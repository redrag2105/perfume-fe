import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

export default function About() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [storyRef, storyInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      
      {/* Editorial Hero - Full Width */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Large Typography Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <span className="text-[40vw] font-serif text-white font-bold tracking-tighter">P</span>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <p className={`text-[10px] tracking-[0.4em] uppercase text-white/40 mb-8 ${heroInView ? 'animate-fade-in' : 'opacity-0'}`}>
            The Pursuit of Perfection
          </p>
          <h1 className={`text-7xl md:text-9xl font-serif text-white mb-8 tracking-tight ${heroInView ? 'animate-slide-up animate-delay-100' : 'opacity-0'}`}>
            Pétale
          </h1>
          <p className={`text-lg text-white/50 font-light max-w-lg mx-auto ${heroInView ? 'animate-slide-up animate-delay-300' : 'opacity-0'}`}>
            Curating the world's most extraordinary fragrances since 2024.
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-linear-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Story Section - Asymmetric Layout */}
      <section ref={storyRef} className="py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Left Column - Large Text */}
            <div className={`lg:col-span-5 ${storyInView ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 mb-6">Our Story</p>
              <h2 className="text-5xl md:text-6xl font-serif text-black leading-[1.1] mb-8">
                The Art of<br />Olfactory<br />Excellence
              </h2>
              <div className="w-24 h-px bg-black" />
            </div>
            
            {/* Right Column - Body Text */}
            <div className={`lg:col-span-6 lg:col-start-7 space-y-8 pt-8 ${storyInView ? 'animate-slide-in-right animate-delay-200' : 'opacity-0'}`}>
              <p className="text-lg text-neutral-600 leading-relaxed">
                At Pétale, we believe that fragrance is more than a scent—it is an expression of identity, 
                a memory captured in essence, and a journey through artistry.
              </p>
              <p className="text-neutral-500 leading-relaxed">
                We partner with the most distinguished maisons to bring you collections that transcend 
                the ordinary. Each fragrance in our collection has been personally selected for its 
                exceptional craftsmanship, unique character, and ability to evoke emotion.
              </p>
              <p className="text-neutral-500 leading-relaxed">
                We seek out compositions that tell stories, that linger in memory, that become 
                part of who you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Editorial Grid */}
      <section ref={valuesRef} className="py-32 md:py-40 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-24 ${valuesInView ? 'animate-slide-up' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-serif text-black">Our Principles</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black">
            {[
              {
                number: '01',
                title: 'Authenticity',
                description: 'Every fragrance is sourced directly from authorized distributors, ensuring absolute authenticity and quality.'
              },
              {
                number: '02',
                title: 'Curation',
                description: "We don't carry everything—only the exceptional. Each addition must meet our exacting standards."
              },
              {
                number: '03',
                title: 'Experience',
                description: 'From discovery to delivery, every touchpoint reflects the luxury of the fragrances we carry.'
              }
            ].map((value, i) => (
              <div 
                key={value.number}
                className={`bg-neutral-100 p-12 md:p-16 ${valuesInView ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${(i + 1) * 150}ms` }}
              >
                <span className="text-6xl font-serif text-black/10 block mb-6">{value.number}</span>
                <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-black mb-4">{value.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width Black */}
      <section ref={ctaRef} className="py-32 md:py-40 bg-black">
        <div className={`max-w-4xl mx-auto px-6 text-center ${ctaInView ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tight">
            Begin Your Journey
          </h2>
          <p className="text-white/50 mb-12 max-w-lg mx-auto">
            Explore our thoughtfully curated collection and discover your signature scent.
          </p>
          <Link 
            to="/" 
            className="inline-block border border-white text-white px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
          >
            View Collection
          </Link>
        </div>
      </section>

    </div>
  );
}
