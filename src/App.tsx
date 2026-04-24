/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/Cart';
import SellerDashboard from './pages/SellerDashboard';
import Orders from './pages/Orders';
import AuthModal from './components/AuthModal';

type View = 'home' | 'details' | 'cart' | 'seller' | 'orders';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setView('details');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar 
        onNavigate={setView} 
        currentView={view} 
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {view === 'home' && <Home onProductClick={navigateToProduct} />}
        {view === 'details' && selectedProductId && (
          <ProductDetails 
            productId={selectedProductId} 
            onBack={() => setView('home')} 
          />
        )}
        {view === 'cart' && <CartPage onCheckoutSuccess={() => setView('orders')} />}
        {view === 'orders' && <Orders />}
        {view === 'seller' && (
          user && profile?.role === 'seller' ? (
            <SellerDashboard />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
              <p className="text-gray-600 mb-8">You need a seller account to access this section.</p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Sign In / Switch Role
              </button>
            </div>
          )
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>

  );
}

