import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, onValue, push, set, off } from 'firebase/database';
import { db } from '../services/liveFirebase';
import { useChat } from '../context/ChatContext';
import {
  callStatusUpdate,
  addRating,
  uploadChatFile,
  buildKundliString,
} from '../services/liveService';
// import { getUserId } from '../services/Liveconfig';
import { getUserId, getUserName, fbChatPath } from  '../services/Liveconfig'
;
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
const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const ChatConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const chatCtx = useChat();

  /* ── resolve session ── */
  const st = location.state || {};
  const gid = st.gid || chatCtx.chatInfo?.gid || '';
  const astrologer_id = String(st.astrologer_id || chatCtx.chatInfo?.astrologer_id || id || '');
  const name = st.astroName || chatCtx.chatInfo?.astroName || 'Astrologer';
  const profileImg = st.astrologerImage || chatCtx.chatInfo?.astrologerImage || '';
  const rate = parseFloat(st.rate || chatCtx.chatInfo?.rate || 5);
  const wallet = parseFloat(st.wallet || chatCtx.chatInfo?.wallet || 0);
  const intake = {
    name: st.name || '',
    gender: st.gender || '',
    dob: st.dob || '',
    tob: st.tob || '',
    place: st.place || st.birthPlace || '',
  };

  const userId = getUserId();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [imgErr, setImgErr] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [sending, setSending] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingReview, setRatingReview] = useState('');

  const kundliSentRef = useRef(false);
  const endingRef = useRef(false);

  /* ── start session timer (also drives ActiveChatBar) ── */
  useEffect(() => {
    if (!gid || !astrologer_id) return;
    const initialSeconds = rate > 0 && wallet > 0 ? Math.floor((wallet / rate) * 60) : 300;
    chatCtx.startChatTimer(
      {
        gid,
        fbchannelID: gid,
        astrologer_id,
        astroName: name,
        astrologerImage: profileImg,
        rate: String(rate),
        wallet: String(wallet),
        name: intake.name,
        gender: intake.gender,
        dob: intake.dob,
        tob: intake.tob,
        place: intake.place,
      },
      initialSeconds
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, astrologer_id]);

  /* ── local elapsed counter ── */
  useEffect(() => {
    const t = setInterval(() => setElapsedSecs((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Firebase listener ── */
  useEffect(() => {
    if (!gid || !userId || !astrologer_id) return;
    const path = fbChatPath(gid, userId, astrologer_id);
    const dbRef = ref(db, path);
    onValue(dbRef, (snap) => {
      const data = snap.val();
      if (!data) { setMessages([]); return; }
      const list = Object.entries(data).map(([key, val]) => ({ key, ...val }));
      list.sort((a, b) => (a.date_time || 0) - (b.date_time || 0));
      setMessages(list);
    });
    return () => off(dbRef);
  }, [gid, userId, astrologer_id]);

  /* ── auto-scroll ── */
  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages]);

  /* ── send message (writes both sides) ── */
  const sendFirebaseMessage = useCallback(
    async (content, type = 'text') => {
      if (!gid || !userId || !astrologer_id || !content) return;
      const timestamp = Date.now();
      const senderPath = fbChatPath(gid, userId, astrologer_id);
      const receiverPath = fbChatPath(gid, astrologer_id, userId);
      const msgId = push(ref(db, senderPath)).key;
      if (!msgId) return;
      const body = {
        name: getUserName(),
        to: astrologer_id,
        from: userId,
        message: content,
        type,
        message_id: msgId,
        date_time: timestamp,
        seen: false,
      };
      try {
        await set(ref(db, `${senderPath}/${msgId}`), body);
        await set(ref(db, `${receiverPath}/${msgId}`), body);
      } catch { /* silent */ }
    },
    [gid, userId, astrologer_id]
  );

  /* ── kundli auto-message (once) ── */
  useEffect(() => {
    if (kundliSentRef.current) return;
    if (!gid || !userId || !astrologer_id) return;
    if (!intake.gender || !intake.dob) return;
    kundliSentRef.current = true;
    sendFirebaseMessage(buildKundliString(intake), 'text');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, userId, astrologer_id]);

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;
    sendFirebaseMessage(text, 'text');
    setMessageText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleAttach = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    const url = await uploadChatFile(file, { isAudio: false });
    setSending(false);
    if (url) sendFirebaseMessage(url, 'image');
    e.target.value = '';
  };

  /* ── minimize on back — chat stays active, ActiveChatBar shows ── */
  const handleMinimize = () => navigate(-1);

  /* ── end chat → rating ── */
  const handleEndChat = async () => {
    if (endingRef.current) { setShowRating(true); return; }
    endingRef.current = true;
    try { await callStatusUpdate(gid, 'end_user'); } catch { /* silent */ }
    setShowRating(true);
  };

  const submitRating = async () => {
    try { await addRating(gid, ratingScore || 5, ratingReview); } catch { /* silent */ }
    chatCtx.stopChatTimer();
    setShowRating(false);
    navigate('/', { replace: true });
  };

  const skipRating = () => {
    chatCtx.stopChatTimer();
    setShowRating(false);
    navigate('/', { replace: true });
  };

  const remainingBalance = Math.max(0, Math.round(wallet - (elapsedSecs / 60) * rate));

  const renderBubble = (msg) => {
    if (msg.type === 'image') {
      return (
        <img
          src={msg.message}
          alt="attachment"
          style={{ maxWidth: 200, borderRadius: 12, cursor: 'pointer' }}
          onClick={() => setPreviewImage(msg.message)}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      );
    }
    if (msg.type === 'audio') {
      return <audio src={msg.message} controls style={{ maxWidth: 220 }} />;
    }
    return (msg.message || '').split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}{i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="cc-page">
      <div className="cc-main">

        {/* ────── LEFT SIDEBAR ────── */}
        <div className="cc-left">
          <motion.div className="cc-profile-card"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Link to={`/astrologer/${astrologer_id}`} className="cc-back">
              <i className="fas fa-arrow-left" /> Back
            </Link>

            <div className="cc-avatar-wrap">
              <div className="cc-avatar">
                {profileImg && !imgErr
                  ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} />
                  : <div className="cc-avatar-init" style={{ background: `linear-gradient(135deg,${avColor(name)},${avColor(name)}99)` }}>{initials(name)}</div>}
              </div>
              <div className="cc-online-dot" />
            </div>

            <div className="cc-profile-name">
              {name} <i className="fas fa-check-circle cc-verified-check" />
            </div>
            <div className="cc-verified-label">
              <i className="fas fa-check-circle" /> Verified Expert
            </div>

            <div className="cc-stats">
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-clock" /> Rate</span>
                <span className="cc-stat-value">₹{rate}/min</span>
              </div>
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-hourglass-half" /> Time Left</span>
                <span className="cc-stat-value">{formatTimer(chatCtx.chatTimeLeft || 0)}</span>
              </div>
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-wallet" /> Balance</span>
                <span className="cc-stat-value">₹{remainingBalance}</span>
              </div>
            </div>

            <button className="cc-view-profile-btn" onClick={() => navigate(`/astrologer/${astrologer_id}`)}>
              View Profile
            </button>
          </motion.div>

          <div className="cc-safety-card">
            <div className="cc-safety-title"><i className="fas fa-shield-alt" /> Safety & Privacy</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> 100% Secure Chats</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> Your privacy is our priority</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> End-to-end encrypted</div>
            <div className="cc-safety-warning">Never share your personal or payment details in chat.</div>
          </div>
        </div>

        {/* ────── CHAT CENTER ────── */}
        <motion.div className="cc-chat-center"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <div className="cc-chat-header">
            <div className="cc-chat-header-left">
              <button className="cc-back" onClick={handleMinimize} title="Minimize — chat stays active"
                style={{ position: 'static', marginRight: 6 }}>
                <i className="fas fa-chevron-left" />
              </button>
              <div className="cc-chat-online-badge">
                <span className="cc-chat-online-dot" />
                <span className="cc-chat-online-text">Online</span>
              </div>
              <div className="cc-chat-info">
                <span className="cc-chat-name">{name}</span>
                <span className="cc-chat-reply-time">₹{rate}/min · {formatTimer(chatCtx.chatTimeLeft || 0)} left</span>
              </div>
            </div>
            <button className="cc-end-chat-btn" onClick={handleEndChat}>
              <i className="fas fa-phone-slash" /> End Chat
            </button>
          </div>

          <div className="cc-chat-body" ref={chatBodyRef}>
            <div className="cc-encrypt-notice">
              <i className="fas fa-lock" /> This conversation is end-to-end encrypted. Your privacy is 100% protected.
            </div>
            <div className="cc-date-divider"><span>Today</span></div>

            <AnimatePresence>
              {messages.map((msg) => {
                const outgoing = String(msg.from) === String(userId);
                return (
                  <motion.div key={msg.key || msg.message_id}
                    className={`cc-message ${outgoing ? 'outgoing' : 'incoming'}`}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                    {!outgoing && (
                      <div className="cc-msg-avatar">
                        {profileImg && !imgErr ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} /> : null}
                      </div>
                    )}
                    <div className="cc-msg-content">
                      <div className="cc-msg-bubble">{renderBubble(msg)}</div>
                      <div className="cc-msg-time">
                        {fmtTime(msg.date_time || Date.now())}
                        {outgoing && <span className="cc-msg-ticks">{msg.seen ? '✓✓' : '✓'}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 30 }}>
                Say Namaste 🙏 to begin your consultation.
              </div>
            )}
          </div>

          <div className="cc-chat-input-area">
            <div className="cc-input-row">
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAttach} />
              <button className="cc-attach-btn" onClick={() => fileRef.current?.click()} disabled={sending}>
                <i className={`fas ${sending ? 'fa-spinner fa-spin' : 'fa-paperclip'}`} />
              </button>
              <input ref={inputRef} className="cc-chat-input" type="text"
                placeholder="Type your message..." value={messageText}
                onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="cc-emoji-btn">😊</button>
              <button className="cc-send-btn" onClick={handleSend}><i className="fas fa-paper-plane" /></button>
            </div>
            <div className="cc-secure-note">
              <i className="fas fa-lock" /> Messages are secure and encrypted
            </div>
          </div>
        </motion.div>

        {/* ────── RIGHT SIDEBAR ────── */}
        <div className="cc-right">
          <motion.div className="cc-consult-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
            <div className="cc-consult-title"><i className="fas fa-clipboard-list" /> Consultation Details</div>
            <div className="cc-consult-row"><span className="cc-consult-label">Consultation Type</span><span className="cc-consult-value">Chat</span></div>
            <hr className="cc-consult-divider" />
            <div className="cc-consult-row"><span className="cc-consult-label">Rate</span><span className="cc-consult-value">₹{rate} / min</span></div>
            <div className="cc-consult-row">
              <span className="cc-consult-label">Time Elapsed</span>
              <span className="cc-consult-value"><i className="far fa-clock cc-timer-icon" /> {formatTimer(elapsedSecs)}</span>
            </div>
            <div className="cc-consult-row"><span className="cc-consult-label">Remaining Balance</span><span className="cc-consult-value">₹{remainingBalance}</span></div>
          </motion.div>

          <motion.div className="cc-qa-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
            <div className="cc-qa-title"><i className="fas fa-bolt" /> Quick Actions</div>
            <div className="cc-qa-grid">
              <div className="cc-qa-btn" onClick={() => fileRef.current?.click()}><i className="fas fa-image" /><span>Send Photo</span></div>
              <div className="cc-qa-btn" onClick={() => sendFirebaseMessage(buildKundliString(intake), 'text')}><i className="fas fa-file-alt" /><span>Share Details</span></div>
              <div className="cc-qa-btn cc-qa-end" onClick={handleEndChat}><i className="fas fa-phone-slash" /><span>End Consultation</span></div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* image preview */}
      {previewImage && (
        <div onClick={() => setPreviewImage(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <img src={previewImage} alt="preview" style={{ maxWidth: '92%', maxHeight: '92%', borderRadius: 12 }} />
        </div>
      )}

      {/* rating dialog */}
      {showRating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(400px,92vw)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 6px', color: '#1f2937' }}>Rate your consultation</h3>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 0 }}>How was your session with {name}?</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '14px 0', fontSize: 30 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ cursor: 'pointer', color: i <= ratingScore ? '#f5a623' : '#d1d5db' }} onClick={() => setRatingScore(i)}>★</span>
              ))}
            </div>
            <textarea value={ratingReview} onChange={(e) => setRatingReview(e.target.value)}
              placeholder="Write a short review (optional)" rows={3}
              style={{ width: '100%', borderRadius: 12, border: '1px solid #e5e7eb', padding: 10, resize: 'none', fontSize: 13 }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={skipRating} style={{ flex: 1, padding: 12, borderRadius: 30, border: '1px solid #e5e7eb', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Skip</button>
              <button onClick={submitRating} style={{ flex: 1, padding: 12, borderRadius: 30, border: 'none', background: '#7b1a3a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatConsultation;