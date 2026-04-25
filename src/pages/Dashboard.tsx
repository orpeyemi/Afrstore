import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth, googleProvider } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { motion } from 'motion/react';
import { Package, Heart, History, User, LogIn, ChevronRight, Settings } from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Fetch orders
        const q = query(collection(db, 'orders'), where('userId', '==', u.uid));
        onSnapshot(q, (snap) => {
          setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-t-2 border-l-2 rounded-full border-gold animate-spin"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div className="w-20 h-20 mb-8 rounded-full bg-white/5 flex items-center justify-center text-gold">
          <User size={40} strokeWidth={1} />
        </div>
        <h1 className="text-4xl font-display mb-4 italic">Bespoke Membership</h1>
        <p className="max-w-md text-off-white/40 font-serif mb-10 text-lg">
          Join the AfriSole inner circle to track your bespoke orders and save your custom designs.
        </p>
        <button onClick={handleLogin} className="btn-primary flex items-center gap-3">
          <LogIn size={20} /> SIGN IN WITH GOOGLE
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        
        {/* Sidebar Profile */}
        <aside className="w-full md:w-80 space-y-8">
           <div className="bento-card p-8 border-gold/20">
              <div className="flex items-center gap-4 mb-8">
                 <img src={user.photoURL} alt="profile" className="w-16 h-16 rounded-full border-2 border-gold" />
                 <div>
                    <h2 className="font-bold text-xl">{user.displayName}</h2>
                    <p className="text-xs text-off-white/40 uppercase tracking-widest">A-List Member</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <button className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3"><History size={18} className="text-gold" /> Order Legacy</span>
                    <ChevronRight size={14} className="text-off-white/20" />
                 </button>
                 <button className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3"><Heart size={18} className="text-gold" /> Saved Designs</span>
                    <ChevronRight size={14} className="text-off-white/20" />
                 </button>
                 <button className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
                    <span className="flex items-center gap-3"><Settings size={18} className="text-gold" /> Settings</span>
                    <ChevronRight size={14} className="text-off-white/20" />
                 </button>
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="w-full mt-8 py-3 rounded-xl border border-white/5 text-xs font-bold tracking-[0.2em] uppercase text-off-white/40 hover:text-red-400 hover:border-red-400/20 transition-all"
              >
                Sign Out
              </button>
           </div>
           
           <div className="bento-card p-8 bg-gold text-charcoal">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-1 opacity-60">Loyalty Status</h3>
              <p className="text-3xl font-display font-medium italic">Gold Tier</p>
              <div className="mt-6 h-1 w-full bg-charcoal/20 rounded-full overflow-hidden">
                 <div className="h-full bg-charcoal w-3/4"></div>
              </div>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest opacity-60">120 points until Obsidian Tier</p>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-12">
           <section>
              <h2 className="text-2xl font-display italic mb-8">Recent Bespoke Orders</h2>
              {orders.length > 0 ? (
                <div className="space-y-4">
                   {orders.map(order => (
                     <div key={order.id} className="bento-card p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                              <Package size={24} className="text-gold" />
                           </div>
                           <div>
                              <p className="text-xs text-off-white/40 uppercase tracking-widest mb-1">Order #{order.id.slice(0,8)}</p>
                              <p className="text-lg font-bold">{order.items?.[0]?.name || 'Luxury Pair'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold uppercase tracking-widest text-gold mb-1">{order.status}</p>
                           <p className="text-sm font-serif italic text-off-white/40">Delivered on April 12</p>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="py-12 bento-card text-center italic text-off-white/20 font-serif">
                   No orders recorded in your legacy yet.
                </div>
              )}
           </section>

           <section>
              <h2 className="text-2xl font-display italic mb-8">Saved Creations</h2>
              <div className="grid grid-cols-2 gap-4">
                 {[1,2].map(i => (
                   <div key={i} className="aspect-square bento-card border border-white/10 bg-white/[0.01] flex items-center justify-center group">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Heart size={20} className="fill-gold text-gold" />
                      </div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-off-white/20">Draft Design 0{i}</p>
                   </div>
                 ))}
              </div>
           </section>
        </main>

      </div>
    </div>
  );
}
