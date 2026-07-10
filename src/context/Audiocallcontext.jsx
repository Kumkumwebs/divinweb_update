/**
 * AudioCallContext.jsx
 *
 * Holds the active audio-call session in memory so the minimized floating
 * "ActiveCallBar" stays visible on any DivinIq page while the user navigates.
 * JS port of astroguruji's AudioCallContext.
 *
 * callStatus:
 *   idle       — nothing active
 *   connecting — waiting for astrologer to accept
 *   ringing    — accepted, waiting to join Agora
 *   connected  — astrologer joined the channel
 *   on_hold
 *   ended
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const AudioCallContext = createContext(null);

export function AudioCallProvider({ children }) {
  const [callStatus, setCallStatus] = useState('idle');
  const [callInfo, setCallInfo] = useState(null); // { channelId, astrologerId, astroName, astroImage, rate, wallet }
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const startCall = useCallback((info) => {
    setCallInfo(info);
    setCallStatus('connecting');
    setElapsedSeconds(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsMinimized(false);
  }, []);

  const minimize = useCallback(() => setIsMinimized(true), []);
  const maximize = useCallback(() => setIsMinimized(false), []);

  const endCall = useCallback(() => {
    setCallStatus('idle');
    setCallInfo(null);
    setElapsedSeconds(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsMinimized(false);
  }, []);

  return (
    <AudioCallContext.Provider
      value={{
        callStatus,
        callInfo,
        elapsedSeconds,
        isMuted,
        isSpeakerOn,
        isMinimized,
        startCall,
        setCallStatus,
        setElapsedSeconds,
        setIsMuted,
        setIsSpeakerOn,
        setCallInfo,
        minimize,
        maximize,
        endCall,
      }}
    >
      {children}
    </AudioCallContext.Provider>
  );
}

export function useAudioCall() {
  const ctx = useContext(AudioCallContext);
  if (!ctx) throw new Error('useAudioCall must be used inside <AudioCallProvider>');
  return ctx;
}