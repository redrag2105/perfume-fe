import { Link } from 'react-router-dom';

interface ProductCardProps {
  perfume: {
    _id: string;
    perfumeName: string;
    uri: string;
    targetAudience: string;
    brandName: string;
    concentration?: string;
  };
  index: number;
}

export default function ProductCard({ perfume, index }: ProductCardProps) {
  const isExtrait = perfume.concentration === 'Extrait';

  return (
    <Link
      key={perfume._id}
      to={`/perfumes/${perfume._id}`}
      className="group cursor-pointer flex flex-col h-full transition-transform duration-500 ease-out hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container with Extrait Logic */}
      <div
        className={`relative w-full aspect-4/5 bg-[#F9F9F9] mb-5 overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:bg-[#F5F5F5] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${isExtrait ? 'extrait-card' : ''}`}
      >
        {isExtrait && <span className="extrait-badge">Extrait</span>}

        <img
          src={perfume.uri}
          alt={perfume.perfumeName}
          className="w-3/4 h-3/4 object-contain transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Typography Details */}
      <div className="text-center flex-1 flex flex-col">
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1.5">
          {perfume.brandName}
        </p>
        <h2 className="text-lg md:text-xl font-serif text-primary mb-1 group-hover:opacity-70 transition-opacity">
          {perfume.perfumeName}
        </h2>
        <p className="text-xs italic text-gray-400 capitalize mt-auto pt-1">
          Pour {perfume.targetAudience}
        </p>
      </div>

      {/* Subtle View Details indicator */}
      <div className="mt-5 pt-3 text-center relative">
        {/* Animated line that expands from center */}
        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-black transition-all duration-500 ease-out w-0 group-hover:w-full" />
        <span className="text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          Discover
        </span>
      </div>
    </Link>
  );
}
