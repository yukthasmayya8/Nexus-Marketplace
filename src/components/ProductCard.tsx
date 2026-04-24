import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error('Product out of stock');
      return;
    }
    addToCart(product.id);
    toast.success('Added to cart!');
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleAdd}
            className="p-3 bg-white text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Out of Stock</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4">
           <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-tight">
             {product.category}
           </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
           <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition truncate pr-4">{product.name}</h3>
           <span className="text-lg font-black text-indigo-600">{formatCurrency(product.price)}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div className="flex items-center text-xs font-semibold text-gray-400">
             <span className={product.stock < 5 ? 'text-orange-500' : ''}>
               {product.stock} units left
             </span>
          </div>
          <button 
            className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 text-indigo-600 hover:gap-2.5 transition-all"
            onClick={onClick}
          >
            Details <Eye className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
