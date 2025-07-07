
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DatePickerProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  availableDates?: string[];
}

const DatePicker = ({ label, sublabel, value, onChange, disabled = false, availableDates = [] }: DatePickerProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const validateDateFormat = (dateStr: string) => {
    // Check if format matches DD.MM.YYYY
    const dateRegex = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
    if (!dateRegex.test(dateStr)) return false;
    
    // If availableDates provided, check if date exists in available dates
    if (availableDates.length > 0) {
      return availableDates.includes(dateStr);
    }
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const isValidDate = validateDateFormat(newValue);
    setIsValid(isValidDate);
    
    if (isValidDate) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && inputValue !== value) {
      onChange(inputValue);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-900 mb-1">{label}</label>
      {sublabel && <span className="block text-xs text-gray-500 mb-1">- {sublabel}</span>}
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!isValid) {
              setInputValue(value);
              setIsValid(true);
            }
          }}
          disabled={disabled}
          placeholder="DD.MM.YYYY"
          className={`w-full pr-10 py-2 h-9 ${!isValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {!isValid && (
          <p className="text-xs text-red-500 mt-1">
            {availableDates.length > 0 
              ? 'Please enter a valid simulation date (DD.MM.YYYY)' 
              : 'Please enter a valid date format (DD.MM.YYYY)'
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
