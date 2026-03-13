import { useParams } from 'react-router-dom';
import { ArtistDetailView } from '@/features/artist';

function ArtistPage() {
  const { id } = useParams();

  return <ArtistDetailView artistId={id} />;
}

export default ArtistPage;
