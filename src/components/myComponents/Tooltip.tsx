// src/components/myComponents/Tooltip.tsx
'use client';

import React, { useState } from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip = ({ text, children, position = 'top' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-black',
        bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-black',
        left: 'right-[-4px] top-1/2 -translate-y-1/2 border-l-black',
        right: 'left-[-4px] top-1/2 -translate-y-1/2 border-r-black'
    };

    return (
        <div 
            className="relative flex items-center justify-center p-0 m-0"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute z-[100] whitespace-nowrap bg-black text-white text-[12px] font-bold py-1.5 px-3 rounded-lg shadow-xl animate-in fade-in zoom-in duration-200 ${positionClasses[position]}`}>
                    {text}
                    <div className={`absolute border-4 border-transparent ${arrowClasses[position]}`} />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
