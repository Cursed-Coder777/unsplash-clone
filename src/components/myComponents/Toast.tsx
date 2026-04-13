'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    isExiting?: boolean;
}

let globalToast: any = null;

export const toast = {
    show: (message: string, type: ToastType = 'info', duration: number = 3000) => {
        if (globalToast) {
            globalToast({ message, type, duration });
        }
    },
    success: (message: string, duration?: number) => toast.show(message, 'success', duration),
    error: (message: string, duration?: number) => toast.show(message, 'error', duration),
    warning: (message: string, duration?: number) => toast.show(message, 'warning', duration),
    info: (message: string, duration?: number) => toast.show(message, 'info', duration),
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        globalToast = ({ message, type, duration }: Omit<ToastMessage, 'id'>) => {
            const id = Math.random().toString(36).substring(7);
            setToasts(prev => [...prev, { id, type, message, duration, isExiting: false }]);

            // Start exit animation before removing
            const totalDuration = duration || 3000;
            const exitTime = 500; // Match duration-500 from tailwind

            setTimeout(() => {
                setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== id));
                }, exitTime);
            }, totalDuration - exitTime);
        };

        return () => {
            globalToast = null;
        };
    }, []);

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getColors = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-white dark:bg-[#111111] border-green-500/20 text-gray-900 dark:text-gray-100';
            case 'error':
                return 'bg-white dark:bg-[#111111] border-red-500/20 text-gray-900 dark:text-gray-100';
            case 'warning':
                return 'bg-white dark:bg-[#111111] border-yellow-500/20 text-gray-900 dark:text-gray-100';
            default:
                return 'bg-white dark:bg-[#111111] border-blue-500/20 text-gray-900 dark:text-gray-100';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all duration-500 ease-in-out ${getColors(toast.type)} ${toast.isExiting ? 'opacity-0 translate-x-20 scale-90' : 'animate-in slide-in-from-right-10'}`}
                >
                    <div className="flex-shrink-0">
                        {getIcon(toast.type)}
                    </div>
                    <p className="text-[13px] font-semibold tracking-tight">{toast.message}</p>
                    <button
                        onClick={() => {
                            setToasts(prev => prev.map(t => t.id === toast.id ? { ...t, isExiting: true } : t));
                            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 500);
                        }}
                        className="ml-4 opacity-40 hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}