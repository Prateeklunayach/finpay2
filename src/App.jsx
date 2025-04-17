import { useState } from 'react'
import PaymentForm from './components/PaymentForm'
import WalletSection from './components/WalletSection'
import './App.css'

function App() {
  const [balance, setBalance] = useState(1000.00);
  const [transactions, setTransactions] = useState([]);

  const handlePaymentSuccess = (amount) => {
    setBalance(prevBalance => prevBalance - amount);
    setTransactions(prev => [
      {
        id: Date.now(),
        type: 'payment',
        amount,
        timestamp: new Date().toISOString(),
        status: 'completed'
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
        status: 'completed'
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">FinPay</h1>
          <p className="mt-2 text-lg text-gray-600">Secure payments with fingerprint authentication</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WalletSection balance={balance} onAddMoney={handleAddMoney} />
          <PaymentForm onPaymentSuccess={handlePaymentSuccess} balance={balance} />
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-xl">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                      {transaction.type === 'deposit' ? 'Money Added' : 'Payment to Merchant'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-gray-500 py-4">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
