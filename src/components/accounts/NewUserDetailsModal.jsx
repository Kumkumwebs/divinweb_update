import { useState } from 'react';
import { useStorage } from '../../context/StorageContext';
import AuthService from '../../services/authServices';
// Reusing the same CSS module as ProfileDetailsModal so styling stays consistent.
// If you'd rather keep this fully separate, copy ProfileDetailsModal.module.css
// to NewUserDetailsModal.module.css and update this import.
import styles from './ProfileDetailsModal.module.css';

/**
 * NewUserDetailsModal — shown ONLY right after OTP verification for a
 * brand-new user (loginType !== "login"). Collects just Name + Email,
 * saves them via AuthService.updateProfile, then closes.
 *
 * Existing/old users who already completed their profile skip this
 * entirely — the parent (LoginOTPModel) never sets isOpen=true for them.
 *
 * Props:
 *  - isOpen    boolean
 *  - onClose   fn — called after successful save (or if you allow skipping)
 *  - userData  { phone, country_code } — needed to identify the account
 */
const NewUserDetailsModal = ({ isOpen, onClose, userData }) => {
	const { user, setUser } = useStorage();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const [profile, setProfile] = useState({
		name: '',
		email: '',
	});
	const [errors, setErrors] = useState({});

	const validateForm = () => {
		const newErrors = {};

		if (!profile.name.trim()) {
			newErrors.name = 'Name is required';
		} else if (profile.name.trim().length < 3) {
			newErrors.name = 'Name must be at least 3 characters';
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!profile.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!emailRegex.test(profile.email)) {
			newErrors.email = 'Please enter a valid email address';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProfile((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const handleSubmit = async () => {
		setError('');
		setSuccessMessage('');

		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const response = await AuthService.updateProfile(
				{
					number: userData?.phone || user?.phone,
					country_code: userData?.country_code || user?.country_code || '91',
				},
				{
					name: profile.name,
					email: profile.email,
				}
			);

			if (response.success) {
				setSuccessMessage(response.message || 'Details saved successfully!');

				// Keep local user context in sync so the header/greeting
				// updates immediately without a refetch.
				setUser({ ...user, name: profile.name, email: profile.email });

				setTimeout(() => {
					onClose && onClose();
				}, 1200);
			} else {
				setError(response.message || 'Failed to save details');
			}
		} catch (err) {
			setError('Failed to save details. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<>
			<div className={styles.backdrop} />

			<div className={styles.modalContainer}>
				<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
					<div className={styles.topBorder}></div>

					<div className={styles.content}>
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
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</div>
							</div>
							<h2 className={styles.title}>Welcome! Just a couple of details</h2>
							<p className={styles.subtitle}>Tell us your name and email to finish signing up</p>
						</div>

						{error && <div className={styles.error}>{error}</div>}
						{successMessage && (
							<div className={styles.success}>{successMessage}</div>
						)}

						<div className={styles.formGrid}>
							{/* Name */}
							<div className={styles.formGroup}>
								<label className={styles.label}>
									Name <span className={styles.required}>*</span>
								</label>
								<input
									type="text"
									name="name"
									value={profile.name}
									onChange={handleInputChange}
									className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
									placeholder="Enter your name"
									disabled={isLoading}
								/>
								{errors.name && (
									<span className={styles.fieldError}>{errors.name}</span>
								)}
							</div>

							{/* Email */}
							<div className={styles.formGroup}>
								<label className={styles.label}>
									Email <span className={styles.required}>*</span>
								</label>
								<input
									type="email"
									name="email"
									value={profile.email}
									onChange={handleInputChange}
									className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
									placeholder="Enter your email"
									disabled={isLoading}
								/>
								{errors.email && (
									<span className={styles.fieldError}>{errors.email}</span>
								)}
							</div>
						</div>

						<button
							className={styles.submitButton}
							onClick={handleSubmit}
							disabled={isLoading}
							style={{
								background: 'linear-gradient(135deg, #BA473D 0%, #5B1625 100%)',
								border: 'none',
								color: '#fff',
								boxShadow: isLoading ? 'none' : '0 4px 14px rgba(91, 22, 37, 0.28)',
								opacity: isLoading ? 0.55 : 1,
								cursor: isLoading ? 'not-allowed' : 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: '8px',
								width: '100%',
								padding: '16px',
								borderRadius: '12px',
								fontSize: '17px',
								fontWeight: 600,
								transition: 'all 0.3s ease',
							}}
						>
							{isLoading ? (
								<>
									<div className={styles.spinner}></div>
									Saving...
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
											d="M5 13l4 4L19 7"
										/>
									</svg>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewUserDetailsModal;