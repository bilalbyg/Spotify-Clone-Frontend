import meta from './spotify-data.json';
import users from './users.json';
import artists from './artists.json';
import albums from './albums.json';
import tracks from './tracks.json';
import playlists from './playlists.json';
import categories from './categories.json';
import podcasts from './podcasts.json';
import episodes from './episodes.json';

const spotifyData = {
  ...meta,
  users,
  artists,
  albums,
  tracks,
  playlists,
  categories,
  podcasts,
  episodes,
};

export default spotifyData;
