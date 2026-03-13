import { useParams } from 'react-router-dom';
import { EpisodeDetailView } from '@/features/episode';

function EpisodePage() {
  const { id } = useParams();

  return <EpisodeDetailView episodeId={id} />;
}

export default EpisodePage;
