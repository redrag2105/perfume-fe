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
        setError(err.response?.data?.message || 'Failed to submit feedback.');
      } else {
        setError('Failed to submit feedback.');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm tracking-wide text-gray-500">You must be logged in to share your experience.</p>
        <Link to="/login">
          <Button variant="outline" className="rounded-none border-black text-xs uppercase tracking-widest">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <p className="text-center text-sm tracking-wide text-gray-500 italic">
        Thank you. You have already shared your experience for this fragrance.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-sm uppercase tracking-[0.2em] text-center mb-6">Share Your Experience</h3>

      {error && <p className="text-xs text-center text-red-600">{error}</p>}
      {success && <p className="text-xs text-center text-[#D4AF37]">{success}</p>}

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-gray-500">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3].map((num) => (
            <button
              type="button"
              key={num}
              onClick={() => setRating(num)}
              className={`p-2 transition-colors cursor-pointer ${rating >= num ? 'text-[#D4AF37]' : 'text-gray-300'}`}
            >
              <Star fill={rating >= num ? 'currentColor' : 'none'} size={24} strokeWidth={1} />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-gray-500">Your Thoughts</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 border border-gray-200 focus:outline-none focus:border-black resize-none h-32 text-sm bg-transparent"
          placeholder="Describe the scent, longevity, and your impressions..."
        />
      </div>

      <Button
        type="submit"
        className="w-full rounded-none bg-black text-white text-xs tracking-[0.2em] uppercase h-12 hover:bg-gray-800"
      >
        Submit Feedback
      </Button>
    </form>
  );
}
