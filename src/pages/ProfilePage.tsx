import { useParams } from 'react-router-dom';
import { ProfileDetailView } from '@/features/profile';

function ProfilePage() {
  const { id } = useParams();

  return <ProfileDetailView userId={id} />;
}

export default ProfilePage;
