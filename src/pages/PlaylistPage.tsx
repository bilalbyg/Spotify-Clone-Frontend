import { useParams } from 'react-router-dom';
import { PlaylistDetailView } from '@/features/playlist';

function PlaylistPage() {
  const { id } = useParams();

  return <PlaylistDetailView playlistId={id} />;
}

export default PlaylistPage;
