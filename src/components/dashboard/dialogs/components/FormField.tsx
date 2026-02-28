interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | false;
  type?: 'text' | 'number';
  fullWidth?: boolean;
}

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  fullWidth = false,
}: FormFieldProps) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors ${
          error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
