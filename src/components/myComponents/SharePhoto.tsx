// src/components/myComponents/SharePhoto.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Share2, X, Copy, Check, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { FaPinterest, FaReddit, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { toast } from '@/components/myComponents/Toast';

interface SharePhotoProps {
    isOpen: boolean;
    onClose: () => void;
    photo: {
        id: string;
        url: string;
        title?: string;
    };
}

export default function SharePhoto({ isOpen, onClose, photo }: SharePhotoProps) {
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/home/photo/${photo.id}`;
    const text = photo.title || "Check out this amazing photo on Unsplash Clone!";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: <Twitter size={20} />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
            color: 'bg-[#1DA1F2]'
        },
        {
            name: 'Facebook',
            icon: <Facebook size={20} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: 'bg-[#4267B2]'
        },
        {
            name: 'Pinterest',
            icon: <FaPinterest size={20} />,
            url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(photo.url)}&description=${encodeURIComponent(text)}`,
            color: 'bg-[#E60023]'
        },
        {
            name: 'WhatsApp',
            icon: <FaWhatsapp size={20} />,
            url: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
            color: 'bg-[#25D366]'
        },
        {
            name: 'Telegram',
            icon: <FaTelegram size={20} />,
            url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
            color: 'bg-[#0088cc]'
        },
        {
            name: 'Reddit',
            icon: <FaReddit size={20} />,
            url: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`,
            color: 'bg-[#FF4500]'
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={20} />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            color: 'bg-[#0077B5]'
        },
        {
            name: 'Email',
            icon: <Mail size={20} />,
            url: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(shareUrl)}`,
            color: 'bg-gray-600'
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                ref={modalRef}
                className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Share this photo</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className={`w-12 h-12 ${link.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    {link.icon}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{link.name}</span>
                            </a>
                        ))}
                    </div>

                    <div className="relative">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Direct Link</label>
                        <div className="flex items-center gap-2 p-1 bg-gray-50 border border-gray-100 rounded-2xl">
                            <input 
                                type="text" 
                                readOnly 
                                value={shareUrl}
                                className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-600 outline-none"
                            />
                            <button 
                                onClick={copyToClipboard}
                                className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
