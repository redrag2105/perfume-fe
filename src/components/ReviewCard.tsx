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
    <div className="border-b border-neutral-200 pb-8 group">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <p className="text-xs tracking-[0.15em] uppercase text-black font-medium">{comment.author?.name || 'Anonymous'}</p>
        <div className="flex text-black">
          {[...Array(3)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              fill={i < comment.rating ? "currentColor" : "none"} 
              strokeWidth={i < comment.rating ? 0 : 1}
              className={i < comment.rating ? '' : 'text-neutral-300'}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-neutral-600 leading-relaxed">"{comment.content}"</p>
      <p className="text-[10px] tracking-widest uppercase text-neutral-400 mt-4">
        {new Date(comment.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  );
}
