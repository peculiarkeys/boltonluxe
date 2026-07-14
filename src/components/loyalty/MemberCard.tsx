import React, { useState } from 'react';
import { LoyaltyMember } from '@/hooks/loyalty/useLoyaltyMembers';

// ─────────────────────────────────────────────────────────────────────────────
// Card dimensions: CR80 standard credit card — 540×340 px
// ─────────────────────────────────────────────────────────────────────────────

const W = 540;
const H = 340;

// ── Components ───────────────────────────────────────────────────────────────

export interface CardData {
  cardNumber: string;
  holderName: string;
  joinDate: string; // YYYY-MM-DD
  tier: LoyaltyMember['tier'];
}

/** New BWG Mark Logo from user asset */
const BwgMark = ({ variant = "white" }: { variant?: "white" | "gold" }) => (
  <img 
    src="/loyalty/bwg_mark.png" 
    alt="BWG" 
    style={{ 
      height: 40, 
      width: 'auto', 
      objectFit: 'contain',
      filter: variant === "gold" 
        ? 'invert(48%) sepia(61%) saturate(543%) hue-rotate(345deg) brightness(94%) contrast(92%)' 
        : 'none'
    }} 
  />
);

// ── FRONT of card (Dark Rooftop) ──────────────────────────────────────────────

export const CardFront = React.forwardRef<HTMLDivElement, { card: CardData }>(({ card }, ref) => {
  const expiry = (() => {
    const d = new Date(card.joinDate || Date.now());
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear() + 5).slice(2);
    return `${mm}/${yy}`;
  })();

  return (
    <div
      ref={ref}
      id="card-front"
      style={{
        width: W,
        height: H,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Marcellus', serif",
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
        flexShrink: 0,
        backgroundColor: '#111',
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Marcellus&display=swap" rel="stylesheet" />
      
      {/* Background photo */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/loyalty/card_bg_front.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '30px 32px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Top: White Logo + BWG Mark */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <img src="/loyalty/logo_white.png" alt="Bolton Luxe" style={{ height: 50, width: 'auto', objectFit: 'contain' }} />
          <BwgMark variant="white" />
        </div>

        {/* Middle Left: Card Number */}
        <div style={{
          color: 'white',
          fontSize: 28,
          letterSpacing: '3px',
          fontWeight: 400,
          marginTop: 20,
        }}>
          {card.cardNumber}
        </div>

        {/* Bottom: Holder/Expiry + White QR */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 48 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                Holder name
              </div>
              <div style={{ color: 'white', fontSize: 18 }}>
                {card.holderName}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                Expiry date
              </div>
              <div style={{ color: 'white', fontSize: 18 }}>
                {expiry}
              </div>
            </div>
          </div>
          
          {/* White QR Code */}
          <div style={{ width: 75, height: 75 }}>
            <img src="/loyalty/qr_white.png" alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </div>
  );
});
CardFront.displayName = 'CardFront';

// ── BACK of card (Light Cream) ────────────────────────────────────────────────

export const CardBack = React.forwardRef<HTMLDivElement, { card: CardData }>(({ card }, ref) => {
  return (
    <div
      ref={ref}
      id="card-back"
      style={{
        width: W,
        height: H,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Marcellus', serif",
        boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
        flexShrink: 0,
        background: '#FAF8F5',
      }}
    >
      {/* Decorative swoosh lines */}
      <svg style={{ position: 'absolute', right: 0, bottom: 0, zIndex: 0, opacity: 0.1 }} width="320" height="240">
        <path d="M320 240 Q200 100 60 180 Q-20 220 0 140 Q40 40 200 80 Q340 120 320 240Z" fill="#b86a20" />
      </svg>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '30px 32px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* Top: Gold Logo + Card Number */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/loyalty/logo_gold.png" alt="Bolton Luxe" style={{ height: 50, width: 'auto' }} />
          <div style={{ color: '#1a110a', fontSize: 22, letterSpacing: '2px', fontWeight: 400 }}>
            {card.cardNumber}
          </div>
        </div>

        {/* Middle: Description */}
        <div style={{ color: '#3a2e24', fontSize: 13, lineHeight: 1.6, maxWidth: 380, marginTop: 10 }}>
          Luxe Royalty is Bolton White Group's exclusive loyalty
          program, designed to reward our most valued guests with
          exceptional privileges.
        </div>

        {/* Bottom: Benefits + Black QR */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Exclusive discounts on rooms, dining, spa & events',
              'Priority service & special member-only offers',
              'Points that unlock luxury experiences',
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#2a1f16', fontSize: 12 }}>
                <span style={{ color: '#b86a20', fontSize: 16 }}>✓</span>
                {b}
              </div>
            ))}
          </div>

          {/* Black QR Code */}
          <div style={{ width: 75, height: 75 }}>
            <img src="/loyalty/qr_black.png" alt="QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </div>
  );
});
CardBack.displayName = 'CardBack';

// ── Flip Card Viewer ──────────────────────────────────────────────────────────

export const CardFlipViewer = ({ card, frontRef, backRef }: {
  card: CardData;
  frontRef: React.RefObject<HTMLDivElement>;
  backRef: React.RefObject<HTMLDivElement>;
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div
        style={{
          perspective: '1200px',
          width: W,
          height: H,
          cursor: 'pointer',
        }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s cubic-bezier(0.4,0,0.2,1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front face */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <CardFront card={card} ref={frontRef} />
          </div>
          {/* Back face */}
          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <CardBack card={card} ref={backRef} />
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: '#888', margin: 0, fontFamily: 'sans-serif' }}>
        Click to see the {flipped ? 'front' : 'back'} of the card
      </p>
    </div>
  );
};
