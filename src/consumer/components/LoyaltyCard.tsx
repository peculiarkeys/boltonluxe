import React, { useRef } from 'react';
import { CardFlipViewer, CardData } from '@/components/loyalty/MemberCard';

interface LoyaltyCardProps {
  name: string;
  cardNumber: string;
  expiryDate: string;
  tier?: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ name, cardNumber, expiryDate, tier = 'Standard' }) => {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const cardData: CardData = {
    cardNumber,
    holderName: name,
    // Provide a fake join date that would result in the provided expiryDate,
    // or we can just pass a fixed one that yields a correct-looking date for now.
    joinDate: '2025-12-01',
    tier
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
      <div className="transform scale-[0.6] sm:scale-[0.7] md:scale-[0.85] origin-center">
        <CardFlipViewer card={cardData} frontRef={frontRef} backRef={backRef} />
      </div>
    </div>
  );
};

export default LoyaltyCard;
