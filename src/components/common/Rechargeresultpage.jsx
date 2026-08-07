import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import apiService from "../../services/apiServices";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ScrollToTop from "./ScrollToTop";

// same stylesheet as the rest of the recharge flow — this page reuses
// its classes (recharge-page, recharge-card, recharge-pay-btn, etc.)
// rather than introducing a new one, to stay visually consistent.
import "./RechargeCheckoutPage.css";

const REDIRECT_SECONDS = 15;

// Route this at /recharge-result (matches FRONTEND_RESULT_URL on the
// backend). PayU redirects the browser here via /payu_success or
// /payu_failure, which append ?status=success|failure&txnid=...
//
// We don't trust `status` from the URL alone — that's just a browser
// redirect, not something we control end-to-end. We re-confirm with
// /payu_verify_payment (server-to-server with PayU) before showing
// "success," same as the mobile app does. Once that check resolves,
// a 15-second countdown starts and then sends the user home.
export default function RechargeResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const txnid = searchParams.get("txnid");

  const [state, setState] = useState("checking"); // "checking" | "success" | "failure"
  const [message, setMessage] = useState("Confirming your payment...");
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const countdownRef = useRef(null);

  // ── verify payment status ──
  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!txnid) {
        setState("failure");
        setMessage("Missing transaction reference.");
        return;
      }
      try {
        const res = await apiService.postBearer("/user_api/payu_verify_payment", { txnid });
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
    navigate(state === "success" ? "/wallet" : "/recharge");
  };

  return (
    <div className="recharge-page">
      <ScrollToTop />
      <Header />

      <div className="recharge-page__content">
        <img
          src="/assets/img/wallet/diya_wallet.png"
          alt=""
          aria-hidden="true"
          className="recharge-diya-decor"
        />

        <div className="recharge-container">
          <div className="recharge-pay-card" style={{ textAlign: "center" }}>
            {state === "checking" && (
              <>
                <div className="recharge-card__title" style={{ fontSize: "40px", marginBottom: 8 }}>
                  ⏳
                </div>
                <h3 className="recharge-card__title">Confirming Payment</h3>
                <p className="recharge-secure-note">{message}</p>
              </>
            )}

            {state === "success" && (
              <>
                <div style={{ fontSize: "48px", marginBottom: 8 }}>✅</div>
                <h3 className="recharge-card__title">Payment Successful</h3>
                <p className="recharge-secure-note" style={{ marginBottom: 20 }}>
                  {message}
                </p>

                <button className="recharge-pay-btn" onClick={handleManualRedirect}>
                  Go to Wallet
                </button>

                <p className="recharge-secure-note" style={{ marginTop: 16 }}>
                  Redirecting to home in {secondsLeft}s...
                </p>
              </>
            )}

            {state === "failure" && (
              <>
                <div style={{ fontSize: "48px", marginBottom: 8 }}>❌</div>
                <h3 className="recharge-card__title">Payment Failed</h3>
                <p className="recharge-secure-note" style={{ marginBottom: 20 }}>
                  {message}
                </p>

                <button className="recharge-pay-btn" onClick={handleManualRedirect}>
                  Try Again
                </button>

                <p className="recharge-secure-note" style={{ marginTop: 16 }}>
                  Redirecting to home in {secondsLeft}s...
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}