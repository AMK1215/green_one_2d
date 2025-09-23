import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center">
        <img 
          src="/TemplateData/shan.jpg" 
          alt="GoldenMM Logo" 
          className="w-24 h-24 rounded-full border-4 border-gold mx-auto mb-6 animate-pulse"
        />
        <h1 className="text-white text-3xl font-bold mb-4">GoldenMM</h1>
        <p className="text-gold text-lg mb-6">Premium Slot Game Experience</p>
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
        <p className="text-white text-sm mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
