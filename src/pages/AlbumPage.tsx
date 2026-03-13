import { useParams } from 'react-router-dom';
import { AlbumDetailView } from '@/features/album';

function AlbumPage() {
  const { id } = useParams();

  return <AlbumDetailView albumId={id} />;
}

export default AlbumPage;
