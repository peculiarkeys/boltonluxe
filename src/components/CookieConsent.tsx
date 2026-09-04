import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConsumerAuth } from '@/consumer/contexts/ConsumerAuthContext';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const { user: adminUser } = useAuth();
  const { user: consumerUser } = useConsumerAuth();

  useEffect(() => {
    if (adminUser || consumerUser) {
      const consented = localStorage.getItem('cookie_consent');
      if (!consented) {
        setShow(true);
      }
    }
  }, [adminUser, consumerUser]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] bg-white border border-gray-200 shadow-2xl p-5 z-[9999] flex flex-col gap-4 font-sans rounded-2xl">
      <div className="text-sm text-gray-600">
        <p className="font-semibold text-gray-900 mb-2">🍪 We value your privacy</p>
        <p className="leading-relaxed">We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
      </div>
      <div className="flex gap-3 justify-end mt-1">
        <button onClick={() => setShow(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
          Decline
        </button>
        <button onClick={() => {
          localStorage.setItem('cookie_consent', 'true');
          setShow(false);
        }} className="px-5 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors shadow-sm">
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
