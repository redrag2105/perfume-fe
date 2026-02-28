import { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  /** Optional label - if not provided, no label is rendered */
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | false;
  /** Style variant: 'underline' for auth pages, 'bordered' for admin dashboard */
  variant?: 'underline' | 'bordered';
  className?: string;
}

export default function DropdownSelect({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select',
  error,
  variant = 'bordered',
  className,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  const buttonStyles = variant === 'underline'
    ? cn(
        'h-12 w-full px-0 border-0 border-b border-gray-300 focus:border-black outline-none bg-transparent text-sm cursor-pointer text-left flex items-center justify-between transition-all duration-300 hover:border-gray-500',
        error && 'border-red-500'
      )
    : cn(
        'w-full px-4 py-3 border text-sm bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors cursor-pointer text-left flex items-center justify-between',
        error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
      );

  const textStyles = variant === 'underline'
    ? selectedOption ? 'text-gray-600' : 'text-gray-400'
    : !value ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-white';

  const dropdownStyles = variant === 'underline'
    ? cn(
        'absolute left-0 top-full mt-1 w-full bg-white border border-gray-100 shadow-lg z-50 transition-all duration-200 origin-top',
        isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
      )
    : cn(
        'absolute left-0 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg z-50 transition-all duration-200 origin-top',
        isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
      );

  const optionStyles = (isSelected: boolean) => variant === 'underline'
    ? cn(
        'w-full text-left px-4 py-2.5 text-sm tracking-wide transition-colors cursor-pointer',
        isSelected ? 'text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
      )
    : cn(
        'w-full text-left px-4 py-2.5 text-sm tracking-wide transition-colors cursor-pointer',
        isSelected
          ? 'text-black dark:text-white bg-gray-50 dark:bg-gray-700'
          : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
      );

  return (
    <div ref={ref} className={className}>
      {label && (
        <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={buttonStyles}
        >
          <span className={textStyles}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown 
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform duration-200',
              variant === 'bordered' && 'dark:text-gray-500',
              isOpen && 'rotate-180'
            )} 
          />
        </button>
        <div className={dropdownStyles}>
          <div className="py-1 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={optionStyles(value === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
