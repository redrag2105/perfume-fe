import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { perfumesApi } from '@/api';
import type { PerfumeDetail as PerfumeDetailType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import GlassMagnifier from '@/components/GlassMagnifier';

export default function PerfumeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [perfume, setPerfume] = useState<PerfumeDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  // Scroll animations
  const [imageRef, imageInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [detailsRef, detailsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [reviewsRef, reviewsInView] = useInView({ triggerOnce: true, threshold: 0.45 });

  // Fetch Perfume Details
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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-xl tracking-widest text-gray-400 animate-pulse">Loading Maison Aura...</div>;
  
  if (!perfume) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        {/* Decorative Element */}
        <div className="w-16 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
        
        <h1 className="text-4xl font-serif text-gray-800">Fragrance Not Found</h1>
        
        <p className="text-sm text-gray-500 leading-relaxed tracking-wide">
          The scent you're searching for seems to have faded into the ether. 
          Perhaps it was a limited edition, or maybe it's waiting to be discovered elsewhere.
        </p>
        
        <div className="w-16 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
        
        <Link to="/">
          <Button variant="outline" className="mt-4 rounded-none border-black text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-black hover:text-white transition-all">
            Return to Collection
          </Button>
        </Link>
      </div>
    </div>
  );

  const isExtrait = perfume.concentration === 'Extrait';
  
  // Check if the current user has already reviewed
  const hasReviewed = user ? perfume.comments.some(c => c.author._id === user.memberId) : false;

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Link to="/" className="inline-flex items-center text-xs tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
          <ChevronLeft size={14} className="mr-1" /> Back to Collection
        </Link>
      </div>

      {/* Split Screen Layout */}
      <div className="container mx-auto px-6 pt-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Editorial Image with Glass Magnifier */}
        <div 
          ref={imageRef}
          className={`relative w-full aspect-4/5 flex items-center justify-center bg-[#F9F9F9] p-8 transition-shadow duration-500 hover:shadow-xl ${isExtrait ? 'extrait-card' : ''} ${imageInView ? 'animate-slide-in-left' : 'opacity-0'}`}
        >
          {isExtrait && <span className="extrait-badge">Extrait</span>}
          <GlassMagnifier 
            src={perfume.uri} 
            alt={perfume.perfumeName} 
            className="w-full h-full"
            magnification={2.5}
            glassSize={150}
          />
        </div>

        {/* Right Side: Details & Typography */}
        <div ref={detailsRef} className={`flex flex-col h-full justify-center md:py-12 space-y-8 ${detailsInView ? 'animate-slide-in-right animate-delay-200' : 'opacity-0'}`}>
          
          <div className="space-y-2 border-b border-gray-100 pb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{perfume.brand?.brandName || 'Unknown Maison'}</p>
            <h1 className="text-5xl font-serif text-primary leading-tight">{perfume.perfumeName}</h1>
            <p className="text-lg italic text-gray-500 capitalize font-serif pt-2">Pour {perfume.targetAudience}</p>
          </div>

          <div className="flex justify-between items-center py-2">
            <p className="text-2xl font-light tracking-wide">${perfume.price}</p>
            <p className="text-sm tracking-widest text-gray-500 uppercase">{perfume.volume} ML</p>
          </div>

          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-black mb-2">The Scent</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light">{perfume.description}</p>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-black mb-2">Notes & Ingredients</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light">{perfume.ingredients}</p>
            </div>
            
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-black mb-2">Concentration</h3>
              <p className={`text-sm tracking-widest uppercase ${isExtrait ? 'text-[#D4AF37] font-semibold' : 'text-gray-600'}`}>
                {perfume.concentration}
              </p>
            </div>
          </div>
          
          <Button className="w-full h-14 mt-8 text-sm tracking-[0.2em] uppercase rounded-none bg-black hover:bg-gray-800 text-white transition-all">
            Add to Bag
          </Button>

        </div>
      </div>

      {/* Reviews Section */}
      <div ref={reviewsRef} className={`container mx-auto px-6 mt-32 border-t border-gray-100 pt-16 max-w-4xl ${reviewsInView ? 'animate-slide-up' : 'opacity-0'}`}>
        <h2 className="text-3xl font-serif text-center mb-12">Client Feedback</h2>

        {/* Write a Review Form */}
        <div className="mb-16 bg-[#FAFAFA] p-8 border border-gray-100 transition-shadow duration-300 hover:shadow-md">
          <ReviewForm
            perfumeId={id!}
            isLoggedIn={!!user}
            hasReviewed={hasReviewed}
            onReviewSubmitted={fetchPerfume}
          />
        </div>

        {/* List of Comments */}
        <div className="space-y-8">
          {perfume.comments.length === 0 ? (
            <p className="text-center text-sm text-gray-400 italic">No feedback has been left for this fragrance yet.</p>
          ) : (
            perfume.comments.map((comment) => (
              <ReviewCard key={comment._id} comment={comment} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}