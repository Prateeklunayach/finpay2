import { useState, useEffect } from 'react';
import { createWalletOrder, getWalletBalance, verifyPayment } from '../services/api';

const Wallet = ({ userId }) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchWalletBalance = async (retryCount = 0) => {
    try {
      if (!userId) {
        console.error('No userId provided to Wallet component');
        setError('User ID is required to fetch wallet balance');
        return;
      }

      console.log('Fetching wallet balance for userId:', userId);
      const response = await getWalletBalance(userId);
      
      if (response && typeof response.balance === 'number') {
        // If both stored and calculated balance are 0, set dummy value of 10
        if (response.storedBalance === 0 && response.calculatedBalance === 0) {
          setBalance(10);
          console.log('Setting dummy balance of ₹10 as both balances are 0');
        } else {
          setBalance(response.balance);
        }
        setError(''); // Clear any previous errors
      } else {
        throw new Error('Invalid balance data received from server');
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      
      // If we haven't retried too many times and it's a network error, retry
      if (retryCount < 2 && (err.message.includes('connect to the server') || err.message.includes('Failed to fetch'))) {
        console.log(`Retrying wallet balance fetch (attempt ${retryCount + 1})`);
        setTimeout(() => fetchWalletBalance(retryCount + 1), 2000); // Retry after 2 seconds
        return;
      }

      setError(err.message || 'Failed to fetch wallet balance');
      // Set dummy balance of 10 even in case of error
      setBalance(10);
      console.log('Setting dummy balance of ₹10 due to error condition');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWalletBalance();
    }
  }, [userId]);

  const handlePaymentVerification = async (paymentData) => {
    setVerifying(true);
    try {
      // Log the verification attempt
      console.log('Starting payment verification with data:', {
        ...paymentData,
        userId: paymentData.userId // Explicitly show userId is included
      });

      const response = await verifyPayment(paymentData);
      
      if (response.success) {
        console.log('Payment verification successful:', response);
        await fetchWalletBalance();
        setAmount('');
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Payment verification failed. Please contact support if money was deducted.');
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await createWalletOrder(userId, parseFloat(amount));
      console.log('Order created:', order); // Log the order details
      
      const options = {
        key: 'rzp_live_cUDg7ilqB5gAy9',
        amount: order.amount,
        currency: 'INR',
        name: 'FinPay Wallet',
        description: 'Add money to wallet',
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log('Full Razorpay response:', response);

            // Extract required fields
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature
            } = response;

            // Validate each required field
            if (!razorpay_payment_id) {
              throw new Error('Missing payment ID from Razorpay response');
            }
            if (!razorpay_order_id) {
              throw new Error('Missing order ID from Razorpay response');
            }
            if (!razorpay_signature) {
              throw new Error('Missing signature from Razorpay response');
            }
            if (!userId) {
              throw new Error('Missing user ID');
            }

            // Construct verification payload
            const paymentData = {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              userId,
              amount: order.amount // Include the amount from the order
            };

            // Log the complete verification payload
            console.log('Sending payment verification data:', paymentData);
            
            // Attempt verification
            await handlePaymentVerification(paymentData);
          } catch (error) {
            console.error('Error in Razorpay handler:', error);
            setError(error.message || 'Failed to process payment response');
            setLoading(false);
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#4F46E5'
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay modal dismissed');
            setLoading(false);
          }
        }
      };

      console.log('Opening Razorpay with options:', { 
        ...options, 
        key: '[MASKED]' // Don't log the key
      });

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.message || 'Failed to add money to wallet');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Wallet</h2>
        <div className="mt-4 p-6 bg-indigo-50 rounded-lg">
          <p className="text-sm text-indigo-600 font-medium">Available Balance</p>
          <p className="text-4xl font-bold text-indigo-700">₹{balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">₹</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="block w-full pl-7 pr-12 py-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          onClick={handleAddMoney}
          disabled={loading || verifying}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading || verifying ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {verifying ? 'Verifying Payment...' : 'Processing...'}
            </span>
          ) : (
            'Add Money'
          )}
        </button>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add</h3>
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Secured by Razorpay Payment Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet; 