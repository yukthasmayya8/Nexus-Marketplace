import { Minus, Plus, Trash2, ArrowRight, CreditCard, Shield } from 'lucide-react';
import { collection, doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product, OrderItem } from '../types';
import { formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal';

interface CartPageProps {
  onCheckoutSuccess: () => void;
}

export default function CartPage({ onCheckoutSuccess }: CartPageProps) {
  const { user, profile } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const uniqueIds = Array.from(new Set(items.map(i => i.productId)));
      const results: Record<string, Product> = {};
      
      for (const id of uniqueIds) {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          results[id] = { id: snap.id, ...snap.data() } as Product;
        }
      }
      setProducts(results);
      setLoading(false);
    };

    if (items.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [items]);

  const subtotal = items.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const processOrder = async () => {
    setIsPaymentModalOpen(false);
    setIsCheckingOut(true);
    const orderId = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    try {
      await runTransaction(db, async (transaction) => {
        const orderItems: OrderItem[] = [];
        
        for (const item of items) {
          const productRef = doc(db, 'products', item.productId);
          const productDoc = await transaction.get(productRef);
          
          if (!productDoc.exists()) {
            throw new Error(`Product ${item.productId} no longer exists`);
          }
          
          const currentStock = productDoc.data().stock;
          if (currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${productDoc.data().name}. Only ${currentStock} left.`);
          }
          
          // Decrement stock
          transaction.update(productRef, {
            stock: currentStock - item.quantity
          });
          
          orderItems.push({
            productId: item.productId,
            name: productDoc.data().name,
            quantity: item.quantity,
            price: productDoc.data().price
          });
        }
        
        // Create order
        const orderRef = doc(collection(db, 'orders'));
        transaction.set(orderRef, {
          id: orderId,
          buyerId: user.uid,
          items: orderItems,
          total: subtotal,
          status: 'completed',
          createdAt: serverTimestamp()
        });
      });

      await clearCart();
      toast.success('Checkout successful! Order ID: ' + orderId, { duration: 6000 });
      onCheckoutSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Checkout failed');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) return (
     <div className="flex items-center justify-center min-h-[40vh]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
     </div>
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-300">
        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="h-10 w-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase italic-serif">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything yet. Explore our gallery to find something special.</p>
        <button 
          onClick={onCheckoutSuccess}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition active:scale-95 shadow-xl shadow-indigo-100"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-black text-gray-900 uppercase italic-serif mb-8 flex items-center gap-4">
          Shopping Bag <span className="text-base font-medium normal-case text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{items.length} items</span>
        </h1>
        
        {items.map(item => {
          const product = products[item.productId];
          if (!product) return null;
          
          return (
            <div key={item.productId} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex gap-6 group hover:border-indigo-600/30 transition shadow-sm hover:shadow-md">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition">{product.name}</h3>
                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider mt-0.5">{product.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-gray-300 hover:text-red-500 transition p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex items-center border border-gray-100 rounded-xl bg-gray-50/50 p-1">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-white rounded-lg transition text-gray-500"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-white rounded-lg transition text-gray-500"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xl font-black text-gray-900">{formatCurrency(product.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl sticky top-24">
          <h2 className="text-xl font-black text-gray-900 mb-8 uppercase italic-serif border-b pb-4">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-500">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span className="font-medium">Shipping</span>
              <span className="font-bold text-gray-700">Calculated at next step</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span className="font-medium">Tax</span>
              <span className="font-bold text-gray-700">{formatCurrency(0)}</span>
            </div>
            <div className="h-px bg-gray-100 my-4"></div>
            <div className="flex justify-between text-xl">
              <span className="font-black text-gray-900">Total</span>
              <span className="font-black text-indigo-600">{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <button 
            disabled={isCheckingOut}
            onClick={handleCheckout}
            className="w-full bg-indigo-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-100"
          >
            {isCheckingOut ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <>
                Purchase Now <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <div className="mt-8 space-y-3">
             <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Secure SSL encrypted payment</span>
             </div>
             <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                <CreditCard className="h-4 w-4 text-indigo-500" />
                <span>Supports Visa, Mastercard, AMEX</span>
             </div>
          </div>
        </div>
      </div>
      
        <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={(addr, method) => processOrder(addr, method)}
        total={subtotal}
      />
    </div>
  );
}
