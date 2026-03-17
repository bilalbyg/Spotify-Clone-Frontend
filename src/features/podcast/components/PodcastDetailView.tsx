import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { resolveLocale } from '@/helpers/i18n';

// TEMPORARY: Empty data object to prevent crashes until backend integration is complete.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const spotifyData = {
  tracks: [],
  albums: [],
  artists: [],
  playlists: [],
  users: [],
  episodes: [],
  podcasts: [],
} as any;

type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};

type Podcast = {
  id: string;
  type: 'show';
  uri: string;
  name: string;
  publisher: string;
  description: string;
  languages: string[];
  total_episodes: number;
  images: SpotifyImage[];
  categories?: string[];
  rating?: number;
  rating_count?: number;
  related_show_ids?: string[];
};

type Episode = {
  id: string;
  type: 'episode';
  uri: string;
  show_id: string;
  name: string;
  description: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  duration_ms: number;
  explicit: boolean;
  is_playable: boolean;
  language: string;
  audio_preview_url: string | null;
};

type SpotifyDataset = {
  podcasts: Podcast[];
  episodes: Episode[];
};

const data = spotifyData as SpotifyDataset;

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min ${seconds} sec`;
  }

  return `${minutes} min ${seconds} sec`;
};

const formatDate = (
  value: string,
  precision: Episode['release_date_precision'],
  locale: string,
) => {
  if (precision === 'year') {
    return value;
  }

  if (precision === 'month') {
    const parsedMonth = new Date(`${value}-01`);

    if (Number.isNaN(parsedMonth.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: 'numeric',
    }).format(parsedMonth);
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(parsedDate);
};

const formatCompactNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { notation: 'compact' }).format(value);

const resolveCategory = (show: Podcast, fallbackSociety: string, fallbackTechnology: string) => {
  if (show.categories?.[0]) {
    return show.categories[0];
  }

  if (show.languages.includes('tr')) {
    return fallbackSociety;
  }

  return fallbackTechnology;
};

type PodcastDetailViewProps = {
  podcastId?: string;
};

function PodcastDetailView({ podcastId }: PodcastDetailViewProps) {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const selectedShow = data.podcasts.find((podcast) => podcast.id === podcastId);
  const show = selectedShow ?? data.podcasts[0];
  const notFound = !selectedShow;

  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderStuck(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const showEpisodes = data.episodes
    .filter((episode) => episode.show_id === show.id)
    .sort((a, b) => b.release_date.localeCompare(a.release_date));

  const featuredEpisodes = showEpisodes.slice(0, 6);

  const recommendedShowsById = (show.related_show_ids ?? [])
    .map((relatedId) => data.podcasts.find((podcast) => podcast.id === relatedId))
    .filter((podcast): podcast is Podcast => podcast !== undefined)
    .filter((podcast) => podcast.id !== show.id);

  const fallbackRecommendations = data.podcasts.filter((podcast) => podcast.id !== show.id);
  const recommendedShows = [...recommendedShowsById, ...fallbackRecommendations]
    .filter((podcast, index, list) => list.findIndex((item) => item.id === podcast.id) === index)
    .slice(0, 4);

  const heroImage = show.images[0];
  const rating = show.rating ?? 4.6;
  const ratingCount = show.rating_count ?? Math.max(show.total_episodes * 180, 1100);
  const category = resolveCategory(
    show,
    t('podcastDetail.categorySociety'),
    t('podcastDetail.categoryTechnology'),
  );

  return (
    <section className="relative overflow-hidden rounded-xl bg-zinc-950 min-h-full">
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-50 flex h-14 items-center bg-[#4a2020] px-6 shadow-md transition-opacity duration-300 rounded-t-xl ${isHeaderStuck ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <h1 className="text-lg font-bold text-white tracking-tight">{show.name}</h1>
      </div>

      {/* Header */}
      <header
        ref={headerRef}
        className="relative -mt-14 pt-20 pb-6 px-6 sm:px-8 bg-gradient-to-b from-[#5a2a2a]/90 via-[#3a1a1a]/90 to-zinc-900/80"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="h-48 w-48 shrink-0 overflow-hidden rounded-lg bg-zinc-900 shadow-2xl shadow-black/50">
            {heroImage ? (
              <img
                src={heroImage.url}
                alt={`${show.name} cover`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-500 to-zinc-900" />
            )}
          </div>

          <div className="min-w-0 flex-1" style={{ containerType: 'inline-size' }}>
            <p className="text-sm font-semibold capitalize tracking-wide text-zinc-100/90">
              {t('podcastDetail.podcast')}
            </p>
            <h1
              className="mt-2 font-black tracking-tight text-white"
              style={{
                fontSize: `clamp(1.5rem, ${140 / Math.max(show.name.length, 1)}cqi, 5rem)`,
                lineHeight: 1.1,
              }}
            >
              {show.name}
            </h1>
            <p className="mt-3 text-lg font-semibold text-zinc-100">{show.publisher}</p>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-6 sm:p-8">
        {notFound && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            {t('podcastDetail.notFound')} <code>{show.id}</code>.
          </div>
        )}

        {/* Actions */}
        <div className="mb-8 flex items-center gap-4">
          <button className="rounded-full border border-zinc-500 px-5 py-1.5 text-sm font-bold text-white transition hover:border-white hover:scale-105">
            {t('podcastDetail.following')}
          </button>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:text-white">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
              <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
            </svg>
          </button>
        </div>

        {/* About */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {t('podcastDetail.about')}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">{show.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1.5 text-sm font-semibold text-zinc-100">
              {rating.toFixed(1)} <span className="text-yellow-400">★</span> (
              {formatCompactNumber(ratingCount, locale)})
            </span>
            <span className="text-zinc-500">•</span>
            <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200">
              {category}
            </span>
          </div>
        </section>

        {/* All Episodes */}
        <section>
          <h2 className="mb-4 border-b border-zinc-800 pb-4 text-2xl font-bold tracking-tight text-white">
            {t('podcastDetail.allEpisodes')}
          </h2>

          <div className="space-y-4">
            {featuredEpisodes.length === 0 && (
              <p className="rounded-lg bg-zinc-900/80 p-4 text-sm text-zinc-400">
                {t('podcastDetail.noEpisodes')}
              </p>
            )}

            {featuredEpisodes.map((episode) => (
              <article
                key={episode.id}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 transition hover:bg-zinc-800/50 hover:border-zinc-700/60"
              >
                <div className="flex gap-5">
                  {/* Episode cover */}
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                    {heroImage ? (
                      <img
                        src={heroImage.url}
                        alt={`${show.name} episode art`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-500 to-zinc-900" />
                    )}
                  </div>

                  {/* Episode info */}
                  <div className="min-w-0 flex-1 flex flex-col">
                    <Link
                      to={`/episode/${episode.id}`}
                      className="text-base font-bold text-white hover:underline line-clamp-1"
                    >
                      {episode.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-zinc-400">{show.name}</p>
                    <p className="mt-2 text-sm leading-5 text-zinc-500 line-clamp-2">
                      {episode.description}
                    </p>

                    <div className="mt-auto pt-3 flex items-center justify-between">
                      {/* Date & Duration */}
                      <p className="text-sm text-zinc-400">
                        {formatDate(episode.release_date, episode.release_date_precision, locale)} •{' '}
                        {formatDuration(episode.duration_ms)}
                      </p>
                    </div>

                    {/* Action icons row */}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
                        aria-label={t('podcastDetail.addEpisode')}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M12 1c-6.075 0-11 4.925-11 11s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 20c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9zm-1-13h2v4h4v2h-4v4h-2v-4H7v-2h4V8z"></path>
                        </svg>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
                        aria-label={t('podcastDetail.downloadEpisode')}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M12 3a1 1 0 0 1 1 1v9.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L11 13.586V4a1 1 0 0 1 1-1zM5 20a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H5z"></path>
                        </svg>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
                        aria-label={t('podcastDetail.shareEpisode')}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"></path>
                        </svg>
                      </button>
                      <button
                        className="h-8 w-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition"
                        aria-label={t('podcastDetail.moreActions')}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                        </svg>
                      </button>

                      {/* Play button - far right */}
                      <button className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 hover:bg-zinc-100">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 ml-0.5 fill-current"
                          aria-hidden="true"
                        >
                          <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {showEpisodes.length > featuredEpisodes.length && (
            <button className="mt-5 rounded-full bg-zinc-800 px-5 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700">
              {t('podcastDetail.loadMoreEpisodes')}
            </button>
          )}
        </section>

        {/* More like this */}
        {recommendedShows.length > 0 && (
          <section className="mt-10 border-t border-zinc-800 pt-8">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {t('podcastDetail.moreLikeThis')}
              </h2>
              <button className="text-sm font-semibold text-zinc-300 hover:text-white hover:underline transition">
                {t('common.actions.showAll')}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recommendedShows.map((podcast) => (
                <Link
                  key={podcast.id}
                  to={`/show/${podcast.id}`}
                  className="group rounded-lg bg-zinc-900/60 p-3 transition hover:bg-zinc-800/70"
                >
                  <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-zinc-800">
                    {podcast.images[0] ? (
                      <img
                        src={podcast.images[0].url}
                        alt={podcast.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-zinc-600 to-zinc-900" />
                    )}
                  </div>
                  <h3 className="line-clamp-2 text-sm font-bold text-zinc-100 group-hover:underline">
                    {podcast.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{podcast.publisher}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

export default PodcastDetailView;
