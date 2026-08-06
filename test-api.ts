import axios from 'axios';

async function test() {
  try {
    const api = axios.create({ baseURL: 'http://192.168.1.190:8081/api/v1' });
    const songsRes = await api.get('/songs');
    const albumsRes = await api.get('/albums');
    const artistsRes = await api.get('/artists');

    const songs = songsRes.data.content || songsRes.data;
    const albums = albumsRes.data.content || albumsRes.data;
    const artists = artistsRes.data.content || artistsRes.data;

    const trackId = '0e25e1c3-e826-4220-82a0-0440da7def06';
    const track = songs.find((s: any) => String(s.id) === trackId);
    
    console.log('TRACK:', track);
    
    if (track) {
      console.log('TRACK ALBUM ID:', track.albumId || track.album_id);
      const album = albums.find((a: any) => String(a.id) === String(track.albumId || track.album_id));
      console.log('ALBUM FOUND:', !!album);
      
      console.log('TRACK ARTIST ID:', track.artistId || track.artist_id);
      const artist = artists.find((a: any) => String(a.id) === String(track.artistId || track.artist_id));
      console.log('ARTIST FOUND:', !!artist);
    }
  } catch (e) {
    console.error(e.message);
  }
}
test();
