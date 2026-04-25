import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const journeySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scrollytelling for Artisan's Journey
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: journeySectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        }
      });

      tl.from('.journey-img', {
        scale: 1.2,
        opacity: 0,
        y: 100,
        stagger: 0.2,
      });

      tl.from('.journey-text', {
        y: 50,
        opacity: 0,
        stagger: 0.3,
      }, '-=0.5');
    }, journeySectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <span className="inline-block px-6 py-1 mb-10 text-[10px] font-bold tracking-[0.5em] uppercase border border-gold/30 rounded-none text-gold bg-gold/5">
            Legacy of Craftsmanship
          </span>
          <h1 className="max-w-4xl mx-auto mb-8 text-6xl font-medium leading-[1.1] md:text-9xl font-display">
            The <br/> <span className="italic text-gold">Quiet Luxury</span> <br/> Archive
          </h1>
          <p className="max-w-xl mx-auto mb-12 text-sm md:text-base text-off-white/50 tracking-widest font-light uppercase">
            Synthesizing ancestral African textiles with avant-garde minimalist architecture.
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-center">
            <Link to="/shop" className="btn-primary">
              Enter the Collections
            </Link>
            <button className="btn-secondary">
              View The Atelier
            </button>
          </div>
        </motion.div>

        {/* Hero Image Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="relative w-full max-w-6xl mt-24 aspect-[21/9] rounded-none overflow-hidden shadow-2xl border border-white/5 bg-white/[0.01]"
        >
          <img 
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=2012" 
            alt="Hero Shoe" 
            className="object-cover w-full h-full opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-[80%] h-[80%] border border-white/5 rounded-full opacity-10"></div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-10 md:px-12 border-t border-white/5">
        <div className="flex justify-between items-baseline mb-20">
          <h2 className="text-3xl font-medium md:text-5xl font-display italic">Bespoke Principles</h2>
          <span className="text-[10px] tracking-[0.4em] uppercase opacity-30">Nº 001 - 004</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-0 max-w-7xl mx-auto border-l border-t border-white/5">
          <div className="md:col-span-2 md:row-span-2 bento-card p-12 flex flex-col justify-between min-h-[500px]">
             <div className="absolute inset-0 -z-10 opacity-20">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1470" className="w-full h-full object-cover grayscale" alt="Bento 1" />
             </div>
             <div>
                <span className="text-gold text-[10px] tracking-[0.3em] font-bold block mb-6">HERITAGE</span>
                <h3 className="text-4xl font-display mb-4">Akwete <br/>Foundations</h3>
                <p className="text-off-white/50 text-sm leading-relaxed max-w-xs font-light">Each pair is built upon hand-loomed Akwete fabrics from the Igboland heartlands.</p>
             </div>
             <Link to="/shop" className="flex items-center gap-4 text-xs tracking-widest uppercase font-bold text-gold group">
               View Registry <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
             </Link>
          </div>
          <div className="md:col-span-2 bento-card p-10 border-b">
             <span className="text-gold text-[10px] tracking-[0.3em] font-bold block mb-4 italic">02 / INTEGRITY</span>
             <h3 className="text-xl font-display mb-3">Architectural Lasts</h3>
             <p className="text-off-white/40 text-[13px] leading-relaxed max-w-sm font-light">Custom carved wooden lasts that respect the natural geometry of the foot.</p>
          </div>
          <div className="md:col-span-1 bento-card p-10 border-r border-b text-center flex flex-col justify-center">
             <div className="text-4xl font-display mb-2 text-gold italic">100%</div>
             <p className="text-[9px] tracking-[0.4em] uppercase text-off-white/30 font-bold">Traceable Origin</p>
          </div>
          <div className="md:col-span-1 bento-card p-10 bg-gold/[0.03] border-b">
             <h3 className="text-lg font-serif mb-3 italic">Reserve Access</h3>
             <p className="text-[11px] text-off-white/40 mb-6 font-light">Limited Drop No. 04. Sign up for the concierge list below.</p>
             <Link to="/shop" className="text-[9px] font-bold tracking-[0.4em] uppercase text-gold underline underline-offset-8">Join the Drop</Link>
          </div>
        </div>
      </section>

      {/* The Artisan's Journey (GSAP Scrollytelling) */}
      <section ref={journeySectionRef} className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div className="journey-text">
                <span className="text-gold font-bold text-sm tracking-[0.3em] uppercase block mb-4">Phase I</span>
                <h2 className="text-4xl md:text-5xl font-display leading-tight">The Selection of Raw Materials</h2>
                <p className="text-lg text-off-white/60 font-serif mt-4">We select only the finest full-grain leathers and ethically sourced traditional textiles, ensuring comfort that improves with age.</p>
              </div>
              <div className="journey-text">
                <span className="text-gold font-bold text-sm tracking-[0.3em] uppercase block mb-4">Phase II</span>
                <h2 className="text-4xl md:text-5xl font-display leading-tight">Hand-Stitched Precision</h2>
                <p className="text-lg text-off-white/60 font-serif mt-4">Our master artisans spend over 48 hours on a single pair, using traditional wooden lasts to shape the soul of the shoe.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="journey-img rounded-2xl overflow-hidden aspect-[3/4] mt-12 bg-white/5">
                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1374" className="w-full h-full object-cover" alt="Artisan 1" />
              </div>
              <div className="journey-img rounded-2xl overflow-hidden aspect-[3/4] bg-white/5">
                <img src="https://images.unsplash.com/photo-1512374382149-4332c6c02151?auto=format&fit=crop&q=80&w=1470" className="w-full h-full object-cover" alt="Artisan 2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center border-t border-white/5">
         <h2 className="text-4xl md:text-7xl font-display mb-8">Bespoke is Standard.</h2>
         <p className="max-w-xl mx-auto text-off-white/40 mb-12 font-serif text-lg">Join our waiting list for the next exclusive collection or design your own unique pair in the 3D studio.</p>
         <Link to="/shop" className="btn-primary">ENTER THE STUDIO</Link>
      </section>
    </div>
  );
}
