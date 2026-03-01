import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { perfumesApi } from '@/api';
import type { PerfumeDetail as PerfumeDetailType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Droplets, Wind } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import GlassMagnifier from '@/components/GlassMagnifier';

export default function PerfumeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [perfume, setPerfume] = useState<PerfumeDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  const [imageRef, imageInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [detailsRef, detailsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [reviewsRef, reviewsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const fetchPerfume = useCallback(async () => {
    try {
      const data = await perfumesApi.getById(id!);
      setPerfume(data);
    } catch (error) {
      console.error("Error fetching perfume details", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPerfume();
  }, [fetchPerfume]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
        <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Loading fragrance...</span>
      </div>
    </div>
  );
  
  if (!perfume) return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-lg">
        <h1 className="text-8xl font-serif text-black">404</h1>
        <p className="text-sm text-neutral-500 tracking-wide">
          The fragrance you're searching for could not be found.
        </p>
        <Link to="/">
          <Button className="mt-4 bg-black text-white text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-black/80 transition-all rounded-none">
            Return to Collection
          </Button>
        </Link>
      </div>
    </div>
  );

  const isExtrait = perfume.concentration === 'Extrait';
  const hasReviewed = user ? perfume.comments.some(c => c.author._id === user.memberId) : false;
  const avgRating = perfume.comments.length > 0 
    ? (perfume.comments.reduce((acc, c) => acc + c.rating, 0) / perfume.comments.length).toFixed(1)
    : null;

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Link to="/" className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors">
          <ArrowLeft size={14} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
          <span>Collection</span>
        </Link>
      </div>

      {/* Product Layout - Two Column */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Left: Image with decorative elements */}
        <div 
          ref={imageRef}
          className={`relative ${imageInView ? 'animate-slide-in-left' : 'opacity-0'}`}
        >
          {/* Decorative background square */}
          <div className="absolute -top-4 -left-4 w-2/3 h-2/3 bg-linear-to-br from-neutral-100 to-neutral-50 -z-10" />
          
          <div className={`relative aspect-square bg-white flex items-center justify-center shadow-2xl shadow-neutral-200/50 ${isExtrait ? 'extrait-card' : ''}`}>
            {isExtrait && (
              <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-[#C9A86C] to-[#B89A5C] text-white text-[9px] font-medium tracking-[0.15em] uppercase">
                <Sparkles size={10} />
                Extrait
              </span>
            )}
            <GlassMagnifier 
              src={perfume.uri} 
              alt={perfume.perfumeName} 
              className="w-full h-full p-12"
              magnification={2.5}
              glassSize={150}
            />
          </div>
          
        </div>

        {/* Right: Details */}
        <div ref={detailsRef} className={`flex flex-col justify-center space-y-10 ${detailsInView ? 'animate-slide-in-right animate-delay-200' : 'opacity-0'}`}>
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400">{perfume.brand?.brandName || 'Unknown'}</p>
              {avgRating && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100">
                  <span className="text-[10px] text-black font-medium">{avgRating}</span>
                  <span className="text-[10px] text-neutral-400">/ 3</span>
                </div>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-black leading-[1.05]">{perfume.perfumeName}</h1>
            <p className="text-lg text-neutral-500 italic">Pour {perfume.targetAudience}</p>
          </div>

          {/* Price & Volume - Redesigned */}
          <div className="flex items-stretch gap-6">
            <div className="flex-1 bg-black text-white p-6">
              <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-2">Price</p>
              <p className="text-4xl font-light">${perfume.price}</p>
            </div>
            <div className="flex-1 bg-neutral-100 p-6 border border-neutral-200">
              <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-2">Volume</p>
              <p className="text-4xl font-light text-black">{perfume.volume}<span className="text-lg ml-1">ML</span></p>
            </div>
          </div>

          {/* Description with icons */}
          <div className="space-y-6">
            <div className="group">
              <div className="flex items-center gap-3 mb-3">
                <Droplets size={16} className="text-neutral-300 group-hover:text-[#C9A86C] transition-colors" />
                <h3 className="text-xs tracking-[0.2em] uppercase text-black">The Scent</h3>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed pl-7">{perfume.description}</p>
            </div>
            
            <div className="group">
              <div className="flex items-center gap-3 mb-3">
                <Wind size={16} className="text-neutral-300 group-hover:text-[#C9A86C] transition-colors" />
                <h3 className="text-xs tracking-[0.2em] uppercase text-black">Ingredients</h3>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed pl-7">{perfume.ingredients}</p>
            </div>
            
            <div className="flex items-center gap-6 pt-4 border-t border-neutral-200">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1">Concentration</p>
                <p className={`text-sm tracking-widest uppercase ${isExtrait ? 'text-[#C9A86C] font-medium' : 'text-black'}`}>
                  {perfume.concentration}
                </p>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 mb-1">Reviews</p>
                <p className="text-sm text-black">{perfume.comments.length}</p>
              </div>
            </div>
          </div>
          
          <Button className="w-full h-16 mt-4 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-neutral-800 transition-all rounded-none shadow-xl shadow-neutral-300/50 hover:shadow-2xl hover:shadow-neutral-300/50 hover:-translate-y-1">
            Add to Bag
          </Button>
        </div>
      </div>

      {/* Reviews Section - Redesigned */}
      <div className="bg-white border-t border-neutral-100">
        <div ref={reviewsRef} className={`max-w-4xl mx-auto px-6 py-24 ${reviewsInView ? 'animate-slide-up' : 'opacity-0'}`}>
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-4">What Others Think</p>
            <h2 className="text-5xl font-serif text-black">Reviews</h2>
            {perfume.comments.length > 0 && (
              <p className="text-sm text-neutral-400 mt-4">{perfume.comments.length} review{perfume.comments.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Write Review Form */}
          <div className="mb-16 bg-neutral-50 border border-neutral-100 overflow-hidden">
            <div className="bg-linear-to-r from-neutral-100 to-neutral-50 px-8 py-4 border-b border-neutral-100">
              <h3 className="text-xs tracking-[0.2em] uppercase text-black">Share Your Experience</h3>
            </div>
            <div className="p-8">
              <ReviewForm
                perfumeId={id!}
                isLoggedIn={!!user}
                hasReviewed={hasReviewed}
                onReviewSubmitted={fetchPerfume}
              />
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {perfume.comments.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 border border-neutral-100">
                <p className="text-sm text-neutral-400">No reviews yet. Be the first to share your thoughts.</p>
              </div>
            ) : (
              perfume.comments.map((comment, index) => (
                <div 
                  key={comment._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ReviewCard comment={comment} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
