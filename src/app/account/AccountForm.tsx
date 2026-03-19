'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/components/myComponents/Footer';
import { RiUnsplashFill } from 'react-icons/ri';
import Link from 'next/link';
interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
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

export default function AccountForm({ user }: { user: UserData }) {
    const router = useRouter();
    const [formData, setFormData] = useState(user);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <nav>
             <Link href='/home'>
                <RiUnsplashFill size={48} className='text-black cursor-pointer transition-colors m-2' />
                </Link>
        </nav>
           <div className="max-w-[1440px] mx-auto px-2 py-8 md:py-12 md:flex font-sans">
            {/* Sidebar */}
            <div className="w-full md:w-[280px] pr-8 mb-8 md:mb-0 flex-shrink-0">
                <h3 className="font-bold text-[18px] mb-5 text-[#111]">Account settings</h3>
                <ul className="space-y-[14px] text-[15px] text-[#767676]">
                    <li><a href="#" className="text-[#111] font-semibold">Edit profile</a></li>
                    <li><a href="#" className="hover:text-[#111] transition-colors">Email settings</a></li>
                    <li><a href="#" className="hover:text-[#111] transition-colors">Change password</a></li>
                    <li><a href="#" className="hover:text-[#111] transition-colors">Applications</a></li>
                    <li><a href="#" className="hover:text-[#111] transition-colors">Close account</a></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-[1100px]">
                {/* Title & Badge */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-[24px] font-bold text-[#111]">Edit profile</h1>
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
                            <div className="w-28 h-28 bg-[#eeeeee] rounded-full flex items-center justify-center overflow-hidden mb-3">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&size=200`} 
                                    alt={formData.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <a href="#" className="text-[13px] text-[#767676] underline hover:text-[#111]">Change profile image</a>

                            <div className="mt-8 self-start w-full text-left">
                                <h4 className="text-[15px] text-[#111] mb-2">Badge</h4>
                                <p className="text-[13px] text-[#767676]">You don't have any badges yet :(</p>
                            </div>
                        </div>

                        {/* Names & Email Column */}
                        <div className="flex-1">
                            <div className="flex gap-4 mb-[18px]">
                                <div className="flex-1">
                                    <label htmlFor="firstName" className="block text-[15px] text-[#111] mb-1.5">First name</label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="lastName" className="block text-[15px] text-[#111] mb-1.5">Last name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mb-[18px]">
                                <label htmlFor="email" className="block text-[15px] text-[#111] mb-1.5">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                />
                            </div>

                            <div className="mb-1">
                                <label htmlFor="username" className="block text-[15px] text-[#111] mb-1.5">
                                    Username <span className="text-[#767676]">(only letters, numbers, and underscores)</span>
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                />
                            </div>
                            <p className="text-[13px] text-[#767676]">https://unsplash.com/@{formData.username}</p>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-10">
                        <h2 className="text-[18px] font-bold text-[#111] mb-4">About</h2>

                        <div className="flex gap-4 mb-[18px]">
                            <div className="flex-1">
                                <label htmlFor="location" className="block text-[15px] text-[#111] mb-1.5">Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    value={formData.location || ''}
                                    onChange={handleChange}
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="website" className="block text-[15px] text-[#111] mb-1.5">Personal site/portfolio</label>
                                <input
                                    id="website"
                                    type="text"
                                    value={formData.website || ''}
                                    onChange={handleChange}
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="bio" className="block text-[15px] text-[#111] mb-1.5">Bio</label>
                                <div className="relative">
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        value={formData.bio || ''}
                                        onChange={handleChange}
                                        className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors resize-none"
                                    />
                                    <span className="absolute bottom-2 right-3 text-[12px] text-[#767676]">250</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="interests" className="block text-[15px] text-[#111] mb-1.5">
                                    Interests <span className="text-[#767676]">(maximum 5)</span>
                                </label>
                                <input
                                    id="interests"
                                    type="text"
                                    placeholder="add a tag"
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-[6px] placeholder-[#767676]"
                                />
                                <p className="text-[13px] text-[#767676] leading-snug">
                                    Your interests are generated from the types of photos you like, collect, and contribute.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Section */}
                    <div className="mb-10">
                        <h2 className="text-[18px] font-bold text-[#111] mb-4">Social</h2>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="instagram" className="block text-[15px] text-[#111] mb-1.5">Instagram username</label>
                                <input
                                    id="instagram"
                                    type="text"
                                    value={formData.instagram || ''}
                                    onChange={handleChange}
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-1.5"
                                />
                                <p className="text-[13px] text-[#767676]">
                                    So that we can feature you on <a href="#" className="underline text-[#767676] hover:text-[#111]">@unsplash</a>
                                </p>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="twitter" className="block text-[15px] text-[#111] mb-1.5">X (Twitter) username</label>
                                <input
                                    id="twitter"
                                    type="text"
                                    value={formData.twitter || ''}
                                    onChange={handleChange}
                                    className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-1.5"
                                />
                                <p className="text-[13px] text-[#767676]">
                                    So that we can feature you on <a href="#" className="underline text-[#767676] hover:text-[#111]">@unsplash</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Donations Section */}
                    <div className="mb-10">
                        <h2 className="text-[18px] font-bold text-[#111] mb-4">Donations</h2>

                        <div className="w-full md:w-[calc(50%-8px)]">
                            <label htmlFor="paypal" className="block text-[15px] text-[#111] mb-1.5">PayPal email or username for donations</label>
                            <input
                                id="paypal"
                                type="text"
                                value={formData.paypal || ''}
                                onChange={handleChange}
                                placeholder="name@domain.com"
                                className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] text-[#111] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors mb-1.5 placeholder-[#767676]"
                            />
                            <p className="text-[13px] text-[#767676]">Note: This email/username will be public</p>
                        </div>
                    </div>

                    {/* Messaging Section */}
                    <div className="mb-10">
                        <h2 className="text-[18px] font-bold text-[#111] mb-4">Messaging</h2>

                        <div className="bg-[#f5f5f5] rounded-[4px] p-4 flex justify-between items-center mb-1.5">
                            <label htmlFor="messageEnabled" className="flex items-center text-[15px] text-[#111] cursor-pointer">
                                <input
                                    id="messageEnabled"
                                    type="checkbox"
                                    checked={formData.messageEnabled}
                                    onChange={handleCheckbox}
                                    className="mr-3 w-[15px] h-[15px] accent-blue-600 rounded-[3px]"
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
                        <h2 className="text-[18px] font-bold text-[#111] mb-4">Hiring</h2>

                        <div className="bg-[#f5f5f5] rounded-[4px] p-4 flex justify-between items-center mb-1.5">
                            <label htmlFor="hireEnabled" className="flex items-center text-[15px] text-[#111] cursor-pointer">
                                <input
                                    id="hireEnabled"
                                    type="checkbox"
                                    checked={formData.hireEnabled}
                                    onChange={handleCheckbox}
                                    className="mr-3 w-[15px] h-[15px] rounded-[3px] border-[#d1d5db]"
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
                    <div className="mt-8 mb-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#111] hover:bg-black text-white font-medium py-[12px] rounded-[4px] transition-colors text-[15px] disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update account'}
                        </button>
                    </div>
                </form>
         
            </div>
        </div>
        <Footer />
     </div>
    );
}