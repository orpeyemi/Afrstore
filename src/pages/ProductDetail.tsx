import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCustomizerStore } from '../store/useCustomizerStore';
import { useCartStore } from '../store/useCartStore';
import ShoeCanvas from '../components/3d/ShoeCanvas';
import CameraSizeMeasure from '../components/ui/CameraSizeMeasure';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Box, Sparkles, ShoppingBag, X, Camera, RotateCcw } from 'lucide-react';
import gsap from 'gsap';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  
  const { material, setMaterial, accentColor, setAccentColor, initials, setInitials } = useCustomizerStore();
  const { addItem, items, total, removeItem } = useCartStore();
  
  const titleRef = useRef(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({ 
          id: docSnap.id, 
          ...data,
          images: data.images || [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=2012',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=2012',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=2012'
          ]
        });
      } else {
        setProduct({
          id: 'demo-shoe',
          name: 'The Royal Akwete',
          price: 450,
          stock: 3,
          description: 'A bespoke silhouette featuring hand-stitched Akwete patterns and premium Nigerian calfskin.',
          images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=2012',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=2012',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=2012'
          ]
        });
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      if (!selectedSize) alert('Please select a size first.');
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      material,
      accentColor,
      initials,
      size: selectedSize,
      quantity: 1
    });
    setShowCart(true);
  };

  const handleWhatsAppCheckout = () => {
    const phone = "2348123456789"; 
    let message = `*NEW BESPOKE ORDER - AFRISOLE*\n\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (x${item.quantity})\n`;
      message += `   - Size: EU ${item.size}\n`;
      message += `   - Material: ${item.material}\n`;
      message += `   - Accent: ${item.accentColor}\n`;
      message += `   - Initials: ${item.initials || 'None'}\n`;
      message += `   - Price: $${item.price}\n\n`;
    });
    message += `*Total: $${total}*\n\n`;
    message += `Please confirm my artisan order.`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (product) {
      gsap.from(titleRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, [product]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-t-2 border-l-2 rounded-full border-gold animate-spin"></div>
    </div>
  );

  const materials = [
    { id: 'akwete', label: 'Akwete Textile', icon: Sparkles },
    { id: 'ankara', label: 'Wax Ankara', icon: Palette },
    { id: 'leather', label: 'Matte Leather', icon: Box },
  ];

  const accents = ['#D4AF37', '#9CA3AF', '#EB5757', '#27AE60'];
  const sizes = [39, 40, 41, 42, 43, 44, 45, 46];

  return (
    <div className="pt-24 min-h-screen">
      <AnimatePresence>
        {isMeasuring && (
          <CameraSizeMeasure 
            onClose={() => setIsMeasuring(false)} 
            onSizeDetected={(size) => setSelectedSize(size)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-charcoal border-l border-white/10 p-10 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-display italic">Your Archive</h2>
                <button onClick={() => setShowCart(false)} className="hover:text-gold transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {items.map((item, idx) => (
                  <div key={idx} className="p-6 border border-white/5 bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold tracking-tight">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id, item.material, item.accentColor, item.initials, item.size)}
                        className="text-[10px] uppercase tracking-widest text-red-400 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-off-white/40 mb-4">
                      <span>{item.material} / EU {item.size}</span>
                      <span>{item.initials || 'No Tag'}</span>
                    </div>
                    <p className="text-xl font-serif text-gold italic">${item.price} <span className="text-xs text-white/20 not-italic ml-2">x {item.quantity}</span></p>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-off-white/20 italic font-serif text-center px-10">
                    The archive is currently empty. Explore the atelier and select your vision for the future.
                  </div>
                )}
              </div>

              <div className="pt-10 border-t border-white/5">
                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-[10px] uppercase tracking-[0.4em] opacity-40">Total Value</span>
                  <span className="text-3xl font-display text-white italic">${total}</span>
                </div>
                <button 
                  onClick={handleWhatsAppCheckout}
                  disabled={items.length === 0}
                  className="w-full bg-white text-black py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors duration-500 disabled:opacity-20"
                >
                  Checkout via WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-96px)]">
        
        {/* 3D Viewer Column */}
        <div className="lg:col-span-7 relative bg-[#0a0a0a] overflow-hidden">
          <div className="absolute top-10 left-10 z-10 flex flex-col gap-6">
            <button 
              onClick={() => navigate('/shop')}
              className="flex items-center gap-3 text-[9px] font-bold tracking-[0.4em] text-gold/50 hover:text-gold transition-colors uppercase"
            >
              Archive Return
            </button>
            
            {/* Image Carousel Thumbnails */}
            <div className="hidden lg:flex flex-col gap-3 mt-10">
               {product.images?.map((img: string, i: number) => (
                 <button 
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-12 h-12 border ${selectedImageIndex === i ? 'border-gold' : 'border-white/10'} overflow-hidden transition-all hover:border-gold/50`}
                 >
                   <img src={img} className="w-full h-full object-cover" alt={`view-${i}`} />
                 </button>
               ))}
               <button 
                onClick={() => setSelectedImageIndex(-1)} // -1 for 3D view
                className={`w-12 h-12 border ${selectedImageIndex === -1 ? 'border-dashed border-gold' : 'border-white/10'} flex items-center justify-center transition-all hover:border-gold/50 text-[10px] font-bold text-gold/50`}
               >
                 3D
               </button>
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] h-[80%] border border-white/10 rounded-full"></div>
            <div className="absolute w-[60%] h-[60%] border border-white/10 rounded-full"></div>
          </div>

          <div className="absolute inset-0">
             {selectedImageIndex === -1 ? (
               <ShoeCanvas />
             ) : (
               <motion.img 
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.images[selectedImageIndex]} 
                className="w-full h-full object-contain p-20"
                alt="Product View"
               />
             )}
          </div>
          
          <div className="absolute bottom-10 left-10 z-10 flex gap-4">
             <div className="p-6 bento-card border border-white/5 flex items-center gap-6 bg-charcoal/50">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gold/40 font-bold">Limited Availability</p>
                  <p className="text-sm font-serif italic text-white">{product.stock} Pairs Remaining</p>
                </div>
             </div>
             {selectedImageIndex !== -1 && (
               <button 
                onClick={() => setSelectedImageIndex(-1)}
                className="p-6 bento-card border border-gold/30 flex items-center gap-4 bg-gold/5 text-gold hover:bg-gold/10 transition-colors"
               >
                 <RotateCcw size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Back to 3D Design</span>
               </button>
             )}
          </div>
        </div>

        {/* Customization Controls Column */}
        <div className="lg:col-span-5 p-10 md:p-16 border-l border-white/5 bg-charcoal overflow-y-auto max-h-screen">
          <div ref={titleRef} className="mb-16">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-5xl md:text-7xl font-display leading-[0.9] text-white">{product.name}</h1>
              <p className="text-2xl text-gold font-serif italic">${product.price}</p>
            </div>
            <p className="mt-8 text-sm text-off-white/50 font-light leading-relaxed tracking-wide">{product.description}</p>
          </div>

          <div className="space-y-12">
            {/* Material Selector */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold/40 mb-6">Nº 01 — Vamp Selection</p>
              <div className="grid grid-cols-3 gap-0 border border-white/5">
                {materials.map((m) => {
                  const isSelected = material === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMaterial(m.id as any)}
                      className={`p-6 flex flex-col items-center gap-3 border-r border-white/5 last:border-r-0 transition-all ${
                        isSelected ? 'bg-gold/5 text-gold' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border border-white/10 p-0.5 ${isSelected ? 'border-gold' : ''}`}>
                         <div className={`w-full h-full rounded-full ${m.id === 'akwete' ? 'bg-[#2d1a12]' : m.id === 'ankara' ? 'bg-[#1a2d2a]' : 'bg-[#2d2d2d]'}`}></div>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest">{m.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold/40 mb-6">Nº 02 — Hardware Finish</p>
              <div className="flex gap-4">
                {accents.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-10 h-10 rounded-none border border-white/10 transition-all p-1 ${
                      accentColor === color ? 'scale-110 border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'opacity-40 grayscale group-hover:grayscale-0'
                    }`}
                  >
                    <div className="w-full h-full border border-white/10"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
               <div className="flex justify-between items-baseline mb-6">
                 <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold/40">Nº 03 — Architecture Size</p>
                 <button 
                  onClick={() => setIsMeasuring(true)}
                  className="flex items-center gap-2 text-[9px] font-bold text-gold uppercase tracking-widest hover:opacity-80"
                 >
                   <Camera size={12} /> Measure via AI
                 </button>
               </div>
               <div className="grid grid-cols-4 gap-2">
                  {sizes.map((s) => (
                    <button 
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-4 text-xs font-bold tracking-widest border transition-all ${
                        selectedSize === s ? 'border-gold bg-gold/5 text-gold' : 'border-white/5 text-off-white/40 hover:border-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
               </div>
            </div>

            {/* Personalization */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold/40 mb-6">Nº 04 — Identity Initials</p>
              <div className="relative">
                <input 
                  type="text" 
                  maxLength={3}
                  placeholder="---"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value.toUpperCase())}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-none px-6 py-5 focus:outline-none focus:border-gold/50 transition-colors font-serif italic text-2xl tracking-[0.5em] placeholder:text-off-white/10"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] tracking-widest font-bold text-gold/30">
                  {initials.length}/3
                </div>
              </div>
            </div>
            
            <div className="pt-10 flex gap-4">
               <button 
                 onClick={handleAddToCart}
                 className="flex-1 bg-white text-black py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors duration-500 shadow-xl"
               >
                 Authorize Collection
               </button>
               <button 
                 onClick={() => {
                   if (items.length > 0) setShowCart(true);
                   else alert('Your collection is empty.');
                 }}
                 className="w-20 h-20 border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors text-gold"
               >
                 <ShoppingBag size={20} strokeWidth={1.5} />
               </button>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-6 p-8 bento-card bg-gold/[0.02] border-white/5">
             <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?img=${i+14}`} 
                    className="w-10 h-10 rounded-full border-2 border-charcoal" 
                    alt="avatar"
                  />
                 ))}
             </div>
             <div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-gold/80 mb-1">
                  Artisan Network
               </p>
               <p className="text-[11px] text-off-white/40 font-light italic">
                 12 connoisseurs are viewing this blueprint
               </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
