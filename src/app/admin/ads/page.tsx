'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';

export default function AdDashboard() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const stats = [
    { title: 'Est. Earnings', value: '$1,240.55', change: '+12.5%', isUp: true, icon: DollarSign },
    { title: 'Ad Impressions', value: '45.2K', change: '+8.2%', isUp: true, icon: Users },
    { title: 'Ad Clicks', value: '1,120', change: '-2.4%', isUp: false, icon: MousePointer2 },
    { title: 'Ad CTR', value: '2.48%', change: '+0.5%', isUp: true, icon: TrendingUp },
  ];

  const recentAds = [
    { id: 1, name: 'Summer Collection Promo', type: 'Native', views: '12,400', clicks: '340', earnings: '$85.00', status: 'Active' },
    { id: 2, name: 'CreativePro Assets', type: 'Sponsored', views: '8,200', clicks: '210', earnings: '$52.50', status: 'Active' },
    { id: 3, name: 'Photo Editing Masterclass', type: 'Banner', views: '15,000', clicks: '180', earnings: '$45.00', status: 'Paused' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ad Revenue Dashboard</h1>
            <p className="text-gray-500">Track your earnings and ad performance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Calendar size={16} />
                {timeRange}
              </button>
            </div>
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <stat.icon size={20} className="text-gray-700" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Mockup & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Revenue Over Time</h3>
              <button className="text-sm text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                <BarChart3 size={14} />
                View Details
              </button>
            </div>
            <div className="aspect-[2/1] bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm font-medium italic">[ Interactive Revenue Chart Visualization ]</p>
            </div>
          </div>

          {/* Performance Table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6">Top Performing Ads</h3>
            <div className="space-y-6">
              {recentAds.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{ad.name}</h4>
                    <p className="text-xs text-gray-500 uppercase font-black">{ad.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{ad.earnings}</p>
                    <p className="text-xs text-green-500 font-medium">{ad.clicks} clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
