import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginOTPModal from '../accounts/LoginOTPModel';
import { useStorage } from '../../context/StorageContext';

import styles from './Header.module.css';

const Header = ({ onMenuToggle, onSideMenuToggle, onSearchToggle }) => {
	const location = useLocation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { user, isLoggedIn, clearStorage } = useStorage();
	const dropdownRef = useRef(null);
	const handleEmailClick = () => {
		window.open("mailto:support@diviniq.store", "_blank");
	};

	const handleWhatsappClick = () => {
		window.open(
			"https://wa.me/7311104569?text=Hello%20I%20am%20interested",
			"_blank"
		);
	};
	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogoutClick = () => {
		setIsDropdownOpen(false);
		setShowLogoutConfirm(true);
	};

	const handleLogoutConfirm = () => {
		clearStorage();
		setShowLogoutConfirm(false);
		window.location.href = '/';
	};

	const handleLogoutCancel = () => {
		setShowLogoutConfirm(false);
	};

	const getUserInitial = name => {
		return name ? name.charAt(0).toUpperCase() : 'U';
	};

	const fixImageUrl = (url) => {
		if (!url) return "";
		return url.replace(/&#x2F;/g, "/");
	};


	return (
		<>
			<header className="th-header header-layout1">
				<div className="sticky-wrapper">
					{/* Main Menu Area */}
					<div className="menu-area">
						<div className="container th-container">
							<div className="row align-items-center justify-content-between flex-nowrap">
								<div className="col-auto">
									<div className="header-logo">
										<Link to="/">
											<img src="/assets/img/logo123.svg" alt="DivinIQ" />
										</Link>
									</div>
								</div>
								<div className="col-auto me-xl-auto">
									<nav className="main-menu d-none d-xl-inline-block">
										<ul>
											<li className="">
												<Link
													className={location.pathname === '/' ? 'active' : ''}
													to="/"
												>
													Home
												</Link>
											</li>
											<li>
												<Link to="/about_us">About Us</Link>
											</li>
											<li>
												<Link to="/puja">Puja</Link>
											</li>
											<li>
												<Link to="/chadhava">Chadhava</Link>
											</li>
											<li>
												<Link to="/astrologer">Consult With Astrologer</Link>
											</li>
											<li>
												<Link to="/panchang">Panchang</Link>
											</li>

											<li>
												<Link to="/astrology_calculator_hub">
													Astrology Tools
												</Link>
											</li>
										</ul>
									</nav>
									<button
										type="button"
										className="th-menu-toggle d-block d-xl-none"
										onClick={onMenuToggle}
									>
										<i className="far fa-bars"></i>
									</button>
								</div>
								<div className="col-auto">
									<div className="header-button">
										{isLoggedIn && user ? (
											<div className={styles.userMenu} ref={dropdownRef}>
												<button
													className={styles.userBtn}
													onClick={() => setIsDropdownOpen(!isDropdownOpen)}
												>
													{user.profile_img ? (
														<img src={fixImageUrl(user.profile_img)} alt="User" />
													) : (
														<span className={styles.userInitial}>
															{getUserInitial(user.name)}
														</span>
													)}
												</button>

												{isDropdownOpen && (
													<div className={styles.dropdown}>
														<div className={styles.userInfo}>
															<p className={styles.userName}>
																{user.name || 'User'}
															</p>
															<p className={styles.userPhone}>
																{user.number || user.phone}
															</p>
														</div>

														<div className={styles.menuList}>
															<Link
																to="/profile"
																className={styles.menuItem}
																onClick={() => setIsDropdownOpen(false)}
															>
																<div className={styles.menuItemLeft}>
																	<i
																		className={`fas fa-user ${styles.menuIcon}`}
																	></i>
																	My profile
																</div>
																<i
																	className={`fas fa-chevron-right ${styles.chevron}`}
																></i>
															</Link>

															<Link
																to="/my_puja_booking"
																className={styles.menuItem}
																onClick={() => setIsDropdownOpen(false)}
															>
																<div className={styles.menuItemLeft}>
																	<i
																		className={`fas fa-calendar-alt ${styles.menuIcon}`}
																	></i>
																	My Puja Bookings
																</div>
																<i
																	className={`fas fa-chevron-right ${styles.chevron}`}
																></i>
															</Link>

															<Link
																to="/my_chadhava_booking"
																className={styles.menuItem}
																onClick={() => setIsDropdownOpen(false)}
															>
																<div className={styles.menuItemLeft}>
																	<i
																		className={`fas fa-hand-holding-heart ${styles.menuIcon}`}
																	></i>
																	My Chadhava Bookings
																</div>
																<i
																	className={`fas fa-chevron-right ${styles.chevron}`}
																></i>
															</Link>

															<Link
																to="/puja"
																className={styles.menuItem}
																onClick={() => setIsDropdownOpen(false)}
															>
																<div className={styles.menuItemLeft}>
																	<i
																		className={`fas fa-om ${styles.menuIcon}`}
																	></i>
																	Book a Puja
																</div>
																<div
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																	}}
																>
																	<span className={styles.badgeNew}>New</span>
																	<i
																		className={`fas fa-chevron-right ${styles.chevron}`}
																	></i>
																</div>
															</Link>

															<Link
																to="/chadhava"
																className={styles.menuItem}
																onClick={() => setIsDropdownOpen(false)}
															>
																<div className={styles.menuItemLeft}>
																	<i
																		className={`fas fa-gift ${styles.menuIcon}`}
																	></i>
																	Book a Chadhava
																</div>
																<div
																	style={{
																		display: 'flex',
																		alignItems: 'center',
																	}}
																>
																	<span className={styles.badgeNew}>New</span>
																	<i
																		className={`fas fa-chevron-right ${styles.chevron}`}
																	></i>
																</div>
															</Link>

															<Link
																to="/astrology_calculator_hub"
																className={styles.menuItem}
																onClick={() => setIsDropdownOpen(false)}
															>
																<div className={styles.menuItemLeft}>
																	<i
																		className={`fas fa-star ${styles.menuIcon}`}
																	></i>
																	Astro Tools
																</div>
																<i
																	className={`fas fa-chevron-right ${styles.chevron}`}
																></i>
															</Link>
														</div>

														{/* Help Section */}
														<div className={styles.helpSection}>
															<p className={styles.helpTitle}>Help & Support</p>
															<div className={styles.supportBox}>
																<div className={styles.supportRow}>
																	<span>+91 7311104569</span>
																	<p className={styles.supportTime}>Available: 10:30 AM - 7:30 PM</p>
																</div>
																<i className="fas fa-headset" style={{ color: '#f37335', fontSize: '1.2rem' }}></i>
															</div>
															<div className={styles.contactBtns}>
																<button className={styles.contactBtn} onClick={handleEmailClick}>
																	<i className="fas fa-envelope"></i>
																	Email
																</button>
																<button className={styles.contactBtn} onClick={handleWhatsappClick}>
																	<i className="fab fa-whatsapp"></i>
																	Whatsapp
																</button>
															</div>
														</div>

														<div className={styles.logoutSection}>
															<button
																onClick={handleLogoutClick}
																className={styles.logoutBtn}
															>
																<i className="fas fa-sign-out-alt"></i>
																Is Not You? Logout
															</button>
														</div>
													</div>
												)}
											</div>
										) : (
											<button
												onClick={() => setIsModalOpen(true)}
												className="th-btn style3 rounded-circle p-0 d-flex align-items-center justify-content-center"
												style={{
													width: '45px',
													height: '45px',
													borderRadius: '50%',
												}}
											>
												<img
													src="/assets/img/icon/user.svg"
													alt="Login"
													style={{ width: '20px', height: '20px' }}
												/>
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
						<div
							className="logo-bg"
							style={{
								maskImage: `url(/assets/img/logo_bg_mask.png)`,
							}}
						></div>
					</div>
				</div>
			</header>

			{/* Login Modal */}
			<LoginOTPModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			{/* Logout Confirmation Modal */}
			{showLogoutConfirm && (
				<div className={styles.modalOverlay}>
					<div className={styles.modalContent}>
						<h3 className={styles.modalTitle}>Confirm Logout</h3>
						<p className={styles.modalText}>
							Are you sure you want to log out?
						</p>
						<div className={styles.modalActions}>
							<button className={styles.btnCancel} onClick={handleLogoutCancel}>
								Cancel
							</button>
							<button
								className={styles.btnConfirm}
								onClick={handleLogoutConfirm}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Header;
