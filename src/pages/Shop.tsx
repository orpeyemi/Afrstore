import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  isLive: boolean;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), where('isLive', '==', true));
    
    // Real-time Scarcity Engine listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(prods);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-l-2 rounded-full border-gold animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-16">
        <h1 className="text-4xl md:text-6xl font-display mb-4 italic">The Collection</h1>
        <p className="text-off-white/40 font-serif max-w-lg">Each pair is a limited edition drop. Once stock is depleted, the specific textile patterns may never be repeated.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/shop/${product.id}`} className="block relative overflow-hidden rounded-3xl aspect-[4/5] border border-white/10 bg-white/5 mb-6">
                <img 
                  src={product.image || "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1470"} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Scarcity UI Overlay */}
                {product.stock < 5 && (
                  <div className="absolute top-4 left-4 bg-red-500/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1 backdrop-blur-sm">
                    <TrendingUp size={10} /> {product.stock} Pairs Left
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors">
                    <Eye size={20} />
                  </div>
                </div>
              </Link>
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-display font-bold group-hover:text-gold transition-colors">{product.name}</h3>
                  <p className="text-sm text-off-white/40 mt-1 font-serif">{product.description}</p>
                </div>
                <p className="text-lg font-bold text-gold">${product.price}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {products.length === 0 && (
          <div className="col-span-full py-24 text-center bento-card">
            <h3 className="text-2xl font-display mb-2">No active drops found.</h3>
            <p className="text-off-white/40">Our next collection is being curated. Sign up for early access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
