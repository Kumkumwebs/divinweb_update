import { useState, useRef, useEffect } from "react";
import AuthService from "../../services/authServices";
import { useStorage } from "../../context/StorageContext";
import NewUserDetailsModal from "./NewUserDetailsModal";
import "./auth-otp-modal.css";
// NOTE: assumes Bootstrap 5 CSS is already loaded globally in the app, e.g.
//   import "bootstrap/dist/css/bootstrap.min.css";

const OTP_LEN = 4; // matches existing AuthService OTP length

/* ── SPINNER ── */
function Spinner({ dark = false }) {
	return (
		<span
			className={`spinner-border spinner-border-sm aom-spinner ${dark ? "aom-spinner--dark" : ""}`}
			role="status"
			aria-hidden="true"
		/>
	);
}

/* ── TOAST ── */
function Toast({ msg, type = "error", onDone }) {
	useEffect(() => {
		const id = setTimeout(onDone, 3500);
		return () => clearTimeout(id);
	}, [msg]);
	return (
		<div className={`aom-toast aom-toast--${type} rounded-3 px-4 py-2 d-flex align-items-center gap-2`}>
			{type === "success" ? "✅" : "⚠️"} {msg}
		</div>
	);
}

/* ── LEFT PANEL ── */
function LeftPanel() {
	return <div className="aom-left-panel d-flex flex-column align-items-center position-relative overflow-hidden" />;
}

/* ── LOGIN SCREEN ──
   Controlled phone value so it persists if the user goes back from OTP screen. */
function LoginScreen({ phone, setPhone, agreedToTerms, setAgreedToTerms, onSendOTP }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const ok = phone.length === 10 && !loading;

	const handleSend = async () => {
		setError(null);

		if (!phone) {
			setError("Please enter your phone number");
			return;
		}
		if (!agreedToTerms) {
			setError("Please accept our terms to continue");
			return;
		}
		const phoneRegex = /^\d{10}$/;
		if (!phoneRegex.test(phone)) {
			setError("Please enter a valid 10-digit phone number");
			return;
		}

		setLoading(true);
		const res = await AuthService.checkNumber({ phone, otp: "" });
		setLoading(false);

		if (!res || !res.success) {
			setError(res?.message || "Failed to send OTP.");
			return;
		}

		onSendOTP(phone, { expiresIn: 60, type: res.type });
	};

	return (
		<div className="aom-login-pad d-flex flex-column flex-grow-1 p-4 px-lg-5 py-lg-4">
			<h1 className="aom-title aom-title-text fw-bold mb-1" style={{ fontSize: 27 }}>
				Login to Your Account
			</h1>
			<p className="aom-text-gray mb-4" style={{ fontSize: 13.5 }}>
				We're happy to have you back! 🙏
			</p>

			<div className="aom-divider mb-4">
				<span className="aom-divider-label">Login with Mobile Number</span>
			</div>

			<label className="aom-title-text fw-bold mb-2 d-block" style={{ fontSize: 13.5 }}>
				Mobile Number
			</label>
			<div className={`aom-phone-group d-flex mb-2 ${error ? "aom-phone-group--error" : ""}`}>
				<div className="aom-phone-flag d-flex align-items-center gap-1 px-3">
					<span style={{ fontSize: 18 }}>🇮🇳</span>
					<span className="text-black-50" style={{ fontSize: 11 }}>▾</span>
					<span className="fw-semibold">+91</span>
				</div>
				<input
					type="tel"
					value={phone}
					onChange={e => { setError(null); setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); }}
					onKeyDown={e => e.key === "Enter" && handleSend()}
					onPaste={e => {
						e.preventDefault();
						const digitsOnly = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 10);
						if (digitsOnly) setPhone(digitsOnly);
					}}
					placeholder="Enter your mobile number"
					disabled={loading}
					className="aom-phone-input form-control border-0 flex-grow-1 px-3 py-3"
				/>
			</div>

			<div className="d-flex align-items-start gap-2 mt-1 mb-1 form-check ps-0">
				<input
					type="checkbox"
					id="aom-terms"
					checked={agreedToTerms}
					onChange={e => setAgreedToTerms(e.target.checked)}
					disabled={loading}
					className="form-check-input mt-1 ms-0 flex-shrink-0"
					style={{ width: 15, height: 15 }}
				/>
				<label htmlFor="aom-terms" className="form-check-label aom-text-gray" style={{ fontSize: 12, lineHeight: 1.5 }}>
					I accept the{" "}
					<a href="/terms_of_use" className="aom-text-link fw-semibold">Terms of Service</a>{" "}
					&{" "}
					<a href="/privacy_policy" className="aom-text-link fw-semibold">Privacy Policy</a>
				</label>
			</div>

			{error && (
				<p className="aom-text-danger d-flex align-items-center gap-1 my-2" style={{ fontSize: 12.5 }}>
					<span>⚠️</span> {error}
				</p>
			)}
			<p className="aom-text-hint mb-4" style={{ fontSize: 12 }}>
				We will send you a 4-digit OTP on this number
			</p>

			<button
				onClick={handleSend}
				disabled={!ok}
				className="aom-btn-primary btn w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-4"
			>
				{loading ? <><Spinner /> Sending OTP…</> : <>Send OTP <span style={{ fontSize: 20 }}>→</span></>}
			</button>

			<div className="d-flex align-items-center gap-2 mb-3">
				<div className="flex-grow-1 border-top" style={{ borderColor: "var(--aom-border-light)" }} />
				<span className="aom-text-hint fw-medium" style={{ fontSize: 12 }}>OR</span>
				<div className="flex-grow-1 border-top" style={{ borderColor: "var(--aom-border-light)" }} />
			</div>

			<div className="aom-features-row d-flex justify-content-around py-3 px-2 mb-3">
				{[
					{ cls: "aom-feature-icon--orange", icon: "⚡", title: "Quick Login", desc: "Sign in within\nseconds" },
					{ cls: "aom-feature-icon--purple", icon: "🛡️", title: "Secure & Safe", desc: "Your data is always\nprotected" },
					{ cls: "aom-feature-icon--purple", icon: "✅", title: "Trusted Platform", desc: "Used by lakhs of\ndevotees" },
				].map((f, i) => (
					<div key={i} className="flex-fill d-flex flex-column align-items-center gap-1 px-1">
						<div className={`aom-feature-icon ${f.cls} rounded-circle d-flex align-items-center justify-content-center`}>
							{f.icon}
						</div>
						<span className="aom-feature-title aom-title-text fw-bold text-center" style={{ fontSize: 11.5 }}>{f.title}</span>
						<span className="aom-feature-desc aom-text-gray text-center" style={{ fontSize: 10.5, lineHeight: 1.45, whiteSpace: "pre-line" }}>{f.desc}</span>
					</div>
				))}
			</div>

			<div className="d-flex align-items-center justify-content-center gap-1">
				<span className="aom-text-hint" style={{ fontSize: 13 }}>🔒</span>
				<span className="aom-text-hint" style={{ fontSize: 11.5 }}>Your data is safe with us. We never share your information.</span>
			</div>
		</div>
	);
}

