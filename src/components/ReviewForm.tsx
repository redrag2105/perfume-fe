import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { perfumesApi } from '@/api';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  perfumeId: string;
  isLoggedIn: boolean;
  hasReviewed: boolean;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ perfumeId, isLoggedIn, hasReviewed, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(3);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await perfumesApi.addComment(perfumeId, { rating, content });
      setSuccess(res.message);
      setContent('');
      onReviewSubmitted();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to submit review.');
      } else {
        setError('Failed to submit review.');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center space-y-6">
        <p className="text-sm text-neutral-500">Sign in to share your thoughts.</p>
        <Link to="/login">
          <Button variant="outline" className="border-2 border-black text-black text-xs uppercase tracking-[0.2em] px-10 py-3 hover:bg-black hover:text-white transition-all">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <p className="text-center text-sm text-neutral-500">
        You have already reviewed this fragrance.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="text-xs uppercase tracking-[0.2em] text-black text-center">Write a Review</h3>

      {error && <p className="text-xs text-center text-red-600 bg-red-50 p-3 border border-red-200">{error}</p>}
      {success && <p className="text-xs text-center text-black bg-neutral-50 p-3 border border-neutral-200">{success}</p>}

      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3].map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => setRating(num)}
              className={`p-2 transition-colors cursor-pointer ${rating >= num ? 'text-black' : 'text-neutral-300 hover:text-neutral-400'}`}
            >
              <Star fill={rating >= num ? 'currentColor' : 'none'} size={24} strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Your Review</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 border-2 border-neutral-200 focus:outline-none focus:border-black resize-none h-32 text-sm bg-white text-black placeholder:text-neutral-400 transition-colors"
          placeholder="Describe the scent, longevity, and your impressions..."
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-black text-white text-xs tracking-[0.2em] uppercase h-14 hover:bg-black/80 transition-all"
      >
        Submit Review
      </Button>
    </form>
  );
}
