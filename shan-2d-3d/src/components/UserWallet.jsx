import React from 'react';

const UserWallet = ({ user }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white/80 rounded-3xl shadow-2xl mb-4 p-6 border-2 border-transparent bg-gradient-to-br from-yellow-400/40 via-white/10 to-blue-400/40">
      <div className="text-center">
        <h3 className="text-white text-lg font-bold mb-2">လက်ကျန်ငွေ</h3>
        <div className="text-2xl font-bold text-gold">
          {user?.balance ? `${user.balance.toLocaleString()} MMK` : '0 MMK'}
        </div>
        <p className="text-gray-400 text-sm mt-1">
          {user?.name || 'Player'}
        </p>
      </div>
    </div>
  );
};

export default UserWallet;
