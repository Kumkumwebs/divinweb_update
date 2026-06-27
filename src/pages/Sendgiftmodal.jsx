import React from 'react';
import './Modals.css';

const GIFTS = [
  { id: 'rose', emoji: '🌹', label: 'Rose', price: '₹51' },
  { id: 'fruits-basket', emoji: '🧺', label: 'Fruits Basket', price: '₹101' },
  { id: 'diya', emoji: '🪔', label: 'Diya', price: '₹251' },
  { id: 'puja-samagri', emoji: '🍱', label: 'Puja Samagri', price: '₹501' },
  { id: 'blessings-shawl', emoji: '🧣', label: 'Blessings Shawl', price: '₹751' },
  { id: 'premium-gift', emoji: '🎁', label: 'Premium Gift', price: '₹1100' },
];

export default function SendGiftModal({
  astrologerName = 'Astrologer',
  onMaybeLater,
  onSendGift,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--wide modal-card--center">
        <h2 className="modal-title">Thank Your {astrologerName}</h2>
        <p className="modal-subtitle">
          Show your gratitude with a Blessings Gift.
        </p>

        <div className="gift-grid">
          {GIFTS.map((gift) => (
            <button
              key={gift.id}
              type="button"
              className="gift-card"
              onClick={() => onSendGift?.(gift.id)}
            >
              <span className="gift-emoji">{gift.emoji}</span>
              <span className="gift-label">{gift.label}</span>
              <span className="gift-price">{gift.price}</span>
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn--outline" onClick={onMaybeLater}>
            Maybe Later
          </button>
          <button className="btn btn--primary" onClick={() => onSendGift?.('selected')}>
            Send Gift
          </button>
        </div>
      </div>
    </div>
  );
}