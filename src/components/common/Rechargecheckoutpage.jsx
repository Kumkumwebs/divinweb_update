import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import apiService from "../../services/apiServices";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ScrollToTop from "./ScrollToTop";

import "./RechargeCheckoutPage.css";

const GST_RATE = 0.18;

// Builds a hidden form and submits it — this is how PayU's hosted
// checkout is triggered from a browser: a real full-page POST to
// their payment page, not an API call. The browser will navigate
// away entirely, so nothing after form.submit() needs to run.
function submitToPayU(payuUrl, params) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = payuUrl;

  Object.entries(params || {}).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value ?? "";
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export default function RechargeCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Amount is passed from RechargeAmountPage via
  // navigate("/recharge-checkout", { state: { amount } })
  // Falls back to a default if this page is opened directly.
  const baseAmount = location.state?.amount ?? 211;

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponStatus, setCouponStatus] = useState(null); // null | "applied" | "invalid"
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paying, setPaying] = useState(false);

  const discountedBase = Math.max(baseAmount - discount, 0);
  const gstAmount = useMemo(() => discountedBase * GST_RATE, [discountedBase]);
  const totalPayable = useMemo(
    () => discountedBase + gstAmount,
    [discountedBase, gstAmount]
  );

  // ─── Apply Coupon ───
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
  
    try {
      setApplyingCoupon(true);
      setCouponStatus(null);
  
      const res = await apiService.postBearer("/user_api/apply_coupon", {
        code: couponCode.trim(),
        amount: baseAmount,
      });
  
      if (res.status && res.discount) {
        setDiscount(res.discount);
        setCouponStatus("applied");
      } else {
        setDiscount(0);
        setCouponStatus("invalid");
      }
    } catch (e) {
      console.error("apply_coupon failed:", e.response?.data || e);
      setDiscount(0);
      setCouponStatus("invalid");
    } finally {
      setApplyingCoupon(false);
    }
  };
  // ─── Pay (PayU hosted checkout) ───
  const handlePay = async () => {
    try {
      setPaying(true);
  
      const initRes = await apiService.postBearer("/user_api/payu_initiate", {
        amount: totalPayable.toFixed(2),
        wallet_amount: discountedBase.toFixed(2),
        coupan_code: couponStatus === "applied" ? couponCode.trim() : "",
        offer_id: "",
        profit_amount: "0",
        platform: "web",   // <-- add this line
      });
  
      if (!initRes.status || !initRes.results) {
        alert("Unable to start payment. Please try again.");
        setPaying(false);
        return;
      }
  
      const { payu_url, params } = initRes.results;
  
      submitToPayU(payu_url, params);
    } catch (e) {
      console.error("payu_initiate failed:", e.response?.data || e);
      alert("Something went wrong while starting payment.");
      setPaying(false);
    }
  };
  return (
    <div className="recharge-page">
      <ScrollToTop />
      <Header />

      <div className="recharge-page__content">
        {/* Decorative hanging diyas */}
        <img
          src="/assets/img/wallet/diya_wallet.png"
          alt=""
          aria-hidden="true"
          className="recharge-diya-decor"
        />

        <div className="recharge-container">
          {/* Payment Summary */}
          <div className="recharge-card">
            <h3 className="recharge-card__title">Payment Summary</h3>

            <div className="recharge-row">
              <span className="recharge-row__label">Base Amount</span>
              <span className="recharge-row__value">
                ₹{baseAmount.toFixed(2)}
              </span>
            </div>

            {discount > 0 && (
              <div className="recharge-row">
                <span className="recharge-row__label recharge-row__label--muted">
                  Coupon Discount
                </span>
                <span className="recharge-row__value recharge-row__value--discount">
                  -₹{discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="recharge-row">
              <span className="recharge-row__label recharge-row__label--muted">
                GST @ 18%
              </span>
              <span className="recharge-row__value recharge-row__value--muted">
                ₹{gstAmount.toFixed(2)}
              </span>
            </div>

            <div className="recharge-row recharge-row--total">
              <span className="recharge-row__label">Amount Payable</span>
              <span className="recharge-row__value recharge-row__value--total">
                ₹{totalPayable.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Coupon */}
          <div className="recharge-card">
            <h3 className="recharge-card__title">Coupon / Promo Code</h3>

            <div className="recharge-coupon-row">
              <input
                type="text"
                className="recharge-coupon-input"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponStatus(null);
                }}
              />
              <button
                className="recharge-coupon-btn"
                onClick={handleApplyCoupon}
                disabled={applyingCoupon || !couponCode.trim()}
              >
                {applyingCoupon ? "Applying..." : "Apply"}
              </button>
            </div>

            {couponStatus === "applied" && (
              <p className="recharge-coupon-msg recharge-coupon-msg--success">
                Coupon applied successfully!
              </p>
            )}
            {couponStatus === "invalid" && (
              <p className="recharge-coupon-msg recharge-coupon-msg--error">
                Invalid or expired coupon code.
              </p>
            )}
          </div>

          {/* Total Pay + Pay button */}
          <div className="recharge-pay-card">
            <div className="recharge-total-bar">
              <span>Total Pay</span>
              <span>INR {totalPayable.toFixed(2)}</span>
            </div>

            <button
              className="recharge-pay-btn"
              onClick={handlePay}
              disabled={paying}
            >
              <span className="recharge-pay-btn__icon">🔒</span>
              {paying ? "Redirecting..." : `Pay ₹${totalPayable.toFixed(2)}`}
            </button>

            <p className="recharge-secure-note">
              <span className="recharge-secure-note__check">✓</span>
              Secured by PayU • 100% Safe &amp; Encrypted
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}