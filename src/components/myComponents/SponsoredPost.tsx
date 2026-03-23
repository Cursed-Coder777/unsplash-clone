'use client';

import Image from 'next/image';
import { ExternalLink, Info } from 'lucide-react';

interface SponsoredPostProps {
  title: string;
  description: string;
  imageUrl: string;
  sponsorName: string;
  sponsorLogo?: string;
  targetUrl: string;
}

export default function SponsoredPost({
  title,
  description,
  imageUrl,
  sponsorName,
  sponsorLogo,
  targetUrl
}: SponsoredPostProps) {
  return (
    <div className="relative group rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-4 transition-all hover:shadow-md">
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sponsored Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm z-10">
          <Info size={12} />
          Sponsored
        </div>

        {/* CTA Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 z-10">
           <div className="flex items-center gap-2">
            {sponsorLogo ? (
              <Image src={sponsorLogo} alt={sponsorName} width={24} height={24} className="rounded-full" />
            ) : (
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {sponsorName.charAt(0)}
              </div>
            )}
            <span className="text-white text-xs font-semibold drop-shadow-md">{sponsorName}</span>
          </div>
          <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md line-clamp-2">{title}</h3>
          <a 
            href={targetUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 bg-white text-black text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            Learn More
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
