import React from 'react';
import Button from './Button';
import { Operator } from '../types';
import { Delete, Divide, Minus, Plus, X, Calculator as CalcIcon } from 'lucide-react';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: Operator) => void;
  onClear: () => void;
  onDelete: () => void;
  onEquals: () => void;
  onDecimal: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ 
  onDigit, onOperator, onClear, onDelete, onEquals, onDecimal, onToggleSign, onPercent 
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-gray-900 rounded-b-2xl h-full">
      <Button label="AC" onClick={onClear} variant="danger" className="text-lg font-bold" />
      <Button label={<Delete size={20} />} onClick={onDelete} variant="secondary" />
      <Button label="%" onClick={onPercent} variant="secondary" />
      <Button label={<Divide size={24} />} onClick={() => onOperator('÷')} variant="secondary" className="text-blue-300" />

      <Button label="7" onClick={() => onDigit('7')} variant="primary" />
      <Button label="8" onClick={() => onDigit('8')} variant="primary" />
      <Button label="9" onClick={() => onDigit('9')} variant="primary" />
      <Button label={<X size={24} />} onClick={() => onOperator('×')} variant="secondary" className="text-blue-300" />

      <Button label="4" onClick={() => onDigit('4')} variant="primary" />
      <Button label="5" onClick={() => onDigit('5')} variant="primary" />
      <Button label="6" onClick={() => onDigit('6')} variant="primary" />
      <Button label={<Minus size={24} />} onClick={() => onOperator('-')} variant="secondary" className="text-blue-300" />

      <Button label="1" onClick={() => onDigit('1')} variant="primary" />
      <Button label="2" onClick={() => onDigit('2')} variant="primary" />
      <Button label="3" onClick={() => onDigit('3')} variant="primary" />
      <Button label={<Plus size={24} />} onClick={() => onOperator('+')} variant="secondary" className="text-blue-300" />

      <Button label="+/-" onClick={onToggleSign} variant="primary" className="text-lg" />
      <Button label="0" onClick={() => onDigit('0')} variant="primary" />
      <Button label="." onClick={onDecimal} variant="primary" className="text-2xl pb-2" />
      <Button label="=" onClick={onEquals} variant="accent" className="font-bold text-2xl" />
    </div>
  );
};

export default Keypad;
