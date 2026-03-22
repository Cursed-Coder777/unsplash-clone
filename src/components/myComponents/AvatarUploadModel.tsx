'use client';

import { useState, useRef } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface AvatarUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAvatarUpdate: (newAvatar: string) => void;
    currentAvatar?: string;
    username: string;
}

export default function AvatarUploadModal({
    isOpen,
    onClose,
    onAvatarUpdate,
    currentAvatar,
    username,
}: AvatarUploadModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(currentAvatar || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError('');
        setSelectedFile(file);

        // Create preview with proper sizing
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            const res = await fetch('/api/user/avatar', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onAvatarUpdate(data.avatar);
            onClose();
            
            // Notify other components that avatar was updated
            window.dispatchEvent(new CustomEvent('avatarUpdated'));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Change profile image</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Avatar Preview - Fixed small size */}
                        <div className="flex justify-center mb-6">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 shadow-sm">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt={username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                                        <span className="text-white text-2xl font-bold">
                                            {username?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Upload Area - Compact */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                            <p className="text-sm text-gray-600">Click to select an image</p>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                        </div>

                        {/* Selected file info - Compact */}
                        {selectedFile && (
                            <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                                <ImageIcon size={16} className="text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {(selectedFile.size / 1024).toFixed(0)} KB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                'Upload'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}