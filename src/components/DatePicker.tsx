
import React from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DatePickerProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const DatePicker = ({ label, sublabel, value, onChange, disabled = false }: DatePickerProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
      {sublabel && <span className="block text-xs text-gray-500 mb-1">- {sublabel}</span>}
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full pr-10 py-2 h-9"
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default DatePicker;
