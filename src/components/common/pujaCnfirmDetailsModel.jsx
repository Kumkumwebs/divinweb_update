import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const OrderConfirmationModal = ({ isOpen, onClose, formData, cart, onConfirm, walletBalance = 0 }) => {
  const [paymentMode, setPaymentMode] = useState("razorpay");

  if (!isOpen) return null;

  const totalAmount = (cart?.grand_total || 0) + 10;

  return (
    <AnimatePresence>
      <>
        <style>{`
          .ocm-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.55);
            z-index: 10000;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            padding: 0;
          }
          @media(min-width: 600px){
            .ocm-overlay { align-items: center; padding: 20px; }
          }

          .ocm-card {
            background: #fff;
            border-radius: 28px 28px 0 0;
            width: 100%;
            max-width: 520px;
            max-height: 95vh;
            overflow-y: auto;
            padding: 0 0 24px;
            position: relative;
            box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
          }
          @media(min-width: 600px){
            .ocm-card { border-radius: 28px; box-shadow: 0 20px 60px rgba(0,0,0,0.22); }
          }

          /* drag handle */
          .ocm-handle {
            width: 40px; height: 4px;
            background: #e5e7eb;
            border-radius: 99px;
            margin: 14px auto 0;
          }

          /* close button */
          .ocm-close {
            position: absolute;
            top: 14px; right: 16px;
            width: 34px; height: 34px;
            border-radius: 50%;
            border: 1.5px solid #e5e7eb;
            background: #fff;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            font-size: 16px; color: #6b7280;
            transition: background 0.15s;
          }
          .ocm-close:hover { background: #f3f4f6; }

          /* header */
          .ocm-header {
            padding: 20px 24px 0;
            display: flex; align-items: center; gap: 14px;
          }
          .ocm-header-img {
            width: 60px; height: 60px; object-fit: contain; flex-shrink: 0;
          }
          .ocm-header-title {
            font-size: 20px; font-weight: 800;
            color: #7B1F3A; margin: 0 0 2px;
            line-height: 1.2;
          }
          .ocm-header-sub {
            font-size: 13px; color: #9ca3af; margin: 0;
          }
          .ocm-divider-wrap {
            display: flex; align-items: center; gap: 8px;
            padding: 10px 24px 0;
          }
          .ocm-divider-line { flex: 1; height: 1px; background: #f5a623; opacity: 0.4; }
          .ocm-divider-icon { color: #f5a623; font-size: 14px; }

          /* details card */
          .ocm-details {
            margin: 14px 16px 0;
            background: #fdf8f2;
            border-radius: 16px;
            padding: 16px;
            position: relative;
            overflow: hidden;
          }
          .ocm-details-watermark {
            position: absolute;
            right: -10px; bottom: -10px;
            width: 90px; opacity: 0.06;
            pointer-events: none;
          }
          .ocm-details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .ocm-detail-item {
            display: flex; align-items: flex-start; gap: 10px;
          }
          .ocm-detail-icon {
            width: 38px; height: 38px; border-radius: 50%;
            background: #fde8ef;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            color: #7B1F3A; font-size: 15px;
          }
          .ocm-detail-label {
            font-size: 10px; font-weight: 800;
            color: #f5a623; letter-spacing: 0.5px;
            text-transform: uppercase; margin-bottom: 2px;
          }
          .ocm-detail-value {
            font-size: 14px; font-weight: 700; color: #111827;
            display: flex; align-items: center; gap: 6px;
          }
          .ocm-no-badge {
            width: 18px; height: 18px; border-radius: 50%;
            background: #f5a623;
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 10px; font-weight: 700;
          }
          .ocm-address {
            margin-top: 12px;
            padding-top: 10px;
            border-top: 1px solid #f0e8d8;
            font-size: 12px; color: #6b7280;
          }

          /* payment section */
          .ocm-payment {
            margin: 12px 16px 0;
            background: #fff;
            border: 1.5px solid #f3f4f6;
            border-radius: 16px;
            padding: 16px;
          }
          .ocm-payment-title {
            display: flex; align-items: center; gap: 8px;
            font-size: 11px; font-weight: 800;
            color: #f5a623; letter-spacing: 0.6px;
            text-transform: uppercase; margin-bottom: 14px;
          }
          .ocm-payment-title i { font-size: 16px; }

          .ocm-pay-opt {
            display: flex; align-items: center; gap: 12px;
            padding: 10px 0;
            cursor: pointer;
          }
          .ocm-pay-opt + .ocm-pay-opt {
            border-top: 1px solid #f3f4f6;
          }
          .ocm-radio {
            width: 20px; height: 20px; border-radius: 50%;
            border: 2px solid #d1d5db;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; transition: border-color 0.15s;
          }
          .ocm-radio.active { border-color: #7B1F3A; }
          .ocm-radio.active::after {
            content: '';
            width: 10px; height: 10px;
            border-radius: 50%; background: #7B1F3A;
          }
          .ocm-pay-logo {
            width: 48px; height: 48px; border-radius: 50%;
            background: #fdf8f2;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0; overflow: hidden;
          }
          .ocm-pay-logo img { width: 32px; object-fit: contain; }
          .ocm-pay-logo i { font-size: 22px; color: #f5a623; }
          .ocm-pay-name {
            font-size: 14px; font-weight: 700; color: #7B1F3A;
          }
          .ocm-pay-sub {
            font-size: 12px; color: #9ca3af; margin-top: 1px;
          }
          .ocm-wallet-bal {
            font-size: 13px; font-weight: 700; color: #f5a623; margin-left: 4px;
          }

          /* amount row */
          .ocm-amount-row {
            margin: 12px 16px 0;
            display: flex; align-items: center; gap: 12px;
            padding: 12px 0;
            border-top: 1px solid #f3f4f6;
            border-bottom: 1px solid #f3f4f6;
          }
          .ocm-amount-icon {
            width: 40px; height: 40px; border-radius: 50%;
            background: #fdf8f2;
            display: flex; align-items: center; justify-content: center;
            color: #f5a623; font-size: 18px; flex-shrink: 0;
          }
          .ocm-amount-label {
            font-size: 15px; font-weight: 700; color: #111827; flex: 1;
          }
          .ocm-amount-val {
            font-size: 26px; font-weight: 900; color: #f5a623;
          }

          /* action buttons */
          .ocm-actions {
            margin: 14px 16px 0;
            display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px;
          }
          .ocm-btn-edit {
            padding: 14px;
            border: 2px solid #7B1F3A;
            border-radius: 50px;
            background: #fff;
            color: #7B1F3A;
            font-size: 14px; font-weight: 700;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 6px;
            transition: background 0.15s;
          }
          .ocm-btn-edit:hover { background: #fdf0f4; }
          .ocm-btn-pay {
            padding: 14px;
            border: none;
            border-radius: 50px;
            background: #f5a623;
            color: #fff;
            font-size: 14px; font-weight: 700;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: opacity 0.15s;
            box-shadow: 0 4px 14px rgba(245,166,35,0.35);
          }
          .ocm-btn-pay:hover { opacity: 0.9; }

          /* secure note */
          .ocm-secure {
            text-align: center; margin-top: 12px;
            font-size: 12px; color: #6b7280;
            display: flex; align-items: center; justify-content: center; gap: 6px;
          }
          .ocm-secure i { color: #16a34a; font-size: 14px; }
        `}</style>

        <div className="ocm-overlay" onClick={onClose}>
          <motion.div
            className="ocm-card"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="ocm-handle" />

            {/* Close button */}
            <button className="ocm-close" onClick={onClose}>✕</button>

            {/* Header */}
            <div className="ocm-header">
              <img
                className="ocm-header-img"
                src="/assets/img/pooja_fill/kalashfill.png"
                alt="Kalash"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <div className="ocm-header-title">Please confirm your details</div>
                <div className="ocm-header-sub">Final verification before sacred booking</div>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="ocm-divider-wrap">
              <div className="ocm-divider-line" />
              <i className="fas fa-snowflake ocm-divider-icon" />
              <div className="ocm-divider-line" />
            </div>

            {/* Details card */}
            <div className="ocm-details">
              <div className="ocm-details-grid">
                {/* Devotee Name */}
                <div className="ocm-detail-item">
                  <div className="ocm-detail-icon">
                    <i className="fas fa-user" />
                  </div>
                  <div>
                    <div className="ocm-detail-label">Devotee Name</div>
                    <div className="ocm-detail-value">
                      {formData?.participantName || "—"}
                    </div>
                  </div>
                </div>

                {/* Gotra */}
                <div className="ocm-detail-item">
                  <div className="ocm-detail-icon">
                    <i className="fas fa-om" style={{fontSize:13}} />
                  </div>
                  <div>
                    <div className="ocm-detail-label">Gotra</div>
                    <div className="ocm-detail-value">
                      {formData?.isGotraKnown && formData?.gotra
                        ? formData.gotra
                        : "Not Provided"}
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="ocm-detail-item">
                  <div className="ocm-detail-icon">
                    <i className="fab fa-whatsapp" />
                  </div>
                  <div>
                    <div className="ocm-detail-label">WhatsApp</div>
                    <div className="ocm-detail-value">
                      {formData?.whatsapp || "—"}
                    </div>
                  </div>
                </div>

                {/* Aashirwad Box */}
                <div className="ocm-detail-item">
                  <div className="ocm-detail-icon">
                    <i className="fas fa-gift" />
                  </div>
                  <div>
                    <div className="ocm-detail-label">Aashirwad Box</div>
                    <div className="ocm-detail-value">
                      {formData?.wantsAashirwad || "No"}
                      {formData?.wantsAashirwad === "No" && (
                        <span className="ocm-no-badge">✕</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address if Yes */}
              {formData?.wantsAashirwad === "Yes" && formData?.address && (
                <div className="ocm-address">
                  📍 {[
                    formData.address.houseNo,
                    formData.address.area,
                    formData.address.city,
                    formData.address.pincode,
                  ].filter(Boolean).join(", ")}
                </div>
              )}

              {/* Watermark Om */}
              <img
                className="ocm-details-watermark"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Om_symbol.svg/200px-Om_symbol.svg.png"
                alt=""
              />
            </div>

            {/* Payment Mode */}
            <div className="ocm-payment">
              <div className="ocm-payment-title">
                <i className="fas fa-credit-card" />
                Select Payment Mode
              </div>

              {/* Razorpay / UPI */}
              <div
                className="ocm-pay-opt"
                onClick={() => setPaymentMode("razorpay")}
              >
                <div className={`ocm-radio ${paymentMode === "razorpay" ? "active" : ""}`} />
                <div className="ocm-pay-logo">
                  <img
                    src="https://razorpay.com/assets/razorpay-logo-white-bg.svg"
                    alt="UPI"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = '<span style="font-size:11px;font-weight:800;color:#072654">UPI</span>';
                    }}
                  />
                </div>
                <div>
                  <div className="ocm-pay-name">Online Payment (UPI / Card)</div>
                  <div className="ocm-pay-sub">Pay securely using UPI, Debit/Credit Card</div>
                </div>
              </div>

              {/* Wallet */}
              <div
                className="ocm-pay-opt"
                onClick={() => setPaymentMode("wallet")}
              >
                <div className={`ocm-radio ${paymentMode === "wallet" ? "active" : ""}`} />
                <div className="ocm-pay-logo">
                  <i className="fas fa-wallet" />
                </div>
                <div>
                  <div className="ocm-pay-name">
                    DiviniQ Wallet
                    <span className="ocm-wallet-bal">₹{walletBalance}</span>
                  </div>
                  <div className="ocm-pay-sub">Use your DiviniQ wallet balance</div>
                </div>
              </div>
            </div>

            {/* Amount row */}
            <div className="ocm-amount-row">
              <div className="ocm-amount-icon">
                <i className="fas fa-wallet" />
              </div>
              <div className="ocm-amount-label">Amount to Pay</div>
              <div className="ocm-amount-val">₹{totalAmount}</div>
            </div>

            {/* Action buttons */}
            <div className="ocm-actions">
              <button className="ocm-btn-edit" onClick={onClose}>
                <i className="fas fa-pen" style={{fontSize:12}} />
                Edit Info
              </button>
              <button className="ocm-btn-pay" onClick={() => onConfirm(paymentMode)}>
                <i className="fas fa-lock" style={{fontSize:13}} />
                Submit & Pay
              </button>
            </div>

            {/* Secure note */}
            <div className="ocm-secure">
              <i className="fas fa-shield-alt" />
              100% Secure Payments
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>
  );
};

export default OrderConfirmationModal;