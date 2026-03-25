'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/myComponents/Footer';
import Link from 'next/link';

export default function ChangePasswordForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Successfully updated password!');
        setError(false);

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            setError(true);
            return;
        }

        if (formData.newPassword.length < 8) {
            setMessage('Password must be at least 8 characters');
            setError(true);
            return;
        }

        setLoading(true);

        // Fetch API call to change password
        try {
            // Updating the password
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Password update failed');
            }

            setMessage('Password updated successfully!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            setMessage(err.message);
            setError(true);
        } finally {
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
                        <li><Link href="/account/changePassword" title="Current settings" className="font-semibold text-black">Change password</Link></li>
                        <li><Link href="#" className="hover:text-black transition-colors">Applications</Link></li>
                        <li><Link href="/account/close" className="hover:text-black transition-colors">Close account</Link></li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-[800px]">
                    <h1 className="text-[24px] font-bold mb-8">Change password</h1>

                    {message && (
                        <div className={`mb-6 p-4 rounded-[4px] text-[15px] ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
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
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors h-[42px]"
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" title="Enter new password" className="block text-[15px] mb-1.5 font-medium">Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors h-[42px]"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" title="Confirm current password" className="block text-[15px] mb-1.5 font-medium">Password confirmation</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[15px] focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors h-[42px]"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#111] hover:bg-black text-white font-bold py-[12px] rounded-[4px] transition-all text-[15px] disabled:opacity-50 shadow-md transform active:scale-[0.99] h-[44px]"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Updating...
                                    </div>
                                ) : 'Change password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
