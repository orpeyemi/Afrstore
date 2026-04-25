import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, User, Heart, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function TabBar() {
  const location = useLocation();
  
  const tabs = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: ShoppingBag, path: '/shop', label: 'Shop' },
    { icon: Heart, path: '/dashboard', label: 'Saved' },
    { icon: User, path: '/dashboard', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 md:hidden">
      <div className="flex items-center justify-around h-16 px-4 bg-[#000] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link key={tab.label} to={tab.path} className="relative flex flex-col items-center">
              <Icon 
                size={22} 
                strokeWidth={isActive ? 2 : 1.5} 
                className={isActive ? 'text-gold' : 'text-off-white/40'} 
              />
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
