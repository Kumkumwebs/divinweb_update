import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ChatCallService from '../services/chatCallServices';
import './ChatCallingScreen.css';

const ChatCallingScreen = () => {
  const { id } = useParams(); // astrologer id (from the route)
  const navigate = useNavigate();
  const { state } = useLocation();

  // Guard: if someone lands here directly (refresh / no state), bounce back
  useEffect(() => {
    if (!state?.astrologer_id) {
      navigate(`/astrologer/${id}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    callType,       // 'chat' | 'call'  (as sent from AstrologerDetail)
    astrologer_id,
    name,
    profile_img,
    rate,
    wallet,
    intake,
  } = state || {};

  // API expects 'audio' for a voice call, 'chat' for chat
  const apiCallType = callType === 'call' ? 'audio' : 'chat';

  const [statusText, setStatusText] = useState('Connecting...');
  const channelIdRef = useRef(null);
  const pollRef = useRef(null);
  const timeoutRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (state?.astrologer_id) startFlow();
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.astrologer_id]);

  const cleanup = () => {
    cancelledRef.current = true;
    if (pollRef.current) clearInterval(pollRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goBackToDetails = () => {
    cleanup();
    navigate(`/astrologer/${astrologer_id || id}`, { replace: true });
  };

  const startFlow = async () => {
    const res = await ChatCallService.initiateChat({
      astrologerId: astrologer_id,
      callType: apiCallType,
      intake,
    });

    // status false → back to astrologer details
    if (!res || res.status !== true) {
      goBackToDetails();
      return;
    }

    const channelId = res.channel_id || res.results?.channel_id;
    if (!channelId) {
      goBackToDetails();
      return;
    }
    channelIdRef.current = channelId;
    setStatusText('Waiting for astrologer to accept...');

    // stop polling after 60s if nothing happens
    timeoutRef.current = setTimeout(() => {
      if (!cancelledRef.current) {
        ChatCallService.endChat(channelId, 'timeout');
        goBackToDetails();
      }
    }, 60000);

    pollRef.current = setInterval(() => pollStatus(channelId), 2000);
  };

  const pollStatus = async (channelId) => {
    const res = await ChatCallService.checkStatus(channelId);
    if (cancelledRef.current || !res || res.status !== true) return;

    const s = res.results?.status;

    if (s === 'accept_astro') {
      cleanup();
      const target = callType === 'call'
        ? `/consultation/call/${astrologer_id}`
        : `/consultation/chat/${astrologer_id}`;
      navigate(target, {
        replace: true,
        state: {
          channelId,
          userId: res.results?.user_id,
          name,
          profile_img,
          rate,
          wallet,
          intake,
        },
      });
    } else if (s === 'reject_astro') {
      ChatCallService.endChat(channelId, 'reject');
      goBackToDetails();
    }
  };

  const handleCancel = () => {
    if (channelIdRef.current) ChatCallService.endChat(channelIdRef.current, 'disconnect_user');
    goBackToDetails();
  };

  return (
    <div className="ccs-page">
      <div className="ccs-card">
        <div className="ccs-avatar">
          {profile_img
            ? <img src={profile_img} alt={name} />
            : <div className="ccs-avatar-fallback">{(name || 'A')[0]}</div>}
        </div>
        <h2 className="ccs-name">{name || 'Astrologer'}</h2>
        <p className="ccs-status">{statusText}</p>
        <div className="ccs-spinner" />
        <button className="ccs-cancel-btn" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ChatCallingScreen;