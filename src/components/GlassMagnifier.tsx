import { useState, useRef, useCallback, useEffect } from 'react';

interface GlassMagnifierProps {
  src: string;
  alt: string;
  magnification?: number;
  minMagnification?: number;
  maxMagnification?: number;
  glassSize?: number;
  className?: string;
}

export default function GlassMagnifier({
  src,
  alt,
  magnification = 2.5,
  minMagnification = 1,
  maxMagnification = 5,
  glassSize = 150,
  className = '',
}: GlassMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentMagnification, setCurrentMagnification] = useState(magnification);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
    setImageSize({ width: rect.width, height: rect.height });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    setCurrentMagnification(magnification); // Reset to default on enter
  }, [magnification]);
  
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  // Handle scroll wheel to adjust magnification
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (!isHovering) return;
      
      // Prevent page scroll
      e.preventDefault();
      
      // Scroll up (negative deltaY) = increase zoom, scroll down = decrease
      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      
      setCurrentMagnification(prev => {
        const newMag = prev + delta;
        return Math.min(maxMagnification, Math.max(minMagnification, newMag));
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isHovering, minMagnification, maxMagnification]);

  // Calculate background position for zoomed effect
  const bgPosX = (position.x / imageSize.width) * 100;
  const bgPosY = (position.y / imageSize.height) * 100;

  return (
    <div
      ref={containerRef}
      className={`relative cursor-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* Glass Magnifier */}
      {isHovering && (
        <>
          <div
            className="pointer-events-none absolute rounded-full border border-gray-200 shadow-lg overflow-hidden transition-[background-size] duration-100 ease-out"
            style={{
              width: glassSize,
              height: glassSize,
              left: position.x - glassSize / 2,
              top: position.y - glassSize / 2,
              backgroundImage: `url(${src})`,
              backgroundSize: `${imageSize.width * currentMagnification}px ${imageSize.height * currentMagnification}px`,
              backgroundPosition: `${bgPosX}% ${bgPosY}%`,
              backgroundRepeat: 'no-repeat',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 30px rgba(255,255,255,0.1)',
            }}
          />
          {/* Zoom Level Indicator */}
          <div className="pointer-events-none absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white text-[10px] tracking-widest uppercase">
            {currentMagnification.toFixed(1)}x
          </div>
        </>
      )}
    </div>
  );
}
