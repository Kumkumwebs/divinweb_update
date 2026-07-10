import React, { useState, useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MobileMenu from "../components/layout/MobileMenu";
import PopupSearch from "../components/layout/PopupSearch";
import ScrollTop from "../components/common/ScrollTop";
import "./Pujadetails.css";
import PujaService from "../services/pujaServices";
import { Link, useParams } from "react-router-dom";
import PujaUserDetailsModal from "./pujaUserDetailsModel";
import LoginOTPModal from "../components/accounts/LoginOTPModel";
import { useStorage } from "../context/StorageContext";

/* ══════════════════════════════════════
   IMAGE FALLBACKS
   Inline SVG data URIs — these never touch the network, so they can
   never themselves fail to load or trigger a retry loop.
══════════════════════════════════════ */
const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
      <rect width="400" height="260" fill="#f5ede0"/>
      <text x="50%" y="52%" font-size="120" text-anchor="middle" dominant-baseline="middle" fill="#c9962f" font-family="serif">ॐ</text>
    </svg>
  `);

const AVATAR_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <rect width="80" height="80" fill="#f5ede0"/>
      <circle cx="40" cy="32" r="14" fill="#c9962f"/>
      <path d="M14 70c0-16 12-24 26-24s26 8 26 24" fill="#c9962f"/>
    </svg>
  `);

// Swaps to a placeholder exactly once — the dataset flag rules out any
// possibility of a retry loop even if this somehow fires more than once.
const handleImgError = (fallbackSrc) => (e) => {
  const img = e.currentTarget;
  if (img.dataset.fallback === "done") return;
  img.dataset.fallback = "done";
  img.src = fallbackSrc;
};

/* ══════════════════════════════════════
   EXPANDABLE TEXT — "Read More / Show Less"
   Props:
     text        – the full string from API
     maxChars    – character limit before truncating (default 300)
     maxLines    – optional CSS line-clamp count (default 4)
══════════════════════════════════════ */
const ExpandableText = ({ text = "", maxChars = 300, className = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > maxChars;
  const displayed = expanded || !needsTruncation ? text : text.slice(0, maxChars) + "…";

  return (
    <span className={className}>
      {displayed}
      {needsTruncation && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#d4a057",
            fontWeight: 600,
            fontSize: "0.92em",
            marginLeft: 6,
            padding: 0,
            textDecoration: "underline",
            textUnderlineOffset: 2,
            whiteSpace: "nowrap",
          }}
        >
          {expanded ? "Show Less ▲" : "Read More ▼"}
        </button>
      )}
    </span>
  );
};

