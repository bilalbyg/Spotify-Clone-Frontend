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
  name: string;
  publisher: string;
  images: SpotifyImage[];
};

type Episode = {
  id: string;
  name: string;
  description: string;
  show_id: string;
  release_date: string;
  release_date_precision: 'year' | 'month' | 'day';
  duration_ms: number;
};

type Dataset = {
  podcasts: Podcast[];
  episodes: Episode[];
};

const data = spotifyData as Dataset;

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
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
};

type EpisodeDetailViewProps = {
  episodeId?: string;
};

function EpisodeDetailView({ episodeId }: EpisodeDetailViewProps) {
  const { t, i18n } = useTranslation();
  const locale = resolveLocale(i18n.language);
  const selectedEpisode = data.episodes.find((episode) => episode.id === episodeId);
  const episode = selectedEpisode ?? data.episodes[0];
  const notFound = !selectedEpisode;

  const show = data.podcasts.find((podcast) => podcast.id === episode.show_id) ?? data.podcasts[0];

  const relatedEpisodes = data.episodes
    .filter((item) => item.show_id === show.id && item.id !== episode.id)
    .sort((a, b) => b.release_date.localeCompare(a.release_date))
    .slice(0, 6);

  return (
    <section className="overflow-hidden rounded-xl bg-zinc-950">
      <header className="bg-gradient-to-b from-red-500/85 via-red-800/70 to-zinc-900 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
          <div className="h-44 w-44 shrink-0 overflow-hidden rounded-lg bg-zinc-800 shadow-2xl shadow-black/40">
            {show.images[0] ? (
              <img
                src={show.images[0].url}
                alt={show.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-500 to-zinc-900" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold capitalize tracking-wide text-zinc-100/90">
              {t('episodeDetail.episode')}
            </p>
            <h1 className="line-clamp-2 text-4xl font-black tracking-tight sm:text-6xl">
              {episode.name}
            </h1>
            <p className="mt-2 text-lg text-zinc-100">
              <Link className="font-semibold hover:underline" to={`/show/${show.id}`}>
                {show.name}
              </Link>
              {' • '}
              {show.publisher}
            </p>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-red-950/35 to-zinc-950 p-6">
        {notFound && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            {t('episodeDetail.notFound')} <code>{episode.id}</code>.
          </div>
        )}

        <div className="mb-5 flex items-center gap-4 text-zinc-300">
          <button className="h-14 w-14 rounded-full bg-emerald-500 text-2xl font-black text-black transition hover:scale-105">
            {'>'}
          </button>
          <button className="text-2xl">+</button>
          <button className="text-2xl">...</button>
          <span className="ml-auto text-sm text-zinc-300">
            {formatDate(episode.release_date, episode.release_date_precision, locale)}
          </span>
        </div>

        <section className="rounded-xl bg-zinc-900/65 p-4">
          <h2 className="mb-2 text-2xl font-bold">{t('episodeDetail.aboutEpisode')}</h2>
          <p className="leading-7 text-zinc-300">{episode.description}</p>
          <p className="mt-3 text-sm text-zinc-400">
            {t('episodeDetail.duration', { value: formatDuration(episode.duration_ms) })}
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-3xl font-black">
              {t('episodeDetail.moreFromShow', { showName: show.name })}
            </h2>
            <Link
              to={`/show/${show.id}`}
              className="text-sm font-semibold text-zinc-300 hover:text-white"
            >
              {t('episodeDetail.goToShow')}
            </Link>
          </div>

          <div className="space-y-1 rounded-xl bg-zinc-900/65 p-3">
            {relatedEpisodes.map((item) => (
              <Link
                key={item.id}
                to={`/episode/${item.id}`}
                className="grid grid-cols-[minmax(0,1fr)_120px] items-center gap-3 rounded-md px-2 py-2 transition hover:bg-zinc-800/70"
              >
                <p className="truncate font-medium text-zinc-100">{item.name}</p>
                <span className="text-right text-sm text-zinc-300">
                  {formatDuration(item.duration_ms)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default EpisodeDetailView;
