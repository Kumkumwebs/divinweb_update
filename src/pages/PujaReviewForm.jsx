import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import OrderConfirmationModal from "../components/common/pujaCnfirmDetailsModel";
import { useStorage } from "../context/StorageContext";
import SideMenu from "../components/layout/SideMenu";
import PopupSearch from "../components/layout/PopupSearch";
import MobileMenu from "../components/layout/MobileMenu";
import "../components/sections/Chadhavacartpage.css";

/* ── Razorpay loader ── */



	const submitToPayU = (payuUrl, params) => {
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
	};

/* ══════════════════════════════════════════════
   STATUS MODAL
══════════════════════════════════════════════ */
const StatusModal = ({ status, onClose }) => {
	if (!status) return null;

	const config = {
		pending: {
			icon: "fas fa-fire",
			title: "Confirming Sankalp",
			desc: "Connecting with the temple server\nand registering your names...",
			color: "#F5A623",
			ring: true,
			btn: null,
		},
		success: {
			icon: "fas fa-check",
			title: "Offering Accepted!",
			desc: "Your Sankalp has been registered\nsuccessfully. May you be blessed. 🙏",
			color: "#0b845c",
			btn: "View Bookings",
		},
		failed: {
			icon: "fas fa-times",
			title: "Booking Failed",
			desc: "Something went wrong while\ncommunicating with the temple.\nPlease try again.",
			color: "#B33A3A",
			btn: "Go Back & Retry",
		},
	};

	const current = config[status];

	return (
		<AnimatePresence>
			<div
				className="diviniq-modal-overlay"
				onClick={status !== "pending" ? onClose : undefined}
			>
				<motion.div
					initial={{ y: 50, opacity: 0, scale: 0.95 }}
					animate={{ y: 0, opacity: 1, scale: 1 }}
					exit={{ y: 50, opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
					onClick={(e) => e.stopPropagation()}
					className="diviniq-modal-card text-center"
				>
					{(status === "success" || status === "failed" || status === "pending") && (
						<div className="diviniq-hang-diyas">
							<img
								src="/assets/img/chadawa_detail/diya_chadhawa.png"
								alt=""
								className="diviniq-diya diviniq-diya-1"
							/>
							<img
								src="/assets/img/chadawa_detail/diya_chadhawa.png"
								alt=""
								className="diviniq-diya diviniq-diya-2"
							/>
						</div>
					)}

					{status !== "pending" && (
						<button className="diviniq-close-btn" onClick={onClose} aria-label="Close">
							<i className="fas fa-times"></i>
						</button>
					)}

					<div className="diviniq-badge-wrap">
						<div className="diviniq-mandala" />
						<div
							className="diviniq-icon-wrap"
							style={{ borderColor: current.color, color: current.color }}
						>
							{current.ring && (
								<motion.div
									className="diviniq-icon-ring"
									animate={{ rotate: 360 }}
									transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
								/>
							)}
							<i className={current.icon} style={{ fontSize: "30px" }}></i>
						</div>
					</div>

					<h3 className="diviniq-title">{current.title}</h3>

					<div className="diviniq-lotus-divider">
						<span className="line" />
						<i className="fas fa-spa"></i>
						<span className="line" />
					</div>

					<p className="diviniq-desc" style={{ whiteSpace: "pre-line" }}>
						{current.desc}
					</p>

					{(status === "success" || status === "failed" || status === "pending") && (
						<img
							src="/assets/img/chadawa_detail/kalashchadawa.png"
							alt="Kalash offering"
							className="diviniq-kalash-img"
							onError={(e) => { e.target.style.display = "none"; }}
						/>
					)}

					{current.btn && (
						<button
							className="diviniq-btn"
							style={{ background: current.color }}
							onClick={onClose}
						>
							<span className="diviniq-btn-dots">
								<i className="fas fa-gem"></i>
							</span>
							{current.btn}
							<span className="diviniq-btn-dots">
								<i className="fas fa-gem"></i>
							</span>
						</button>
					)}
				</motion.div>
			</div>
		</AnimatePresence>
	);
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const PujaFillForm = () => {
	const { state } = useLocation();
	const navigate = useNavigate();
	const { devoteeDetails } = useStorage();
const pujaMasterData = state?.pujaData;
	const selectedPackage = state?.selectedPackage;

	const [cart, setCart] = useState(null);
	const [cartError, setCartError] = useState(false);
	const [pujaAddons, setPujaAddons] = useState([]);
	const [pujaHomeAddons, setPujaHomeAddons] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const [bookingStatus, setBookingStatus] = useState(null);
	const [walletBalance, setWalletBalance] = useState(0);
const [aashirwadOption, setAashirwadOption] = useState("Yes");
	const [showSideMenu, setShowSideMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [formData, setFormData] = useState({
		whatsapp: "",
		participantName: "",
		gotra: "",
		isGotraKnown: true,
		wantsAashirwad: "Yes",
		address: { pincode: "", city: "", state: "", houseNo: "", area: "", landmark: "" },
	});

	const pollIntervalRef = useRef(null);
	const stopPolling = () => { if (pollIntervalRef.current) { clearInterval(pollIntervalRef.current); pollIntervalRef.current = null; } };
	useEffect(() => () => stopPolling(), []);




	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await apiService.postBearer('https://admin.diviniq.in/puja/getPujaCart', {});
				if (res?.status && res.data) {
					setCart(res.data);
				} else {
					setCartError(true);
				}
			} catch (e) {
				console.error('Cart fetch error', e);
				setCartError(true);
			}
		};

		const fetchWallet = async () => {
			try {
				const res = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
				if (res?.status && res?.results) {
					setWalletBalance(Number(res.results.wallet || 0));
				}
			} catch (e) {
				console.error('Wallet fetch error', e);
			}
		};

		const fetchPujaAddons = async () => {
			const pujaId = pujaMasterData?._id || state?.pujaData?._id;
			if (!pujaId) return;
			try {
				const res = await apiService.postBearer(
					'https://admin.diviniq.in/puja/pujabyinstaid',
					{ instaId: pujaId }
				);
				if (res?.status && res?.data) {
					setPujaAddons(res.data.addons || []);
					setPujaHomeAddons(res.data.homeDeliveryAddons || []);
				}
			} catch (e) {
				console.error('Puja addons fetch error', e);
			}
		};

		fetchCart();
		fetchWallet();
		fetchPujaAddons();

		if (devoteeDetails?.whatsapp) {
			setFormData(prev => ({
				...prev,
				whatsapp: devoteeDetails.whatsapp,
				participantName: devoteeDetails.name || '',
			}));
		}
	}, [devoteeDetails]);
// Use fresh API-fetched addons, fallback to pujaMasterData
	const addonSource = pujaAddons.length > 0 ? pujaAddons : (pujaMasterData?.addons || []);
	const homeAddonSource = pujaHomeAddons.length > 0 ? pujaHomeAddons : (pujaMasterData?.homeDeliveryAddons || []);

	const templeAddons = (cart?.addons_selected || []).map((item) => {
		const details = addonSource.find((a) => a._id === item.addon_id);
		return {
			...item,
			pname: details?.pname || "Temple Addon",
			pimage: details?.pimage || "",
			pamount: Number(details?.pamount || 0),
			lineTotal: Number(details?.pamount || 0) * (item.qty || 1),
		};
	});

	const homeAddons = (cart?.home_addons_selected || []).map((item) => {
		const details = homeAddonSource.find((h) => h._id === item.addon_id);
		return {
			...item,
			pname: details?.pname || "Home Prasad",
			pimage: details?.pimage || "",
			pamount: Number(details?.pamount || 0),
			lineTotal: Number(details?.pamount || 0) * (item.qty || 1),
		};
	});
	const basePkgVal = Number(cart?.base_total ?? selectedPackage?.packagePrice ?? 0);
	const addonsVal = Number(cart?.addons_total ?? templeAddons.reduce((acc, item) => acc + (item.lineTotal || 0), 0));
	const homeAddonsVal = Number(cart?.home_addons_total ?? homeAddons.reduce((acc, item) => acc + (item.lineTotal || 0), 0));
	const discountVal = Number(cart?.discount || 0);
	const subtotalVal = Math.max(0, basePkgVal + addonsVal + homeAddonsVal - discountVal);
	const gstVal = Number((subtotalVal * 0.18).toFixed(2));
	const grandTotalVal = Number((subtotalVal + gstVal).toFixed(2));

	const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
	const handleAddressChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, address: { ...prev.address, [name]: value } })); };

	const handleProceed = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const payload = {
				puja_id: cart?.pujaDetails?.puja_id,
				package_id: cart?.package?.package_id,
				// preserve existing addons from cart
				addons_selected: cart?.addons_selected || [],
				home_addons_selected: cart?.home_addons_selected || [],
				is_home_delivery_required: formData.wantsAashirwad === "Yes",
				userDetails: {
					name: formData.participantName,
					whatsappNumber: formData.whatsapp,
					gotra: formData.isGotraKnown ? formData.gotra : "Kashyap (Generic)",
				},
				deliveryAddress: formData.wantsAashirwad === "Yes"
					? {
						pincode: formData.address.pincode,
						city: formData.address.city,
						state: formData.address.state,
						houseNumber: formData.address.houseNo,
						area: formData.address.area,
						landmark: formData.address.landmark,
					}
					: null,
			};
			const res = await apiService.postBearer("https://admin.diviniq.in/puja/pujaaddToCart", payload);
			if (res?.status) setIsConfirmModalOpen(true);
			else alert("Something went wrong. Please try again.");
		} catch (error) {
			console.error("Update Error", error);
			alert("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const startPolling = (orderId) => {
		stopPolling();
		pollIntervalRef.current = setInterval(async () => {
			try {
				const res = await fetch(`https://admin.diviniq.in/puja/payment_status/${orderId}`, { method: "GET" });
				const data = await res.json();
				if (data.payment_status === "Success") { stopPolling(); setBookingStatus("success"); }
				else if (data.payment_status === "Failed") { stopPolling(); setBookingStatus("failed"); }
			} catch (err) { console.error("Poll error:", err); }
		}, 3000);
	};


	const verifyPayuPayment = async (txnid) => {
		try {
			const res = await apiService.postBearer(
				"https://admin.diviniq.in/puja/payu_verify_puja_booking",
				{ txnid }
			);
			if (res && res.status === true) return "Success";
			if (res && res.status === false && res.message === "Payment not successful") return "Failed";
			return "Pending";
		} catch (e) {
			return "Pending";
		}
	};
 
	// ── Picks up the PayU redirect result on page load ──
	// After submitToPayU() navigates away, the backend's webhook sends
	// the browser back to this exact page URL with ?status=...&txnid=...
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const status = params.get("status");
		const txnid = params.get("txnid");
		if (!status || !txnid) return;
 
		setBookingStatus("pending");
 
		(async () => {
			const result = await verifyPayuPayment(txnid);
			if (result === "Success") {
				setBookingStatus("success");
			} else if (result === "Failed") {
				setBookingStatus("failed");
			} else {
				let attempts = 0;
				const retryInterval = setInterval(async () => {
					attempts += 1;
					const retryResult = await verifyPayuPayment(txnid);
					if (retryResult === "Success") {
						clearInterval(retryInterval);
						setBookingStatus("success");
					} else if (retryResult === "Failed" || attempts >= 5) {
						clearInterval(retryInterval);
						setBookingStatus("failed");
					}
				}, 3000);
			}
		})();
 
		// clear the query params so a refresh doesn't re-trigger this,
		// keeping the original route state (pujaData/selectedPackage) intact
		navigate(location.pathname, { replace: true, state });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
 
	const handleFinalSubmit = async (paymentMode) => {
		setIsConfirmModalOpen(false);
		setBookingStatus("pending");
		try {
			const isPayu = paymentMode === "payu";
			const endpoint = isPayu
				? "https://admin.diviniq.in/puja/bookpuja_payu"
				: "https://admin.diviniq.in/puja/bookpuja";
			const payload = isPayu ? { platform: "web" } : { payment_mode: paymentMode };
 
			const response = await apiService.postBearer(endpoint, payload);
 
			if (response?.status === true) {
				if (isPayu) {
					const { payu_url, params } = response.results || {};
					if (!payu_url || !params) {
						setBookingStatus("failed");
						return;
					}
					// Navigates this tab away to PayU entirely — nothing after
					// this line runs; booking status resumes on page reload via
					// the useEffect above once PayU redirects back here.
					submitToPayU(payu_url, params);
					return;
				}
				// wallet (or any other non-PayU mode) — direct success
				setBookingStatus("success");
			} else {
				setBookingStatus("failed");
			}
		} catch (e) { console.error("Booking Error:", e); setBookingStatus("failed"); }
	};

	const handleStatusClose = () => { if (bookingStatus === "success") navigate("/my_puja_booking"); else setBookingStatus(null); };

	if (!cart && !cartError) {
		return (
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 16 }}>
				<div style={{ width: 48, height: 48, border: "4px solid #f3f4f6", borderTopColor: "#9B1C1C", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
				<p style={{ color: "#6b7280", fontSize: 15 }}>Loading Sacred Form...</p>
				<style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
			</div>
		);
	}

	// Cart is null but no error means empty cart — redirect
	if (cart === null && cartError) {
		return (
			<div className="main-wrapper bg-light">
				<SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
				<PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
				<MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
				<Header
					onMenuToggle={() => setShowMobileMenu(true)}
					onSideMenuToggle={() => setShowSideMenu(true)}
					onSearchToggle={() => setShowSearch(true)}
				/>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center", padding: 24 }}>
					<i className="fas fa-shopping-cart" style={{ fontSize: 48, color: "#d1d5db" }} />
					<h4 style={{ color: "#111827" }}>Your cart is empty</h4>
					<p style={{ color: "#6b7280", maxWidth: 320 }}>Please go back and select a puja package to continue.</p>
					<button onClick={() => navigate("/puja")} style={{ padding: "12px 32px", background: "#9B1C1C", color: "#fff", border: "none", borderRadius: 50, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
						Browse Pujas
					</button>
				</div>
				<Footer />
			</div>
		);
	}

	if (cartError) {
		return (
			<div className="main-wrapper bg-light">
				<SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
				<PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
				<MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
				<Header
					onMenuToggle={() => setShowMobileMenu(true)}
					onSideMenuToggle={() => setShowSideMenu(true)}
					onSearchToggle={() => setShowSearch(true)}
				/>
				<div style={{
					display: "flex", flexDirection: "column",
					alignItems: "center", justifyContent: "center",
					minHeight: "60vh", gap: 16, textAlign: "center", padding: 24
				}}>
					<i className="fas fa-exclamation-circle" style={{ fontSize: 48, color: "#f59e0b" }} />
					<h4 style={{ color: "#111827" }}>Unable to load your booking</h4>
					<p style={{ color: "#6b7280", maxWidth: 320 }}>
						Please make sure you are logged in and have selected a puja package.
					</p>
					<button
						onClick={() => window.location.href = "/puja"}
						style={{
							padding: "12px 32px", background: "#9B1C1C",
							color: "#fff", border: "none", borderRadius: 50,
							fontWeight: 700, cursor: "pointer", fontSize: 14
						}}
					>
						Browse Pujas
					</button>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<>
			<style>{`
        .pff-root { font-family: 'Inter', sans-serif; background: #f8f7f4; min-height: 100vh; }

        /* ── HERO BANNER ── */
        .pff-hero {
          background: linear-gradient(135deg, #0f0520 0%, #1a0535 40%, #2d0a4e 70%, #1a0535 100%);
          padding: 60px 0 50px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .pff-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/assets/img/pooja_fill/banner.png') center center/cover no-repeat;
        }
        .pff-hero-inner { position: relative; z-index: 2; }
        .pff-hero-deco {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          margin-bottom: 12px;
        }
        .pff-hero-deco-line { width: 60px; height: 1px; background: rgba(255,180,50,0.5); }
        .pff-hero-deco-icon { color: #f5a623; font-size: 18px; }
        .pff-hero h1 { font-size: 42px; font-weight: 800; color: #fff; margin: 0 0 10px; letter-spacing: -0.5px; }
        .pff-hero h1 span { color: #f5a623; }
        .pff-hero-sub { color: rgba(255,255,255,0.7); font-size: 16px; margin: 0; }
        .pff-hero-img-left, .pff-hero-img-right {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 160px; opacity: 0.85;
        }
        .pff-hero-img-left { left: 40px; }
        .pff-hero-img-right { right: 40px; }

        /* ── LAYOUT ── */
        .pff-body { max-width: 1200px; margin: 0 auto; padding: 36px 20px 60px; display: grid; grid-template-columns: 1fr 380px; gap: 28px; }
        @media(max-width:900px){ .pff-body{ grid-template-columns:1fr; } }

        /* ── CARDS ── */
        .pff-card {
          background: #fff; border-radius: 20px;
          padding: 28px 24px 28px 24px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          margin-bottom: 20px;
          position: relative;
          overflow: visible;
        }
        .pff-card-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
        .pff-card-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: #fef3f2; display: flex; align-items: center; justify-content: center;
          color: #9B1C1C; font-size: 20px; flex-shrink: 0;
        }
        .pff-card-title { font-size: 18px; font-weight: 700; color: #9B1C1C; margin: 0; }
        .pff-card-sub { font-size: 13px; color: #9ca3af; margin: 2px 0 0; }
        .pff-card-watermark {
          position: absolute; right: 16px; top: 20px;
          width: 110px; opacity: 0.12; pointer-events: none;
        }

        /* ── FORM FIELDS ── */
        .pff-label { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; display: block; }
        .pff-label span { color: #ef4444; }
        .pff-input-wrap { position: relative; }
        .pff-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 16px; }
        .pff-input {
          width: 100%; padding: 13px 16px 13px 42px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 15px; color: #111827; background: #fff;
          outline: none; transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .pff-input:focus { border-color: #9B1C1C; }
        .pff-input::placeholder { color: #d1d5db; }

        /* phone row */
        .pff-phone-row { display: flex; gap: 12px; align-items: stretch; }
        .pff-phone-code {
          position: relative;
          display: flex; align-items: center;
          padding: 0 14px; border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 15px; font-weight: 700; color: #1a1a2e; white-space: nowrap;
          background: #fff; flex-shrink: 0;
          min-width: 92px;
        }
        .pff-phone-code select {
          appearance: none; -webkit-appearance: none; -moz-appearance: none;
          border: none; outline: none; font-size: 15px; font-weight: 700;
          color: #1a1a2e; cursor: pointer; background: transparent;
          width: 100%; padding: 13px 20px 13px 0;
        }
        .pff-phone-code-arrow {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          font-size: 10px; color: #9ca3af; pointer-events: none;
        }
        .pff-phone-input {
          flex: 1; padding: 13px 42px 13px 16px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 15px; color: #111827; outline: none;
          transition: border-color 0.2s; box-sizing: border-box;
          position: relative;
        }
        .pff-phone-input:focus { border-color: #9B1C1C; }
        .pff-phone-verified { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #16a34a; font-size: 20px; }
        .pff-phone-wrap { position: relative; flex: 1; }

        /* ── WhatsApp card layout ── */
        .pff-wa-card { position: relative; }
        .pff-wa-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; margin-bottom: 20px;
        }
        .pff-wa-illustration {
          width: 90px; height: 80px; object-fit: contain; flex-shrink: 0;
        }
        .pff-wa-dot {
          position: absolute; left: 50%; bottom: -8px; transform: translateX(-50%);
          width: 14px; height: 14px; border-radius: 50%; background: #f5a623;
        }
        @media (max-width: 480px) {
          .pff-wa-illustration { display: none; }
        }

        /* checkbox */
        .pff-check-row { display: flex; align-items: center; gap: 8px; margin-top: 14px; cursor: pointer; }
        .pff-check-box {
          width: 18px; height: 18px; border: 2px solid #d1d5db; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff; cursor: pointer;
        }
        .pff-check-box.checked { background: #9B1C1C; border-color: #9B1C1C; }
        .pff-check-label { font-size: 13px; color: #6b7280; }

        /* ── AASHIRWAD OPTIONS ── */
        .pff-aashirwad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }

        .pff-aashirwad-opt {
          border: 2px solid #e5e7eb; border-radius: 16px;
          cursor: pointer; background: #fff;
          overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          position: relative;
          display: flex; flex-direction: column; justify-content: space-between;
          height: 100%;
        }
        .pff-aashirwad-opt.active { border-color: #d4a04a; box-shadow: 0 4px 14px rgba(212,160,74,0.18); }
        .pff-aashirwad-opt:hover { border-color: #c5a068; transform: translateY(-1px); }

        .pff-recommended-badge {
          position: absolute; top: 0; right: 0;
          background: #d4a04a; color: #fff;
          font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase;
          padding: 5px 14px 5px 10px;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 10px 100%);
          border-radius: 0 14px 0 0;
          z-index: 2;
        }

        .pff-aashirwad-radio-row { padding: 12px 14px 0; display: flex; align-items: center; }
        .pff-aashirwad-radio {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid #d1d5db;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; background: #fff;
        }
        .pff-aashirwad-radio.active { border-color: #7B1C38; }
        .pff-aashirwad-radio.active::after { content:''; width:8px; height:8px; border-radius:50%; background:#7B1C38; }

        .pff-aashirwad-img-area {
          width: 100%; height: 110px;
          display: flex; align-items: center; justify-content: center;
          background: #fdf5ef; overflow: hidden; padding: 8px;
        }
        .pff-aashirwad-img-area img { width: 100%; height: 100%; object-fit: contain; }
        .pff-aashirwad-img-area.gray-bg { background: #fafafa; }

        .pff-aashirwad-label-area {
          padding: 10px 12px 6px; text-align: center;
          flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center;
        }
        .pff-aashirwad-deco { display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 2px; }
        .pff-aashirwad-deco-line { height: 1px; width: 22px; background: #e2b96a; }
        .pff-aashirwad-name { font-size: 17px; font-weight: 800; color: #2d1010; margin: 0 0 1px; }
        .pff-aashirwad-desc { font-size: 11.5px; color: #9ca3af; margin: 0 0 6px; }
        .pff-aashirwad-desc.maroon { color: #7B1C38; font-weight: 600; }

        .pff-aashirwad-btn {
          margin: 0 10px 12px;
          padding: 9px 10px;
          border-radius: 9px;
          width: calc(100% - 20px);
          display: flex; align-items: center; justify-content: center; gap: 5px;
          font-size: 9px; font-weight: 700; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s; border: none;
          box-sizing: border-box; white-space: nowrap;
        }
        .pff-aashirwad-btn.primary { background: #7B1C38; color: #fff; box-shadow: 0 2px 8px rgba(123,28,56,0.25); }
        .pff-aashirwad-btn.outline { background: #fff; color: #7B1C38; border: 1.5px solid #7B1C38; }
        .pff-aashirwad-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .pff-aashirwad-footer {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          padding-top: 14px; margin-top: 2px;
          border-top: 1px solid #f3e8e0;
          font-size: 12px; color: #9B4A2A; font-weight: 600;
        }
        .pff-aashirwad-footer-item { display: flex; align-items: center; gap: 5px; }
        .pff-aashirwad-footer-sep { width: 1px; height: 16px; background: #e5d5c8; }

        /* address inside aashirwad card */
        .pff-aashirwad-address-box {
          margin-top: 18px;
          padding: 20px;
          background: #fff9f5;
          border-radius: 14px;
          border: 1.5px solid #f0d9c8;
        }
        .pff-aashirwad-address-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
        }
        .pff-aashirwad-address-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #fef3f2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          color: #9B1C1C;
        }

        /* ── SUBMIT BUTTON WRAPPER ── */
        .pff-submit-wrap {
          background: #fff;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          margin-bottom: 20px;
        }
        .pff-submit-btn {
          width: 100%; padding: 16px 24px;
          background: linear-gradient(135deg, #f5a623 0%, #e8920d 100%);
          color: #fff; border: none; border-radius: 14px;
          font-size: 16.5px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform 0.15s, opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(245,166,35,0.35);
          letter-spacing: 0.2px;
        }
        .pff-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,166,35,0.45); }
        .pff-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .pff-secure-note { text-align: center; margin-top: 12px; font-size: 12.5px; color: #6b7280; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .pff-secure-note i { color: #16a34a; }

        /* ── TRUST STRIP ── */
        .pff-trust-strip {
          max-width: 1200px;
          margin: 0 auto 40px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 16px;
        }
        @media(max-width:600px){ .pff-trust-strip{ grid-template-columns:repeat(2,1fr); gap: 10px; } }
        .pff-trust-item {
          text-align: center;
          background: #fff;
          border-radius: 16px;
          padding: 16px 12px;
          border: 1px solid #f3e8e0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .pff-trust-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(155, 28, 28, 0.08);
          border-color: #f0d5c5;
        }
        .pff-trust-icon { width: 44px; height: 44px; margin: 0 auto 10px; }
        .pff-trust-icon img { width: 100%; height: 100%; object-fit: contain; }
        .pff-trust-name { font-size: 13px; font-weight: 700; color: #9B1C1C; margin-bottom: 2px; }
        .pff-trust-sub { font-size: 11px; color: #6b7280; }

        /* ── RIGHT SIDEBAR ── */
        .pff-sidebar { position: sticky; top: 100px; }
        .pff-summary-card {
          background: #fff; border-radius: 20px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07); margin-bottom: 16px;
        }
        .pff-summary-header {
          background: #fff; padding: 20px 24px 16px;
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid #f3f4f6;
        }
        .pff-summary-header-icon { color: #9B1C1C; font-size: 18px; }
        .pff-summary-header-title { font-size: 16px; font-weight: 700; color: #111827; }
        .pff-summary-body { padding: 20px 24px; }
        .pff-pkg-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f3f4f6; }
        .pff-pkg-label { font-size: 12px; color: #9ca3af; margin-bottom: 3px; }
        .pff-pkg-name { font-size: 15px; font-weight: 700; color: #111827; }
        .pff-pkg-price { font-size: 20px; font-weight: 800; color: #f5a623; }
        .pff-addon-section-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .pff-addon-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #f9fafb; border-radius: 12px; margin-bottom: 8px; }
        .pff-addon-img { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
        .pff-addon-name { font-size: 13px; font-weight: 600; color: #111827; }
        .pff-addon-qty { font-size: 12px; color: #9ca3af; }
        .pff-addon-price { margin-left: auto; font-size: 13px; font-weight: 700; color: #374151; }
        .pff-addon-row.home { border-left: 3px solid #f5a623; }
        .pff-billing-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .pff-billing-label { font-size: 13px; color: #6b7280; }
        .pff-billing-val { font-size: 13px; color: #374151; font-weight: 500; }
        .pff-divider-dashed { border: none; border-top: 2px dashed #f3f4f6; margin: 12px 0; }
        .pff-total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
        .pff-total-label { font-size: 16px; font-weight: 700; color: #111827; }
        .pff-total-val { font-size: 24px; font-weight: 800; color: #f5a623; }
        .pff-secure-banner { background: #fffbeb; border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; gap: 8px; margin-top: 14px; }
        .pff-secure-banner i { color: #f5a623; font-size: 14px; }
        .pff-secure-banner span { font-size: 13px; color: #92400e; font-weight: 500; }
        .pff-sidebar-trust {
          padding: 16px 14px 18px;
          border-top: 1px solid #f3f4f6;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: #fff;
        }
        .pff-sidebar-trust-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 4px;
          background: #fdf8f5;
          border-radius: 12px;
          border: 1px solid #f9ece4;
          transition: all 0.2s ease;
        }
        .pff-sidebar-trust-item:hover {
          transform: translateY(-2px);
          background: #fcf1ea;
          border-color: #f5dacc;
        }
        .pff-sidebar-trust-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #9B1C1C;
          font-size: 13px;
          margin-bottom: 6px;
          box-shadow: 0 2px 6px rgba(155, 28, 28, 0.08);
        }
        .pff-sidebar-trust-name {
          font-size: 11px;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
          margin-bottom: 2px;
        }
        .pff-sidebar-trust-sub {
          font-size: 10px;
          color: #6b7280;
          line-height: 1.2;
        }
        .pff-devotion-banner {
          border-radius: 16px; overflow: hidden; position: relative;
          height: 189px; margin-top: 30px;
        }
        .pff-devotion-banner img { width: 100%; height: 100%; object-fit: cover; }
        .pff-devotion-banner-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; padding: 16px; text-align: center;
        }
        .pff-devotion-text { font-size: 14px; color: #fff; line-height: 1.5; font-weight: 500; }
        .pff-devotion-text strong { color: #f5a623; }

        /* ── WHAT HAPPENS NEXT CARD ── */
        .pff-next-card {
          background: #fff;
          border-radius: 20px;
          padding: 20px 22px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          margin-top: 18px;
          border: 1.5px solid #f3e8e0;
        }
        .pff-next-header {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 16px; padding-bottom: 12px;
          border-bottom: 1px solid #f9ece4;
        }
        .pff-next-header-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: #fef3f2; color: #9B1C1C;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .pff-next-title { font-size: 15px; font-weight: 700; color: #111827; }
        .pff-next-sub { font-size: 11.5px; color: #9ca3af; }
        .pff-next-list { display: flex; flex-direction: column; gap: 14px; }
        .pff-next-item { display: flex; align-items: flex-start; gap: 12px; }
        .pff-next-num {
          width: 26px; height: 26px; border-radius: 50%;
          background: #fdf3e7; color: #c87a3a; border: 1px solid #f5dacc;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; flex-shrink: 0; margin-top: 1px;
        }
        .pff-next-item-title { font-size: 13px; font-weight: 700; color: #2d1010; line-height: 1.3; }
        .pff-next-item-desc { font-size: 11.5px; color: #6b7280; line-height: 1.35; margin-top: 2px; }

        /* ── NEED HELP CARD ── */
        .pff-help-card {
          background: linear-gradient(135deg, #fffcf7 0%, #fff6eb 100%);
          border-radius: 20px;
          padding: 18px 20px;
          margin-top: 18px;
          border: 1.5px solid #f5e3ca;
          box-shadow: 0 2px 14px rgba(245,166,35,0.08);
        }
        .pff-help-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .pff-help-icon {
          width: 42px; height: 42px; border-radius: 50%;
          background: #e8f5e9; color: #25D366;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37,211,102,0.18);
        }
        .pff-help-title { font-size: 14px; font-weight: 700; color: #1a1a2e; }
        .pff-help-desc { font-size: 11.5px; color: #666; margin-top: 1px; }
        .pff-wa-chat-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 11px;
          background: #25D366; color: #fff;
          border-radius: 10px; font-size: 13px; font-weight: 700;
          text-decoration: none; transition: transform 0.15s, background 0.15s;
          box-shadow: 0 3px 10px rgba(37,211,102,0.25);
        }
        .pff-wa-chat-btn:hover { background: #20bd5a; color: #fff; transform: translateY(-1px); }
      .pff-addr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pff-addr-grid .full { grid-column: 1 / -1; }
        @media(max-width:500px){ .pff-addr-grid{ grid-template-columns:1fr; } }

        /* =========================================================
           RESPONSIVE ENHANCEMENTS (added only — no existing rule
           or JSX changed, purely additive media queries)
           ========================================================= */

        /* ── Hero ── */
        @media (max-width: 992px) {
          .pff-hero { padding: 48px 0 40px; }
          .pff-hero h1 { font-size: 32px; }
          .pff-hero-sub { font-size: 14px; }
          .pff-hero-img-left, .pff-hero-img-right { width: 100px; opacity: 0.5; }
          .pff-hero-img-left { left: 12px; }
          .pff-hero-img-right { right: 12px; }
        }
        @media (max-width: 600px) {
          .pff-hero { padding: 36px 0 30px; }
          .pff-hero h1 { font-size: 26px; }
          .pff-hero-sub { font-size: 13px; padding: 0 16px; }
          .pff-hero-img-left, .pff-hero-img-right { display: none; }
        }

        /* ── Body layout / cards ── */
        @media (max-width: 992px) {
          .pff-body { padding: 28px 16px 48px; gap: 20px; }
          .pff-card { padding: 22px 18px !important; }
          .pff-card-watermark { width: 90px !important; opacity: 0.6; }
          .pff-card-title { font-size: 16px; }
          .pff-card-sub { font-size: 12px; }
          .pff-sidebar { position: static; top: auto; }
        }
        @media (max-width: 600px) {
          .pff-body { padding: 20px 12px 40px; }
          .pff-card { padding: 18px 14px !important; }
          .pff-card-header { gap: 10px; }
          .pff-card-icon { width: 38px; height: 38px; font-size: 16px; }
          .pff-card-watermark { display: none !important; }
        }

      /* ── Phone row ── */
        @media (max-width: 480px) {
          .pff-phone-row { flex-wrap: nowrap; gap: 8px; }
          .pff-phone-code { padding: 10px 8px; font-size: 13px; }
          .pff-phone-code select { font-size: 13px; }
          .pff-phone-wrap { padding: 0 !important; }
          .pff-phone-input { padding: 12px 44px 12px 12px !important; font-size: 14px; }
          .pff-phone-verified { right: 12px; }
        }
        /* ── Aashirwad grid ── */
        @media (max-width: 640px) {
          .pff-aashirwad-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
        }
        @media (max-width: 600px) {
          .pff-aashirwad-img-area { height: 110px; }
          .pff-aashirwad-name { font-size: 16px; }
          .pff-aashirwad-btn { font-size: 9px; padding: 9px 12px; }
          .pff-aashirwad-footer { flex-direction: column; gap: 8px; }
          .pff-aashirwad-footer-sep { display: none; }
        }

        /* ── Address box ── */
        @media (max-width: 600px) {
          .pff-aashirwad-address-box { padding: 14px; }
        }

        /* ── Submit button ── */
        @media (max-width: 600px) {
          .pff-submit-btn { padding: 15px; font-size: 15px; }
        }
        @media (max-width: 640px) {
          .pff-submit-wrap {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background: #fff;
            padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
            box-shadow: 0 -6px 20px rgba(0,0,0,0.1);
            z-index: 999;
          }
          .pff-submit-wrap .pff-secure-note { display: none; }
          .pff-body { padding-bottom: 90px; }
        }
   
       /* ── Trust strip ── */
        @media (max-width: 420px) {
          .pff-trust-strip { gap: 14px; }
          .pff-trust-icon { width: 34px; height: 34px; }
          .pff-trust-name { font-size: 11.5px; }
          .pff-trust-sub { font-size: 10.5px; }
        }

        @media (max-width: 600px) {
          .pff-summary-header { padding: 16px 18px 12px; }
          .pff-summary-body { padding: 16px 18px; }
          .pff-pkg-price, .pff-total-val { font-size: 18px; }
          .pff-sidebar-trust { padding: 12px 10px 14px; gap: 6px; }
        }

        /* ── Devotion banner ── */
        @media (max-width: 600px) {
          .pff-devotion-banner { height: 150px; margin-top: 20px; }
          .pff-devotion-text { font-size: 13px; }
        }
      `}</style>

				<div className="pff-root">
				<ScrollToTop />
				<SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
				<PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
				<MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
				<Header
					onMenuToggle={() => setShowMobileMenu(true)}
					onSideMenuToggle={() => setShowSideMenu(true)}
					onSearchToggle={() => setShowSearch(true)}
				/>

				{/* ══ HERO BANNER ══ */}
				<div className="pff-hero">
					<img
						className="pff-hero-img-left"
						src="https://images.unsplash.com/photo-1601933513839-04e30d94e55e?w=300&q=80"
						alt=""
						style={{ borderRadius: 12 }}
					/>
					<div className="pff-hero-inner">
						<div className="pff-hero-deco">
							<span className="pff-hero-deco-line" />
							<i className="fas fa-om pff-hero-deco-icon" />
							<span className="pff-hero-deco-line" />
						</div>
						<h1>Sankalp &amp; <span>Address</span></h1>
						<p className="pff-hero-sub">Enter your details for a meaningful puja experience</p>
					</div>
				</div>

				{/* ══ BODY ══ */}
				<div className="pff-body">

					{/* ── LEFT COLUMN ── */}
					<div>
						<form id="puja-fill-form" onSubmit={handleProceed}>

							{/* ── WHATSAPP CONTACT ── */}
							<div className="pff-card pff-wa-card" style={{ padding: "24px", overflow: "visible" }}>
								<div className="pff-wa-top">
									<div className="pff-card-header" style={{ marginBottom: 0 }}>
										<div className="pff-card-icon"><i className="fab fa-whatsapp" /></div>
										<div>
											<div className="pff-card-title">WhatsApp Contact</div>
											<div className="pff-card-sub">All updates will be sent on WhatsApp</div>
										</div>
									</div>
									<img
										className="pff-wa-illustration"
										src="/assets/img/pooja_fill/whatsappimage.png"
										alt=""
										onError={(e) => { e.target.style.display = "none"; }}
									/>
								</div>

								<div className="pff-phone-row">
									<div className="pff-phone-code">
										<select
											defaultValue="+91"
											aria-label="Country code"
										>
											<option>+91</option>
										</select>
										<i className="fas fa-chevron-down pff-phone-code-arrow" />
									</div>
									<div className="pff-phone-wrap">
										<input
											type="tel"
											name="whatsapp"
											required
											className="pff-phone-input"
											placeholder="Enter WhatsApp number"
											value={formData.whatsapp}
											onChange={handleInputChange}
										/>
										{formData.whatsapp?.length === 10 && (
											<i className="fas fa-check-circle pff-phone-verified" />
										)}
									</div>
								</div>
							</div>

							{/* ── PARTICIPANT DETAILS ── */}
							<div className="pff-card">
								<div className="pff-card-header">
									<div className="pff-card-icon"><i className="fas fa-user" /></div>
									<div>
										<div className="pff-card-title">Participant Details</div>
										<div className="pff-card-sub">Enter devotee details for the sankalp</div>
									</div>
								</div>
								<img
									className="pff-card-watermark"
									src="/assets/img/pooja_fill/hand.png"
									alt=""
									style={{ width: 160 }}
									onError={(e) => { e.target.style.display = "none"; }}
								/>

								<div style={{ marginBottom: 18 }}>
									<label className="pff-label">Full Name <span>*</span></label>
									<div className="pff-input-wrap">
										<i className="fas fa-user pff-input-icon" />
										<input
											type="text"
											name="participantName"
											required
											className="pff-input"
											placeholder="Enter your full name"
											value={formData.participantName}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div>
									<label className="pff-label">Gotra <span style={{ color: '#9ca3af', fontWeight: 400 }}>(Optional)</span></label>
									<div className="pff-input-wrap">
										<i className="fas fa-om pff-input-icon" style={{ fontSize: 14 }} />
										<input
											type="text"
											name="gotra"
											disabled={!formData.isGotraKnown}
											className="pff-input"
											placeholder={formData.isGotraKnown ? "Enter Gotra" : "Kashyap (Generic)"}
											value={formData.gotra}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div
									className="pff-check-row"
									onClick={() => setFormData((p) => ({ ...p, isGotraKnown: !p.isGotraKnown }))}
								>
									<div className={`pff-check-box ${!formData.isGotraKnown ? "checked" : ""}`}>
										{!formData.isGotraKnown && <i className="fas fa-check" style={{ fontSize: 10, color: '#fff' }} />}
									</div>
									<span className="pff-check-label">I do not know my gotra</span>
								</div>
							</div>

							{/* ── AASHIRWAD BOX ── */}
							<div className="pff-card" style={{ padding: "28px 24px", overflow: "visible" }}>
								<div className="pff-card-header">
									<div className="pff-card-icon"><i className="fas fa-gift" /></div>
									<div>
										<div className="pff-card-title">Receive Aashirwad Box?</div>
										<div className="pff-card-sub">Get prasad, holy items and blessings at your address</div>
									</div>
								</div>

								<div className="pff-aashirwad-grid">
									{/* YES option */}
									<div
										className={`pff-aashirwad-opt ${formData.wantsAashirwad === "Yes" ? "active" : ""}`}
										onClick={() => setFormData((p) => ({ ...p, wantsAashirwad: "Yes" }))}
									>
										<div className="pff-recommended-badge">Recommended</div>
										<div className="pff-aashirwad-radio-row">
											<div className={`pff-aashirwad-radio ${formData.wantsAashirwad === "Yes" ? "active" : ""}`} />
										</div>
										<div className="pff-aashirwad-img-area">
											<img src="/assets/img/pooja_fill/gift.png" alt="Aashirwad Box" />
										</div>
										<div className="pff-aashirwad-label-area">
											<div className="pff-aashirwad-deco">
												<div className="pff-aashirwad-deco-line" />
												<span style={{ fontSize: 9, color: "#e2b96a" }}>✦</span>
												<div className="pff-aashirwad-deco-line" />
											</div>
											<div className="pff-aashirwad-name">Yes</div>
											<div className="pff-aashirwad-desc maroon">Deliver Aashirwad Box</div>
										</div>
										<button
											type="button"
											className="pff-aashirwad-btn primary"
											onClick={(e) => { e.stopPropagation(); setFormData((p) => ({ ...p, wantsAashirwad: "Yes" })); }}
										>
											<i className="fas fa-truck" style={{ fontSize: 12 }} />
											Yes, Deliver Aashirwad Box
											<i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
										</button>
									</div>

									{/* NO option */}
									<div
										className={`pff-aashirwad-opt ${formData.wantsAashirwad === "No" ? "active" : ""}`}
										onClick={() => setFormData((p) => ({ ...p, wantsAashirwad: "No" }))}
									>
										<div className="pff-aashirwad-radio-row">
											<div className={`pff-aashirwad-radio ${formData.wantsAashirwad === "No" ? "active" : ""}`} />
										</div>
										<div className="pff-aashirwad-img-area gray-bg">
											<img src="/assets/img/pooja_fill/giftpack.png" alt="No Box" />
										</div>
										<div className="pff-aashirwad-label-area">
											<div className="pff-aashirwad-deco">
												<div className="pff-aashirwad-deco-line" />
												<div style={{ width: 22, height: 22, borderRadius: "50%", background: "#7B1C38", display: "flex", alignItems: "center", justifyContent: "center" }}>
													<i className="fas fa-hand-paper" style={{ fontSize: 10, color: "#fff" }} />
												</div>
												<div className="pff-aashirwad-deco-line" />
											</div>
											<div className="pff-aashirwad-name">No</div>
											<div className="pff-aashirwad-desc">I don't want Aashirwad Box</div>
										</div>
										<button
											type="button"
											className="pff-aashirwad-btn outline"
											onClick={(e) => { e.stopPropagation(); setFormData((p) => ({ ...p, wantsAashirwad: "No" })); }}
										>
											No, Skip Aashirwad Box
											<i className="fas fa-arrow-right" style={{ fontSize: 11 }} />
										</button>
									</div>
								</div>

								{/* Footer trust strip */}
								<div className="pff-aashirwad-footer">
									<div className="pff-aashirwad-footer-item">
										<i className="fas fa-shield-alt" style={{ fontSize: 13 }} />
										100% Secure Packaging
									</div>
									<div className="pff-aashirwad-footer-sep" />
									<div className="pff-aashirwad-footer-item">
										Delivered with Devotion
										<i className="fas fa-heart" style={{ fontSize: 12 }} />
									</div>
								</div>

								{/* ── ADDRESS FORM — slides open when Yes ── */}
								<AnimatePresence>
									{formData.wantsAashirwad === "Yes" && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3, ease: "easeInOut" }}
											style={{ overflow: "hidden" }}
										>
											<div className="pff-aashirwad-address-box">
												<div className="pff-aashirwad-address-header">
													<div className="pff-aashirwad-address-icon">
														<i className="fas fa-map-marker-alt" style={{ color: "#9B1C1C", fontSize: 13 }} />
													</div>
													<div>
														<div style={{ fontSize: 14, fontWeight: 700, color: "#9B1C1C" }}>Delivery Address</div>
														<div style={{ fontSize: 12, color: "#9ca3af" }}>Where should we send your Aashirwad Box?</div>
													</div>
												</div>
												<div className="pff-addr-grid">
													{[
														{ name: "pincode", placeholder: "Pincode", icon: "fas fa-map-pin" },
														{ name: "city", placeholder: "City", icon: "fas fa-city" },
														{ name: "state", placeholder: "State", icon: "fas fa-map", full: true },
														{ name: "houseNo", placeholder: "House / Flat No.", icon: "fas fa-home", full: true },
														{ name: "area", placeholder: "Area / Colony", icon: "fas fa-map-marker-alt", full: true },
														{ name: "landmark", placeholder: "Landmark (optional)", icon: "fas fa-landmark", full: true, req: false },
													].map(({ name, placeholder, icon, full, req = true }) => (
														<div key={name} className={full ? "full" : ""}>
															<div className="pff-input-wrap">
																<i className={`${icon} pff-input-icon`} style={{ fontSize: 13 }} />
																<input
																	type="text"
																	name={name}
																	required={req}
																	className="pff-input"
																	placeholder={placeholder}
																	value={formData.address[name]}
																	onChange={handleAddressChange}
																/>
															</div>
														</div>
													))}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* ── SUBMIT ── */}
							<div className="pff-submit-wrap">
								<button type="submit" disabled={isLoading} className="pff-submit-btn">
									<i className="fas fa-lock" style={{ fontSize: 16 }} />
									{isLoading ? "Updating Sankalp..." : "Confirm & Proceed To Payment"}
									{!isLoading && <i className="fas fa-arrow-right" style={{ fontSize: 14 }} />}
								</button>
								<div className="pff-secure-note">
									<i className="fas fa-shield-alt" />
									100% Secure &amp; Safe Payments
								</div>
							</div>
						</form>
					</div>

					{/* ── RIGHT SIDEBAR ── */}
					<div className="pff-sidebar">
						<div className="pff-summary-card">
							<div className="pff-summary-header">
								<i className="fas fa-receipt pff-summary-header-icon" />
								<span className="pff-summary-header-title">Booking Summary</span>
							</div>

							<div className="pff-summary-body">
								<div className="pff-pkg-row">
									<div>
										<div className="pff-pkg-label">Selected Package</div>
										<div className="pff-pkg-name">{cart?.package?.packageName || selectedPackage?.packageName || "Individual"}</div>
									</div>
									<div className="pff-pkg-price">₹{cart?.base_total ?? selectedPackage?.packagePrice ?? 0}</div>
								</div>

								{homeAddons.length > 0 && (
									<div style={{ marginBottom: 14 }}>
										<div className="pff-addon-section-label">Home Delivery</div>
										{homeAddons.map((item, i) => (
											<div key={i} className="pff-addon-row home">
												{item.pimage
													? <img src={item.pimage} className="pff-addon-img" alt="" />
													: <div className="pff-addon-img" style={{ background: '#fef3f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-box" style={{ color: '#9B1C1C', fontSize: 16 }} /></div>
												}
												<div>
													<div className="pff-addon-name">{item.pname}</div>
													<div className="pff-addon-qty">Qty: {item.qty}</div>
												</div>
												<div className="pff-addon-price">₹{item.lineTotal || item.pamount || 0}</div>
											</div>
										))}
									</div>
								)}

								{templeAddons.length > 0 && (
									<div style={{ marginBottom: 14 }}>
										<div className="pff-addon-section-label">Ritual Add-ons</div>
										{templeAddons.map((item, i) => (
											<div key={i} className="pff-addon-row">
												{item.pimage
													? <img src={item.pimage} className="pff-addon-img" alt="" />
													: <div className="pff-addon-img" style={{ background: '#fef3f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fas fa-om" style={{ color: '#9B1C1C', fontSize: 16 }} /></div>
												}
												<div>
													<div className="pff-addon-name">{item.pname}</div>
													<div className="pff-addon-qty">Qty: {item.qty}</div>
												</div>
												<div className="pff-addon-price">₹{item.lineTotal || item.pamount || 0}</div>
											</div>
										))}
									</div>
								)}

								<hr className="pff-divider-dashed" />
								<div className="pff-billing-row">
									<span className="pff-billing-label">Addons Total</span>
									<span className="pff-billing-val">₹{addonsVal}</span>
								</div>
								<div className="pff-billing-row">
									<span className="pff-billing-label">Home Delivery</span>
									<span className="pff-billing-val">₹{homeAddonsVal}</span>
								</div>
								{discountVal > 0 && (
									<div className="pff-billing-row">
										<span className="pff-billing-label">Discount</span>
										<span className="pff-billing-val" style={{ color: "#22c55e" }}>-₹{discountVal}</span>
									</div>
								)}
								<div className="pff-billing-row">
									<span className="pff-billing-label">GST (18%)</span>
									<span className="pff-billing-val">₹{gstVal}</span>
								</div>
								<div className="pff-billing-row">
									<span className="pff-billing-label">Platform Fee</span>
									<span className="pff-billing-val">
										<span style={{ textDecoration: "line-through", color: "#9ca3af", marginRight: "6px" }}>₹10</span>
										<span style={{ color: "#16a34a", fontWeight: "700" }}>₹0</span>
									</span>
								</div>
								<hr className="pff-divider-dashed" />
								<div className="pff-total-row">
									<span className="pff-total-label">Total Payable</span>
									<span className="pff-total-val">₹{grandTotalVal}</span>
								</div>

								<button
									type="submit"
									form="puja-fill-form"
									disabled={isLoading}
									className="pff-submit-btn"
									style={{ marginTop: "16px", padding: "14px 18px", fontSize: "16px" }}
								>
									<i className="fas fa-lock" style={{ fontSize: 15 }} />
									{isLoading ? "Updating Sankalp..." : "Confirm & Proceed To Payment"}
									{!isLoading && <i className="fas fa-arrow-right" style={{ fontSize: 13 }} />}
								</button>

								<div className="pff-secure-banner">
									<i className="fas fa-lock" />
									<span>Your payment is secure with us</span>
								</div>
							</div>

							<div className="pff-sidebar-trust">
								{[
									{ icon: "fas fa-shield-alt", name: "Secure Payments", sub: "100% secure" },
									{ icon: "fas fa-check-circle", name: "Instant Confirm", sub: "Confirmed" },
									{ icon: "fas fa-headset", name: "Dedicated Support", sub: "24×7 support" },
								].map((t, i) => (
									<div key={i} className="pff-sidebar-trust-item">
										<div className="pff-sidebar-trust-icon"><i className={t.icon} /></div>
										<div className="pff-sidebar-trust-name">{t.name}</div>
										<div className="pff-sidebar-trust-sub">{t.sub}</div>
									</div>
								))}
							</div>
						</div>

						<div className="pff-devotion-banner">
							<img src="/assets/img/pooja_fill/pff-devotion.png" alt="Puja" />
							<div className="pff-devotion-banner-overlay">
								<div className="pff-devotion-text">
									Every Puja is performed<br />
									with <strong>devotion &amp;</strong><br />
									<strong>authentic rituals</strong>
								</div>
							</div>
						</div>

						{/* ── WHAT HAPPENS NEXT CARD ── */}
						<div className="pff-next-card">
							<div className="pff-next-header">
								<div className="pff-next-header-icon"><i className="fas fa-om" /></div>
								<div>
									<div className="pff-next-title">What Happens Next?</div>
									<div className="pff-next-sub">3 simple steps after booking</div>
								</div>
							</div>
							<div className="pff-next-list">
								<div className="pff-next-item">
									<div className="pff-next-num">1</div>
									<div>
										<div className="pff-next-item-title">Sankalp &amp; Chanting</div>
										<div className="pff-next-item-desc">Punditji recites your Name &amp; Gotra during the sacred ritual</div>
									</div>
								</div>
								<div className="pff-next-item">
									<div className="pff-next-num">2</div>
									<div>
										<div className="pff-next-item-title">Video &amp; Photos</div>
										<div className="pff-next-item-desc">Receive full ritual video proof directly on WhatsApp</div>
									</div>
								</div>
								<div className="pff-next-item">
									<div className="pff-next-num">3</div>
									<div>
										<div className="pff-next-item-title">Prasad Dispatch</div>
										<div className="pff-next-item-desc">Blessed Prasad box delivered directly to your home</div>
									</div>
								</div>
							</div>
						</div>

						{/* ── LIVE ASSISTANCE & SUPPORT CARD ── */}
						<div className="pff-help-card">
							<div className="pff-help-top">
								<div className="pff-help-icon">
									<i className="fab fa-whatsapp" />
								</div>
								<div>
									<div className="pff-help-title">Need Help With Booking?</div>
									<div className="pff-help-desc">Our Puja Sevak is online to assist you</div>
								</div>
							</div>
							<a
								href="https://wa.me/919999999999?text=Namaste!%20I%20need%20help%20with%20my%20Puja%20Sankalp%20booking."
								target="_blank"
								rel="noreferrer"
								className="pff-wa-chat-btn"
							>
								<i className="fab fa-whatsapp" style={{ fontSize: 15 }} />
								Chat On WhatsApp
							</a>
						</div>
					</div>

				</div>{/* /pff-body */}

				{/* ── TRUST STRIP ── */}
				<div className="pff-trust-strip">
					{[
						{ img: "/assets/img/pooja_fill/templefill.png", name: "Temple Verified", sub: "Authentic & Trusted" },
						{ img: "/assets/img/pooja_fill/leaf.png", name: "Pure & Authentic", sub: "Vedic Rituals" },
						{ img: "/assets/img/pooja_fill/peopleicon.png", name: "Thousands of Devotees", sub: "Trust DivinIQ" },
						{ img: "/assets/img/pooja_fill/car.png", name: "On-Time Delivery", sub: "Safe & Reliable" },
					].map((t, i) => (
						<div key={i} className="pff-trust-item">
							<div className="pff-trust-icon">
								<img src={t.img} alt={t.name} style={{ borderRadius: 10 }} />
							</div>
							<div className="pff-trust-name">{t.name}</div>
							<div className="pff-trust-sub">{t.sub}</div>
						</div>
					))}
				</div>

				<Footer />

				<OrderConfirmationModal
					isOpen={isConfirmModalOpen}
					onClose={() => setIsConfirmModalOpen(false)}
					formData={formData}				
					walletBalance={walletBalance}
					cart={cart}
					onConfirm={handleFinalSubmit}
				/>
				<StatusModal status={bookingStatus} onClose={handleStatusClose} />
			</div>
		</>
	);
};

export default PujaFillForm;