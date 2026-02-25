import { Star } from 'lucide-react';

interface ReviewCardProps {
  comment: {
    _id: string;
    rating: number;
    content: string;
    author: { _id: string; name: string };
    createdAt: string;
  };
}

export default function ReviewCard({ comment }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-100 pb-8 transition-all duration-300 hover:pl-2 hover:border-l-2 hover:border-l-gray-200">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold tracking-wide">{comment.author?.name || 'Anonymous Client'}</p>
        <div className="flex text-[#D4AF37]">
          {[...Array(comment.rating)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed font-light italic">"{comment.content}"</p>
      <p className="text-xs text-gray-400 mt-4">
        {new Date(comment.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  );
}
