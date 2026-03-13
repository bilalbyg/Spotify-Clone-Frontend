import { useParams } from 'react-router-dom';
import { TrackDetailView } from '@/features/track';

function TrackPage() {
  const { id } = useParams();

  return <TrackDetailView trackId={id} />;
}

export default TrackPage;
