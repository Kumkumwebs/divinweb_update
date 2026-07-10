import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useAudioCall } from '../context/AudioCallContext';
import {
  fetchAgoraToken,
  callInitiateStatus,
  callStatusUpdate,
  addRating,
} from '../services/liveService';
// import { AGORA_APP_ID } from '../config/liveConfig';
import './AudioCall.css';

const initials = (n) => (n || '').trim().split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
const COLORS = ['#7c3aed', '#059669', '#dc2626', '#d97706', '#2563eb'];
const avColor = (n) => COLORS[((n || '').charCodeAt(0) || 65) % COLORS.length];
const fmt = (s) => {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
};

const GIFTS = [
  { name: 'Rose', price: '₹51', icon: 'fas fa-spa', img: '/assets/img/gift/rose.png' },
  { name: 'Fruits Basket', price: '₹101', icon: 'fas fa-apple-alt', img: '/assets/img/gift/fruits.png' },
  { name: 'Diya', price: '₹251', icon: 'fas fa-fire', img: '/assets/img/gift/diya.png' },
  { name: 'Puja Samagri', price: '₹501', icon: 'fas fa-pray', img: '/assets/img/gift/puja.png' },
  { name: 'Blessings Shawl', price: '₹751', icon: 'fas fa-tshirt', img: '/assets/img/gift/shawl.png' },
  { name: 'Premium Gift', price: '₹1100', icon: 'fas fa-gift', img: '/assets/img/gift/gift.png' },
];
const BARS = [
  { lbl: '5 Stars', pct: 82, color: '#f5a623' },
  { lbl: '4 Stars', pct: 13, color: '#f5a623' },
  { lbl: '3 Stars', pct: 3, color: '#f5c842' },
  { lbl: '2 Stars', pct: 1, color: '#ddd' },
  { lbl: '1 Star', pct: 1, color: '#ddd' },
];

const AudioCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = useAudioCall();

  const st = location.state || {};
  const channelId = st.channelId || st.gid || ctx.callInfo?.channelId || '';
  const astrologer_id = String(st.astrologer_id || ctx.callInfo?.astrologerId || id || '');
  const name = st.astroName || ctx.callInfo?.astroName || 'Astrologer';
  const pImg = st.astrologerImage || ctx.callInfo?.astroImage || '';
  const price = st.rate || ctx.callInfo?.rate || 15;
  const wallet = st.wallet || ctx.callInfo?.wallet || '210';

  const [imgErr, setImgErr] = useState(false);
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [spk, setSpk] = useState(true);
  const [callState, setCallState] = useState('connecting'); // connecting | connected | ended
  const [err, setErr] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingReview, setRatingReview] = useState('');

  const clientRef = useRef(null);
  const localTrackRef = useRef(null);
  const remoteTrackRef = useRef(null);
  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const endingRef = useRef(false);
  const navRef = useRef(navigate);
  useEffect(() => { navRef.current = navigate; }, [navigate]);

  /* ── register active call for ActiveCallBar ── */
  useEffect(() => {
    if (!channelId) return;
    ctx.startCall({
      channelId,
      astrologerId: astrologer_id,
      astroName: name,
      astroImage: pImg,
      rate: String(price),
      wallet: String(wallet),
    });
    ctx.maximize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setSecs((p) => { const n = p + 1; ctx.setElapsedSeconds(n); return n; });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── join Agora ── */
  const join = useCallback(async () => {
    if (!channelId) { setErr('Missing channel id.'); return; }
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'audio' && user.audioTrack) {
        remoteTrackRef.current = user.audioTrack;
        user.audioTrack.play();
        setCallState('connected');
        ctx.setCallStatus('connected');
        startTimer();
      }
    });
    client.on('user-unpublished', (user) => { user.audioTrack?.stop(); });
    client.on('user-left', () => { handleEnd('end_user', true); });

    try {
      const token = await fetchAgoraToken(channelId);
      await client.join(AGORA_APP_ID, channelId, token || null, null);
      const mic = await AgoraRTC.createMicrophoneAudioTrack();
      localTrackRef.current = mic;
      await client.publish([mic]);
      ctx.setCallStatus('ringing');
      startTimer(); // start counting once we're in the channel
    } catch (e) {
      let msg = 'Could not connect to the call server.';
      const m = e?.message || '';
      if (m.includes('CAN_NOT_GET_GATEWAY_SERVER')) msg = 'Token rejected — check Agora App ID / Certificate.';
      else if (m.includes('INVALID_TOKEN')) msg = 'Invalid Agora token from backend.';
      else if (m.includes('TOKEN_EXPIRED')) msg = 'Agora token expired.';
      setErr(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, startTimer]);

  const leave = useCallback(async () => {
    try {
      localTrackRef.current?.stop();
      localTrackRef.current?.close();
      localTrackRef.current = null;
      remoteTrackRef.current?.stop();
      remoteTrackRef.current = null;
      await clientRef.current?.leave();
      clientRef.current = null;
    } catch { /* silent */ }
  }, []);

  /* ── status poll (reject / remote end) ── */
  useEffect(() => {
    if (!channelId) return;
    join();
    pollRef.current = setInterval(async () => {
      try {
        const res = await callInitiateStatus(channelId);
        const s = res?.results?.status ?? res?.status;
        if (s === 'end_astro' || s === 'reject_astro' || s === 'disconnect_user') {
          handleEnd('end_user', true);
        }
      } catch { /* keep polling */ }
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  /* ── controls ── */
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    ctx.setIsMuted(next);
    localTrackRef.current?.setEnabled(!next);
  };
  const toggleSpeaker = () => {
    const next = !spk;
    setSpk(next);
    ctx.setIsSpeakerOn(next);
    remoteTrackRef.current?.setVolume(next ? 100 : 0);
  };

  /* ── minimize on back ── */
  const handleMinimize = () => { ctx.minimize(); navRef.current(-1); };

  /* ── end call → rating ── */
  const handleEnd = useCallback(async (status = 'end_user', remote = false) => {
    if (endingRef.current) return;
    endingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    setCallState('ended');
    ctx.setCallStatus('ended');
    try { if (!remote) await callStatusUpdate(channelId, status); } catch { /* silent */ }
    await leave();
    setShowRating(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, leave]);

  const submitRating = async () => {
    try { await addRating(channelId, ratingScore || 5, ratingReview); } catch { /* silent */ }
    ctx.endCall();
    setShowRating(false);
    navRef.current('/', { replace: true });
  };
  const skipRating = () => { ctx.endCall(); setShowRating(false); navRef.current('/', { replace: true }); };

  const cats = ['Vedic Astrology', 'Numerology', 'Vastu', 'Kundli Matching', 'Career Guidance'];
  const lang = 'Hindi, English';
  const rating = 4.9;
  const reviews = '12,456';
  const exp = '15';

  return (
    <div className="ac-page">
      <div className="ac-main">

        {/* ══ LEFT ══ */}
        <div className="ac-left">
          <motion.div className="ac-lcard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <div className="ac-lcard-title"><i className="fas fa-calendar-check" /> Consultation Details</div>
            {[
              { lbl: 'Topic', val: 'Consultation' },
              { lbl: 'Astrologer', val: name, icon: true },
              { lbl: 'Experience', val: `${exp}+ Years` },
              { lbl: 'Language', val: lang },
              { lbl: 'Call Type', val: 'Audio Call' },
              { lbl: 'Rate', val: `₹${price} / min` },
              { lbl: 'Remaining Balance', val: `₹${wallet}` },
            ].map((r) => (
              <div key={r.lbl} className="ac-drow">
                <div className="ac-dlbl">{r.lbl}</div>
                <div className="ac-dval">{r.val}{r.icon && <i className="fas fa-check-circle" />}</div>
              </div>
            ))}
          </motion.div>

          <motion.div className="ac-lcard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.07 }}>
            <div className="ac-rtitle"><i className="fas fa-star" /> Astrologer Rating</div>
            <div className="ac-rscore"><i className="fas fa-star" /><span>{rating} ({reviews} Reviews)</span></div>
            {BARS.map((b) => (
              <div key={b.lbl} className="ac-brow">
                <span className="ac-blbl">{b.lbl}</span>
                <div className="ac-btrack"><div className="ac-bfill" style={{ width: `${b.pct}%`, background: b.color }} /></div>
                <span className="ac-bpct">{b.pct}%</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══ CENTER ══ */}
        <div className="ac-center">
          <motion.div className="ac-callcard" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.26 }}>
            <div className="ac-enc">
              <i className="fas fa-lock" />
              <div>
                <div className="ac-enc-t">End-to-end Encrypted</div>
                <div className="ac-enc-s">Your privacy is 100% protected</div>
              </div>
            </div>
            <button className="ac-infobtn" onClick={handleMinimize}><i className="fas fa-chevron-left" /> Minimize</button>

            <div className="ac-calltop">
              <div className="ac-calllbl">
                {callState === 'connected' ? 'Audio Call' : callState === 'ended' ? 'Call Ended' : 'Connecting…'}
                <div className="ac-wave">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="ac-wb" />)}</div>
              </div>
              <div className="ac-timer">{fmt(secs)}</div>
            </div>

            {err && <div style={{ color: '#dc2626', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>{err}</div>}

            <div className="ac-avwrap">
              <div className="ac-av">
                {pImg && !imgErr
                  ? <img src={pImg} alt={name} onError={() => setImgErr(true)} />
                  : <div className="ac-avinit" style={{ background: `linear-gradient(135deg,${avColor(name)},${avColor(name)}99)` }}>{initials(name)}</div>}
              </div>
              <div className="ac-avbadge"><i className="fas fa-check" /></div>
            </div>

            <div className="ac-namerow">
              <span className="ac-name">{name}</span>
              <span className="ac-pill"><i className="fas fa-check-circle" /> Verified Expert</span>
            </div>
            <div className="ac-ratingrow"><i className="fas fa-star" /><span>{rating} ({reviews} Reviews)</span></div>

            <div className="ac-skills">
              {cats.map((c, i) => <span key={i} className="ac-spill"><i className="fas fa-om" /> {c}</span>)}
            </div>

            <div className="ac-ctrls">
              <button className="ac-cb" onClick={toggleMute}>
                <div className="ac-cico"><i className="fas fa-microphone-slash" style={{ color: muted ? '#d32f2f' : '#333' }} /></div>
                <span className="ac-clbl">{muted ? 'Unmute' : 'Mute'}</span>
              </button>
              <button className="ac-cb" onClick={toggleSpeaker}>
                <div className="ac-cico"><i className={`fas ${spk ? 'fa-volume-up' : 'fa-volume-mute'}`} style={{ color: spk ? '#333' : '#d32f2f' }} /></div>
                <span className="ac-clbl">Speaker</span>
              </button>
              <button className="ac-cb end" onClick={() => handleEnd('end_user')}>
                <div className="ac-cico"><i className="fas fa-phone-slash" /></div>
                <span className="ac-clbl">End Call</span>
              </button>
              <button className="ac-cb" onClick={handleMinimize}>
                <div className="ac-cico"><i className="fas fa-compress" /></div>
                <span className="ac-clbl">Minimize</span>
              </button>
            </div>
          </motion.div>

          <motion.div className="ac-actions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.12 }}>
            {[
              { icon: 'fas fa-share-alt', lbl: 'Share Details', sub: 'Share your birth details or documents' },
              { icon: 'fas fa-sticky-note', lbl: 'Notes', sub: 'Take notes during your consultation' },
              { icon: 'fas fa-record-vinyl', lbl: 'Record Call', sub: 'Record this call for your reference' },
              { icon: 'fas fa-gift', lbl: 'Send Gift', sub: 'Show your gratitude with a gift' },
            ].map((a) => (
              <div key={a.lbl} className="ac-act">
                <div className="ac-aico"><i className={a.icon} /></div>
                <span className="ac-albl">{a.lbl}</span>
                <span className="ac-asub">{a.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="ac-right">
          <motion.div className="ac-sum" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.1 }}>
            <div className="ac-sumtitle"><i className="fas fa-calendar-check" /> Consultation Summary</div>
            {[
              { lbl: 'Call Type', val: 'Audio Call' },
              { lbl: 'Rate', val: `₹${price} / min` },
              { lbl: 'Duration', val: fmt(secs) },
            ].map((r) => (
              <div key={r.lbl} className="ac-srow"><div className="ac-slbl">{r.lbl}</div><div className="ac-sval">{r.val}</div></div>
            ))}
            <div className="ac-srow"><div className="ac-slbl">Remaining Balance</div><div className="ac-sval big">₹{wallet}</div></div>
          </motion.div>

          <motion.div className="ac-gifts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.16 }}>
            <div className="ac-gtitle"><i className="fas fa-gift" /> Send Blessings Gift</div>
            <div className="ac-ggrid">
              {GIFTS.map((g) => (
                <div key={g.name} className="ac-gitem">
                  <div className="ac-gbox">
                    <img src={g.img} alt={g.name}
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = `<i class="${g.icon}"></i>`; }} />
                  </div>
                  <span className="ac-gname">{g.name}</span>
                  <span className="ac-gprice">{g.price}</span>
                </div>
              ))}
            </div>
            <button className="ac-gbtn">View More Gifts</button>
          </motion.div>
        </div>

      </div>

      {/* rating dialog */}
      {showRating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(400px,92vw)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 6px', color: '#1f2937' }}>Rate your call</h3>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 0 }}>How was your call with {name}?</p>
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

export default AudioCall;