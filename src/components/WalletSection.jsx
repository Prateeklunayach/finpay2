import React, { useState, useEffect } from 'react';

const WalletSection = ({ balance, onAddMoney }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      const options = {
        key: 'rzp_test_XXXXXXXXXXXXX', // Replace with your test key
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'FinPay',
        description: 'Add money to wallet',
        handler: function(response) {
          onAddMoney(amount);
          setAmount('');
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl shadow-xl text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium">Wallet Balance</h3>
          <p className="text-3xl font-bold mt-2">₹{balance.toFixed(2)}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
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
            />
          </div>
        </div>

        <button
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
        </button>
      </form>
    </div>
  );
};

export default WalletSection; 