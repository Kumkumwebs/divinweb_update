import { useState, useEffect } from 'react';
import AuthService from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../../context/StorageContext';
import styles from './LoginOTPModel.module.css';
import ProfileDetailsModal from './ProfileDetailsModal';

const LoginOTPModal = ({ isOpen, onClose }) => {
	const navigate = useNavigate();
	const [step, setStep] = useState('login');
	const [loginType, setLoginType] = useState('');
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [phone, setPhone] = useState('');
	const [otp, setOtp] = useState(['', '', '', '']);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [resendTimer, setResendTimer] = useState(0);
	const [agreedToTerms, setAgreedToTerms] = useState(false);

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
			return () => clearTimeout(timer);
		}
	}, [resendTimer]);

	useEffect(() => {
		if (!isOpen) {
			setTimeout(() => {
				setStep('login');
				setPhone('');
				setOtp(['', '', '', '']);
				setError('');
				setResendTimer(0);
				setAgreedToTerms(false);
				setShowProfileModal(false);
			}, 300);
		}
	}, [isOpen]);

	const handlePhoneSubmit = async () => {
		setError('');

		if (!phone) {
			setError('Please enter your phone number');
			return;
		}

		if (!agreedToTerms) {
			setError('Please accept our terms to continue');
			return;
		}

		const phoneRegex = /^\d{10}$/;
		if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
			setError('Please enter a valid 10-digit phone number');
			return;
		}

		setIsLoading(true);
		const res = await AuthService.checkNumber({ phone, otp: '' });
		if (!res || !res.success) {
			setError(res.message);
			return;
		}

		setStep('otp');
		setLoginType(res.type);
		setResendTimer(60);

		setIsLoading(false);
	};

	const handleOtpChange = (index, value) => {
		if (value.length > 1) value = value[0];
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < 3) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			nextInput?.focus();
		}
	};

	const handleOtpKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-${index - 1}`);
			prevInput?.focus();
		} else if (e.key === 'Enter') {
			handleOtpSubmit();
		}
	};

	const handleOtpPaste = e => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

		// If pasted number is larger than 4 digits, don't paste
		if (pastedData.length > 4) return;

		// If pasted data is empty or not digits, return
		if (!pastedData) return;

		const pastedDigits = pastedData.split('');

		if (pastedData.length === 4) {
			// If exactly 4 digits, paste from first input
			setOtp(pastedDigits);
			document.getElementById('otp-3')?.focus();
		} else {
			// If shorter than 4 digits
			// Find the last filled input index
			let lastFilledIndex = -1;
			for (let i = 3; i >= 0; i--) {
				if (otp[i] !== '') {
					lastFilledIndex = i;
					break;
				}
			}

			if (lastFilledIndex === -1) {
				// No input field is filled, paste from first
				const newOtp = [
					...pastedDigits,
					...Array(4 - pastedDigits.length).fill(''),
				];
				setOtp(newOtp);
				const focusIndex = Math.min(pastedDigits.length - 1, 3);
				document.getElementById(`otp-${focusIndex}`)?.focus();
			} else {
				// Some fields are filled, paste from next position after last filled
				const startIndex = lastFilledIndex + 1;
				const availableSlots = 4 - startIndex;

				// Only paste if there's room for all digits
				if (pastedDigits.length <= availableSlots) {
					const newOtp = [...otp];
					pastedDigits.forEach((digit, i) => {
						if (startIndex + i < 4) {
							newOtp[startIndex + i] = digit;
						}
					});
					setOtp(newOtp);
					const focusIndex = Math.min(startIndex + pastedDigits.length - 1, 3);
					document.getElementById(`otp-${focusIndex}`)?.focus();
				}
			}
		}
	};

	const { setToken, setUser } = useStorage();

	const handleOtpSubmit = async () => {
		setError('');

		const otpValue = otp.join('');
		if (otpValue.length !== 4) {
			setError('Please enter the complete 4-digit code');
			return;
		}

		setIsLoading(true);
		const res = await AuthService.verifyOtp({ phone, otp: otp.join('') });
		if (res.success || res.status) {
			// Handle both success formats just in case
			const token = res.token;
			const userData = res.results || res.user;

			setToken(token);
			setUser(userData);

			if (loginType?.toLowerCase() !== 'login') {
				// For new registrations, show profile details modal
				setShowProfileModal(true);
			} else {
				onClose();
			}
		} else {
			setError(res.message);
		}

		setIsLoading(false);
	};

	const handleResendOtp = async () => {
		if (resendTimer > 0) return;

		setError('');
		setIsLoading(true);
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsLoading(false);
		setResendTimer(60);
		setOtp(['', '', '', '']);

		const successMsg = document.createElement('div');
		successMsg.style.cssText =
			'position: fixed; top: 20px; right: 20px; background: linear-gradient(to right, #9333ea, #f97316); color: white; padding: 12px 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 10000; font-weight: 500;';
		successMsg.textContent = 'Verification code sent!';
		document.body.appendChild(successMsg);
		setTimeout(() => successMsg.remove(), 3000);
	};

	const handlePhoneKeyPress = e => {
		if (e.key === 'Enter') handlePhoneSubmit();
	};

	const formatPhoneDisplay = value => {
		const cleaned = value.replace(/\D/g, '');
		if (cleaned.length <= 3) return cleaned;
		if (cleaned.length <= 6)
			return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
		return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
			6,
			10
		)}`;
	};

	const handlePhoneChange = e => {
		const value = e.target.value.replace(/\D/g, '');
		if (value.length <= 10) setPhone(value);
	};

	const handlePhonePaste = e => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text');
		const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 10);
		if (digitsOnly) setPhone(digitsOnly);
	};

	if (!isOpen) return null;

	return (
		<>
			<div className={styles.backdrop} onClick={onClose} />

			<div className={styles.modalContainer}>
				<div className={styles.modal} onClick={e => e.stopPropagation()}>
					<div className={styles.topBorder}></div>

					<button onClick={onClose} className={styles.closeButton}>
						<svg
							className={styles.closeIcon}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					<div className={styles.content}>
						{step === 'login' ? (
							<>
								<div className={styles.headerSection}>
									<div className={styles.iconContainer}>
										<div className={styles.iconGlow}></div>
										<div className={styles.icon}>
											<svg
												className={styles.iconSvg}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
												/>
											</svg>
										</div>
									</div>
									<h2 className={styles.title}>Welcome to DivinIQ</h2>
									<p className={styles.subtitle}>
										Sign in with your mobile number
									</p>
								</div>

								<div>
									<label className={styles.label}>Mobile Number</label>
									<div className={styles.inputWrapper}>
										<span className={styles.phonePrefix}>+91</span>
										<input
											type="tel"
											value={formatPhoneDisplay(phone)}
											onChange={handlePhoneChange}
											onKeyDown={handlePhoneKeyPress}
											onPaste={handlePhonePaste}
											placeholder="000 000 0000"
											className={styles.input}
											disabled={isLoading}
										/>
										<svg
											className={styles.inputIcon}
											width="20"
											height="20"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
									</div>

									<div className={styles.checkboxWrapper}>
										<input
											type="checkbox"
											id="terms"
											checked={agreedToTerms}
											onChange={e => setAgreedToTerms(e.target.checked)}
											className={styles.checkbox}
											disabled={isLoading}
										/>
										<label htmlFor="terms" className={styles.checkboxLabel}>
											I accept the{' '}
											<a href="/terms_of_use" className={styles.link}>
												Terms of Service
											</a>{' '}
											&{' '}
											<a href="/privacy_policy" className={styles.link}>
												Privacy Policy
											</a>
										</label>
									</div>

									{error && <div className={styles.error}>{error}</div>}

									<button
										onClick={handlePhoneSubmit}
										disabled={isLoading}
										className={styles.button}
									>
										{isLoading ? (
											<>
												<div className={styles.spinner}></div>
												Sending Code...
											</>
										) : (
											<>
												Continue
												<svg
													className={styles.buttonIcon}
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M13 7l5 5m0 0l-5 5m5-5H6"
													/>
												</svg>
											</>
										)}
									</button>
								</div>
							</>
						) : (
							<>
								<div className={styles.headerSection}>
									<div className={styles.iconContainer}>
										<div className={styles.iconGlow}></div>
										<div className={styles.icon}>
											<svg
												className={styles.iconSvg}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</div>
									</div>
									<h2 className={styles.title}>Verify Your Number</h2>
									<p className={`${styles.subtitle} ${styles.subtitleSpacing}`}>
										Code sent to
									</p>
									<p className={styles.phoneDisplay}>
										+91 {formatPhoneDisplay(phone)}
									</p>
									<button
										onClick={() => setStep('login')}
										className={`${styles.link} ${styles.changeNumberBtn}`}
									>
										Change Number
									</button>
								</div>

								<div>
									<label className={`${styles.label} ${styles.labelCenter}`}>
										Enter Verification Code
									</label>
									<div className={styles.otpContainer}>
										{otp.map((digit, index) => (
											<input
												key={index}
												id={`otp-${index}`}
												type="text"
												inputMode="numeric"
												maxLength={1}
												value={digit}
												onChange={e => handleOtpChange(index, e.target.value)}
												onKeyDown={e => handleOtpKeyDown(index, e)}
												onPaste={index === 0 ? handleOtpPaste : undefined}
												className={styles.otpInput}
												disabled={isLoading}
											/>
										))}
									</div>

									{error && (
										<div className={`${styles.error} ${styles.errorCenter}`}>
											{error}
										</div>
									)}

									<button
										onClick={handleOtpSubmit}
										disabled={isLoading}
										className={styles.button}
									>
										{isLoading ? (
											<>
												<div className={styles.spinner}></div>
												Verifying...
											</>
										) : (
											<>
												Verify & Sign In
												<svg
													className={styles.buttonIcon}
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</>
										)}
									</button>

									<div className={`${styles.footer} ${styles.footerMt}`}>
										Didn't receive the code?{' '}
										{resendTimer > 0 ? (
											<span className={styles.resendTimer}>{resendTimer}s</span>
										) : (
											<button
												onClick={handleResendOtp}
												disabled={isLoading}
												className={`${styles.link} ${styles.resendBtn}`}
											>
												Resend Code
											</button>
										)}
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Profile Details Modal for new registrations */}
			<ProfileDetailsModal
				isOpen={showProfileModal}
				onClose={() => {
					setShowProfileModal(false);
					onClose();
				}}
				userData={{ phone, country_code: '91' }}
			/>
		</>
	);
};

export default LoginOTPModal;