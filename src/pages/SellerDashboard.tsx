import { Plus, Package, DollarSign, TrendingUp, LayoutGrid, List, Sparkles, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { collection, onSnapshot, query, where, updateDoc, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Product, Order } from '../types';
import { formatCurrency } from '../lib/utils';
import AddProductModal from '../components/AddProductModal';
import SellerProducts from '../components/SellerProducts';
import { toast } from 'react-hot-toast';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  useEffect(() => {
    if (!user) return;

    const qProducts = query(
      collection(db, 'products'),
      where('sellerId', '==', user.uid)
    );

    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setProducts(data);
      setLoading(false);
    });

    const qOrders = query(collection(db, 'orders'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
      const sellerOrders = data.filter(order => 
        order.items.some(item => item.sellerId === user.uid)
      );
      sellerOrders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(sellerOrders);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [user]);

  const totalEarnings = products.reduce((acc, p) => acc + (Number(p.price) * (Number(p.stock) || 0)), 0);
  const totalUnitsSold = orders.reduce((acc, o) => acc + o.items.reduce((sum, i) => i.sellerId === user?.uid ? sum + i.quantity : sum, 0), 0);
  const lowStockProducts = products.filter(p => Number(p.stock) < 5);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Merchant Portal</label>
          <h1 className="text-5xl font-black text-gray-900 uppercase italic-serif leading-none tracking-tight">Enterprise Console</h1>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => setActiveTab('products')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition ${
              activeTab === 'products' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            Fulfillment ({orders.length})
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition flex items-center gap-2 shadow-2xl shadow-gray-200"
          >
            <Plus className="h-4 w-4" /> New Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Asset Value</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(totalEarnings)}</h3>
            <div className="mt-4 flex items-center text-emerald-500 text-xs font-bold gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>Projected liquidation</span>
            </div>
          </div>
          <DollarSign className="absolute right-[-10px] bottom-[-10px] h-24 w-24 text-indigo-50 opacity-0 group-hover:opacity-100 transition duration-500" />
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Distribution</p>
            <h3 className="text-3xl font-black text-gray-900">{totalUnitsSold} <span className="text-sm font-medium text-gray-400">Units</span></h3>
            <div className="mt-4 flex items-center text-indigo-500 text-xs font-bold gap-1">
              <LayoutGrid className="h-3 w-3" />
              <span>Fulfilled globally</span>
            </div>
          </div>
          <Truck className="absolute right-[-10px] bottom-[-10px] h-24 w-24 text-emerald-50 opacity-0 group-hover:opacity-100 transition duration-500" />
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Logistics Health</p>
            <h3 className={`text-3xl font-black ${lowStockProducts.length > 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {lowStockProducts.length} <span className="text-sm font-medium text-gray-400">Alerts</span>
            </h3>
            <div className="mt-4 flex items-center text-gray-500 text-xs font-bold gap-1">
              <List className="h-3 w-3" />
              <span>Inventory warnings</span>
            </div>
          </div>
          <Package className="absolute right-[-10px] bottom-[-10px] h-24 w-24 text-red-50 opacity-0 group-hover:opacity-100 transition duration-500" />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
        {activeTab === 'products' ? (
          <SellerProducts products={products} />
        ) : (
          <div className="p-8 space-y-6">
            <h2 className="text-2xl font-black uppercase italic-serif text-gray-900">Order Management Queue</h2>
            {orders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {order.status === 'delivered' ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                          <p className="text-lg font-black text-gray-900">{order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fulfillment Status</p>
                        <p className={`text-sm font-bold capitalize ${order.status === 'delivered' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.status}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                           <MapPin className="h-3 w-3" /> Shipping Destination
                        </h4>
                        <div className="text-sm font-medium italic-serif text-gray-700">
                          <p className="font-black text-gray-900">{order.shippingAddress?.fullName}</p>
                          <p>{order.shippingAddress?.street}</p>
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                          <p className="text-indigo-600 font-bold mt-2">Tel: {order.shippingAddress?.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Consignment Items</h4>
                        <div className="space-y-2">
                          {order.items.filter(i => i.sellerId === user?.uid).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="font-bold text-gray-700">{item.name}</span>
                              <span className="bg-white px-3 py-1 rounded-lg border border-gray-100 font-black text-indigo-600">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Carrier Tracking</p>
                         <p className="text-sm font-mono font-bold text-gray-500">{order.trackingNumber}</p>
                      </div>
                      {order.status !== 'delivered' && (
                        <button 
                          onClick={async () => {
                             try {
                                const q = query(collection(db, 'orders'), where('id', '==', order.id));
                                const snap = await getDocs(q);
                                if (!snap.empty) {
                                  await updateDoc(doc(db, 'orders', snap.docs[0].id), {
                                    status: 'delivered'
                                  });
                                  toast.success('Inventory Dispatched Successfully');
                                }
                              } catch (e) {
                                toast.error('Fulfillment Error');
                              }
                          }}
                          className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition"
                        >
                          Confirm Dispatch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Queue Is Empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
