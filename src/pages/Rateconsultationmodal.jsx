import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';
import './Modals.css';

const CATEGORIES = ['Career', 'Marriage', 'Health', 'Business', 'Other'];

const TAGS = [
  'Accurate Prediction',
  'Helpful Remedies',
  'Polite Behavior',
  'Good Communication',
  'Detailed Analysis',
  'Fast Response',
];

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent Guidance',
};

export default function RateConsultationModal({ onClose, onSkip, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('Career');
  const [review, setReview] = useState('');
  const [tags, setTags] = useState(['Accurate Prediction']);
  const [anonymous, setAnonymous] = useState(false);

  const activeRating = hoverRating || rating;

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--wide">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <h2 className="modal-title">How was your experience?</h2>
        <p className="modal-subtitle">
          Your feedback helps us and our experts improve.
        </p>

        <div className="star-row">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              className="star-btn"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                fill="currentColor"
                className={i <= activeRating ? 'star star--filled' : 'star'}
              />
            </button>
          ))}
        </div>
        {activeRating > 0 && (
          <p className="rating-label">{RATING_LABELS[activeRating]}</p>
        )}

        <p className="field-label">What was this consultation about?</p>
        <div className="pill-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill ${category === cat ? 'pill--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
              {category === cat && <Check size={14} className="pill-check" />}
            </button>
          ))}
        </div>

        <p className="field-label">Write your review (optional)</p>
        <div className="textarea-wrap">
          <textarea
            className="review-textarea"
            placeholder="Share your experience..."
            maxLength={300}
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <span className="char-count">{review.length}/300</span>
        </div>

        <div className="tag-row">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag ${tags.includes(tag) ? 'tag--active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Submit as anonymous
        </label>

        <div className="modal-actions">
          <button className="btn btn--outline" onClick={onSkip}>
            Skip
          </button>
          <button
            className="btn btn--primary"
            onClick={() => onSubmit?.({ rating, category, review, tags, anonymous })}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}