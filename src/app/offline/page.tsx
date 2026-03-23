import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-6">
        <WifiOff size={48} className="text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        It looks like you've lost your internet connection. Check your connection and try again.
      </p>
      <Link 
        href="/home" 
        className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Retry Connection
      </Link>
    </div>
  );
}
