import { X, Upload, IndianRupee, Package, Tag, FileText, Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { generateProductDetails } from '../services/geminiService';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Art', 'Sports', 'Wellness'];

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: CATEGORIES[0],
    imageUrl: '',
    specifications: [] as string[]
  });

  if (!isOpen) return null;

  const handleAiAutofill = async () => {
    if (!aiQuery.trim()) {
      toast.error('Please enter a product name or category');
      return;
    }
    setIsAiLoading(true);
    try {
      const data = await generateProductDetails(aiQuery);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price ? data.price.toString() : '',
        stock: '10', // Default stock
        category: CATEGORIES.includes(data.category) ? data.category : CATEGORIES[0],
        imageUrl: formData.imageUrl, // Keep existing image or placeholder
        specifications: data.specifications || []
      });
      toast.success('AI successfully found product details!');
    } catch (error) {
      console.error(error);
      toast.error('AI couldn\'t find specific details for that item');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sellerId: user.uid,
        createdAt: serverTimestamp()
      });
      toast.success('Product listed successfully!');
      onClose();
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: CATEGORIES[0],
        imageUrl: '',
        specifications: []
      });
      setAiQuery('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 uppercase italic-serif tracking-tight">List New Item</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Package className="h-3 w-3" /> Product Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Vintage Leather Jacket"
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Tag className="h-3 w-3" /> Category
                </label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <IndianRupee className="h-3 w-3" /> Price (INR)
                </label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Package className="h-3 w-3" /> Initial Stock
                </label>
                <input
                  required
                  type="number"
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <FileText className="h-3 w-3" /> Description
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share the story of this product..."
                className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Upload className="h-3 w-3" /> Image URL
              </label>
              <input
                required
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            {formData.specifications.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Specifications Found</label>
                <div className="flex flex-wrap gap-2">
                  {formData.specifications.map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
               <button 
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-600 h-14 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                disabled={loading}
                className="flex-[2] bg-indigo-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition disabled:opacity-50 shadow-xl shadow-indigo-100"
              >
                {loading ? 'Creating Listing...' : 'Launch Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
