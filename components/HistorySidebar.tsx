import React from 'react';
import { HistoryItem } from '../types';
import { History, Trash2, ChevronRight } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, isOpen, onClear, onSelect, onClose }) => {
  return (
    <div 
      className={`fixed inset-y-0 right-0 w-80 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-l border-gray-800 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center space-x-2 text-white">
          <History size={20} className="text-blue-400" />
          <h2 className="font-semibold text-lg">History</h2>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={onClear} 
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-full transition-colors"
            title="Clear History"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors md:hidden"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-sm">No calculation history yet.</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex flex-col items-end p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 cursor-pointer transition-all border border-transparent hover:border-gray-700"
            >
              <div className="text-gray-400 text-sm mb-1 font-mono">{item.expression}</div>
              <div className="text-white text-xl font-medium">{item.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
