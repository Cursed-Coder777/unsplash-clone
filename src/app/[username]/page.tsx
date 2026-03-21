import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Link2, Instagram, Twitter, Users, Camera as CameraIcon } from 'lucide-react';
import { connectToDb } from '@/lib/db';
import User from '@/lib/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/utils';
import AvatarUploadModal from '@/components/myComponents/AvatarUploadModel';

interface Props {
    params: Promise<{ username: string }>;
}

// Get user by username
async function getUserByUsername(username: string) {
    await connectToDb();
    return await User.findOne({ username }).select('-password');
}

// Check if current user is following
async function isFollowing(currentUserId: string, profileUserId: string) {
    const user = await User.findById(currentUserId);
    return user?.following?.includes(profileUserId) || false;
}

export default async function ProfilePage({ params }: Props) {
    const { username: rawUsername } = await params;
    // Remove @ if present
    const username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;
    
    const user = await getUserByUsername(username);
    
    if (!user) return notFound();
    
    // Get current user
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    let currentUser = null;
    let isFollowingUser = false;
    
    if (token) {
        const decoded = verifyToken(token);
        if (decoded && typeof decoded !== 'string') {
            currentUser = await User.findById(decoded.userId);
            isFollowingUser = currentUser?.following?.includes(user._id) || false;
        }
    }
    
    const isOwnProfile = currentUser?._id.toString() === user._id.toString();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                {/* Avatar Section */}
                {isOwnProfile ? (
                    <AvatarUploadModal
                        currentAvatar={user.avatar}
                        username={user.username}
                        onAvatarUpdate={() => {}}
                        isOpen={false}
                        onClose={() => {}}
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt={user.username}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                                <span className="text-white text-3xl font-bold">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                
                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <h1 className="text-3xl font-bold">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-gray-500">@{user.username}</p>
                        
                        {!isOwnProfile && (
                            <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                                {isFollowingUser ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex gap-6 justify-center md:justify-start mb-4">
                        <div>
                            <span className="font-bold text-lg">{user.photosCount || 0}</span>
                            <span className="text-gray-500 ml-1">photos</span>
                        </div>
                        <div>
                            <span className="font-bold text-lg">{user.followers?.length || 0}</span>
                            <span className="text-gray-500 ml-1">followers</span>
                        </div>
                        <div>
                            <span className="font-bold text-lg">{user.following?.length || 0}</span>
                            <span className="text-gray-500 ml-1">following</span>
                        </div>
                    </div>
                    
                    {/* Bio */}
                    {user.bio && (
                        <p className="text-gray-700 mb-3 max-w-md mx-auto md:mx-0">{user.bio}</p>
                    )}
                    
                    {/* Location & Links */}
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                        {user.location && (
                            <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.website && (
                            <a
                                href={user.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-blue-500"
                            >
                                <Link2 size={14} />
                                <span>Website</span>
                            </a>
                        )}
                        {user.instagram && (
                            <a
                                href={`https://instagram.com/${user.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-pink-500"
                            >
                                <Instagram size={14} />
                                <span>@{user.instagram}</span>
                            </a>
                        )}
                        {user.twitter && (
                            <a
                                href={`https://twitter.com/${user.twitter}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-blue-400"
                            >
                                <Twitter size={14} />
                                <span>@{user.twitter}</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
            
            {/* User's Photos Grid */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CameraIcon size={20} />
                    Photos by {user.firstName}
                </h2>
                
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                    {/* Photos will be fetched here */}
                    <div className="text-center py-10 text-gray-500 col-span-full">
                        No photos uploaded yet.
                    </div>
                </div>
            </div>
        </div>
    );
}