/* ── OTP SCREEN ── */
function OTPScreen({ phone, otpMeta, onBack, onVerified, shieldSrc }) {
	const [digits, setDigits] = useState(Array(OTP_LEN).fill(""));
	const [focused, setFocused] = useState(0);
	const [secs, setSecs] = useState(otpMeta?.expiresIn ?? 60);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [resending, setResending] = useState(false);
	const refs = useRef([]);

	useEffect(() => { refs.current[0]?.focus(); }, []);
	useEffect(() => {
		if (secs <= 0) return;
		const id = setInterval(() => setSecs(s => s - 1), 1000);
		return () => clearInterval(id);
	}, [secs]);

	const mm = String(Math.floor(secs / 60)).padStart(2, "0");
	const ss = String(secs % 60).padStart(2, "0");

	const verifyBtnRef = useRef(null);

	const handleChange = (i, val) => {
		const d = val.replace(/\D/g, "").slice(-1);
		const next = [...digits]; next[i] = d; setDigits(next);
		setError(null);
		if (d && i < OTP_LEN - 1) {
			refs.current[i + 1]?.focus();
			setFocused(i + 1);
		} else if (d && i === OTP_LEN - 1) {
			// Last digit filled — dismiss the mobile keyboard so the
			// Verify button (previously hidden behind it, per screenshot)
			// becomes visible, then scroll it into view for good measure.
			refs.current[i]?.blur();
			setTimeout(() => {
				verifyBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
			}, 100);
		}
	};

	const handleKeyDown = (i, e) => {
		if (e.key === "Backspace") {
			if (digits[i]) { const n = [...digits]; n[i] = ""; setDigits(n); }
			else if (i > 0) { refs.current[i - 1]?.focus(); setFocused(i - 1); }
		}
		if (e.key === "Enter" && allFilled) handleVerify();
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LEN);
		if (!pasted) return;
		const next = Array(OTP_LEN).fill("");
		[...pasted].forEach((ch, i) => { next[i] = ch; });
		setDigits(next);
		if (pasted.length >= OTP_LEN) {
			refs.current[OTP_LEN - 1]?.blur();
			setTimeout(() => {
				verifyBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
			}, 100);
		} else {
			const focusIdx = Math.min(pasted.length, OTP_LEN - 1);
			refs.current[focusIdx]?.focus();
			setFocused(focusIdx);
		}
	};

	const allFilled = digits.every(Boolean);

	const handleVerify = async () => {
		if (!allFilled || loading || secs === 0) return;
		setError(null);
		setLoading(true);
		const otpValue = digits.join("");
		const res = await AuthService.verifyOtp({ phone, otp: otpValue });
		setLoading(false);

		if (res.success || res.status) {
			const token = res.token;
			const userData = res.results || res.user;
			onVerified({ token, user: userData });
		} else {
			setError(res.message || "OTP verification failed.");
			setDigits(Array(OTP_LEN).fill(""));
			setTimeout(() => refs.current[0]?.focus(), 50);
		}
	};

	const handleResend = async () => {
		if (secs > 0 || resending) return;
		setError(null);
		setResending(true);
		const res = await AuthService.checkNumber({ phone, otp: "" });
		setResending(false);
		if (res && res.success) {
			setSecs(60);
			setDigits(Array(OTP_LEN).fill(""));
			setTimeout(() => refs.current[0]?.focus(), 50);
		} else {
			setError(res?.message || "Failed to resend OTP.");
		}
	};

	return (
		<div className="aom-otp-pad d-flex flex-column flex-grow-1 p-3">
			<button onClick={onBack} className="btn btn-link aom-text-med p-0 mb-3 d-flex align-items-center gap-2 fw-semibold text-decoration-none align-self-start" style={{ fontSize: 14 }}>
				<span style={{ fontSize: 16 }}>←</span> Back
			</button>

			<div className="d-flex justify-content-center mb-3">
				<div className="aom-avatar-ring rounded-circle d-flex align-items-center justify-content-center position-relative overflow-hidden">
					{shieldSrc
						? <img src={shieldSrc} alt="Secure" className="aom-shield-icon" style={{ width: 54, height: 54, objectFit: "contain" }} />
						: <span style={{ fontSize: 36 }}>🛡️</span>
					}
					<div className="aom-avatar-badge">✉️</div>
				</div>
			</div>

			<div className="text-center mb-3">
				<h2 className="aom-title-text fw-bold mb-1" style={{ fontSize: 22 }}>Verify Your Mobile Number</h2>
				<p className="aom-text-gray mb-0" style={{ fontSize: 13 }}>We've sent a 4-digit OTP to</p>
			</div>

			<div className="aom-phone-pill d-flex align-items-center gap-2 px-3 py-3 mb-4">
				<span style={{ fontSize: 20 }}>🇮🇳</span>
				<span className="aom-title-text fw-bold flex-grow-1" style={{ fontSize: 15 }}>+91 {phone.slice(0, 5)} {phone.slice(5)}</span>
				<button onClick={onBack} className="aom-btn-link btn p-0 d-flex align-items-center gap-1" style={{ fontSize: 13 }}>
					Edit <span style={{ fontSize: 12 }}>✏️</span>
				</button>
			</div>

			<label className="aom-title-text fw-bold mb-2 d-block" style={{ fontSize: 13.5 }}>Enter 4-digit OTP</label>

			<div className="aom-otp-row mb-2">
				{digits.map((d, i) => (
					<input
						key={i}
						ref={el => refs.current[i] = el}
						type="tel"
						inputMode="numeric"
						maxLength={1}
						value={d}
						onChange={e => handleChange(i, e.target.value)}
						onKeyDown={e => handleKeyDown(i, e)}
						onFocus={() => setFocused(i)}
						onPaste={i === 0 ? handlePaste : undefined}
						disabled={loading}
						className={`aom-otp-box form-control flex-fill ${error ? "aom-otp-box--error" : d ? "aom-otp-box--filled" : ""}`}
					/>
				))}
			</div>

			{error && (
				<p className="aom-text-danger d-flex align-items-center gap-1 mb-2" style={{ fontSize: 12.5 }}>
					<span>⚠️</span> {error}
				</p>
			)}

			<div className="aom-text-gray d-flex align-items-center gap-1 mb-4" style={{ fontSize: 12 }}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--aom-link-purple)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
					<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
				</svg>
				{secs > 0
					? <><span>OTP will expire in </span><span className="aom-text-danger fw-bold">{mm}:{ss}</span></>
					: <span className="aom-text-danger fw-bold">OTP expired. Please resend.</span>
				}
			</div>

			<button
				ref={verifyBtnRef}
				onClick={handleVerify}
				disabled={!allFilled || loading || secs === 0}
				className="aom-btn-verify btn w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-3"
			>
				{loading ? <><Spinner /> Verifying…</> : <>Verify OTP <span style={{ fontSize: 20 }}>→</span></>}
			</button>

			<div className="d-flex justify-content-between align-items-center aom-text-gray mb-3" style={{ fontSize: 13 }}>
				<span>Didn't receive OTP?</span>
				<button onClick={handleResend} disabled={secs > 0 || resending} className="aom-btn-link btn p-0 d-flex align-items-center gap-1 fw-bold">
					{resending ? "Sending…" : <>Resend OTP <span style={{ fontSize: 14 }}>↺</span></>}
				</button>
			</div>

			<div className="aom-secure-box d-flex align-items-center gap-3 px-3 py-3">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--aom-link-purple)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
					<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
				</svg>
				<div className="flex-grow-1">
					<p className="aom-title-text fw-bold mb-1" style={{ fontSize: 13 }}>Secure & Confidential</p>
					<p className="aom-text-gray mb-0" style={{ fontSize: 11.5, lineHeight: 1.5 }}>Your information is safe with us and<br />never shared with anyone.</p>
				</div>
				{shieldSrc && (
					<img src={shieldSrc} alt="Secure" className="aom-shield-icon--sm flex-shrink-0" style={{ width: 46, height: 46, objectFit: "contain" }} />
				)}
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────────────────────────────────
   Root export — same props Header.jsx already uses:
	 isOpen, onClose
   Behaves exactly like the old modal internally:
	 - AuthService.checkNumber / AuthService.verifyOtp
	 - useStorage().setToken / setUser on success
	 - shows NewUserDetailsModal (Name + Email) for new registrations
	   (loginType !== 'login')
   ───────────────────────────────────────────────────────────────────────── */
