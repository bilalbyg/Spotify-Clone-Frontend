import { useParams } from 'react-router-dom';
import { PodcastDetailView } from '@/features/podcast';

function PodcastPage() {
  const { id } = useParams();

  return <PodcastDetailView podcastId={id} />;
}

export default PodcastPage;
