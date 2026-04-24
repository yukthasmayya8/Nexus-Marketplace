import { X, LogIn, Store, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, updateRole, profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(selectedRole);
      toast.success('Successfully signed in!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchRole = async (role: UserRole) => {
    setLoading(true);
    try {
      await updateRole(role);
      toast.success(`Switched role to ${role}`);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {user ? 'Manage Your Role' : 'Get Started'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {!user ? (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">Join Nexus Marketplace to shop or sell high-quality products.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedRole('buyer')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${selectedRole === 'buyer' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <LogIn className={`h-6 w-6 ${selectedRole === 'buyer' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-semibold text-sm">I'm a Buyer</span>
                </button>
                <button 
                  onClick={() => setSelectedRole('seller')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition ${selectedRole === 'seller' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <Store className={`h-6 w-6 ${selectedRole === 'seller' ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-semibold text-sm">I'm a Seller</span>
                </button>
              </div>

              <button 
                onClick={handleSignIn}
                disabled={loading}
                className="w-full bg-indigo-600 text-white h-12 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : (
                  <>
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">Current role: <span className="font-bold text-indigo-600 capitalize">{profile?.role}</span></p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleSwitchRole('buyer')}
                  disabled={loading || profile?.role === 'buyer'}
                  className="w-full h-14 border-2 border-gray-200 rounded-xl flex items-center px-4 hover:border-indigo-600 transition disabled:opacity-50 disabled:hover:border-gray-200"
                >
                  <UserCheck className="h-6 w-6 text-gray-400 mr-3" />
                  <div className="text-left">
                    <p className="font-bold text-sm">Switch to Buyer</p>
                    <p className="text-[10px] text-gray-500">Shop for thousands of products</p>
                  </div>
                </button>
                <button 
                  onClick={() => handleSwitchRole('seller')}
                  disabled={loading || profile?.role === 'seller'}
                  className="w-full h-14 border-2 border-gray-200 rounded-xl flex items-center px-4 hover:border-indigo-600 transition disabled:opacity-50 disabled:hover:border-gray-200"
                >
                  <Store className="h-6 w-6 text-gray-400 mr-3" />
                  <div className="text-left">
                    <p className="font-bold text-sm">Switch to Seller</p>
                    <p className="text-[10px] text-gray-500">List and manage your inventory</p>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          <p className="mt-8 text-[11px] text-gray-400 text-center uppercase tracking-widest font-semibold italic-serif">
            Nexus Marketplace © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
