'use client';

import { useState } from 'react';
import {
  ChevronDown,
  RotateCcw,
  Layout,
  AlignCenter,
  Palette,
  Check,
  Camera,
  Calendar,
  Layers,
  Search
} from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: {
    order_by: string;
    color: string;
    orientation: string;
    content_filter: string;
    camera: string;
    dateRange: string;
  }) => void;
}

const colors = [
  { name: 'Black & White', value: 'black_and_white', hex: '#000000' },
  { name: 'Black', value: 'black', hex: '#262626' },
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Yellow', value: 'yellow', hex: '#FFD700' },
  { name: 'Orange', value: 'orange', hex: '#FFA500' },
  { name: 'Red', value: 'red', hex: '#FF0000' },
  { name: 'Purple', value: 'purple', hex: '#800080' },
  { name: 'Magenta', value: 'magenta', hex: '#FF00FF' },
  { name: 'Green', value: 'green', hex: '#008000' },
  { name: 'Teal', value: 'teal', hex: '#008080' },
  { name: 'Blue', value: 'blue', hex: '#0000FF' },
];

const orientations = [
  { name: 'Landscape', value: 'landscape', icon: <Layout size={14} className="rotate-90" /> },
  { name: 'Portrait', value: 'portrait', icon: <Layout size={14} /> },
  { name: 'Squarish', value: 'squarish', icon: <AlignCenter size={14} /> },
];

const sorts = [
  { name: 'Relevant', value: 'relevant' },
  { name: 'Latest', value: 'latest' },
];

const contentFilters = [
  { name: 'High Quality', value: 'high' },
  { name: 'Low Quality', value: 'low' },
];

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [selectedSort, setSelectedSort] = useState('relevant');
  const [selectedOrientation, setSelectedOrientation] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('high');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Simulated advanced filters
  const [camera, setCamera] = useState('');
  const [dateRange, setDateRange] = useState('');

  const handleUpdate = (type: string, value: string) => {
    let newSort = selectedSort;
    let newOrientation = selectedOrientation;
    let newColor = selectedColor;
    let newQuality = selectedQuality;
    let newCamera = camera;
    let newDateRange = dateRange;

    if (type === 'sort') {
      newSort = value;
      setSelectedSort(value);
    } else if (type === 'orientation') {
      newOrientation = value === selectedOrientation ? '' : value;
      setSelectedOrientation(newOrientation);
    } else if (type === 'color') {
      newColor = value === selectedColor ? '' : value;
      setSelectedColor(newColor);
    } else if (type === 'quality') {
      newQuality = value;
      setSelectedQuality(value);
    } else if (type === 'camera') {
      newCamera = value;
      setCamera(value);
    } else if (type === 'dateRange') {
      newDateRange = value;
      setDateRange(value);
    }

    onFilterChange({
      order_by: newSort,
      color: newColor,
      orientation: newOrientation,
      content_filter: newQuality,
      camera: newCamera,
      dateRange: newDateRange
    });
  };

  const handleApply = () => {
    setShowAdvanced(false);
    // Explicitly re-trigger in case some changes were pending
    onFilterChange({
      order_by: selectedSort,
      color: selectedColor,
      orientation: selectedOrientation,
      content_filter: selectedQuality,
      camera: camera,
      dateRange: dateRange
    });
  };

  const clearFilters = () => {
    setSelectedSort('relevant');
    setSelectedOrientation('');
    setSelectedColor('');
    setSelectedQuality('high');
    setCamera('');
    setDateRange('');
    onFilterChange({
      order_by: 'relevant',
      color: '',
      orientation: '',
      content_filter: 'high',
      camera: '',
      dateRange: ''
    });
  };

  return (
    <div className="flex flex-col gap-4 py-4 z-20">
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest hidden sm:block">Sort</label>
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
            {sorts.map((sort) => (
              <button
                key={sort.value}
                onClick={() => handleUpdate('sort', sort.value)}
                aria-label={`Sort by ${sort.name}`}
                className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all ${selectedSort === sort.value
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
              >
                {sort.name}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2 hidden sm:block" />

        {/* Orientation Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest hidden sm:block">Orientation</label>
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800">
            {orientations.map((o) => (
              <button
                key={o.value}
                onClick={() => handleUpdate('orientation', o.value)}
                aria-label={`Orientation ${o.name}`}
                className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all flex items-center gap-2 ${selectedOrientation === o.value
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
              >
                {o.icon}
                <span className="hidden md:inline">{o.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2 hidden lg:block" />

        {/* Color Filter */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest hidden sm:block">Color</label>
          <div className="flex flex-wrap gap-1.5 p-1">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => handleUpdate('color', c.value)}
                title={c.name}
                aria-label={`Filter by color ${c.name}`}
                className={`w-5 h-5 rounded-full border border-gray-200 dark:border-gray-800 transition-all flex items-center justify-center ${selectedColor === c.value ? 'scale-125 ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-black' : 'hover:scale-110'
                  }`}
                style={{ backgroundColor: c.hex }}
              >
                {selectedColor === c.value && (
                  <Check size={10} className={c.value === 'white' ? 'text-black' : 'text-white'} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ml-auto ${showAdvanced ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-gray-100 dark:bg-gray-900 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        >
          <Layers size={14} />
          Filters
        </button>

        {/* Clear Button */}
        {(selectedOrientation || selectedColor || selectedSort !== 'relevant' || camera || dateRange) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-2">
              <Camera size={12} /> Camera
            </label>
            <select
              value={camera}
              onChange={(e) => handleUpdate('camera', e.target.value)}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-gray-200"
            >
              <option value="">Any Camera</option>
              <option value="canon">Canon</option>
              <option value="nikon">Nikon</option>
              <option value="sony">Sony</option>
              <option value="fujifilm">Fujifilm</option>
              <option value="leica">Leica</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-2">
              <Calendar size={12} /> Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => handleUpdate('dateRange', e.target.value)}
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-2 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all dark:text-gray-200"
            >
              <option value="">Any Time</option>
              <option value="today">Today</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest flex items-center gap-2">
              <Check size={12} /> Content Filter
            </label>
            <div className="flex bg-white dark:bg-black p-1 rounded-lg border border-gray-200 dark:border-gray-800">
              {contentFilters.map((cf) => (
                <button
                  key={cf.value}
                  onClick={() => handleUpdate('quality', cf.value)}
                  className={`flex-1 py-1 px-3 rounded-md text-[13px] font-semibold transition-all ${selectedQuality === cf.value
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                    }`}
                >
                  {cf.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              onClick={handleApply}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg active:scale-95"
            >
              <Search size={16} /> Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

