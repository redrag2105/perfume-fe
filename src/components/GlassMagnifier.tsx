import { useState, useRef, useCallback } from 'react';

interface GlassMagnifierProps {
  src: string;
  alt: string;
  magnification?: number;
  glassSize?: number;
  className?: string;
}

export default function GlassMagnifier({
  src,
  alt,
  magnification = 2.5,
  glassSize = 150,
  className = '',
}: GlassMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
    setImageSize({ width: rect.width, height: rect.height });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

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
        <div
          className="pointer-events-none absolute rounded-full border border-gray-200 shadow-lg overflow-hidden"
          style={{
            width: glassSize,
            height: glassSize,
            left: position.x - glassSize / 2,
            top: position.y - glassSize / 2,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imageSize.width * magnification}px ${imageSize.height * magnification}px`,
            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
            backgroundRepeat: 'no-repeat',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 30px rgba(255,255,255,0.1)',
          }}
        />
      )}
    </div>
  );
}
