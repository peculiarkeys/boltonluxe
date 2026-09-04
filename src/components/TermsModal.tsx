import React from 'react';

const TermsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Terms of Service</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 text-gray-600 space-y-4 text-sm leading-relaxed">
          <p><strong>1. Acceptance of Terms</strong><br/>By accessing or using the Bolton HQ & Luxe Loyalty platforms, you agree to be bound by these Terms of Service.</p>
          <p><strong>2. User Accounts</strong><br/>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <p><strong>3. Privacy Policy</strong><br/>Your use of our services is also governed by our Privacy Policy, which outlines how we collect, use, and protect your data.</p>
          <p><strong>4. Intellectual Property</strong><br/>All content, branding, and intellectual property on this platform are owned by Bolton White Group.</p>
          <p><strong>5. Limitation of Liability</strong><br/>Bolton White Group shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our platform.</p>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
export default TermsModal;
