import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type BrowseCard = {
  id: string;
  titleKey:
    | 'music'
    | 'podcasts'
    | 'liveEvents'
    | 'madeForYou'
    | 'newReleases'
    | 'iconTurkiye'
    | 'charts'
    | 'discover'
    | 'trending'
    | 'podcastCharts'
    | 'educational'
    | 'documentary'
    | 'comedy'
    | 'mood';
  to: string;
  palette: string;
  image: string;
};

const browseCards: BrowseCard[] = [
  {
    id: 'music',
    titleKey: 'music',
    to: '/playlist/liked-songs',
    palette: 'from-pink-500 to-fuchsia-600',
    image: 'https://picsum.photos/seed/search-music/300/300',
  },
  {
    id: 'podcasts',
    titleKey: 'podcasts',
    to: '/show/merdiven-alti-terapi',
    palette: 'from-emerald-700 to-teal-800',
    image: 'https://picsum.photos/seed/search-podcast/300/300',
  },
  {
    id: 'live-events',
    titleKey: 'liveEvents',
    to: '/artist/b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    palette: 'from-indigo-500 to-violet-700',
    image: 'https://picsum.photos/seed/search-events/300/300',
  },
  {
    id: 'made-for-you',
    titleKey: 'madeForYou',
    to: '/playlist/workout',
    palette: 'from-indigo-800 to-blue-900',
    image: 'https://picsum.photos/seed/search-madeforyou/300/300',
  },
  {
    id: 'new-releases',
    titleKey: 'newReleases',
    to: '/album/c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    palette: 'from-sky-700 to-indigo-900',
    image: 'https://picsum.photos/seed/search-releases/300/300',
  },
  {
    id: 'icon',
    titleKey: 'iconTurkiye',
    to: '/artist/the-velvet-sundown',
    palette: 'from-red-500 to-rose-700',
    image: 'https://picsum.photos/seed/search-icon/300/300',
  },
  {
    id: 'charts',
    titleKey: 'charts',
    to: '/playlist/alternative-indie-turk-rock',
    palette: 'from-blue-700 to-indigo-700',
    image: 'https://picsum.photos/seed/search-charts/300/300',
  },
  {
    id: 'discover',
    titleKey: 'discover',
    to: '/home',
    palette: 'from-violet-600 to-fuchsia-700',
    image: 'https://picsum.photos/seed/search-discover/300/300',
  },
  {
    id: 'trending',
    titleKey: 'trending',
    to: '/playlist/phonk',
    palette: 'from-fuchsia-700 to-purple-700',
    image: 'https://picsum.photos/seed/search-trending/300/300',
  },
  {
    id: 'podcast-charts',
    titleKey: 'podcastCharts',
    to: '/show/acik-bilim-podcast',
    palette: 'from-blue-600 to-blue-700',
    image: 'https://picsum.photos/seed/search-podcast-charts/300/300',
  },
  {
    id: 'educational',
    titleKey: 'educational',
    to: '/show/acik-bilim-podcast',
    palette: 'from-sky-700 to-cyan-800',
    image: 'https://picsum.photos/seed/search-educational/300/300',
  },
  {
    id: 'documentary',
    titleKey: 'documentary',
    to: '/show/yoldan-cikanlar',
    palette: 'from-zinc-700 to-violet-900',
    image: 'https://picsum.photos/seed/search-documentary/300/300',
  },
  {
    id: 'comedy',
    titleKey: 'comedy',
    to: '/show/bu-mu-yani',
    palette: 'from-fuchsia-700 to-pink-700',
    image: 'https://picsum.photos/seed/search-comedy/300/300',
  },
  {
    id: 'mood',
    titleKey: 'mood',
    to: '/playlist/workout',
    palette: 'from-pink-600 to-fuchsia-700',
    image: 'https://picsum.photos/seed/search-mood/300/300',
  },
];

function SearchPage() {
  const { t } = useTranslation();

  return (
    <section className="rounded-xl bg-zinc-950/95 p-5 sm:p-6">
      <h1 className="mb-6 text-5xl font-black tracking-tight">{t('searchPage.title')}</h1>

      <div className="grid gap-3 md:grid-cols-2">
        {browseCards.map((card) => (
          <Link
            key={card.id}
            to={card.to}
            className={`group relative h-44 overflow-hidden rounded-lg bg-gradient-to-br ${card.palette} p-4 shadow-lg shadow-black/30 transition hover:brightness-110`}
          >
            <h2 className="max-w-[60%] text-4xl font-black leading-tight text-white">
              {t(`searchPage.cards.${card.titleKey}`)}
            </h2>

            <img
              src={card.image}
              alt={t(`searchPage.cards.${card.titleKey}`)}
              loading="lazy"
              className="absolute -bottom-2 -right-2 h-28 w-28 rotate-[24deg] rounded-md object-cover shadow-2xl shadow-black/40 transition duration-300 group-hover:rotate-[16deg] group-hover:scale-105 sm:h-32 sm:w-32"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default SearchPage;
