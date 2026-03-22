// app/verify/page.tsx
import { Suspense } from 'react';
import VerifyContent from './VerifyContext';

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}