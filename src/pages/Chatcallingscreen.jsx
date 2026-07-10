import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  callInitiate,
  callInitiateStatus,
  callStatusUpdate,
  buildKundliString,
  generateChannelId,
} from '../services/liveService';

/**
 * ChatCallingScreen
 *
 * Step 2 of the handshake. Receives astrologer + intake details via router
 * state, fires call_initiate, then polls call_initiate_status every 2s until
 * the astrologer accepts — then routes into the chat or call screen.
 *
 * Route: /consultation/calling/:id   (state carries everything below)
 */

const RING_TIMEOUT = 60; // seconds to wait before auto-cancel

const ChatCallingScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const s = location.state || {};
  const callType = s.callType === 'call' ? 'audio' : s.callType || 'chat'; // 'chat' | 'audio'
  const astrologerId = String(s.astrologer_id || id || '');
  const astroName = s.name || s.astroName || 'Astrologer';
  const astrologerImage = s.profile_img || s.astrologerImage || '';
  const rate = String(s.rate || '5');
  const wallet = String(s.wallet || '0');
  const intake = s.intake || {}; // { name, gender, dob, tob, place }

  const [status, setStatus] = useState('connecting'); // connecting | accepted | rejected
  const [countdown, setCountdown] = useState(RING_TIMEOUT);

  // channelIdRef holds the *client-generated* id we send as fb_channel_id.
  // Once callInitiate responds, we swap this ref to the *server-returned*
  // channel_id, since that's the id callInitiateStatus/callStatusUpdate
  // actually require.
  const channelIdRef = useRef(s.channelId || generateChannelId());
  const pollRef = useRef(null);
  const countdownRef = useRef(null);
  const doneRef = useRef(false);
  const navRef = useRef(navigate);
  useEffect(() => { navRef.current = navigate; }, [navigate]);

  const stopAll = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  }, []);

  const cancel = useCallback(async (silent = false) => {
    if (doneRef.current) return;
    doneRef.current = true;
    stopAll();
    try { await callStatusUpdate(channelIdRef.current, 'disconnect_user'); } catch { /* silent */ }
    if (!silent) navRef.current(-1);
  }, [stopAll]);

  // Initiate + poll
  useEffect(() => {
    const fbChannelId = channelIdRef.current; // client-generated, sent as fb_channel_id

    const [yearStr, monthStr, dayStr] = (intake.dob || "").split("-");
    const [hhStr, mmStr] = (intake.tob || "").split(":");

    const kundli = buildKundliString({
      name: intake.name || "",
      gender: intake.gender || "Male",
      yy: yearStr,
      mm: monthStr,
      dd: dayStr,
      hh_time: hhStr,
      mm_time: mmStr,
      latitude: intake.latitude || "0",
      longitude: intake.longitude || "0",
      place: intake.place || intake.birthPlace || "",
    });

    let cancelled = false;

    // Countdown starts immediately regardless of initiate/poll timing
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { cancel(); return 0; }
        return prev - 1;
      });
    }, 1000);

    function startPolling(channelId) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await callInitiateStatus(channelId);
          const st = res?.results?.status ?? res?.status;
          if (st === 'accept_astro') {
            if (doneRef.current) return;
            doneRef.current = true;
            stopAll();
            setStatus('accepted');
            const sessionState = {
              gid: channelId, fbchannelID: channelId, channelId,
              astrologer_id: astrologerId, astroName, astrologerImage, rate, wallet,
              name: intake.name || '', gender: intake.gender || '',
              dob: intake.dob || '', tob: intake.tob || '',
              place: intake.place || intake.birthPlace || '',
            };
            const path = callType === 'audio'
              ? `/consultation/call/${astrologerId}`
              : `/consultation/chat/${astrologerId}`;
            setTimeout(() => navRef.current(path, { replace: true, state: sessionState }), 600);
          } else if (st === 'reject_astro') {
            if (doneRef.current) return;
            doneRef.current = true;
            stopAll();
            setStatus('rejected');
            setTimeout(() => navRef.current(-1), 1600);
          } else if (st === 'end_user' || st === 'disconnect_user') {
            doneRef.current = true;
            stopAll();
            navRef.current('/', { replace: true });
          }
        } catch { /* keep retrying */ }
      }, 400);
    }

    (async () => {
      let serverChannelId = fbChannelId; // fallback in case initiate fails or doesn't return one
      try {
        const res = await callInitiate({
          astrologer_id: astrologerId,
          call_type: callType, // 'chat' | 'audio'
          fb_channel_id: fbChannelId,
          kundli: "1",
        });
        // Server returns its own channel_id — THIS is what callInitiateStatus
        // and callStatusUpdate actually expect, not the fb_channel_id we sent.
        serverChannelId = res?.channel_id || res?.results?.channel_id || fbChannelId;
      } catch {
        // Even if initiate errors, we still poll — backend may have created it.
      }

      if (cancelled) return;
      channelIdRef.current = serverChannelId; // keep in sync for cancel()/status updates
      startPolling(serverChannelId);
    })();

    const onPop = () => { cancel(); };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPop);

    return () => {
      cancelled = true;
      stopAll();
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  const statusLabel =
    status === 'accepted' ? 'Connected!' :
    status === 'rejected' ? 'Astrologer is not available right now' :
    'Connecting you with the astrologer…';

  const statusColor =
    status === 'accepted' ? '#16a34a' :
    status === 'rejected' ? '#dc2626' : '#7b1a3a';

  const initials = (astroName || 'A').trim().split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();

  return (
    <div className="cc-calling-page" style={styles.page}>
      <div style={styles.card}>
        <div style={styles.ringWrap}>
          <span style={{ ...styles.ring, animationDelay: '0s' }} />
          <span style={{ ...styles.ring, animationDelay: '0.6s' }} />
          <div style={styles.avatar}>
            {astrologerImage
              ? <img src={astrologerImage} alt={astroName} style={styles.avatarImg}
                     onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              : <span style={styles.avatarInit}>{initials}</span>}
          </div>
        </div>

        <div style={styles.name}>{astroName}</div>
        <div style={{ ...styles.status, color: statusColor }}>{statusLabel}</div>

        <div style={styles.dots}>
          <span style={{ ...styles.dot, animationDelay: '0s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
          <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
        </div>

        <div style={styles.meta}>
          <span><i className="fas fa-bolt" /> ₹{rate}/min</span>
          <span><i className={`fas ${callType === 'audio' ? 'fa-phone' : 'fa-comment-dots'}`} /> {callType === 'audio' ? 'Audio Call' : 'Chat'}</span>
        </div>

        {status === 'connecting' && (
          <div style={styles.timeout}>Auto-cancel in {countdown}s</div>
        )}

        <button style={styles.cancelBtn} onClick={() => cancel()}>
          <i className="fas fa-times" /> Cancel
        </button>

        <div style={styles.secure}>
          <i className="fas fa-lock" /> Your details are private &amp; secure
        </div>
      </div>

      <style>{keyframes}</style>
    </div>
  );
};

/* ── inline styles (self-contained; matches DivinIq maroon theme) ── */
const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg,#fff5f7,#fdeef2)', padding: 20 },
  card: { background: '#fff', borderRadius: 24, padding: '40px 28px', width: 'min(420px,92vw)', textAlign: 'center', boxShadow: '0 20px 60px rgba(123,26,58,0.18)' },
  ringWrap: { position: 'relative', width: 140, height: 140, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #7b1a3a', opacity: 0.35, animation: 'ccPing 1.8s ease-out infinite' },
  avatar: { width: 108, height: 108, borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg,#7b1a3a,#a83a5b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 34, fontWeight: 700 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInit: { color: '#fff' },
  name: { fontSize: 20, fontWeight: 700, color: '#1f2937' },
  status: { fontSize: 14, fontWeight: 600, marginTop: 6 },
  dots: { display: 'flex', gap: 6, justifyContent: 'center', margin: '16px 0' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#7b1a3a', animation: 'ccBounce 1s infinite' },
  meta: { display: 'flex', gap: 18, justifyContent: 'center', fontSize: 13, color: '#6b7280', marginBottom: 14 },
  timeout: { fontSize: 12, color: '#9ca3af', marginBottom: 16 },
  cancelBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 30, padding: '11px 26px', fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  secure: { marginTop: 18, fontSize: 11, color: '#9ca3af' },
};

const keyframes = `
@keyframes ccPing { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.4); opacity: 0; } }
@keyframes ccBounce { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-6px); opacity: 1; } }
`;

export default ChatCallingScreen;