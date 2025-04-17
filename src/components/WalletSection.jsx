import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WalletSection = ({ balance, onAddMoney }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      const options = {
        key: 'rzp_test_XXXXXXXXXXXXX', // Replace with your test key
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'FinPay',
        description: 'Add money to wallet',
        handler: function(response) {
          onAddMoney(amount);
          setAmount('');
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#4F46E5'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl shadow-xl text-white"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Wallet Balance</h3>
          <motion.p 
            key={balance}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold mt-2"
          >
            ₹{balance.toFixed(2)}
          </motion.p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white/10 p-3 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </motion.div>
      </div>

      <form onSubmit={handleAddMoney} className="space-y-4">
        <div>
          <label htmlFor="add-money" className="block text-sm font-medium text-white/80">
            Add Money
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white/80 sm:text-sm">₹</span>
            </div>
            <input
              type="number"
              name="add-money"
              id="add-money"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full pl-7 pr-12 py-2 border border-transparent rounded-md bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent sm:text-sm"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-300"
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          Add Money
        </motion.button>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-3 bg-green-500/20 rounded-lg text-green-200 text-sm"
          >
            Money added successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletSection; 