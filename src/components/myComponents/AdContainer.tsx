'use client';

import { useEffect, useState } from 'react';

interface AdContainerProps {
  adSlot: string;
  adLayoutKey?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdContainer({
  adSlot,
  adLayoutKey,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ""
}: AdContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense Error:', err);
    }
  }, []);

  if (!mounted) return <div className={`my-4 h-[300px] bg-gray-50 dark:bg-gray-900 rounded-xl animate-pulse ${className}`} />;

  return (
    <div className={`ad-container my-4 mx-auto flex justify-center overflow-hidden min-h-[100px] bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-md ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-2708237217895756'}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        {...(adLayoutKey ? { 'data-ad-layout-key': adLayoutKey } : {})}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
