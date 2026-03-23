'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  RotateCcw, 
  Layout, 
  AlignCenter, 
  Palette,
  Check
} from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: {
    order_by: string;
    color: string;
    orientation: string;
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
  { name: 'Landscape', value: 'landscape' },
  { name: 'Portrait', value: 'portrait' },
  { name: 'Squarish', value: 'squarish' },
];

const sorts = [
  { name: 'Relevant', value: 'relevant' },
  { name: 'Latest', value: 'latest' },
];

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [selectedSort, setSelectedSort] = useState('relevant');
  const [selectedOrientation, setSelectedOrientation] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleUpdate = (type: string, value: string) => {
    let newSort = selectedSort;
    let newOrientation = selectedOrientation;
    let newColor = selectedColor;

    if (type === 'sort') {
      newSort = value;
      setSelectedSort(value);
    } else if (type === 'orientation') {
      newOrientation = value === selectedOrientation ? '' : value;
      setSelectedOrientation(newOrientation);
    } else if (type === 'color') {
      newColor = value === selectedColor ? '' : value;
      setSelectedColor(newColor);
    }

    onFilterChange({
      order_by: newSort,
      color: newColor,
      orientation: newOrientation
    });
  };

  const clearFilters = () => {
    setSelectedSort('relevant');
    setSelectedOrientation('');
    setSelectedColor('');
    onFilterChange({ order_by: 'relevant', color: '', orientation: '' });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 py-6 border-b border-gray-100 mb-8 sticky top-0 bg-white z-40">
      {/* Sort Filter */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Sort</label>
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
          {sorts.map((sort) => (
            <button
              key={sort.value}
              onClick={() => handleUpdate('sort', sort.value)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                selectedSort === sort.value 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-500 hover:text-black'
              }`}
            >
              {sort.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden sm:block" />

      {/* Orientation Filter */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Orientation</label>
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
          {orientations.map((o) => (
            <button
              key={o.value}
              onClick={() => handleUpdate('orientation', o.value)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                selectedOrientation === o.value 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-500 hover:text-black'
              }`}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden lg:block" />

      {/* Color Filter */}
      <div className="flex items-center gap-2">
        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Color</label>
        <div className="flex flex-wrap gap-1.5 p-1">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => handleUpdate('color', c.value)}
              title={c.name}
              className={`w-5 h-5 rounded-full border border-gray-200 transition-all flex items-center justify-center ${
                selectedColor === c.value ? 'scale-125 ring-2 ring-black ring-offset-2' : 'hover:scale-110'
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

      {/* Clear Button */}
      {(selectedOrientation || selectedColor || selectedSort !== 'relevant') && (
        <button 
          onClick={clearFilters}
          className="ml-auto flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-wider"
        >
          <RotateCcw size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
