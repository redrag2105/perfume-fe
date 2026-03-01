interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  fullWidth?: boolean;
  error?: string | false;
}

export default function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  fullWidth = false,
  error,
}: TextAreaFieldProps) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-gray-900 dark:focus:border-gray-400 transition-colors resize-none ${
          error ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
