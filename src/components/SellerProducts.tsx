import { MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

interface SellerProductsProps {
  products: Product[];
}

export default function SellerProducts({ products }: SellerProductsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product removed');
    } catch (error) {
      toast.error('Failed to remove product');
    }
  };

  const handleUpdateStock = async (id: string) => {
    try {
      await updateDoc(doc(db, 'products', id), { stock: editStock });
      setEditingId(null);
      toast.success('Stock updated');
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center p-8">
        <div className="bg-indigo-50 p-6 rounded-full mb-6">
          <MoreVertical className="h-12 w-12 text-indigo-200" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase italic-serif">No catalog items yet</h3>
        <p className="text-gray-500 max-w-sm mb-8">Ready to grow your business? Start by listing your first product on the marketplace.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Product</th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Inventory</th>
            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition group">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{product.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{product.category}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="font-black text-gray-900">{formatCurrency(product.price)}</span>
              </td>
              <td className="px-8 py-6">
                {editingId === product.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm font-bold focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={editStock}
                      onChange={e => setEditStock(parseInt(e.target.value))}
                    />
                    <button 
                      onClick={() => handleUpdateStock(product.id)}
                      className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="text-[10px] font-black uppercase text-gray-400"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                     <span className={`font-black ${product.stock < 10 ? 'text-orange-500' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                    <button 
                      onClick={() => { setEditingId(product.id); setEditStock(product.stock); }}
                      className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-indigo-600"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-8 py-6">
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Preview"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </button>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
