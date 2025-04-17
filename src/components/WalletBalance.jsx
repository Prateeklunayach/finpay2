import React from 'react';

const WalletBalance = ({ balance }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet Balance</h3>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-indigo-600">${balance.toFixed(2)}</span>
        <span className="ml-2 text-sm text-gray-500">USD</span>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-indigo-600 rounded-full" 
            style={{ width: `${Math.min(100, (balance / 1000) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance; 