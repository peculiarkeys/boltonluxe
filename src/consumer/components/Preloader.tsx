import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-[#f7f7f9] flex flex-col items-center justify-center z-[100] animate-fade-in">
      <div className="relative">
        {/* The pulse animation creates a gentle scaling effect */}
        <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <img 
          src="/logo.png" 
          alt="Bolton Luxe Logo" 
          className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 animate-pulse"
        />
      </div>
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default Preloader;
