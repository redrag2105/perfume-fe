import { useState, useMemo } from 'react';
import { ImageOff } from 'lucide-react';

interface ImagePreviewProps {
  uri: string;
}

export default function ImagePreview({ uri }: ImagePreviewProps) {
  // Use uri as part of key to reset error state when uri changes
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});
  const imageError = errorMap[uri] ?? false;

  // Check if URI is a valid URL for preview
  const isValidImageUrl = useMemo(() => {
    try {
      new URL(uri);
      return uri.startsWith('http://') || uri.startsWith('https://');
    } catch {
      return false;
    }
  }, [uri]);

  const handleImageError = () => {
    setErrorMap(prev => ({ ...prev, [uri]: true }));
  };

  return (
    <div className="w-48 shrink-0">
      <label className="block text-[9px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 mb-2">
        Preview
      </label>
      <div className="aspect-3/4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
        {isValidImageUrl && !imageError ? (
          <img
            src={uri}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="text-center p-4">
            <ImageOff size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" strokeWidth={1} />
            <p className="text-[9px] tracking-wide uppercase text-gray-400 dark:text-gray-500">
              {uri ? 'Invalid URL' : 'No image'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
