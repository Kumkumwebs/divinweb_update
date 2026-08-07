import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import apiService from "../../services/apiServices";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ScrollToTop from "./ScrollToTop";

// .recharge-page / .recharge-page__content (the outer wrapper) live in
// the shared checkout stylesheet — kept for consistency with that flow.
import "./RechargeCheckoutPage.css";
// This page's own styles (result card, diya wings, status colors) live
// separately so they can't collide with or affect other pages that share
// the file above.
import "./RechargeResultPage.css";

const STATUS_ICON_CLASS = {
  checking: "rchg-result-icon--checking",
  success: "rchg-result-icon--success",
  failure: "rchg-result-icon--failure",
};

// Small inline icons — crisper than emoji and themeable to match the
// success/failure/checking palette above.
const StatusIcon = ({ state }) => {
  if (state === "success") {
    return (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (state === "failure") {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
};

// Small refresh icon for the "Try Again" button — spins gently via CSS.
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="rchg-btn-icon">
    <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

// Circular countdown ring — visualizes the auto-redirect timer.
const CountdownRing = ({ secondsLeft, total, color }) => {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, secondsLeft / total));
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" style={{ display: "block" }}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="#f0e2cf" strokeWidth="5" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={(1 - progress) * circumference}
        transform="rotate(-90 32 32)"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      <text x="32" y="37" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1a1a1a">
        {secondsLeft}
      </text>
    </svg>
  );
};

// Matches the colors defined for .rchg-result-icon--* in RechargeResultPage.css,
// so the ring always tracks the same status color as the icon above it.
const RING_COLOR = {
  checking: "#c9852e",
  success: "#1a9d4c",
  failure: "#d64545",
};

// ── Hanging diya: CSS-drawn beaded chain + the site's real diya artwork ──
// Hangs straight down from the top of .rchg-hero, i.e. right under the
// page Header, rather than from any decorative band.
const HangingDiya = ({ chainLength = 130 }) => (
  <>
    <div className="rchg-diya-chain" style={{ height: chainLength }} />
    <img
      src="/assets/img/wallet/diya_wallet.png"
      alt=""
      aria-hidden="true"
      className="rchg-diya-img"
    />
  </>
);

// Faint lotus/mandala motif — used sparingly (behind the status icon and
// as a soft "reflection" under the card), not repeated in every corner.
const MandalaMotif = ({ size = 220, className = "" }) => (
  <svg
    className={`rchg-mandala ${className}`}
    width={size}
    height={size}
    viewBox="0 0 200 200"
    aria-hidden="true"
  >
    <g fill="none" stroke="#c98a2e" strokeWidth="0.75">
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="100"
          cy="65"
          rx="14"
          ry="34"
          transform={`rotate(${i * 45} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="60" />
    </g>
  </svg>
);

// Route this at /recharge-result (matches FRONTEND_RESULT_URL on the
// backend). PayU redirects the browser here via /payu_success or
// /payu_failure, which append ?status=success|failure&txnid=...
//
// We don't trust `status` from the URL alone — that's just a browser
// redirect, not something we control end-to-end. We re-confirm with
// /payu_verify_payment (server-to-server with PayU) before showing
// "success," same as the mobile app does. Once that check resolves,
// a 15-second countdown starts and then sends the user home.
// Matches the absolute-URL pattern used for every other endpoint in the
// app (get_profile, profile_update, upload_a_file). A relative path here
// was resolving against the frontend's own origin instead of the API
// domain, which is why verification was throwing (network/404) instead
// of returning a clean success/failure — landing on the generic catch-
// block message regardless of the real payment outcome.
const VERIFY_PAYMENT_URL = "https://admin.diviniq.in/user_api/payu_verify_payment";

const REDIRECT_SECONDS = 15;

export default function RechargeResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const txnid = searchParams.get("txnid");

  const [state, setState] = useState("checking"); // "checking" | "success" | "failure"
  const [message, setMessage] = useState("Confirming your payment...");
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const countdownRef = useRef(null);

  // ── verify payment status ── (unchanged)
  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!txnid) {
        setState("failure");
        setMessage("Missing transaction reference.");
        return;
      }
      try {
        const res = await apiService.postBearer(VERIFY_PAYMENT_URL, { txnid });
        if (cancelled) return;

        if (res.status) {
          setState("success");
          setMessage("Your wallet has been recharged. Thank you for your trust!");
        } else {
          setState("failure");
          setMessage(res.data.message || "Payment could not be confirmed.");
        }
      } catch (e) {
        if (cancelled) return;
        setState("failure");
        setMessage("Something went wrong while confirming your payment.");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [txnid]);

  // ── 15s countdown → redirect home, starts once we have a final result ──
  useEffect(() => {
    if (state === "checking") return;

    setSecondsLeft(REDIRECT_SECONDS);
    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [state, navigate]);

  const handleManualRedirect = () => {
    clearInterval(countdownRef.current);
    navigate(state === "success" ? "/wallet" : "/recharge-checkout");
  };

  const ringColor = RING_COLOR[state];

  return (
    <div className="recharge-page">
      <ScrollToTop />
      <Header />

      <div className="rchg-hero">
        <div className="rchg-diya-wrap rchg-diya-wrap--left">
          <HangingDiya chainLength={110} />
        </div>
        <div className="rchg-diya-wrap rchg-diya-wrap--right">
          <HangingDiya chainLength={110} />
        </div>

        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="rchg-card-shell">
                <div className="rchg-result-card shadow p-4 p-md-5 text-center">
                  <div className="rchg-icon-halo">
                    <MandalaMotif size={150} className="rchg-mandala--icon" />
                    <div
                      className={`rchg-result-icon ${STATUS_ICON_CLASS[state]} rounded-circle d-flex align-items-center justify-content-center mx-auto`}
                    >
                      <StatusIcon state={state} />
                    </div>
                  </div>

                  <h3 className="rchg-title mb-0">
                    {state === "checking" && "Confirming Payment"}
                    {state === "success" && "Payment Successful"}
                    {state === "failure" && "Payment Failed"}
                  </h3>

                  <div className="rchg-divider" aria-hidden="true">
                    <span className="rchg-divider-line" />
                    <span className="rchg-divider-dot">✦</span>
                    <span className="rchg-divider-line" />
                  </div>

                  <p className="rchg-result-message mx-auto mb-4">{message}</p>

                  {state === "success" && (
                    <button
                      className="rchg-result-btn btn btn-lg rounded-pill fw-bold px-4"
                      onClick={handleManualRedirect}
                    >
                      Go to Wallet
                    </button>
                  )}

                  {state === "failure" && (
                    <button
                      className="rchg-result-btn rchg-result-btn--failure btn btn-lg rounded-pill fw-bold px-4"
                      onClick={handleManualRedirect}
                    >
                      <RefreshIcon />
                      Try Again
                    </button>
                  )}

                  {state !== "checking" && (
                    <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                      <CountdownRing secondsLeft={secondsLeft} total={REDIRECT_SECONDS} color={ringColor} />
                      <span className="rchg-countdown-label small text-start">
                        Redirecting to home
                        <br />
                        in {secondsLeft}s
                      </span>
                    </div>
                  )}
                </div>

                <MandalaMotif size={260} className="rchg-mandala--reflection" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}