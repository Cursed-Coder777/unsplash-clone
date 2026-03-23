'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-6 overflow-x-auto no-scrollbar" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 whitespace-nowrap">
        <li className="inline-flex items-center">
          <Link
            href="/home"
            className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-black transition-colors"
          >
            <Home size={14} className="mr-2" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight size={14} className="text-gray-400 mx-1" />
              {item.active ? (
                <span className="ml-1 text-sm font-semibold text-black md:ml-2">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="ml-1 text-sm font-medium text-gray-400 hover:text-black transition-colors md:ml-2"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
