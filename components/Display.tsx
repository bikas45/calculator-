import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  input: string;
  previousInput: string;
  operator: string | null;
  result: string | null;
}

const Display: React.FC<DisplayProps> = ({ input, previousInput, operator, result }) => {
  const inputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to end of input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [input, result]);

  const formatNumber = (num: string) => {
    if (!num) return '';
    // Prevent formatting partially typed decimals (e.g. "5.")
    if (num.endsWith('.')) return num;
    // Basic comma separation for display
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  return (
    <div className="w-full bg-gray-900 rounded-t-2xl p-6 flex flex-col justify-end items-end h-40 select-none">
      <div className="text-gray-400 text-lg h-6 mb-1 font-medium tracking-wide">
        {previousInput} {operator}
      </div>
      <div 
        ref={inputRef}
        className="text-white text-5xl font-light w-full text-right overflow-x-auto whitespace-nowrap scrollbar-hide"
        style={{ scrollbarWidth: 'none' }}
      >
        {result !== null ? formatNumber(result) : (input ? formatNumber(input) : '0')}
      </div>
    </div>
  );
};

export default Display;
