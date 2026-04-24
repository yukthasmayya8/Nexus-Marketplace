import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
}

export default function ProductDetails({ productId, onBack }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const docSnap = await getDoc(doc(db, 'products', productId));
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  const handleAdd = () => {
    if (!product || product.stock <= 0) {
      toast.error('Product out of stock');
      return;
    }
    addToCart(product.id);
    toast.success('Added to cart!');
  };

  if (loading) return (
     <div className="flex items-center justify-center min-h-[60vh]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
     </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Product not found.</p>
      <button onClick={onBack} className="mt-4 text-indigo-600 font-bold">Return Home</button>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition mb-8 font-semibold group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition" />
        Back to Gallery
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative rounded-[2rem] overflow-hidden bg-gray-100 aspect-square shadow-2xl"
        >
          <img 
            src={product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-6 left-6">
             <span className="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-xs font-black uppercase tracking-widest text-indigo-600 shadow-xl">
               {product.category}
             </span>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col h-full py-4"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight uppercase italic-serif">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl font-black text-indigo-600">{formatCurrency(product.price)}</span>
            <span className={`text-sm font-bold uppercase tracking-widest ${product.stock < 10 ? 'text-orange-500' : 'text-emerald-500'}`}>
              {product.stock > 0 ? `${product.stock} Units Stocked` : 'Unavailable'}
            </span>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {product.description}
          </p>

          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-10 pb-10 border-b border-gray-100">
               <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 italic-serif">Technical Spec</h4>
               <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                 {product.specifications.map((spec, i) => (
                   <li key={i} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                     {spec}
                   </li>
                 ))}
               </ul>
            </div>
          )}

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4 text-gray-700">
              <div className="p-3 bg-gray-100 rounded-xl">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Authenticity Guaranteed</p>
                <p className="text-xs text-gray-500 italic">Verified by Nexus Quality Control</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-sm">Priority Shipping</p>
                <p className="text-xs text-gray-500 italic">2-3 day delivery available</p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-grow bg-indigo-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-indigo-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {product.stock > 0 ? 'Reserve Yours' : 'Join Waitlist'}
            </button>
            <button className="sm:w-16 h-16 border-2 border-gray-200 rounded-2xl flex items-center justify-center hover:border-black transition active:scale-95">
               <RefreshCcw className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