/* ══════════════════════════════════════
   COUNTDOWN HOOK
══════════════════════════════════════ */
const useCountdown = () => {
  const [time, setTime] = useState({ d: 203, h: 0, m: 58, s: 15 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        return {
          d: Math.max(0, d),
          h: Math.max(0, h),
          m: Math.max(0, m),
          s: Math.max(0, s),
        };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const pad = (n, len = 2) => String(n).padStart(len, "0");

/* ══════════════════════════════════════
   STATIC DATA
══════════════════════════════════════ */
const BENEFITS = [
  {
    icon: "fas fa-shield-alt",
    title: "Protection from Hidden Obstacles",
    sub: "Tarak & Planetary Relief",
    text: "The Dus Mahavidyas are supreme forces of divine Shakti. Their combined blessings remove unseen Tantric and astrological obstacles, afflictions, negative energies that silently block progress.",
  },
  {
    icon: "fas fa-lightbulb",
    title: "Clarity, Courage & Right Decisions",
    sub: "Strengthening Inner Power",
    text: "Blessings of Maa Bagalamukhi, Chhinnamasta, and Dhoomavati awaken inner strength, clarity, and confidence — empowering you to take correct and timely decisions.",
  },
  {
    icon: "fas fa-coins",
    title: "Lakshmi Kripa & Prosperity Flow",
    sub: "Growth, Abundance & Stability",
    text: "When offered during auspicious periods like Diwali, this tithi Chadhava opens the channels of Goddess Lakshmi grace. It attracts success, wealth, opportunities, increased income, and steady financial flow.",
  },
];

const INCLUDED = [
  { icon: "fas fa-om", text: "Vedic Rituals by Expert Pandits" },
  { icon: "fas fa-om", text: "Sankalp in Your Name & Gotra" },
  { icon: "fas fa-om", text: "Mantra Chanting & Havan" },
  { icon: "fas fa-om", text: "Puja Photos & Live Updates" },
  { icon: "fas fa-om", text: "Prasad Delivered to Your Home" },
];

const HOW_STEPS = [
  { num: "01", icon: "fas fa-hand-pointer", title: "Select Your Puja", desc: "Choose a sacred puja or chadhava aligned with your intention." },
  { num: "02", icon: "fas fa-gift", title: "Add Divine Offering", desc: "Give Seva, Deep Daan, Vastr Seva, and more." },
  { num: "03", icon: "fas fa-user-edit", title: "Provide Sankalp", desc: "Enter your Name & Gotra to personalise the puja Sankalp." },
  { num: "04", icon: "fas fa-video", title: "Live Puja & Updates", desc: "Pandits perform dedicatedly. Get real-time updates." },
  { num: "05", icon: "fas fa-box-open", title: "Receive Blessings", desc: "Get puja video in 3 days & prasad delivered in 6-10 days." },
];

const REVIEWS = [
  {
    name: "Rakesh Sharma",
    loc: "Delhi, India",
    av: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    stars: 5,
    date: "17 Feb 2025",
    text: "The puja was performed with great devotion. I received the video and prasad on time. Truly a divine experience.",
  },
  {
    name: "Anita Verma",
    loc: "Mumbai, India",
    av: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
    stars: 5,
    date: "3 Feb 2025",
    text: "Very peaceful experience. The pandit ji looked over our names clearly during sankalp. Felt blessed.",
  },
  {
    name: "Suresh Patel",
    loc: "Ahmedabad, India",
    av: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    stars: 5,
    date: "21 Jan 2025",
    text: "Excellent service! The live puja updates were amazing. I could feel the divine energy even from home.",
  },
  {
    name: "Priya Singh",
    loc: "Jaipur, India",
    av: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    stars: 5,
    date: "10 Jan 2025",
    text: "DiviniQ made it so easy to book and participate in the puja. The prasad delivery was prompt and beautifully packed.",
  },
];

const FAQS = [
  { q: "What is the significance of this puja?", a: "This puja invokes divine blessings for protection, prosperity, and spiritual growth. It is performed by expert Pandits with full Vedic rituals." },
  { q: "When will I receive the prasad?", a: "Prasad is typically delivered within 6-10 working days after the puja is performed." },
  { q: "How will I receive the puja updates?", a: "You will receive live photos and videos directly on your registered mobile number via WhatsApp." },
  { q: "Can I add multiple names in the sankalp?", a: "Yes, you can include multiple names and gotras in the sankalp. Please mention them during booking." },
  { q: "How long does the puja take?", a: "The puja typically takes 2-4 hours depending on the rituals involved." },
  { q: "Is the payment secure?", a: "Yes, 100%. We use secure payment gateways including UPI, Visa, Mastercard, and RuPay." },
];

/* ══════════════════════════════════════
   HELPER COMPONENTS
══════════════════════════════════════ */
const FaqItem = ({ num, q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="pd-faq-item" onClick={() => setOpen((o) => !o)}>
      <div className="pd-faq-q">
        <span className="pd-faq-num">{pad(num)}</span>
        <span className="pd-faq-text">{q}</span>
        <div className="pd-faq-toggle">
          <i className={`fas fa-${open ? "minus" : "plus"}`} />
        </div>
      </div>
      {open && <div className="pd-faq-ans">{a}</div>}
    </div>
  );
};
const ReviewsSection = ({ reviews = [] }) => {
  // Merge API reviews with static fallback, normalize field names
  const allReviews = reviews.length > 0
    ? reviews.map(r => ({
      name: r.name || "Devotee",
      loc: "India",
      av: r.photo || AVATAR_PLACEHOLDER,
      stars: 5,
      date: "",
      text: r.review || "",
      reviewType: r.reviewType || "text",
      videoUrl: r.videoUrl || r.review || "",
    }))
    : REVIEWS;

  const [current, setCurrent] = useState(0);
  const perPage = 2;
  const total = Math.max(allReviews.length - perPage + 1, 1);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % total),
      4000
    );
    return () => clearInterval(t);
  }, [total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);
  const visible = allReviews.slice(current, current + perPage);
  return (
    <div className="pd-reviews-wrap">
      <div className="pd-sec-eyebrow">
        <span className="pd-eyebrow-line" />
        <i className="fas fa-om" /> Devotee Experiences & Reviews{" "}
        <i className="fas fa-om" />
        <span className="pd-eyebrow-line" />
      </div>
      <div className="pd-rev-slider">
        <button className="pd-rev-arr left" onClick={prev}>
          <i className="fas fa-chevron-left" />
        </button>
        <div className="pd-rev-grid">
          {visible.map((r, i) => (
            <div key={`${current}-${i}`} className="pd-rev-card">
              {r.reviewType === "video" && r.videoUrl ? (
                <div style={{ marginBottom: 10 }}>
                  <iframe
                    width="100%"
                    height="160"
                    src={r.videoUrl.replace("youtu.be/", "www.youtube.com/embed/").replace(/\?.*/, "")}
                    frameBorder="0"
                    allowFullScreen
                    style={{ borderRadius: 8 }}
                  />
                </div>
              ) : null}
              <div className="pd-rev-user">
                <img
                  className="pd-rev-av"
                  src={r.av}
                  alt={r.name}
                  onError={handleImgError(AVATAR_PLACEHOLDER)}
                />
                <div>
                  <div className="pd-rev-name">{r.name}</div>
                  <div className="pd-rev-loc">{r.loc}</div>
                </div>
              </div>
              <div className="pd-rev-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className={`fa${s <= r.stars ? "s" : "r"} fa-star`}
                  />
                ))}
              </div>
              <p className="pd-rev-text">{r.text}</p>
              <div className="pd-rev-footer">
                <span className="pd-rev-date">{r.date}</span>
                <span className="pd-rev-verified">
                  <i className="fas fa-check-circle" /> Verified Devotee
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="pd-rev-arr right" onClick={next}>
          <i className="fas fa-chevron-right" />
        </button>
      </div>
      <div className="pd-rev-dots">
        {Array.from({ length: Math.max(total, 1) }).map((_, i) => (

          <div
            key={i}
            className={`pd-rev-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
const PujaDetails = () => {
  const { name, id } = useParams();
  const timer = useCountdown();
  const { isLoggedIn } = useStorage();

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pujaDetails, setPujaDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedPackageData, setSelectedPackageData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingPackageType, setPendingPackageType] = useState(null);

  // Tracks whether the packages section is currently on screen, so the
  // mobile sticky "Select Puja Package" bar can hide itself there instead
  // of overlapping that section.
  const [packagesSectionVisible, setPackagesSectionVisible] = useState(false);

  useEffect(() => {
    fetchPujaDetails();
  }, [id]);

  const fetchPujaDetails = async () => {
    try {
      setLoading(true);
      const response = await PujaService.getPujaListById(id);
      if (response?.status && response.data) {
        setPujaDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Watch the packages section so the mobile sticky button can hide
  // itself while that section is already on screen. Uses two different
  // thresholds for showing vs. hiding (hysteresis) so it doesn't flicker
  // right at the boundary, and is debounced on scroll only — no 'resize'
  // listener, since mobile browsers fire resize events as their address
  // bar auto-hides/shows while scrolling, which would otherwise cause
  // this to re-fire dozens of times a second and flicker.
  useEffect(() => {
    if (!pujaDetails) return undefined;
    const el = document.getElementById("pd-packages-section");
    if (!el) return undefined;

    let debounceTimer = null;
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      setPackagesSectionVisible((prev) =>
        prev
          ? rect.bottom > 80 && rect.top < viewportHeight
          : rect.top < viewportHeight * 0.6 && rect.bottom > 0
      );
    };

    const onScroll = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(checkVisibility, 120);
    };

    checkVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pujaDetails]);

  const handleSelectPackage = (type) => {
    if (!isLoggedIn) {
      setPendingPackageType(type);
      setShowLoginModal(true);
      return;
    }
    proceedSelectPackage(type);
  };

  const proceedSelectPackage = (type) => {
    const isFamily = type === "family";

    // Find actual package from API packages array
    const chosenPkg = isFamily
      ? pujaDetails?.packages?.find(p =>
        p.packageType?.toLowerCase() === "family"
      ) || pujaDetails?.packages?.[pujaDetails.packages.length - 1]
      : pujaDetails?.packages?.find(p =>
        p.packageType?.toLowerCase() === "individual"
      ) || pujaDetails?.packages?.[0];

    const selectedPackage = {
      _id: chosenPkg?._id || "",
      packageName: chosenPkg?.packageName || "",
      packagePrice: chosenPkg?.packagePrice || 0,
      packageType: chosenPkg?.packageType || "",
      packageDescription: chosenPkg?.packageDescription || [],
    };

    const pujaData = {
      _id: pujaDetails?._id,
      title: pujaDetails?.title || "",
      mandirName: pujaDetails?.mandirName || "",
      purposeOfPooja: pujaDetails?.purposeOfPooja || "",
      aboutPuja: pujaDetails?.aboutPuja || "",
      pujaImage: pujaDetails?.pujaImage || "",
      pujaDatetime: pujaDetails?.pujaDatetime || pujaDetails?.pujaDate || null,
      pujaDate: pujaDetails?.pujaDate || "",
      duration: pujaDetails?.duration || "45–60 Min",
      pujaType: chosenPkg?.packageType || "Vedic Ritual",
      addons: pujaDetails?.addons || [],
      homeDeliveryAddons: pujaDetails?.homeDeliveryAddons || [],
      packages: pujaDetails?.packages || [],
      faq: pujaDetails?.faq || [],
      reviews: pujaDetails?.reviews || [],
    };

    setSelectedPackageData({ pujaData, selectedPackage });
    setShowUserModal(true);
  };

  const handleModalClose = () => {
    setShowUserModal(false);
  };

  // Builds the share text/url once so both handlers stay in sync
  const getShareData = () => {
    const url = window.location.href;
    const title = pujaDetails?.title || "Sacred Puja";
    const text = `Join me in this sacred puja "${title}" on DiviniQ 🙏`;
    return { url, title, text };
  };

  const handleWhatsAppShare = () => {
    const { url, text } = getShareData();
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    const { url, title, text } = getShareData();
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.log(err);
      }
    }
  };

  // If the user completes login while a package selection was pending,
  // automatically continue on to the booking form.
  useEffect(() => {
    if (isLoggedIn && pendingPackageType) {
      setShowLoginModal(false);
      proceedSelectPackage(pendingPackageType);
      setPendingPackageType(null);
    }
  }, [isLoggedIn, pendingPackageType])
  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <style>{`
          @keyframes pd-spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pd-pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "4px solid #f0e0c0",
            borderTopColor: "#7B1F3A",
            animation: "pd-spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#7B1F3A",
            letterSpacing: 0.3,
            animation: "pd-pulse 1.4s ease-in-out infinite",
          }}
        >
          <i className="fas fa-om" style={{ marginRight: 8, color: "#c8952a" }} />
          Loading Puja Details...
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page">
      <ScrollTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />

      <PujaUserDetailsModal
        isOpen={showUserModal}
        onClose={handleModalClose}
        cart={selectedPackageData?.selectedPackage}
        page="puja"
        puja={selectedPackageData?.pujaData}
        selectedPackage={selectedPackageData?.selectedPackage}
      />

      <LoginOTPModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingPackageType(null);
        }}
      />

      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      <style>{`
        .pd-mobile-proceed-wrap { display: none; }
        @media (max-width: 767px) {
          .pd-mobile-proceed-wrap {
            display: block;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 998;
            padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
            background: #fff;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
          }
          .pd-mobile-proceed-btn {
            width: 100%;
            background: linear-gradient(135deg, #7B1F3A, #5a1329);
            color: #fff;
            border: none;
            border-radius: 999px;
            padding: 14px;
            font-weight: 700;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
          }
        }
      `}</style>

      {/* ── BREADCRUMB ── */}
      <div className="pd-bc">
        <div className="pd-bc-inner">
          <Link to="/">Home</Link>
          <i className="fas fa-angle-right" />
          <Link to="/puja">Puja</Link>
          <i className="fas fa-angle-right" />
          <span>{name?.replace(/-/g, " ") || pujaDetails?.puja_name}</span>
        </div>
      </div>

      {/* ══ HERO ══ */}
      <div className="pd-hero">
        <div className="pd-hero-bg" />
        <div className="pd-hero-overlay" />
        <div className="pd-hero-body">
          <div className="pd-avail-badge">
            <i className="fas fa-exclamation-triangle" /> Limited Availability –
            Final Day to Participate
          </div>
          <div className="pd-featured-lbl">FEATURED PUJA</div>
          <h1 className="pd-hero-title">{pujaDetails?.title}</h1>

          {/* ─── ABOUT PUJA: 3-line clamp, no toggle ─── */}
          <p
            className="pd-hero-desc"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {pujaDetails?.aboutPuja}
          </p>

          <div className="pd-hero-tags">
            <span className="pd-hero-tag">
              <i className="fas fa-map-marker-alt" /> {pujaDetails?.mandirName}
            </span>
            <span className="pd-hero-tag">
              <i className="fas fa-calendar-alt" />{" "}
              {pujaDetails?.pujaDate
                ? (() => {
                  const d = new Date(pujaDetails.pujaDate);
                  return isNaN(d.getTime())
                    ? pujaDetails.pujaDate
                    : d.toLocaleString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                })()
                : ""}
            </span>
          </div>
          <p className="pd-devotee-note">
            <i className="fas fa-exclamation-circle" /> Over{" "}
            <strong>3,00,000+ devotees</strong> have participated in pujas
            conducted by DiviniQ.
          </p>
          <div className="pd-hero-trust">
            {[
              { icon: "fas fa-gopuram", title: "Temple Certified", sub: "Authentic & Verified" },
              { icon: "fas fa-user-graduate", title: "Expert Pandits", sub: "Vedic & Experienced" },
              { icon: "fas fa-lock", title: "100% Secure", sub: "Payments" },
              { icon: "fas fa-box", title: "Prasad Delivery", sub: "To Your Home" },
            ].map((t, i) => (
              <div key={i} className="pd-hero-trust-item">
                <div className="pd-hero-trust-ico">
                  <i className={t.icon} />
                </div>
                <div className="pd-hero-trust-title">{t.title}</div>
                <div className="pd-hero-trust-sub">{t.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BOOKING CARD ── */}
        <div className="pd-booking-card">
          <div className="pd-bc-badge">
            <i className="fas fa-fire" /> Featured Offering
          </div>
          <div className="pd-bc-price-row">
            <div className="pd-bc-price">
              <span className="pd-bc-price-sym">₹</span>
              {pujaDetails?.packages?.[0]?.packagePrice || 0}
            </div>
            <div className="pd-bc-per">per person</div>
          </div>
          <div className="pd-bc-checks">
            {[pujaDetails?.purposeOfPooja, pujaDetails?.mandirName, pujaDetails?.packages?.[0]?.packageType].map((item, i) => (
              <div key={i} className="pd-bc-check">
                <i className="fas fa-check-circle" />
                {/* ─── purposeOfPooja can be long — truncate at 80 chars ─── */}
                <span>
                  {i === 0 && item && item.length > 80 ? (
                    <ExpandableText text={item} maxChars={80} />
                  ) : (
                    item
                  )}
                </span>
              </div>
            ))}
            <div className="pd-bc-check pd-bc-check--devotee">
              <i className="fas fa-check-circle" />
              <span>
                Over <strong>3,00,000+ devotees</strong> have participated in
                pujas conducted by DiviniQ.
              </span>
            </div>
          </div>
          <button
            className="pd-bc-btn"
            onClick={() => handleSelectPackage("individual")}
          >
            Select Puja Package
          </button>
          <div className="pd-bc-secure mb-5"  >
            <span className="pd-bc-secure-lbl">Secure Payments</span>
            <div className="pd-bc-pay-icons">
              <img src="/assets/img/about/upi.png" alt="UPI" className="pd-pay-img"
                onError={(e) => { e.target.style.display = "none"; }} />
              <img src="/assets/img/about/visa.png" alt="Visa" className="pd-pay-img"
                onError={(e) => { e.target.style.display = "none"; }} />
              <img src="/assets/img/about/mastercard.png" alt="Mastercard" className="pd-pay-img pd-pay-img--mc"
                onError={(e) => { e.target.style.display = "none"; }} />
              <img src="/assets/img/about/rupay.png" alt="RuPay" className="pd-pay-img"
                onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══ COUNTDOWN ══ */}
      <div
        className="pd-countdown"
        style={{ backgroundImage: "url('/assets/img/about/ABUTBG2.png')" }}
      >
        <div className="pd-cd-overlay" />
        <img
          src="/assets/img/about/diya.png"
          alt=""
          className="pd-cd-diya"
          onError={(e) => (e.target.style.display = "none")}
        />
        <div className="pd-cd-center">
          <div className="pd-cd-title">
            <span className="pd-cd-title-line" />
            <i className="fas fa-om" /> Booking Ends In <i className="fas fa-om" />
            <span className="pd-cd-title-line" />
          </div>
          <div className="pd-cd-timer">
            {[
          
              { val: timer.d, len: 3, lbl: "Days" },
              { val: timer.h, len: 2, lbl: "Hours" },
              { val: timer.m, len: 2, lbl: "Minutes" },
              { val: timer.s, len: 2, lbl: "Seconds" },
            ].map((t, i) => (
              <React.Fragment key={t.lbl}>
                {i > 0 && <span className="pd-cd-sep">›</span>}
                <div className="pd-cd-box">
                  <div className="pd-cd-num">{pad(t.val, t.len)}</div>
                  <div className="pd-cd-lbl">{t.lbl}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="pd-cd-right">
          
           <a href="#"
            className="pd-cd-share"
            onClick={(e) => {
              e.preventDefault();
              handleNativeShare();
            }}
          >
            <i className="fas fa-share-alt" /> Share with your loved ones
          </a>
          
          <a  href="#"
            className="pd-cd-share whatsapp"
            onClick={(e) => {
              e.preventDefault();
              handleWhatsAppShare();
            }}
          >
            <i className="fab fa-whatsapp" /> Share on WhatsApp
          </a>
        </div>
      </div>

      {/* ══ BENEFITS ══ */}
      <div className="pd-section">
        <div className="pd-sec-eyebrow">
          <span className="pd-eyebrow-line" />
          <i className="fas fa-om" /> Sacred Outcomes <i className="fas fa-om" />
          <span className="pd-eyebrow-line" />
        </div>
        <h2 className="pd-sec-title">Benefits of This Puja & Offering</h2>
        <p className="pd-sec-sub">
          Each offering is performed with a sacred Sankalp, invoking divine
          energies that bring balance, protection, and prosperity into your life.
        </p>
        <div className="pd-benefits-grid">
          {BENEFITS.map((b, i) => (
            <div key={i} className="pd-benefit-card">
              <div className="pd-benefit-ico">
                <i className={b.icon} />
              </div>
              <div className="pd-benefit-title">{b.title}</div>
              <div className="pd-benefit-sub">{b.sub}</div>
              <p className="pd-benefit-text">
                <ExpandableText text={b.text} maxChars={160} />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ INCLUDED + HOW ══ */}
      <div className="pd-inc-how-wrap">
        <div className="pd-inc-card">
          <div className="pd-sub-title">
            <i className="fas fa-list-check" /> What's Included in This Puja?
          </div>
          <div className="pd-inc-card-inner">
            <div className="pd-inc-list">
              {INCLUDED.map((item, i) => (
                <div key={i} className="pd-inc-item">
                  <i className={item.icon} /> {item.text}
                </div>
              ))}
            </div>
            <img
              src="/assets/img/about/kalash-icon2.png"
              alt="Kalash"
              className="pd-inc-kalash"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        </div>
        <div className="pd-how-card">
          <div className="pd-sub-title">
            <i className="fas fa-route" /> How Your Puja Happens at DiviniQ
          </div>
          <div className="pd-how-steps">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="pd-how-step">
                <div className="pd-step-num">{s.num}</div>
                <div className="pd-step-ico-wrap">
                  <i className={s.icon} />
                </div>
                <div className="pd-step-title">{s.title}</div>
                <div className="pd-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ PACKAGES ══ */}
      <div className="pd-packages-wrap" id="pd-packages-section">
        <div className="pd-pkg-eyebrow">
          <span className="pd-eyebrow-line" />
          <i className="fas fa-om" /> Choose Your Puja Package{" "}
          <i className="fas fa-om" />
          <span className="pd-eyebrow-line" />
        </div>
       <div className="pd-pkg-scroll-grid" style={{
          gap: "16px",
          width: "100%",
          padding: "0 0 24px"
        }}>
          {(pujaDetails?.packages || []).map((pkg, i) => {
            const pkgImgs = [
              "/assets/img/about/devotee-woman (3).png",
              "/assets/img/about/family.png",
              "/assets/img/about/family.png",
              "/assets/img/about/family.png",
            ];
            const iconMap = ["fa-user", "fa-user-friends", "fa-users", "fa-home"];
            const btnStyles = [
              { background: "#7B1F3A", color: "#fff", border: "none" },
              { background: "#F5A623", color: "#fff", border: "none" },
              { background: "#fff", color: "#7B1F3A", border: "2px solid #7B1F3A" },
              { background: "#7B1F3A", color: "#fff", border: "none" },
            ];
            return (
            <div key={pkg._id || i} className="pd-pkg-card-inner" style={{
                background: "#fff",
                borderRadius: "20px",
                border: "1.5px solid #f0e6d3",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 0 14px",
                minWidth: 0,
                position: "relative",
              }}>
                {/* IMAGE */}
                <div className="pd-pkg-card-image" style={{
                  width: "100%",
                  aspectRatio: "5/3",
                  overflow: "hidden",
                  marginBottom: 8,
                  background: "#fdf8f2",
                }}>
                  <img
                    src={pkgImgs[i] || pkgImgs[0]}
                    alt={pkg.packageName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={handleImgError(IMAGE_PLACEHOLDER)}
                  />
                </div>

                <div className="pd-pkg-card-content" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}>
                  {/* TOP ICON CIRCLE */}
                  <div style={{
                    marginTop: "-1px",
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: "#fdf3e7",
                    border: "1.5px solid #f0e6d3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 6,
                    marginTop: 10,
                    flexShrink: 0,
                  }}>
                    <i className={`fas ${iconMap[i] || "fa-user"}`} style={{ color: "#c8952a", fontSize: 22 }} />
                  </div>

                  {/* PACKAGE NAME */}
                  <div style={{
                    fontWeight: 700,
                    fontSize: "clamp(13px, 1.4vw, 17px)",
                    color: "#3d1a1a",
                    textAlign: "center",
                    padding: "0 12px",
                    lineHeight: 1.25,
                    marginBottom: 8,
                    wordBreak: "break-word",
                  }}>
                    {pkg.packageName}
                  </div>

                  {/* TYPE BADGE */}
                  <div style={{
                    background: "#fdf3e7",
                    border: "1px solid #f0e6d3",
                    borderRadius: 20,
                    padding: "3px 14px",
                    fontSize: 11,
                    color: "#c8952a",
                    fontWeight: 600,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                    <span style={{ color: "#c8952a", fontSize: 8 }}>◆</span>
                    {pkg.packageType}
                    <span style={{ color: "#c8952a", fontSize: 8 }}>◆</span>
                  </div>

                  {/* PRICE */}
                  <div style={{
                   fontSize: "clamp(18px, 1.8vw, 26px)",
                    fontWeight: 800,
                    color: "#7B1F3A",
                    marginBottom: 2,
                  }}>
                    ₹{pkg.packagePrice}
                  </div>

                  {/* DIVIDER LINE */}
                {/* DIVIDER LINE */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 14,
                  }}>
                    {/* <span style={{ width: 20, height: 1, background: "#f0c070", display: "block" }} />
                    <span style={{ fontSize: 11, color: "#c8952a" }}>per booking</span>
                    <span style={{ width: 20, height: 1, background: "#f0c070", display: "block" }} /> */}
                  </div>

                  {/* CTA BUTTON */}
                  <button
                    className="pd-pkg-select-btn"
                    onClick={() => handleSelectPackage(pkg.packageType?.toLowerCase() === "individual" ? "individual" : "family")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.opacity = "0.88";
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(123,31,58,0.28)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={{
                      ...btnStyles[i] || btnStyles[0],
                      borderRadius: 50,
                      padding: "8px 16px",
                      fontSize: "clamp(10px, 1vw, 13px)",
                      fontWeight: 700,
                      cursor: "pointer",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginBottom: 12,
                      transition: "transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    Select Package
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <i className="fas fa-chevron-right" style={{ fontSize: 9 }} />
                    </span>
                  </button>

                  {/* DIVIDER LINE */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 14,
                  }}>
                    {/* <span style={{ width: 20, height: 1, background: "#f0c070", display: "block" }} />
                    {/* <span style={{ fontSize: 11, color: "#c8952a" }}>per booking</span> 
                    <span style={{ width: 20, height: 1, background: "#f0c070", display: "block" }} /> */}
                  </div>

                  {/* DESCRIPTION if any */}
                  {pkg.packageDescription?.length > 0 && (
                    <ul style={{ textAlign: "left", paddingLeft: 16, marginBottom: 12, fontSize: 11, color: "#888", width: "90%" }}>
                      {pkg.packageDescription.map((d, di) => (
                        <li key={di} style={{ marginBottom: 3 }}>✔ {d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="pd-trust-strip">
          {[
            { icon: "fas fa-lock", t: "100% Secure Payments" },
            { icon: "fas fa-check-circle", t: "Instant Booking Confirmation" },
            { icon: "fas fa-users", t: "Trusted by 50 Lakh+ Devotees" },
            { icon: "fas fa-box-open", t: "Prasad Delivery Guaranteed" },
          ].map((ts, i) => (
            <div key={i} className="pd-ts-item">
              <i className={ts.icon} /> {ts.t}
            </div>
          ))}
        </div>
      </div>

      {/* ══ REVIEWS ══ */}
      {/* ══ REVIEWS ══ */}
      <ReviewsSection reviews={pujaDetails?.reviews || []} />

      {/* ══ STATS BANNER ══ */}
      <div
        className="pd-stats-banner"
        style={{ backgroundImage: "url('/assets/img/about/bg3.png')" }}
      >
        {[
          { num: "3,00,000+", lbl: "Pujas Performed" },
          { num: "108+", lbl: "Temples Pan India" },
          { num: "4.9", lbl: "Average Rating", star: true },
          { num: "99%", lbl: "Devotee Satisfaction" },
        ].map((s, i) => (
          <div key={i} className="pd-stat-cell">
            <div className="pd-stat-num">
              {s.star && <span className="pd-stat-star">★ </span>}
              {s.num}
            </div>
            <div className="pd-stat-lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* ══ FAQ ══ */}
      <div className="pd-faq-wrap">
        <div className="pd-sec-eyebrow">
          <span className="pd-eyebrow-line" />
          <i className="fas fa-om" /> Frequently Asked Questions{" "}
          <i className="fas fa-om" />
          <span className="pd-eyebrow-line" />
        </div>
        <div className="pd-faq-grid">
          {(pujaDetails?.faq || FAQS).map((f, i) => (
            <FaqItem
              key={i}
              num={i + 1}
              q={f.question || f.q}
              a={f.answer || f.a}
            />
          ))}
        </div>
      </div>

      {/* ══ CTA BANNER ══ */}
      <div
        className="pd-cta-banner"
        style={{ backgroundImage: "url('/assets/img/about/last_bg.png')" }}
      >
        <div className="pd-cta-text">
          <div className="pd-cta-title">
            Perform this sacred puja and invite
          </div>
          <div className="pd-cta-sub">Divine blessings into your life.</div>
        </div>
        <button
          className="pd-bc-btn-botom"
          onClick={() => handleSelectPackage("individual")}
        >
          Select Puja Package
        </button>
      </div>

      <Footer />

      {/* ══ MOBILE STICKY SELECT PACKAGE BAR ══
          Hidden while the packages section is already on screen, so it
          doesn't overlap the "Choose Your Puja Package" cards. */}
      {!packagesSectionVisible && (
        <div className="pd-mobile-proceed-wrap">
          <button
            type="button"
            className="pd-mobile-proceed-btn"
            onClick={() => {
              document.getElementById("pd-packages-section")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Select Puja Package <i className="fas fa-arrow-right" />
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════
   PACKAGE DESCRIPTION LIST
   Shows first 3 items, "Show X More" toggles the rest
══════════════════════════════════════ */
const PackageDescList = ({ items = [], initialShow = 3 }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, initialShow);
  const remaining = items.length - initialShow;

  return (
    <ul className="pd-pkg-desc-list">
      {visible.map((item, i) => (
        <li key={i} className="pd-pkg-desc-item">
          <i className="fas fa-check-circle" style={{ color: "#c8952a", marginRight: 6 }} />
          {typeof item === "string" ? item : item?.text || item?.name || JSON.stringify(item)}
        </li>
      ))}
      {items.length > initialShow && (
        <li>
          <button
            onClick={() => setShowAll((s) => !s)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#c8952a",
              fontWeight: 600,
              fontSize: "0.88em",
              padding: "4px 0 0 0",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            {showAll
              ? "Show Less ▲"
              : `+ ${remaining} more benefit${remaining !== 1 ? "s" : ""} ▼`}
          </button>
        </li>
      )}
    </ul>
  );
};

export default PujaDetails;