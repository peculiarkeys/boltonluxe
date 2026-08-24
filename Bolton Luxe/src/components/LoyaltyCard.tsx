import React, { useState } from 'react';
import './LoyaltyCard.css';

interface LoyaltyCardProps {
  name: string;
  cardNumber: string;
  expiryDate: string;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ name, cardNumber, expiryDate }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="loyalty-card-wrapper flex flex-col items-center">
      <div 
        className={`card-container ${flipped ? 'flipped' : ''}`} 
        onClick={() => setFlipped(!flipped)}
      >
        <div className="card-inner">
          
          {/* FRONT OF CARD */}
          <div className="card-face card-front">
            <div className="card-front-bg"></div>
            <div className="card-front-overlay"></div>
            <div className="card-front-content text-left">
              <div className="card-header">
                {/* Images not provided locally, use placeholders or empty divs if broken */}
                <div className="h-12 text-white font-bold tracking-widest text-xl opacity-90 font-sans">Bolton Luxe</div>
                <div className="h-10 text-white font-bold opacity-80 font-sans">BWG</div>
              </div>
              
              <div className="card-number">{cardNumber}</div>
              
              <div className="card-footer">
                <div className="card-meta-group text-left">
                  <div>
                    <div className="meta-label">Holder Name</div>
                    <div className="meta-value">{name}</div>
                  </div>
                  <div>
                    <div className="meta-label">Expiry Date</div>
                    <div className="meta-value">{expiryDate}</div>
                  </div>
                </div>
                <div className="qr-container bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center p-2">
                  <div className="w-full h-full border-2 border-white/50 border-dashed rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* BACK OF CARD */}
          <div className="card-face card-back text-left">
            <svg className="card-back-svg" width="320" height="240" viewBox="0 0 320 240">
              <path d="M320 240 Q200 100 60 180 Q-20 220 0 140 Q40 40 200 80 Q340 120 320 240Z" fill="#b86a20" />
            </svg>
            <div className="card-back-content">
              <div className="card-back-logo-row">
                <div className="h-8 text-[#b86a20] font-bold tracking-widest text-lg opacity-90 font-sans">Bolton Luxe</div>
                <div className="card-number-back">{cardNumber}</div>
              </div>
              
              <div className="card-description">
                Luxe Royalty is Bolton White Group's exclusive loyalty program, designed to reward our most valued guests with exceptional privileges.
              </div>
              
              <div className="card-footer">
                <div className="card-benefits-list">
                  <div className="benefit-item">
                    <span className="benefit-check">✓</span>
                    <span>Exclusive discounts on rooms, dining, spa & events</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-check">✓</span>
                    <span>Priority service & special member-only offers</span>
                  </div>
                  <div className="benefit-item">
                    <span className="benefit-check">✓</span>
                    <span>Points that unlock luxury experiences</span>
                  </div>
                </div>
                <div className="qr-container bg-black/5 rounded-lg flex items-center justify-center p-2">
                  <div className="w-full h-full border-2 border-black/20 border-dashed rounded"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="hint text-center">Click the card to flip it</div>
    </div>
  );
};

export default LoyaltyCard;
