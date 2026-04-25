import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ShoppingBag, User, Search } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export default function Navbar() {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(18, 18, 18, 0)', 'rgba(18, 18, 18, 0.9)']
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ['1px solid rgba(255, 255, 255, 0)', '1px solid rgba(255, 255, 255, 0.1)']
  );

  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <motion.nav
      style={{ backgroundColor, borderBottom }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 md:px-12 backdrop-blur-md"
    >
      <div className="flex items-center gap-12">
        <Link to="/" className="text-2xl font-serif tracking-[0.3em] text-gold transition-opacity hover:opacity-80">
          AFRISOLE
        </Link>
        <div className="hidden gap-8 md:flex">
          <Link to="/shop" className="text-[10px] font-bold tracking-[0.25em] uppercase transition-colors text-off-white/50 hover:text-gold">
            COLLECTIONS
          </Link>
          <Link to="/shop" className="text-[10px] font-bold tracking-[0.25em] uppercase transition-colors text-off-white/50 hover:text-gold">
            THE ATELIER
          </Link>
          <Link to="/" className="text-[10px] font-bold tracking-[0.25em] uppercase transition-colors text-off-white/50 hover:text-gold">
            LEGACY
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3 pr-6 border-r border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
          <span className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Atelier Live</span>
        </div>
        <button className="transition-colors hover:text-gold">
          <Search size={18} strokeWidth={1.5} />
        </button>
        <Link to="/dashboard" className="transition-colors hover:text-gold">
          <User size={18} strokeWidth={1.5} />
        </Link>
        <Link to="/shop" className="relative transition-colors hover:text-gold">
          <ShoppingBag size={18} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-charcoal">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </motion.nav>
  );
}
