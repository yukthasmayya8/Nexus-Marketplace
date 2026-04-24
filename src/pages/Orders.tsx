import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { formatCurrency } from '../lib/utils';
import { Package, Truck, CheckCircle2, Clock, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('buyerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      // Sort by creation date in memory as we don't have composite index yet
      data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'delivered': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-amber-50 border-amber-100';
      case 'shipped': return 'bg-indigo-50 border-indigo-100';
      case 'delivered': return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-sm font-black uppercase tracking-widest text-gray-400">Retrieving Order Ledger</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Track Your Goods</label>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic-serif leading-none">Order History</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Order ID or Tracking #"
            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6 px-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500"
            >
              {/* Order Status Header/Left */}
              <div className={`p-8 md:w-64 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 transition-colors ${getStatusColor(order.status)}`}>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(order.status)}
                    <span className="text-xs font-black uppercase tracking-widest text-gray-900">{order.status}</span>
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">OrderID: {order.id.slice(0, 10)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-gray-900 leading-none">{formatCurrency(order.total)}</p>
                </div>
              </div>

              {/* Order Details Right */}
              <div className="flex-grow p-8 flex flex-col justify-between gap-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Shipment Content</h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-baseline gap-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-black text-gray-500">x{item.quantity}</span>
                          <span className="text-sm font-bold text-gray-700">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Delivery Address
                    </h3>
                    <div className="text-sm text-gray-600 font-medium italic-serif">
                      <p className="font-black text-gray-900">{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.street}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-6 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Tracking Number</span>
                    <span className="text-sm font-mono font-black text-indigo-600 tracking-tighter">{order.trackingNumber || 'Awaiting Pickup'}</span>
                  </div>
                  <button className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition transform active:scale-95 shadow-lg shadow-gray-200">
                    Live Tracking API
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <Package className="h-20 w-20 text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-gray-900 uppercase italic-serif">Mystery Packages Only</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto">It seems you haven't secured any deals yet. Head back to the marketplace to start your collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
