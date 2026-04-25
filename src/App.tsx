/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import TabBar from './components/layout/TabBar';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-charcoal text-off-white selection:bg-gold/30 selection:text-gold">
        <Navbar />
        
        <main className="pb-24 md:pb-0">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="w-12 h-12 border-t-2 border-l-2 rounded-full border-gold animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>

        <TabBar />
        
        {/* WhatsApp Floating Action Button */}
        <a
          href="https://wa.me/2340000000000?text=I'm%20interested%20in%20a%20bespoke%20AfriSole%20pair."
          target="_blank"
          rel="noreferrer"
          className="fixed z-50 flex items-center justify-center w-14 h-14 transition-transform rounded-full shadow-2xl bottom-28 right-6 bg-green-500 hover:scale-110 md:bottom-10"
        >
          <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.988 0 1.757.455 3.409 1.25 4.852L2 22l5.311-1.392c1.401.764 3.001 1.2 4.701 1.2 5.508 0 9.987-4.479 9.987-9.988S17.52 2 12.012 2zm0 18.286c-1.54 0-2.981-.4-4.22-1.101l-.304-.171-3.136.822.836-3.056-.188-.3c-.768-1.226-1.176-2.651-1.176-4.137 0-4.403 3.585-7.988 7.988-7.988s7.988 3.585 7.988 7.988-3.585 7.988-7.988 7.988z" />
          </svg>
        </a>
      </div>
    </Router>
  );
}
