import React, { useState, useCallback } from 'react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistorySidebar from './components/HistorySidebar';
import AIModal from './components/AIModal';
import { Operator, HistoryItem } from './types';
import { History as HistoryIcon, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Actually we don't have uuid installed in the prompt constraints, using Date.now

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [previousInput, setPreviousInput] = useState<string>('');
  const [operator, setOperator] = useState<Operator>(null);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Helper to safely format numbers for calculations (removing commas)
  const cleanNumber = (num: string) => num.replace(/,/g, '');

  const handleDigit = useCallback((digit: string) => {
    if (result !== null) {
      // Starting a new calculation after a result
      setInput(digit);
      setResult(null);
      setPreviousInput('');
      setOperator(null);
    } else {
      // Prevent multiple leading zeros
      if (input === '0' && digit === '0') return;
      // Replace only zero with new digit
      if (input === '0' && digit !== '0') {
        setInput(digit);
      } else {
        // Limit input length
        if (input.length < 15) {
          setInput(prev => prev + digit);
        }
      }
    }
  }, [input, result]);

  const handleDecimal = useCallback(() => {
    if (result !== null) {
      setInput('0.');
      setResult(null);
      setPreviousInput('');
      setOperator(null);
    } else if (!input.includes('.')) {
      setInput(prev => (prev === '' ? '0.' : prev + '.'));
    }
  }, [input, result]);

  const handleOperator = useCallback((op: Operator) => {
    if (result !== null) {
      // Continue calculation with previous result
      setPreviousInput(result);
      setInput('');
      setResult(null);
      setOperator(op);
    } else if (input) {
      if (previousInput && operator) {
        // Chaining operations (e.g., 5 + 5 + ...)
        calculate();
        setOperator(op);
      } else {
        setPreviousInput(input);
        setInput('');
        setOperator(op);
      }
    } else if (previousInput) {
      // Changing operator
      setOperator(op);
    }
  }, [input, previousInput, operator, result]); // Will add 'calculate' to deps via reference or use helper

  const calculate = () => {
    if (!previousInput || !input || !operator) return;

    const prev = parseFloat(cleanNumber(previousInput));
    const current = parseFloat(cleanNumber(input));
    let res = 0;

    switch (operator) {
      case '+': res = prev + current; break;
      case '-': res = prev - current; break;
      case '×': res = prev * current; break;
      case '÷': 
        if (current === 0) {
          setResult('Error');
          setInput('');
          setPreviousInput('');
          setOperator(null);
          return;
        }
        res = prev / current; 
        break;
      default: return;
    }

    // Fix floating point precision issues
    const formattedResult = parseFloat(res.toFixed(10)).toString();

    setResult(formattedResult);
    
    // Add to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: `${previousInput} ${operator} ${input}`,
      result: formattedResult,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
    
    // Setup for next calc
    setPreviousInput('');
    setOperator(null);
    // Note: We don't clear input here because we want to show the result, 
    // but the next digit press will reset it via handleDigit logic
  };

  const handleEquals = useCallback(() => {
    calculate();
  }, [input, previousInput, operator]);

  const handleClear = useCallback(() => {
    setInput('');
    setPreviousInput('');
    setOperator(null);
    setResult(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (result !== null) {
      handleClear();
    } else {
      setInput(prev => prev.slice(0, -1));
    }
  }, [result, handleClear]);

  const handlePercent = useCallback(() => {
    if (input) {
      const val = parseFloat(input);
      setInput((val / 100).toString());
    } else if (result) {
        const val = parseFloat(result);
        const newRes = (val / 100).toString();
        setResult(newRes);
        setInput(newRes); // Update input to allow continuation
    }
  }, [input, result]);

  const handleToggleSign = useCallback(() => {
    if (input) {
      setInput(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    } else if (result) {
        const newRes = (result.startsWith('-') ? result.slice(1) : '-' + result);
        setResult(newRes);
        setInput(newRes);
    }
  }, [input, result]);

  const restoreHistoryItem = (item: HistoryItem) => {
    setInput(item.result);
    setPreviousInput('');
    setOperator(null);
    setResult(null);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-sm z-10 flex flex-col gap-4">
        
        {/* Top Controls */}
        <div className="flex justify-between items-center px-2">
            <button 
                onClick={() => setIsAIModalOpen(true)}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-sm font-medium shadow-lg shadow-blue-900/40 hover:scale-105 transition-all"
            >
                <Sparkles size={16} className="text-yellow-300" />
                <span>Ask AI</span>
            </button>

            <button 
                onClick={() => setIsHistoryOpen(true)}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                title="View History"
            >
                <HistoryIcon size={24} />
            </button>
        </div>

        {/* Main Calculator Body */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 overflow-hidden flex flex-col">
          <Display 
            input={input} 
            previousInput={previousInput} 
            operator={operator} 
            result={result} 
          />
          <Keypad 
            onDigit={handleDigit}
            onOperator={handleOperator}
            onClear={handleClear}
            onDelete={handleDelete}
            onEquals={handleEquals}
            onDecimal={handleDecimal}
            onPercent={handlePercent}
            onToggleSign={handleToggleSign}
          />
        </div>
      </div>

      <HistorySidebar 
        history={history}
        isOpen={isHistoryOpen}
        onClear={() => setHistory([])}
        onSelect={restoreHistoryItem}
        onClose={() => setIsHistoryOpen(false)}
      />

      <AIModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
};

export default App;
