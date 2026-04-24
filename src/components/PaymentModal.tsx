import { X, CreditCard, Lock, ShieldCheck, QrCode, Smartphone, Landmark, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: any, method: string) => void;
  total: number;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'qr';

export default function PaymentModal({ isOpen, onClose, onConfirm, total }: PaymentModalProps) {
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    upiId: '',
    selectedBank: ''
  });

  const validateCard = () => {
    return formData.cardNumber.replace(/\s/g, '').length === 16 && 
           /^\d{2}\/\d{2}$/.test(formData.expiry) && 
           formData.cvc.length >= 3;
  };

  const validateUPI = () => {
    return formData.upiId.includes('@') && formData.upiId.length > 5;
  };

  const validateAddress = () => {
    return Object.values(address).every(val => val.length > 0) && /^\d{6}$/.test(address.pincode);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep('payment');
    } else {
      toast.error('Please enter a valid Indian address (6-digit pincode)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Real-world validation checks
    if (method === 'card' && !validateCard()) return toast.error('Invalid Card Details');
    if (method === 'upi' && !validateUPI()) return toast.error('Invalid UPI ID format');
    if (method === 'netbanking' && !formData.selectedBank) return toast.error('Please select a bank');

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirm(address, method);
      }, 1500);
    }, 2500);
  };

  const INDIAN_BANKS = [
    { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
    { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
    { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
    { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
    { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' },
    { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' },
    { id: 'bob', name: 'Bank of Baroda', code: 'BOB' },
    { id: 'yes', name: 'Yes Bank', code: 'YES' }
  ];

  const methods = [
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: Smartphone },
    { id: 'qr', name: 'QR Code', icon: QrCode },
    { id: 'netbanking', name: 'Banking', icon: Landmark },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[850px]"
      >
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-indigo-600 flex flex-col items-center justify-center text-white"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12 }}
              >
                <CheckCircle2 className="h-32 w-32 mb-6" />
              </motion.div>
              <h2 className="text-4xl font-black uppercase italic-serif mb-2">Payment Success</h2>
              <p className="opacity-80 font-medium">Redirecting to your order history...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar - Methods */}
        <div className="bg-gray-50 p-6 md:w-48 border-r border-gray-100 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as PaymentMethod)}
              className={`flex flex-1 md:flex-none flex-col md:flex-row items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
                method === m.id 
                ? 'bg-white shadow-xl shadow-indigo-100 text-indigo-600 border border-indigo-50' 
                : 'text-gray-400 hover:bg-gray-100 border border-transparent'
              }`}
            >
              <m.icon className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{m.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="bg-white p-8 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Lock className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Gateway v2.0</span>
              </div>
              <h2 className="text-3xl font-black italic-serif uppercase text-gray-900 leading-none">Checkout</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="p-8 pt-2 flex-grow overflow-y-auto custom-scrollbar">
            <div className="mb-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Payable</p>
                <p className="text-4xl font-black text-indigo-900 tracking-tight">{formatCurrency(total)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Items</p>
                <p className="font-bold text-indigo-900"> AIS Checkout </p>
              </div>
            </div>

            {step === 'address' ? (
              <form onSubmit={handleNextStep} className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Full Name" className="p-4 bg-gray-50 rounded-xl border border-gray-100" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
                  <input required placeholder="Phone Number" className="p-4 bg-gray-50 rounded-xl border border-gray-100" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                </div>
                <input required placeholder="Street / House No" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                <div className="grid grid-cols-3 gap-4">
                  <input required placeholder="City" className="p-4 bg-gray-50 rounded-xl border border-gray-100" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  <input required placeholder="State" className="p-4 bg-gray-50 rounded-xl border border-gray-100" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                  <input required placeholder="Pincode" maxLength={6} className="p-4 bg-gray-50 rounded-xl border border-gray-100" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition">
                  Proceed to Payment
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setStep('address')} className="text-[10px] font-black uppercase text-indigo-500 hover:underline">← Change Address</button>
                </div>
                <AnimatePresence mode="wait">
                  {method === 'card' && (
                    <motion.div key="card" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      {/* Card Inputs */}
                      <input required placeholder="Cardholder Name" className="w-full p-4 bg-gray-50 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      <input required placeholder="0000 0000 0000 0000" className="w-full p-4 bg-gray-50 rounded-xl font-mono" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19)})} />
                      <div className="grid grid-cols-2 gap-4">
                        <input required placeholder="MM/YY" className="p-4 bg-gray-50 rounded-xl text-center" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                        <input required placeholder="CVV" maxLength={3} className="p-4 bg-gray-50 rounded-xl text-center" value={formData.cvc} onChange={e => setFormData({...formData, cvc: e.target.value})} />
                      </div>
                    </motion.div>
                  )}
                  
                  {method === 'upi' && (
                    <motion.div key="upi" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                      <div className="grid grid-cols-3 gap-3">
                        {['PhonePe', 'GPay', 'Paytm'].map(app => (
                          <button key={app} type="button" onClick={() => setFormData({...formData, upiId: app.toLowerCase() + '@okaxis'})} className="p-4 border rounded-2xl flex flex-col items-center gap-2 hover:bg-indigo-50">
                            <Smartphone className="h-6 w-6 text-indigo-500" />
                            <span className="text-[8px] font-black">{app}</span>
                          </button>
                        ))}
                      </div>
                      <input required placeholder="VPA (e.g. user@upi)" className="w-full p-4 bg-gray-50 rounded-xl font-bold text-indigo-600" value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} />
                    </motion.div>
                  )}

                  {method === 'netbanking' && (
                    <motion.div key="netbanking" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <select required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 font-bold" value={formData.selectedBank} onChange={e => setFormData({...formData, selectedBank: e.target.value})}>
                        <option value="">Select Your Bank</option>
                        {INDIAN_BANKS.map(bank => (
                          <option key={bank.id} value={bank.id}>{bank.name}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition">
                  {loading ? 'Processing Transaction...' : `Pay ${formatCurrency(total)}`}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
