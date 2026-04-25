import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit3, Save, X, ToggleLeft, ToggleRight, LayoutDashboard, Package, TrendingUp } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [newProductForm, setNewProductForm] = useState<any>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    isLive: false,
    textures: ['leather']
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, u => setUser(u));
    
    const unsubscribeProds = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProds();
    };
  }, []);

  const handleUpdate = async (id: string, updates: any) => {
    try {
      await updateDoc(doc(db, 'products', id), updates);
      setIsEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), newProductForm);
      setIsAdding(false);
      setNewProductForm({
        name: '',
        price: 0,
        stock: 0,
        description: '',
        image: '',
        isLive: false,
        textures: ['leather']
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Simple Admin check for demo (In real app, use custom claims or a specific 'admins' collection)
  const isAdmin = user?.email === 'musbaulawal4@gmail.com'; 

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-4xl font-display mb-4">Access Restricted</h1>
        <p className="text-off-white/40 font-serif max-w-md">The Artisan Panel is reserved for registered curators and master craftsmen.</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-4xl md:text-6xl font-display italic mb-2">Artisan Control</h1>
          <p className="text-off-white/40 font-serif tracking-wide uppercase text-xs">Curating the AfriSole Legacy</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-secondary py-3 px-6 text-sm flex items-center gap-2"
        >
          {isAdding ? <X size={18} /> : <Plus size={18} />} 
          {isAdding ? 'CANCEL' : 'NEW PROJECT'}
        </button>
      </header>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 bento-card p-10 border-gold/30 bg-gold/[0.02]"
        >
          <h2 className="text-2xl font-display italic mb-8">Nº 00 — New Archive Entry</h2>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold/50 block mb-2">Internal Designation</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. The Monolith Chelsea"
                  value={newProductForm.name}
                  onChange={e => setNewProductForm({...newProductForm, name: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 px-5 py-4 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold/50 block mb-2">Acquisition Price ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({...newProductForm, price: parseFloat(e.target.value)})}
                    className="w-full bg-white/[0.02] border border-white/10 px-5 py-4 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold/50 block mb-2">Stock Allocation</label>
                  <input 
                    type="number" 
                    required
                    value={newProductForm.stock}
                    onChange={e => setNewProductForm({...newProductForm, stock: parseInt(e.target.value)})}
                    className="w-full bg-white/[0.02] border border-white/10 px-5 py-4 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold/50 block mb-2">Visual Asset URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://..."
                  value={newProductForm.image}
                  onChange={e => setNewProductForm({...newProductForm, image: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 px-5 py-4 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold/50 block mb-2">Editorial Narrative</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Describe the architectural soul of this piece..."
                  value={newProductForm.description}
                  onChange={e => setNewProductForm({...newProductForm, description: e.target.value})}
                  className="w-full bg-white/[0.02] border border-white/10 px-5 py-4 focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10 resize-none font-serif italic text-sm"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01]">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-off-white/40 mb-1">Release Status</p>
                  <p className="text-sm font-serif italic">{newProductForm.isLive ? 'Live in Atelier' : 'Stored in Archive'}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setNewProductForm({...newProductForm, isLive: !newProductForm.isLive})}
                  className="transition-colors"
                >
                  {newProductForm.isLive ? <ToggleRight size={32} className="text-gold" /> : <ToggleLeft size={32} className="text-white/20" />}
                </button>
              </div>

              <button type="submit" className="w-full bg-white text-charcoal py-5 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-gold transition-all duration-500 shadow-2xl">
                Authorize Entry
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         <div className="bento-card p-8">
            <LayoutDashboard className="text-gold mb-4" size={24} />
            <p className="text-[10px] uppercase tracking-widest text-off-white/40 mb-1">Active Drops</p>
            <p className="text-3xl font-display">{products.filter(p => p.isLive).length}</p>
         </div>
         <div className="bento-card p-8">
            <Package className="text-gold mb-4" size={24} />
            <p className="text-[10px] uppercase tracking-widest text-off-white/40 mb-1">Total Inventory</p>
            <p className="text-3xl font-display">{products.reduce((acc, p) => acc + (p.stock || 0), 0)}</p>
         </div>
         <div className="bento-card p-8">
            <TrendingUp className="text-gold mb-4" size={24} />
            <p className="text-[10px] uppercase tracking-widest text-off-white/40 mb-1">Pending Orders</p>
            <p className="text-3xl font-display">12</p>
         </div>
      </div>

      <div className="bento-card overflow-hidden border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-off-white/40">Product</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-off-white/40">Stock</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-off-white/40">Price</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-off-white/40">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-off-white/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((product) => {
              const editing = isEditing === product.id;
              
              return (
                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5">
                        <img src={product.image} className="w-full h-full object-cover" alt="prod" />
                      </div>
                      <span className="font-bold tracking-tight">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {editing ? (
                      <input 
                        type="number" 
                        value={editForm.stock} 
                        onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                        className="w-20 bg-white/5 border border-white/10 p-2 rounded" 
                      />
                    ) : (
                      <span className={`font-mono text-sm ${product.stock < 5 ? 'text-red-400 font-bold' : ''}`}>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 font-mono text-sm">${product.price}</td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleUpdate(product.id, { isLive: !product.isLive })}
                      className="transition-colors"
                    >
                      {product.isLive ? (
                        <div className="flex items-center gap-2 text-green-400 text-[10px] font-bold uppercase tracking-tighter">
                          <ToggleRight size={18} /> LIVE
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-off-white/20 text-[10px] font-bold uppercase tracking-tighter">
                          <ToggleLeft size={18} /> DRAFT
                        </div>
                      )}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {editing ? (
                        <>
                          <button onClick={() => handleUpdate(product.id, editForm)} className="text-gold hover:text-white transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setIsEditing(null)} className="text-red-400 hover:text-white transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              setIsEditing(product.id);
                              setEditForm({ ...product });
                            }} 
                            className="text-off-white/40 hover:text-gold transition-colors"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={async () => {
                              if(confirm('Archive this piece permanently?')) {
                                await deleteDoc(doc(db, 'products', product.id));
                              }
                            }}
                            className="text-off-white/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
