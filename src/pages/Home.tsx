import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface HomeProps {
  onProductClick: (id: string) => void;
}

export default function Home({ onProductClick }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const trendingProducts = products.slice(0, 4);
  const otherProducts = products.slice(4);

  const filteredProducts = activeCategory === 'All' 
    ? otherProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = p.category === activeCategory;
        return matchesSearch && matchesCategory;
      });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-48 w-48 bg-gray-200 rounded-2xl mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-100 rounded"></div>
        </div>
        <p className="text-gray-400 font-medium">Curating your experience...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-indigo-900 text-white p-8 md:p-16">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest">Global Hackathon Release</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] uppercase italic-serif">
            The Future of <span className="text-indigo-300">Market</span>.
          </h1>
          <p className="text-indigo-100/70 text-lg md:text-xl mb-10 max-w-md font-medium leading-relaxed">
            Discover premium products from verified sellers around the globe. Curated by humans, powered by AI.
          </p>
          <div className="relative max-w-lg">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search the entire catalog..."
              className="w-full bg-white text-gray-900 pl-14 pr-6 py-5 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/20 outline-none transition shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Abstract shapes for design flair */}
        <div className="absolute right-[-10%] top-[-10%] opacity-20 bg-indigo-400 h-[120%] w-[50%] blur-3xl rounded-full rotate-12"></div>
        <div className="absolute left-[-5%] bottom-[-20%] opacity-10 bg-white h-[60%] w-[40%] blur-3xl rounded-full -rotate-45"></div>
      </div>

      {/* Featured / Trending Section */}
      {activeCategory === 'All' && !searchTerm && (
        <section>
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Premium Curation</label>
              <h2 className="text-3xl font-black text-gray-900 uppercase italic-serif">Trending Now</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick(product.id)} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Catalog with Filters */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 sticky top-24 z-30 bg-gray-50/80 backdrop-blur-xl py-4 rounded-2xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeCategory === category 
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                  : 'bg-white text-gray-400 hover:bg-gray-100 border border-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <SlidersHorizontal className="h-4 w-4" />
            <span>{filteredProducts.length} items found</span>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick(product.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
             <Package className="h-20 w-20 text-gray-200 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-gray-900 uppercase italic-serif">No products found</h3>
             <p className="text-gray-400 font-medium">Try adjusting your filters or searching for something else.</p>
          </div>
        )}
      </section>
    </div>
  );
}
