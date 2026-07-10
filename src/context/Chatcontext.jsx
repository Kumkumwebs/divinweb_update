/**
 * ChatContext.jsx
 *
 * Keeps the active chat session alive across navigation (so ActiveChatBar
 * floats), and runs the billing countdown synced to Firebase CallSession —
 * a faithful JS port of astroguruji's ChatContext.
 *
 * Countdown logic:
 *   - Local 1s tick counts down chatTimeLeft.
 *   - Firebase CallSession/{channelId} corrects drift on every server debit
 *     tick (seconds_remaining / max_minutes + last_tick_at).
 *   - status end_astro | end_user | wallet_empty | rejected → stop everything.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../services/liveFirebase';
// import { fbSessionPath } from './Liveconfig';
import { fbSessionPath } from '../services/Liveconfig';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatActive, setChatActive] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const [chatTimeLeft, setChatTimeLeft] = useState(0);

  const chatInfoRef = useRef(null);
  const timerRef = useRef(null);
  const activeGidRef = useRef(null);
  const firebaseSubRef = useRef(null);

  useEffect(() => {
    chatInfoRef.current = chatInfo;
  }, [chatInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (firebaseSubRef.current) firebaseSubRef.current();
    };
  }, []);

  // Local countdown
  useEffect(() => {
    if (!chatActive) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setChatTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          activeGidRef.current = null;
          chatInfoRef.current = null;
          if (firebaseSubRef.current) {
            firebaseSubRef.current();
            firebaseSubRef.current = null;
          }
          setChatActive(false);
          setChatInfo(null);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [chatActive]);

  // Subscribe to Firebase CallSession for server-authoritative time
  const subscribeFirebase = useCallback((channelId) => {
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }

    const sessionRef = ref(db, fbSessionPath(channelId));

    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const status = String(data.status ?? '');
      const maxMinutes = data.max_minutes;
      const lastTick = data.last_tick_at;
      const startedAt = data.started_at;
      const secondsRemaining = data.seconds_remaining;

      // Server ended the session
      if (['end_astro', 'end_user', 'wallet_empty', 'rejected'].includes(status)) {
        setTimeout(() => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          if (firebaseSubRef.current) {
            firebaseSubRef.current();
            firebaseSubRef.current = null;
          }
          activeGidRef.current = null;
          chatInfoRef.current = null;
          setChatTimeLeft(0);
          setChatActive(false);
          setChatInfo(null);
        }, 2000); // grace so UI can show rating dialog
        return;
      }

      // Correct drift from seconds_remaining + last_tick_at
      if (secondsRemaining != null && lastTick != null) {
        const elapsed = Math.floor((Date.now() - Number(lastTick)) / 1000);
        const accurate = Math.max(Number(secondsRemaining) - elapsed, 0);
        setChatTimeLeft((prev) => (Math.abs(prev - accurate) > 5 ? accurate : prev));
      }

      // Correct drift from max_minutes + last_tick_at
      if (maxMinutes != null) {
        let serverSeconds = Math.max(Math.floor(Number(maxMinutes) * 60), 0);
        if (lastTick) {
          const elapsed = Math.floor((Date.now() - Number(lastTick)) / 1000);
          serverSeconds = Math.max(serverSeconds - elapsed, 0);
        }
        setChatTimeLeft((prev) => (Math.abs(prev - serverSeconds) > 30 ? serverSeconds : prev));
      }

      // Fallback before first debit: derive from wallet/rate + started_at
      if (maxMinutes == null && startedAt) {
        const info = chatInfoRef.current;
        if (info) {
          const rate = parseFloat(info.rate || '1');
          const wallet = parseFloat(info.wallet || '0');
          if (rate > 0 && wallet > 0) {
            const maxSeconds = Math.floor((wallet / rate) * 60);
            const elapsed = Math.floor((Date.now() - Number(startedAt)) / 1000);
            const remaining = Math.max(maxSeconds - elapsed, 0);
            setChatTimeLeft((prev) => (Math.abs(prev - remaining) > 30 ? remaining : prev));
          }
        }
      }
    });

    firebaseSubRef.current = () => off(sessionRef, 'value');
  }, []);

  const startChatTimer = useCallback(
    (info, initialSeconds) => {
      // Same session already running — just update info + time
      if (activeGidRef.current === info.gid) {
        chatInfoRef.current = info;
        setChatInfo(info);
        setChatTimeLeft(initialSeconds);
        return;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      activeGidRef.current = info.gid;
      chatInfoRef.current = info;
      setChatInfo(info);
      setChatTimeLeft(initialSeconds);
      setChatActive(true);

      const channelId = info.fbchannelID || info.gid;
      subscribeFirebase(channelId);
    },
    [subscribeFirebase]
  );

  const stopChatTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }
    activeGidRef.current = null;
    chatInfoRef.current = null;
    setChatActive(false);
    setChatInfo(null);
    setChatTimeLeft(0);
  }, []);

  return (
    <ChatContext.Provider
      value={{ chatActive, chatInfo, chatTimeLeft, startChatTimer, stopChatTimer }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}