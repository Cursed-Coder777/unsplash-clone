'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/myComponents/Footer';
import AvatarUploadModal from '@/components/myComponents/AvatarUploadModel';
import { countries } from '@/lib/constants/countries';
import { X, Search as SearchIcon } from 'lucide-react';

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    instagram?: string;
    twitter?: string;
    paypal?: string;
    messageEnabled: boolean;
    hireEnabled: boolean;
    interests?: string[];
}

const COMMON_TAGS = [
    "Architecture", "Nature", "Wallpapers", "3D Renders", "Textured", "Film",
    "People", "Experimental", "Travel", "Animals", "Street Photography",
    "Fashion", "Interior Design", "Food", "Business", "Sports", "History"
];

export default function AccountForm({ user }: { user: UserData }) {
    const router = useRouter();
    const [formData, setFormData] = useState<UserData>({
        ...user,
        interests: user.interests || []
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [tagInput, setTagInput] = useState('');
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.checked,
        });
    };

    const handleAvatarUpdate = (newAvatar: string) => {
        setAvatar(newAvatar);
        setFormData((prev: UserData) => ({ ...prev, avatar: newAvatar }));
    };

    const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTagInput(val);
        if (val.trim()) {
            const filtered = COMMON_TAGS.filter((t: string) =>
                t.toLowerCase().includes(val.toLowerCase()) &&
                !formData?.interests?.includes(t)
            );
            setTagSuggestions(filtered);
        } else {
            setTagSuggestions([]);
        }
    };

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !formData.interests?.includes(trimmed) && (formData?.interests?.length || 0) < 10) {
            setFormData((prev: UserData) => ({
                ...prev,
                interests: [...(prev.interests || []), trimmed]
            }));
            setTagInput('');
            setTagSuggestions([]);
        }
    };

    const removeTag = (tag: string) => {
        setFormData((prev: UserData) => ({
            ...prev,
            interests: (prev.interests || []).filter((t: string) => t !== tag)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Update failed');
            }

            setMessage('Profile updated successfully!');
            router.refresh();
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>

            <div className="max-w-[1440px] mx-auto px-4 py-8 md:py-12 md:flex font-sans text-[#111]">
                {/* Sidebar */}
                <div className="w-full md:w-[280px] pr-8 mb-8 md:mb-0 flex-shrink-0">
                    <h3 className="font-bold text-[18px] mb-5">Account settings</h3>
                    <ul className="space-y-[14px] text-[15px] text-[#767676]">
                        <li><Link href="/account" className="hover:text-black transition-colors text-black font-semibold">Edit Profile</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Email settings</Link></li>
                        <li><Link href="/account/changePassword" title="Current settings" className="hover:text-black transition-colors">Change password</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Applications</Link></li>
                        <li><Link href="/account/close" className="hover:text-black transition-colors">Close account</Link></li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-[1100px]">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-[24px] font-bold">Edit Profile <span className="text-[14px] text-[#767676] font-normal capitalize">(if you don't see any changes please refresh the page)</span></h1>
                        <div className="bg-[#ccf0d8] text-[#107c41] px-[10px] py-[4px] rounded-full text-[13px] font-medium flex items-center shadow-sm">
                            <svg className="w-4 h-4 mr-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Account Confirmed
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-4 p-3 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Avatar & Basic Info */}
                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                            {/* Avatar Column */}
                            <div className="w-full md:w-[150px] flex flex-col items-center flex-shrink-0 pt-1">
                                <div
                                    onClick={() => setModalOpen(true)}
                                    className="w-28 h-28 rounded-full overflow-hidden bg-[#eeeeee] mb-3 cursor-pointer group relative"
                                >
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt={formData.username}
                                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-white text-3xl font-bold uppercase">
                                                {formData.firstName?.[0]}{formData.lastName?.[0]}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">Change</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(true)}
                                    className="text-[13px] text-[#767676] underline hover:text-black transition-colors cursor-pointer"
                                >
                                    Change profile image
                                </button>

                                <div className="mt-8 self-start w-full text-left">
                                    <h4 className="text-[15px] mb-2">Badge</h4>
                                    <p className="text-[13px] text-[#767676]">You don't have any badges yet :(</p>
                                </div>
                            </div>

                            {/* Names & Email Column */}
                            <div className="flex-1">
                                <div className="flex gap-4 mb-[18px]">
                                    <div className="flex-1">
                                        <label htmlFor="firstName" className="block text-[15px] mb-1.5 font-medium">First name</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="lastName" className="block text-[15px] mb-1.5 font-medium">Last name</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                        />
                                    </div>
                                </div>



                                <div className="mb-1">
                                    <label htmlFor="username" className="block text-[15px] mb-1.5 font-medium">
                                        Username <span className="text-[#767676] font-normal">(only letters, numbers, and underscores)</span>
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                    />
                                </div>
                                <p className="text-[13px] text-[#767676]">https://unsplash.com/@{formData.username}</p>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mb-10">
                            <h2 className="text-[18px] font-bold mb-4">About</h2>

                            <div className="sm:flex gap-4 mb-[18px]">
                                <div className="flex-1">
                                    <label htmlFor="location" className="block text-[15px] mb-1.5 font-medium">Location (country)</label>
                                    <select
                                        id="location"
                                        value={formData.location || ''}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors bg-white appearance-none h-[42px]"
                                        style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%23767676"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                                    >
                                        <option value="">Select country</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 mt-6 sm:mt-0">
                                    <label htmlFor="website" className="block text-[15px] mb-1.5 font-medium">Personal site/portfolio</label>
                                    <input
                                        id="website"
                                        type="text"
                                        value={formData.website || ''}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div className="sm:flex gap-4">
                                <div className="flex-1 ">
                                    <label htmlFor="bio" className="block text-[15px] mb-1.5 font-medium">Bio</label>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <div className="flex-1 relative mt-6 sm:mt-0">
                                    <label htmlFor="interests" className="block text-[15px] mb-1.5 font-medium">
                                        Interests <span className="text-[#767676] font-normal">(maximum 10 tags)</span>
                                    </label>

                                    <div className="flex flex-wrap gap-2 mb-2 p-1 border border-[#d1d5db] rounded-[4px] min-h-[42px] focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-colors bg-white">
                                        {formData?.interests?.map((tag: string) => (
                                            <span key={tag} className="flex items-center gap-1 bg-[#eee] px-2 py-1 rounded text-[13px] font-medium group">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="hover:text-red-500 transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                        {(formData?.interests?.length || 0) < 10 && (
                                            <input
                                                id="interests-input"
                                                type="text"
                                                value={tagInput}
                                                onChange={handleTagInput}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTag(tagInput);
                                                    }
                                                }}
                                                placeholder={(formData?.interests?.length || 0) === 0 ? "add a tag (e.g. Nature)" : ""}
                                                className="flex-1 min-w-[120px] outline-none border-none py-1 px-2 text-[15px] bg-transparent"
                                            />
                                        )}
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {tagSuggestions.length > 0 && (
                                        <div className="absolute z-10 w-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto">
                                            {tagSuggestions.map((tag: string) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    onClick={() => addTag(tag)}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
                                                >
                                                    <SearchIcon size={14} className="text-gray-400" />
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-[13px] text-[#767676] leading-snug mt-1">
                                        Add tags that represent your interests. Press Enter to add.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Section */}
                        <div className="mb-10">
                            <h2 className="text-[18px] font-bold mb-4">Social</h2>

                            <div className="sm:flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="instagram" className="block text-[15px] mb-1.5 font-medium">Instagram username</label>
                                    <div className="relative">
                                        <input
                                            id="instagram"
                                            type="text"
                                            value={formData.instagram || ''}
                                            onChange={handleChange}
                                            className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-1.5"
                                            placeholder="username"
                                        />
                                    </div>
                                    <p className="text-[13px] text-[#767676]">
                                        So that we can feature you on @unsplash
                                    </p>
                                </div>
                                <div className="flex-1 mt-6 sm:mt-0">
                                    <label htmlFor="twitter" className="block text-[15px] mb-1.5 font-medium">X (Twitter) username</label>
                                    <input
                                        id="twitter"
                                        type="text"
                                        value={formData.twitter || ''}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-1.5"
                                        placeholder="username"
                                    />
                                    <p className="text-[13px] text-[#767676]">
                                        So that we can feature you on @unsplash
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Donations Section */}
                        <div className="mb-10">
                            <h2 className="text-[18px] font-bold mb-4">Donations</h2>

                            <div className="w-full md:w-[calc(50%-8px)]">
                                <label htmlFor="paypal" className="block text-[15px] mb-1.5 font-medium">PayPal email or username for donations</label>
                                <input
                                    id="paypal"
                                    type="text"
                                    value={formData.paypal || ''}
                                    onChange={handleChange}
                                    placeholder="name@domain.com"
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-1.5 placeholder-[#767676]"
                                />
                                <p className="text-[13px] text-[#767676]">Note: This email/username will be public</p>
                            </div>
                        </div>

                        {/* Messaging Section */}
                        <div className="mb-10">
                            <h2 className="text-[18px] font-bold mb-4">Messaging</h2>

                            <div className="bg-[#f5f5f5] rounded-[4px] p-4 flex justify-between items-center mb-1.5 transition-colors hover:bg-gray-100">
                                <label htmlFor="messageEnabled" className="flex items-center text-[15px] font-medium cursor-pointer">
                                    <input
                                        id="messageEnabled"
                                        type="checkbox"
                                        checked={formData.messageEnabled}
                                        onChange={handleCheckbox}
                                        className="mr-3 w-[15px] h-[15px] accent-black rounded-[3px]"
                                    />
                                    Display a 'Message' button on your profile
                                </label>
                                <div className="bg-white border border-[#d1d5db] rounded-[4px] p-2 text-[#767676] shadow-sm">
                                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-[13px] text-[#767676]">Messages will be sent to your email</p>
                        </div>

                        {/* Hiring Section */}
                        <div className="mb-10">
                            <h2 className="text-[18px] font-bold mb-4">Hiring</h2>

                            <div className="bg-[#f5f5f5] rounded-[4px] p-4 flex justify-between items-center mb-1.5 transition-colors hover:bg-gray-100">
                                <label htmlFor="hireEnabled" className="flex items-center text-[15px] font-medium cursor-pointer">
                                    <input
                                        id="hireEnabled"
                                        type="checkbox"
                                        checked={formData.hireEnabled}
                                        onChange={handleCheckbox}
                                        className="mr-3 w-[15px] h-[15px] rounded-[3px] accent-black border-[#d1d5db]"
                                    />
                                    Yes, feature my Unsplash profile on hiring pages and display a 'Hire' button
                                </label>
                                <div className="bg-[#007fff] text-white text-[14px] font-medium px-4 py-1.5 rounded-[4px] shadow-sm">
                                    Hire
                                </div>
                            </div>
                            <p className="text-[13px] text-[#767676]">Requests will be sent to your email</p>
                        </div>

                        {/* Update Button */}
                        <div className="mt-8 mb-12 border-t pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#111] hover:bg-black text-white font-bold py-[12px] rounded-[4px] transition-all text-[15px] disabled:opacity-50 shadow-md transform active:scale-[0.99]"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving changes...
                                    </div>
                                ) : 'Update account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />

            <AvatarUploadModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAvatarUpdate={handleAvatarUpdate}
                currentAvatar={avatar}
                username={formData.username}
            />
        </div>
    );
}

