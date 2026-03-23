'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/myComponents/Footer';
import Link from 'next/link';

export default function CloseAccountForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!confirm('Are you absolutely sure you want to delete your account? This action is irreversible.')) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/user/close-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Account deletion failed');
            }

            // Success! The token was cleared by the API.
            // Force a reload or redirect
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setMessage(err.message);
            setIsError(true);
            setLoading(false);
        }
    };

    return (
        <div className="text-[#111] font-sans">
            <div className="max-w-[1440px] mx-auto px-4 py-8 md:py-12 md:flex">
                {/* Sidebar */}
                <div className="w-full md:w-[280px] pr-8 mb-8 md:mb-0 flex-shrink-0">
                    <h3 className="font-bold text-[18px] mb-5">Account settings</h3>
                    <ul className="space-y-[14px] text-[15px] text-[#767676]">
                        <li><Link href="/account" className="hover:text-black transition-colors">Edit profile</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Email settings</Link></li>
                        <li><Link href="/account/changePassword" title="Current settings" className="hover:text-black transition-colors">Change password</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Applications</Link></li>
                        <li><Link href="/account/close" className="font-semibold text-black">Close account</Link></li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-[800px]">
                    <h1 className="text-[24px] font-bold mb-6">Close account</h1>

                    <div className="mb-6">
                        <p className="text-[14px]">
                            <span className="text-[#e25c3d] font-bold">Warning:</span> closing your account is irreversible. It deletes all of your photos, collections, and stats.
                        </p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-[4px] text-[15px] ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="currentPassword" title="Enter current password" className="block text-[15px] mb-1.5 font-medium">Current password</label>
                            <input
                                id="currentPassword"
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors h-[42px]"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#e25c3d] hover:bg-[#d14b2d] text-white font-bold py-[8px] px-4 rounded-[4px] transition-all text-[15px] disabled:opacity-50 shadow-sm"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : 'Delete account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
