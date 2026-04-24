import { ShoppingCart, Store, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { cn } from '../lib/utils';

interface NavbarProps {
  onNavigate: (view: 'home' | 'cart' | 'seller' | 'orders') => void;
  currentView: string;
  onOpenAuth: () => void;
}

export default function Navbar({ onNavigate, currentView, onOpenAuth }: NavbarProps) {
  const { user, profile, logout } = useAuth();
  const { totalCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <Store className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Nexus<span className="text-indigo-600">Market</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('home')}
              className={cn(
                "text-sm font-medium transition italic-serif",
                currentView === 'home' ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              )}
            >
              Shop
            </button>
            <button 
              onClick={() => onNavigate('seller')}
              className={cn(
                "text-sm font-medium transition",
                currentView === 'seller' ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              )}
            >
              Sell
            </button>
            <button 
              onClick={() => onNavigate('orders')}
              className={cn(
                "text-sm font-medium transition",
                currentView === 'orders' ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
              )}
            >
              Orders
            </button>
            
            <div className="flex items-center space-x-4 border-l pl-8 ml-4">
              <button 
                onClick={() => onNavigate('cart')}
                className="relative p-2 text-gray-600 hover:text-indigo-600 transition"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
                    {totalCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900">{profile?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-600 hover:text-red-600 transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
             <button 
                onClick={() => onNavigate('cart')}
                className="relative p-2 text-gray-600 mr-2"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
                    {totalCount}
                  </span>
                )}
              </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4 shadow-lg">
          <button 
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-gray-700"
          >
            Shop
          </button>
          <button 
            onClick={() => { onNavigate('seller'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-gray-700"
          >
            Sell
          </button>
          <button 
            onClick={() => { onNavigate('orders'); setIsMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-gray-700"
          >
            Orders
          </button>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {user ? (
              <>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold">{profile?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                  </div>
                </div>
                <button onClick={logout} className="text-red-600 text-sm font-medium flex items-center">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
