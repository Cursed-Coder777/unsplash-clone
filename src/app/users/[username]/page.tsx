import { notFound } from 'next/navigation';
import ProfileClient from '@/components/myComponents/ProfileClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ username: string }>;
}

async function getUser(username: string) {
  const res = await fetch(
    `https://api.unsplash.com/users/${username}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getUserPhotos(username: string) {
  const res = await fetch(
    `https://api.unsplash.com/users/${username}/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&per_page=20`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);
  if (!user) return { title: 'User Not Found' };
  
  return {
    title: `${user.name} (@${user.username}) | Unsplash Clone`,
    description: user.bio || `View the photography portfolio of ${user.name} on Unsplash Clone.`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const [user, photos] = await Promise.all([
    getUser(username),
    getUserPhotos(username)
  ]);

  if (!user) return notFound();

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <ProfileClient user={user} initialPhotos={photos} />
    </div>
  );
}
