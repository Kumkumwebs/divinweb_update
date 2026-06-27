import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiServices';
import './ChatConsultation.css';

/* ── helpers ── */
const initials = (n) =>
  (n || '').trim().split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
const COLORS = ['#7c3aed', '#059669', '#dc2626', '#d97706', '#2563eb'];
const avColor = (n) => COLORS[((n || '').charCodeAt(0) || 65) % COLORS.length];

const formatTimer = (secs) => {
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const ChatConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  const [astro, setAstro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [elapsedSecs, setElapsedSecs] = useState(504);
  const [remainingBalance] = useState(210);
  const [isTyping, setIsTyping] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, type: 'incoming', text: 'Namaste! 🙏\nHow can I assist you today?', time: '11:20 AM' },
    { id: 2, type: 'outgoing', text: 'Namaste Acharya ji. I wanted to know about my career and growth in the coming years.', time: '11:21 AM' },
    { id: 3, type: 'incoming', text: 'Sure, I will check your details and guide you accurately. Please share your birth details.', time: '11:22 AM' },
    { id: 4, type: 'outgoing', text: '12 July 1995, 10:30 AM\nDelhi, India', time: '11:23 AM' },
    { id: 5, type: 'incoming', text: 'Thank you for sharing. Let me analyze your chart. One moment please... 🔮', time: '11:24 AM' },
  ]);

  const loadAstrologer = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.postBearer(
        'https://admin.diviniq.in/user_api/astrologer_list',
        {
          search: '', page: '1', is_chat: 'on', followAstro: '',
          is_voice_call: 'on', is_video_call: 'on', cat_id: '',
          language_id: '', gender: '', sort_val: 'relevant',
          is_question: '', skill_id: '', country: '', report_id: '', expert_astro: '',
        }
      );
      if (res?.results?.length) {
        const found = res.results.find(
          (a) => String(a.id) === String(id) || String(a._id) === String(id)
        );
        setAstro(found || res.results[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadAstrologer(); }, [loadAstrologer]);

  /* Live timer */
  useEffect(() => {
    const t = setInterval(() => setElapsedSecs((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  /* Auto-scroll chat to bottom */
  useEffect(() => {
    if (chatBodyRef.current)
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    setMessages((prev) => [...prev, { id: Date.now(), type: 'outgoing', text, time: timeStr }]);
    setMessageText('');
    setIsTyping(true);
    setTimeout(() => {
      const rts = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: 'incoming', text: 'Thank you for sharing. I am analyzing your chart and will provide detailed guidance shortly. 🙏', time: rts },
      ]);
      setIsTyping(false);
    }, 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* Derived values */
  const name = astro?.name || 'Acharya Rohit Sharma';
  const cats = astro?.category?.map((c) => c.name) || ['Vedic Astrology', 'Numerology', 'Vastu', 'Kundli Matching'];
  const langs = astro?.language?.map((l) => l.name).join(', ') || 'Hindi, English';
  const price = astro?.per_min_chat || 15;
  const rating = parseFloat(astro?.avg_rate || 4.9);
  const totalReviews = astro?.total_review || '12,456';
  const experience = astro?.experience || '15';
  const totalConsultations = astro?.total_orders || '25,000';
  const profileImg = astro?.profile_img || '';

  /* Loading state */
  if (loading) {
    return (
      <div className="cc-page">
        <div className="cc-main" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#999' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: 28, marginBottom: 10, color: '#7b1a3a' }} />
            <p style={{ fontSize: 13 }}>Loading consultation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-page">

      {/* ══════════ MAIN ══════════ */}
      <div className="cc-main">

        {/* ────── LEFT SIDEBAR ────── */}
        <div className="cc-left">

          {/* Profile Card */}
          <motion.div
            className="cc-profile-card"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
          >
            {/* Back button — top left inside card */}
            <Link to={`/astrologer/${id}`} className="cc-back">
              <i className="fas fa-arrow-left" /> Back
            </Link>

            <div className="cc-avatar-wrap">
              <div className="cc-avatar">
                {profileImg && !imgErr
                  ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} />
                  : <div className="cc-avatar-init" style={{ background: `linear-gradient(135deg,${avColor(name)},${avColor(name)}99)` }}>{initials(name)}</div>
                }
              </div>
              <div className="cc-online-dot" />
            </div>

            <div className="cc-profile-name">
              {name} <i className="fas fa-check-circle cc-verified-check" />
            </div>
            <div className="cc-verified-label">
              <i className="fas fa-check-circle" /> Verified Expert
            </div>

            <div className="cc-rating">
              <i className="fas fa-star cc-rating-star" />
              <span className="cc-rating-score">{rating.toFixed(1)}</span>
              <span className="cc-rating-count">({totalReviews} Reviews)</span>
            </div>

            <div className="cc-tags-slider">
              <div className="cc-tags-track">
                {[...cats, ...cats].map((cat, i) => (
                  <span key={i} className="cc-tag"><i className="fas fa-om" /> {cat}</span>
                ))}
              </div>
            </div>

            <div className="cc-stats">
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-briefcase" /> Experience</span>
                <span className="cc-stat-value">{experience}+ Years</span>
              </div>
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-comments" /> Consultations</span>
                <span className="cc-stat-value">{totalConsultations}+</span>
              </div>
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-language" /> Languages</span>
                <span className="cc-stat-value">{langs}</span>
              </div>
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-clock" /> Response Time</span>
                <span className="cc-stat-value">&lt; 2 min</span>
              </div>
            </div>

            <button className="cc-view-profile-btn" onClick={() => navigate(`/astrologer/${id}`)}>
              View Profile
            </button>
          </motion.div>

          {/* Safety Card */}
          <div className="cc-safety-card">
            <div className="cc-safety-title"><i className="fas fa-shield-alt" /> Safety & Privacy</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> 100% Secure Chats</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> Your privacy is our priority</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> End-to-end encrypted</div>
            <div className="cc-safety-warning">Never share your personal or payment details in chat.</div>
          </div>
        </div>

        {/* ────── CHAT CENTER ────── */}
        <motion.div
          className="cc-chat-center"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}
        >
          {/* Chat Header */}
          <div className="cc-chat-header">
            <div className="cc-chat-header-left">
              <div className="cc-chat-online-badge">
                <span className="cc-chat-online-dot" />
                <span className="cc-chat-online-text">Online</span>
              </div>
              <div className="cc-chat-info">
                <span className="cc-chat-name">{name}</span>
                <span className="cc-chat-reply-time">Typically replies in &lt; 2 min</span>
              </div>
            </div>
            <button className="cc-end-chat-btn" onClick={() => navigate(-1)}>
              <i className="fas fa-phone-slash" /> End Chat
            </button>
          </div>

          {/* Chat Body — ONLY scrollable area */}
          <div className="cc-chat-body" ref={chatBodyRef}>
            <div className="cc-encrypt-notice">
              <i className="fas fa-lock" /> This conversation is end-to-end encrypted. Your privacy is 100% protected.
            </div>
            <div className="cc-date-divider"><span>Today</span></div>

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`cc-message ${msg.type}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {msg.type === 'incoming' && (
                    <div className="cc-msg-avatar">
                      {profileImg && !imgErr
                        ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} />
                        : null
                      }
                    </div>
                  )}
                  <div className="cc-msg-content">
                    <div className="cc-msg-bubble">
                      {msg.text.split('\n').map((line, i, arr) => (
                        <React.Fragment key={i}>
                          {line}{i < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="cc-msg-time">
                      {msg.time}
                      {msg.type === 'outgoing' && <span className="cc-msg-ticks">✓✓</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div className="cc-typing">
                <div className="cc-typing-avatar">
                  {profileImg && !imgErr
                    ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} />
                    : null
                  }
                </div>
                <div className="cc-typing-bubble">
                  <span className="cc-typing-text">Typing...</span>
                  <span className="cc-typing-dot" />
                  <span className="cc-typing-dot" />
                  <span className="cc-typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="cc-chat-input-area">
            <div className="cc-input-row">
              <button className="cc-attach-btn"><i className="fas fa-paperclip" /></button>
              <input
                ref={inputRef}
                className="cc-chat-input"
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="cc-emoji-btn">😊</button>
              <button className="cc-send-btn" onClick={handleSend}>
                <i className="fas fa-paper-plane" />
              </button>
            </div>
            <div className="cc-secure-note">
              <i className="fas fa-lock" /> Messages are secure and encrypted
            </div>
          </div>
        </motion.div>

        {/* ────── RIGHT SIDEBAR ────── */}
        <div className="cc-right">

          {/* Consultation Details */}
          <motion.div className="cc-consult-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
            <div className="cc-consult-title"><i className="fas fa-clipboard-list" /> Consultation Details</div>
            <div className="cc-consult-row">
              <span className="cc-consult-label">Topic</span>
              <span className="cc-consult-value">Career Guidance</span>
            </div>
            <div className="cc-consult-row">
              <span className="cc-consult-label">Consultation Type</span>
              <span className="cc-consult-value">Chat</span>
            </div>
            <hr className="cc-consult-divider" />
            <div className="cc-consult-row">
              <span className="cc-consult-label">Started At</span>
              <span className="cc-consult-value">Today, 11:20 AM</span>
            </div>
            <div className="cc-consult-row">
              <span className="cc-consult-label">Rate</span>
              <span className="cc-consult-value">₹{price} / min</span>
            </div>
            <div className="cc-consult-row">
              <span className="cc-consult-label">Time Elapsed</span>
              <span className="cc-consult-value">
                <i className="far fa-clock cc-timer-icon" /> {formatTimer(elapsedSecs)}
              </span>
            </div>
            <div className="cc-consult-row">
              <span className="cc-consult-label">Remaining Balance</span>
              <span className="cc-consult-value">₹{remainingBalance}</span>
            </div>
            <button className="cc-view-more-btn">
              View More Details <i className="fas fa-chevron-right" style={{ fontSize: 10 }} />
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="cc-qa-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
            <div className="cc-qa-title"><i className="fas fa-bolt" /> Quick Actions</div>
            <div className="cc-qa-grid">
              <div className="cc-qa-btn"><i className="fas fa-file-alt" /><span>Share Horoscope</span></div>
              <div className="cc-qa-btn"><i className="fas fa-cloud-upload-alt" /><span>Upload Document</span></div>
              <div className="cc-qa-btn"><i className="fas fa-image" /><span>Send Photo</span></div>
              <div className="cc-qa-btn cc-qa-end"><i className="fas fa-phone-slash" /><span>End Consultation</span></div>
            </div>
          </motion.div>

          {/* Your Notes */}
          <motion.div className="cc-notes-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}>
            <div className="cc-notes-title"><i className="fas fa-sticky-note" /> Your Notes</div>
            <div className="cc-notes-empty">
              <p>You can add private notes during the consultation.</p>
              <button className="cc-add-note-btn"><i className="fas fa-plus-circle" /> Add Note</button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ChatConsultation;