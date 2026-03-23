'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
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
            setToasts(prev => [...prev, { id, type, message, duration }]);

            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration || 3000);
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
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slide-in ${getColors(toast.type)}`}
                >
                    {getIcon(toast.type)}
                    <p className="text-sm font-medium">{toast.message}</p>
                    <button
                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        className="ml-2 opacity-60 hover:opacity-100 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}