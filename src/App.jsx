import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PaymentForm from './components/PaymentForm'
import WalletSection from './components/WalletSection'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [balance, setBalance] = useState(1000.00);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'deposit',
      amount: 5000.00,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed',
      source: 'Razorpay',
      category: 'Deposit',
      merchant: 'Self'
    },
    {
      id: 2,
      type: 'payment',
      amount: 1500.00,
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed',
      merchant: 'Amazon',
      category: 'Shopping'
    },
    {
      id: 3,
      type: 'payment',
      amount: 2000.00,
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      status: 'completed',
      merchant: 'Netflix',
      category: 'Entertainment'
    },
    {
      id: 4,
      type: 'payment',
      amount: 1000.00,
      timestamp: new Date(Date.now() - 345600000).toISOString(),
      status: 'completed',
      merchant: 'Spotify',
      category: 'Entertainment'
    },
    {
      id: 5,
      type: 'deposit',
      amount: 3000.00,
      timestamp: new Date(Date.now() - 432000000).toISOString(),
      status: 'completed',
      source: 'Razorpay',
      category: 'Deposit',
      merchant: 'Self'
    }
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handlePaymentSuccess = (amount) => {
    setBalance(prevBalance => prevBalance - amount);
    setTransactions(prev => [
      {
        id: Date.now(),
        type: 'payment',
        amount,
        timestamp: new Date().toISOString(),
        status: 'completed',
        merchant: 'Amazon',
        category: 'Shopping'
      },
      ...prev
    ]);
  };

  const handleAddMoney = (amount) => {
    setBalance(prevBalance => prevBalance + parseFloat(amount));
    setTransactions(prev => [
      {
        id: Date.now(),
        type: 'deposit',
        amount: parseFloat(amount),
        timestamp: new Date().toISOString(),
        status: 'completed',
        source: 'Razorpay',
        category: 'Deposit',
        merchant: 'Self'
      },
      ...prev
    ]);
  };

  const Dashboard = () => (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Send Money
                  </div>
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Request Money
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet Balance History</h2>
              <div className="space-y-4">
                {transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type === 'deposit' ? 'Money Added' : `Payment to ${transaction.merchant}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: ₹{(balance + (transaction.type === 'deposit' ? transaction.amount : -transaction.amount)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <WalletSection balance={balance} onAddMoney={handleAddMoney} />
            <PaymentForm onPaymentSuccess={handlePaymentSuccess} balance={balance} />
          </div>
        </div>
      </div>
    </div>
  );

  const Transactions = () => (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wallet Balance History</h2>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.type === 'deposit' ? 'Money Added' : `Payment to ${transaction.merchant}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Balance: ₹{(balance + (transaction.type === 'deposit' ? transaction.amount : -transaction.amount)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Settings = () => (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive email notifications for transactions</p>
                  </div>
                  <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Use setting</span>
                    <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="sr-only">Use setting</span>
                    <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
              <div className="mt-4 space-y-4">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Change Password
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
