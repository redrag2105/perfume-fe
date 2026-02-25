import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-center max-w-3xl px-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-6">Est. 2024</p>
          <h1 className="text-6xl md:text-7xl font-serif text-primary mb-8 leading-tight">
            Maison Aura
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            A curated destination for the world's most extraordinary fragrances.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">Our Philosophy</p>
              <h2 className="text-4xl md:text-5xl font-serif text-primary leading-tight">
                The Art of <br />Olfactory Excellence
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At Aura, we believe that fragrance is more than a scent—it is an expression of identity, 
                a memory captured in essence, and a journey through artistry. We partner with the most 
                distinguished maisons to bring you collections that transcend the ordinary.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each fragrance in our collection has been personally selected for its exceptional 
                craftsmanship, unique character, and ability to evoke emotion. We seek out compositions 
                that tell stories, that linger in memory, that become part of who you are.
              </p>
            </div>
            <div className="aspect-4/5 bg-[#F5F5F5] flex items-center justify-center">
              <span className="text-[120px] font-serif text-gray-200">A</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4">Our Values</p>
            <h2 className="text-4xl font-serif text-primary">What Guides Us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-px h-12 bg-gray-300 mx-auto" />
              <h3 className="text-sm tracking-[0.2em] uppercase font-medium">Authenticity</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Every fragrance is sourced directly from authorized distributors, 
                ensuring absolute authenticity and quality.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-px h-12 bg-gray-300 mx-auto" />
              <h3 className="text-sm tracking-[0.2em] uppercase font-medium">Curation</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We don't carry everything—only the exceptional. Each addition 
                to our collection must meet our exacting standards.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-px h-12 bg-gray-300 mx-auto" />
              <h3 className="text-sm tracking-[0.2em] uppercase font-medium">Experience</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                From discovery to delivery, we craft every touchpoint 
                to reflect the luxury of the fragrances we carry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif text-primary mb-6">Begin Your Journey</h2>
          <p className="text-gray-600 mb-10 max-w-lg mx-auto">
            Explore our thoughtfully curated collection and discover 
            your signature scent.
          </p>
          <Link 
            to="/" 
            className="inline-block border border-black px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all duration-300"
          >
            View Collection
          </Link>
        </div>
      </section>

    </div>
  );
}
