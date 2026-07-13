import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Modals.css';

const GIFTS = [
  { id: 'rose', label: 'Rose', price: 51, emoji: '🌹' },
  { id: 'fruits_basket', label: 'Fruits Basket', price: 101, emoji: '🧺' },
  { id: 'diya', label: 'Diya', price: 251, emoji: '🪔' },
  { id: 'puja_samagri', label: 'Puja Samagri', price: 501, emoji: '🙏' },
  { id: 'blessings_shawl', label: 'Blessings Shawl', price: 751, emoji: '🧣' },
  { id: 'premium_gift', label: 'Premium Gift', price: 1100, emoji: '🎁' },
];

export default function BlessingsGiftModal({
  astrologerName = 'Astrologer',
  onMaybeLater,
  onSendGift,
  onClose,
}) {
  const [selected, setSelected] = useState(null);

  const handleSend = () => {
    if (!selected) return;
    onSendGift?.(selected);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--wide">
        {onClose && (
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        )}

        <h2 className="modal-title">Thank Your Astrologer</h2>
        <p className="modal-subtitle">
          Show your gratitude with a Blessings Gift
        </p>

        <div className="gift-grid">
          {GIFTS.map((g) => (
            <button
              key={g.id}
              type="button"
              className="gift-card"
              onClick={() => setSelected(g.id)}
              style={{
                outline: selected === g.id ? '2px solid var(--color-primary, #7a1f36)' : 'none',
                borderRadius: 14,
              }}
            >
              <div className="gift-emoji">{g.emoji}</div>
              <span className="gift-label">{g.label}</span>
              <span className="gift-price">₹{g.price}</span>
            </button>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn--outline" onClick={onMaybeLater}>
            Maybe Later
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSend}
            disabled={!selected}
            style={!selected ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            Send Gift
          </button>
        </div>
      </div>
    </div>
  );
}