export default function LoginOTPModal({
	isOpen,
	onClose,
	shieldSrc = "/assets/img/shield.png",
}) {
	const { setToken, setUser } = useStorage();

	const [screen, setScreen] = useState("login");
	const [phone, setPhone] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [otpMeta, setOtpMeta] = useState(null);
	const [loginType, setLoginType] = useState("");
	const [toast, setToast] = useState(null);
	const [showProfileModal, setShowProfileModal] = useState(false);

	// Close on Escape
	useEffect(() => {
		if (!isOpen) return;
		const onKey = e => { if (e.key === "Escape") handleClose(); };
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isOpen]);

	// Reset state every time modal opens/closes
	useEffect(() => {
		if (!isOpen) {
			setTimeout(() => {
				setScreen("login");
				setPhone("");
				setAgreedToTerms(false);
				setOtpMeta(null);
				setLoginType("");
				setToast(null);
				setShowProfileModal(false);
			}, 300);
		}
	}, [isOpen]);

	// Lock body scroll while open
	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => { document.body.style.overflow = ""; };
	}, [isOpen]);

	const handleClose = () => { setToast(null); onClose(); };

	const handleSendOTP = (p, meta) => {
		setPhone(p);
		setOtpMeta(meta);
		setLoginType(meta?.type || "");
		setScreen("otp");
		setToast({ msg: `OTP sent to +91 ${p.slice(0, 5)} ${p.slice(5)}`, type: "success" });
	};

	const handleVerified = ({ token, user }) => {
		setToken(token);
		setUser(user);

		setToast({ msg: "Login successful! Welcome 🙏", type: "success" });

		if (loginType?.toLowerCase() !== "login") {
			// New registration — collect Name + Email next
			setTimeout(() => {
				setToast(null);
				setShowProfileModal(true);
			}, 700);
		} else {
			setTimeout(handleClose, 900);
		}
	};

	if (!isOpen) return null;

	return (
		<>
			{toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

			{/* Backdrop — click outside closes */}
			<div
				onClick={handleClose}
				className="aom-root aom-backdrop d-flex align-items-center justify-content-center p-3"
			>
				{/* Modal shell — stop click propagation */}
				<div
					onClick={e => e.stopPropagation()}
					className="aom-modal-shell d-flex"
				>
					<LeftPanel />
					<div className="aom-right-panel flex-grow-1 bg-white d-flex flex-column">
						{/* Close × */}
						<button onClick={handleClose} className="aom-close-btn btn rounded-circle d-flex align-items-center justify-content-center">✕</button>

						{screen === "login" ? (
							<LoginScreen
								phone={phone}
								setPhone={setPhone}
								agreedToTerms={agreedToTerms}
								setAgreedToTerms={setAgreedToTerms}
								onSendOTP={handleSendOTP}
							/>
						) : (
							<OTPScreen
								phone={phone}
								otpMeta={otpMeta}
								onBack={() => setScreen("login")}
								shieldSrc={shieldSrc}
								onVerified={handleVerified}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Name + Email popup — only shown for new registrations */}
			<NewUserDetailsModal
				isOpen={showProfileModal}
				onClose={() => {
					setShowProfileModal(false);
					onClose();
				}}
				userData={{ phone, country_code: "91" }}
			/>
		</>
	);
}