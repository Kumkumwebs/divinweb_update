import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import UserDetailsModal from "../common/ChadhavaUserDetailsModel";
import ScrollToTop from "./ScrollToTop";
import Footer from "../layout/Footer";
import SideMenu from "../layout/SideMenu";
import PopupSearch from "../layout/PopupSearch";
import MobileMenu from "../layout/MobileMenu";
import Header from "../layout/Header";
import apiService from "../../services/apiServices";
import { useStorage } from '../../context/StorageContext';

const ChadhavaCartPage = () => {
	const navigate = useNavigate();
	const [paymentMode, setPaymentMode] = useState("razorpay");
	const [errorMessage, seterrorMessage] = useState("");
	const {
		devoteeDetails: contextDevoteeDetails,
		setDevoteeDetails,
		activeChadhavaId: contextActiveChadhavaId,
		setActiveChadhavaId,
	} = useStorage();

	// --- States ---
	const [showSideMenu, setShowSideMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showSearch, setShowSearch] = useState(false);

	const [cartResponse, setCartResponse] = useState(null);
	const [mergedCart, setMergedCart] = useState([]);
	const [userDetails, setUserDetails] = useState(
		contextDevoteeDetails || { name: '', whatsapp: '' }
	);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [bookingStatus, setBookingStatus] = useState(null);

	// --- Coupon States ---
	const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
	const [couponCode, setCouponCode] = useState('');
	const [appliedDiscount, setAppliedDiscount] = useState(0);

	const fetchCartFromServer = useCallback(async () => {
		try {
			const response = await apiService.postBearer('https://admin.diviniq.in/puja/getChadhavaCart', {});
			if (response && response.status === true && response.data.length > 0) {
				const rawData = response.data[0];
				setCartResponse(rawData);
				const masterAddons = rawData.chadhava_id.addons || [];
				const masterPrasad = rawData.chadhava_id.prasad || [];

				const addons = (rawData.addons_selected || []).map(sel => {
					const d = masterAddons.find(m => m._id === sel.addon_id);
					return {
						...sel,
						type: 'addon',
						name: d?.pname,
						image: d?.pimage,
						price: d?.pamount,
					};
				});

				const prasads = (rawData.prasad_selected || []).map(sel => {
					const d = masterPrasad.find(m => m._id === sel.prasad_id);
					return {
						...sel,
						type: 'prasad',
						name: d?.name,
						image: d?.image,
						price: d?.amount,
					};
				});

				setMergedCart([...addons, ...prasads]);
				setActiveChadhavaId(rawData.chadhava_id._id);
			} else {
				setCartResponse(null);
				setMergedCart([]);
			}
		} catch (error) {
			console.error('Cart fetch error:', error);
		}
	}, []);
	const loadRazorpay = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};
	const styles = {
		label: { fontSize: '0.65rem', letterSpacing: '0.5px' },
		value: { fontSize: '0.8rem' },
		helper: { fontSize: '0.7rem' },
	};
	useEffect(() => {
		fetchCartFromServer();
		if (contextDevoteeDetails?.name) setUserDetails(contextDevoteeDetails);
	}, [fetchCartFromServer]);

	const handleQtyChange = async (item, delta) => {
		const newQty = (item.qty || 0) + delta;
		if (newQty < 0) return;
		const tempCart = mergedCart
			.map(i => {
				const isTarget =
					i.type === 'addon'
						? i.addon_id === item.addon_id
						: i.prasad_id === item.prasad_id;
				return isTarget ? { ...i, qty: newQty } : i;
			})
			.filter(i => i.qty > 0);
		setMergedCart(tempCart);
		try {
			const payload = {
				chadhava_id: contextActiveChadhavaId,
				addons_selected: tempCart
					.filter(i => i.type === 'addon')
					.map(i => ({ addon_id: i.addon_id, qty: i.qty })),
				prasad_selected: tempCart
					.filter(i => i.type === 'prasad')
					.map(i => ({ prasad_id: i.prasad_id, qty: i.qty })),
			};
			const res = await apiService.postBearer(
				'https://admin.diviniq.in/puja/ChadhavaaddToCart',
				payload
			);
			if (res && res.status) fetchCartFromServer();
		} catch (e) {
			fetchCartFromServer();
		}
	};

	const handlePayNow = async () => {
		if (!userDetails.name) return setIsEditModalOpen(true);
		setBookingStatus('pending');
		try {
			const payload = {
				payment_mode: paymentMode,
				userDetails: { name: userDetails.name },
			};
			const res = await apiService.postBearer(
				'https://admin.diviniq.in/puja/createChadhavaBooking',
				payload
			);
			if (res && res.status === true) {
				if (paymentMode === 'razorpay') {
					const razorpayLoaded = await loadRazorpay();
					if (!razorpayLoaded) {
						alert("Razorpay SDK failed to load");
						return;
					}
					const options = {
						key: "rzp_live_S1mko1CFcilo1s", // replace with your Razorpay Key
						amount: response.amount,
						currency: "INR",
						name: "DivinIQ",
						description: "Puja Booking Payment",
						order_id: response.orderId,
						handler: function (response1) {
							// console.log("Payment Success:", response1);
							// Verify payment on backend
							// Call every 3 seconds until success
							const interval = setInterval(verifyPayment, 3000);

							// Stop polling after success
							if (status === "Success") clearInterval(interval);
							verifyPayment(response.orderId);
						},
						prefill: {
							name: formData.participantName,
							contact: formData.whatsapp,
						},
						theme: {
							color: "#FCD417",
						},
					};

					const rzp = new window.Razorpay(options);
					rzp.open();
					// Redirect to Razorpay Checkout
					return
				}
				// For other payment modes, directly show success
				else {
					setBookingStatus('success');
					
				}
			} else {
				setBookingStatus('failed');
			}
		} catch (e) {
			setBookingStatus('failed');
		}
	};
	const verifyPayment = async (paymentResponse) => {
		const res = await fetch(`puja/chadhava_payment_status/${paymentResponse}`, {
			method: 'GET',
		});
		const data = await res.json();

		if (data.payment_status === "Success") {
			setBookingStatus('success');
		}

		if (data.payment_status === "Failed") {
			setBookingStatus('failed');
		}
	};


	const applyCoupon = () => {
		if (couponCode.toUpperCase() === 'FIRST100') {
			setAppliedDiscount(100);
			setIsCouponModalOpen(false);
		} else {
			alert('Invalid Coupon Code');
		}
	};

	const closeStatusModal = () => {
		if (bookingStatus === 'success') navigate('/');
		setBookingStatus(null);
	};

	// --- Sub-Components ---
	const StatusModal = ({ status, onClose, desc="Unable to process payment. Please try again." }) => {
		if (!status) return null;
		const config = {
			pending: {
				icon: 'fas fa-spinner fa-spin',
				title: 'Confirming Sankalp',
				desc: 'Connecting with the temple server...',
				color: '#f59e0b',
			},
			success: {
				icon: 'fas fa-check-circle',
				title: 'Offering Accepted!',
				desc: 'Your Sankalp has been registered successfully.',
				color: '#0b845c',
				btn: 'Done',
			},
			failed: {
				icon: 'fas fa-times-circle',
				title: 'Transaction Failed',
				desc: desc,
				color: '#ef4444',
				btn: 'Retry',
			},
		};
		const current = config[status];
		return (
			<div className="diviniq-modal-overlay">
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="diviniq-modal-card text-center"
				>
					<div
						className="mb-4"
						style={{ fontSize: '50px', color: current.color }}
					>
						<i className={current.icon}></i>
					</div>
					<h3 className="fw-bold mb-2">{current.title}</h3>
					<p className="text-muted mb-4">{current.desc}</p>
					{current.btn && (
						<button
							className="th-btn w-100"
							style={{ background: current.color }}
							onClick={onClose}
						>
							{current.btn}
						</button>
					)}
				</motion.div>
			</div>
		);
	};

	const EmptyCartView = () => (
		<div className="text-center py-100">
			<div className="sacred-bowl-icon mb-4">
				<i className="fas fa-om fa-3x text-theme"></i>
			</div>
			<h2 className="fw-bold mb-3">Your Offering Bowl is Empty</h2>
			<p className="text-muted mb-4">
				Add sacred sevas and prasad to begin your spiritual journey.
			</p>
			<Link to="/puja-listing" className="th-btn rounded-pill">
				Explore Sevas
			</Link>
		</div>
	);

	const subtotal = cartResponse?.grand_total || 0;
	const totalAmount = subtotal - appliedDiscount + 10;

	return (
		<div className="main-wrapper bg-white">
			<ScrollToTop />
			<Header
				onMenuToggle={() => setShowMobileMenu(true)}
				onSideMenuToggle={() => setShowSideMenu(true)}
				onSearchToggle={() => setShowSearch(true)}
			/>

			<div
				className="breadcumb-wrapper"
				style={{ background: '#0f172a', padding: '40px 0' }}
			>
				<div className="container text-center">
					<h2 className="breadcumb-title text-white mb-0">
						Sacred <span className="text-theme">Checkout</span>
					</h2>
				</div>
			</div>

			<div className="container py-50">
				{!cartResponse || mergedCart.length === 0 ? (
					<EmptyCartView />
				) : (
					<div className="row g-4">
						<div className="col-lg-8">
							{/* Devotee Info */}
							<div className="d-flex justify-content-between align-items-center p-4 bg-light rounded-20 mb-30 border border-dashed border-theme">
								<div className="d-flex align-items-center">
									<div className="bg-white p-3 rounded-circle shadow-sm me-3">
										<i className="fas fa-user text-theme"></i>
									</div>
									<div>
										<span className="text-theme small fw-bold uppercase d-block">
											// Devotee Details
										</span>
										<h5 className="mb-0 fw-bold">{userDetails.name}</h5>
									</div>
								</div>
								<button
									className="th-btn style3 py-2 px-4 rounded-pill"
									onClick={() => setIsEditModalOpen(true)}
								>
									Change
								</button>
							</div>

							{/* Offerings List */}
							<h5 className="fw-bold mb-20">Your Offerings</h5>
							<div className="bg-white p-4 rounded-20 shadow-sm border border-light mb-4">
								<div className="d-flex align-items-center">
									<img
										src={cartResponse.chadhava_id.chadhavaImage}
										width="80"
										className="rounded-15"
										alt=""
									/>
									<div className="ms-4 flex-grow-1">
										<h6 className="mb-1 fw-bold">
											{cartResponse.chadhava_id.title}
										</h6>
										<span className="badge bg-warning-subtle text-warning px-3 rounded-pill">
											Primary Offering
										</span>
									</div>
									<div className="fw-bold text-dark">
										₹{cartResponse.total_chadhava_amount}
									</div>
								</div>
							</div>

							{mergedCart.map((item, idx) => (
								<div
									key={idx}
									className="bg-white p-3 rounded-20 shadow-sm border border-light mb-3 d-flex align-items-center"
								>
									<img
										src={item.image}
										alt=""
										className="rounded-15"
										style={{
											width: '60px',
											height: '60px',
											objectFit: 'cover',
										}}
									/>
									<div className="ms-3 flex-grow-1">
										<h6 className="mb-0 fw-bold">{item.name}</h6>
										<div className="d-flex align-items-center gap-2">
											<span className="text-theme fw-bold">₹{item.price}</span>
											<span className="text-muted small">
												| {item.type.toUpperCase()}
											</span>
										</div>
									</div>
									<div className="qty-stepper-modern d-flex align-items-center bg-light rounded-pill px-2">
										<button
											className="btn btn-sm"
											onClick={() => handleQtyChange(item, -1)}
										>
											−
										</button>
										<span className="px-3 fw-bold">{item.qty}</span>
										<button
											className="btn btn-sm"
											onClick={() => handleQtyChange(item, 1)}
										>
											+
										</button>
									</div>
								</div>
							))}

							{/* Coupon Trigger */}
							<div
								className="mt-4 p-4 rounded-20 border border-dashed border-muted bg-light d-flex justify-content-between align-items-center cursor-pointer"
								onClick={() => setIsCouponModalOpen(true)}
								style={{ cursor: 'pointer' }}
							>
								<div className="d-flex align-items-center">
									<i className="fas fa-percentage text-theme me-3 fs-4"></i>
									<div>
										<h6 className="mb-0 fw-bold">
											{appliedDiscount > 0
												? `Code FIRST100 Applied`
												: 'Apply Coupon Code'}
										</h6>
										<p className="text-muted small mb-0">
											Save more on your sacred offerings
										</p>
									</div>
								</div>
								<i className="fas fa-chevron-right text-muted"></i>
							</div>
						</div>

						<div className="col-lg-4">
							<div className="sticky-top" style={{ top: '100px' }}>
								<div className="bg-white p-4 rounded-20 shadow-lg border-top border-4 border-theme">
									<h5 className="fw-bold mb-30">Billing Estimation</h5>
									<div className="d-flex justify-content-between mb-3 text-muted">
										<span>Subtotal</span>
										<span>₹{subtotal}</span>
									</div>
									<div className="d-flex justify-content-between mb-3 text-muted">
										<span>Platform Fee</span>
										<span>₹10</span>
									</div>
									{appliedDiscount > 0 && (
										<div className="d-flex justify-content-between mb-3 text-success fw-bold">
											<span>Coupon Discount</span>
											<span>-₹{appliedDiscount}</span>
										</div>
									)}
									<div className="border-top pt-4 mt-4">
										<div className="d-flex justify-content-between align-items-center">
											<h4 className="fw-bold mb-0">Total Pay</h4>
											<h3 className="fw-bold text-theme mb-0">
												₹{totalAmount}
											</h3>
										</div>
									</div>
									<div className="bg-white rounded-20 p-2 border mt-20">
										<label className="text-theme fw-bold text-uppercase d-block mb-2" style={styles.label}>
											Select Payment Mode
										</label>

										<div className="form-check mb-1">
											<input className="form-check-input" type="radio" name="paymentMode" id="onlinePay"
												checked={paymentMode === "razorpay"} onChange={() => setPaymentMode("razorpay")} />
											<label className="form-check-label fw-bold" htmlFor="onlinePay" style={styles.value}>
												Online Payment (UPI / Card)
											</label>
										</div>

										<div className="form-check">
											<input className="form-check-input" type="radio" name="paymentMode" id="walletPay"
												checked={paymentMode === "wallet"} onChange={() => setPaymentMode("wallet")} />
											<label className="form-check-label fw-bold" htmlFor="walletPay" style={styles.value}>
												DivinIQ Wallet <span className="text-theme ms-2">₹0.0</span>
											</label>
										</div>
									</div>
									<button
										className="th-btn w-100 mt-4 py-3 rounded-pill"
										onClick={handlePayNow}
									>
										Proceed to Pay <i className="fas fa-lock ms-2"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* --- Modals --- */}
			<StatusModal status={bookingStatus} desc="" onClose={closeStatusModal} />
			<UserDetailsModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					fetchCartFromServer();
				}}
				cart={mergedCart}
			/>

			{/* --- Coupon Modal --- */}
			<AnimatePresence>
				{isCouponModalOpen && (
					<div
						className="diviniq-modal-overlay"
						onClick={() => setIsCouponModalOpen(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="diviniq-modal-card p-4"
							onClick={e => e.stopPropagation()}
						>
							<div className="modal-accent-line mx-auto mb-3"></div>
							<h4 className="fw-bold text-center mb-4">Apply Coupon</h4>
							<div className="form-group mb-4">
								<input
									type="text"
									className="form-control text-center py-3 rounded-pill"
									placeholder="Enter Code (e.g. FIRST100)"
									value={couponCode}
									onChange={e => setCouponInput(e.target.value)}
								/>
							</div>
							<button
								className="th-btn w-100 rounded-pill"
								onClick={applyCoupon}
							>
								Apply Code
							</button>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			<Footer />
		</div>
	);
};

export default ChadhavaCartPage;