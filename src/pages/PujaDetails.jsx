import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MobileMenu from "../components/layout/MobileMenu";
import PopupSearch from "../components/layout/PopupSearch";
import ScrollTop from "../components/common/ScrollTop";
import "./Pujadetails.css";
import PujaService from "../services/pujaServices";
import { Link, useParams } from "react-router-dom";

/* ─────────────────────────────────────────────
   FIX: Import the modal (was commented out before)
───────────────────────────────────────────── */
import PujaUserDetailsModal from "./pujaUserDetailsModel"; // same folder
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

const ReviewsSection = () => {
  const [current, setCurrent] = useState(0);
  const perPage = 2;
  const total = REVIEWS.length - perPage + 1;

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % total),
      4000
    );
    return () => clearInterval(t);
  }, [total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);
  const visible = REVIEWS.slice(current, current + perPage);

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
              <div className="pd-rev-user">
                <img
                  className="pd-rev-av"
                  src={r.av}
                  alt={r.name}
                  onError={(e) => {
                    e.target.style.background = "#d4a070";
                    e.target.removeAttribute("src");
                  }}
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
        {Array.from({ length: total }).map((_, i) => (
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

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [pujaDetails, setPujaDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─────────────────────────────────────────────
     FIX: Modal state + package data state
  ───────────────────────────────────────────── */
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedPackageData, setSelectedPackageData] = useState(null);

  useEffect(() => {
    fetchPujaDetails();
  }, [id]);

  const fetchPujaDetails = async () => {
    try {
      setLoading(true);
      const response = await PujaService.getPujaListById(id);
      if (response) {
        setPujaDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────
     FIX: handleSelectPackage builds both objects
     that PujaUserDetailsModal needs, then opens
     the modal (NOT navigating directly)
  ───────────────────────────────────────────── */
  const handleSelectPackage = (type) => {
    const isFamily = type === "family";

    const selectedPackage = {
      // _id is used as package_id in the cart API payload
      _id: isFamily ? "family" : "individual",
      packageName: isFamily ? "Family" : "Individual",
      packagePrice: isFamily ? pujaDetails?.family_price : pujaDetails?.price,
    };

    const pujaData = {
      _id: pujaDetails?._id,
      title: pujaDetails?.puja_name,
      mandirName: pujaDetails?.mandir_name,
      purposeOfPooja: pujaDetails?.purpose,
      pujaImage: pujaDetails?.image,
      pujaDatetime: pujaDetails?.puja_date,
      duration: pujaDetails?.duration,
      pujaType: pujaDetails?.puja_type,
      addons: pujaDetails?.addons || [],
      homeDeliveryAddons: pujaDetails?.homeDeliveryAddons || [],
    };

    setSelectedPackageData({ pujaData, selectedPackage });
    setShowUserModal(true);
  };

  const handleModalClose = () => {
    setShowUserModal(false);
    // Navigation is handled inside the modal after form submission
  };

  if (loading) return <h2 style={{ textAlign: "center", padding: "80px 0" }}>Loading...</h2>;

  return (
    <div className="pd-page">
      <ScrollTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />

      {/* ─────────────────────────────────────────────
          FIX: Modal is now properly rendered
      ───────────────────────────────────────────── */}
      <PujaUserDetailsModal
        isOpen={showUserModal}
        onClose={handleModalClose}
        cart={selectedPackageData?.selectedPackage}
        page="puja"
        puja={selectedPackageData?.pujaData}
        selectedPackage={selectedPackageData?.selectedPackage}
      />

      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

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
          <h1 className="pd-hero-title">{pujaDetails?.puja_name}</h1>
          <p className="pd-hero-desc">{pujaDetails?.puja_description}</p>
          <div className="pd-hero-tags">
            <span className="pd-hero-tag">
              <i className="fas fa-map-marker-alt" /> {pujaDetails?.mandir_name}
            </span>
            <span className="pd-hero-tag">
              <i className="fas fa-calendar-alt" /> {pujaDetails?.puja_date}
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
              {pujaDetails?.price}
            </div>
            <div className="pd-bc-per">per person</div>
          </div>
          <div className="pd-bc-checks">
            {[pujaDetails?.purpose, pujaDetails?.mandir_name, pujaDetails?.puja_type].map(
              (item, i) => (
                <div key={i} className="pd-bc-check">
                  <i className="fas fa-check-circle" />
                  <span>{item}</span>
                </div>
              )
            )}
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
          <div className="pd-bc-secure">
            <span className="pd-bc-secure-lbl">Secure Payments</span>
            <div className="pd-bc-pay-icons">
              <img src="/assets/img/about/upi.png" alt="UPI" className="pd-pay-img" />
              <img src="/assets/img/about/visa.png" alt="Visa" className="pd-pay-img" />
              <img src="/assets/img/about/mastercard.png" alt="Mastercard" className="pd-pay-img pd-pay-img--mc" />
              <img src="/assets/img/about/rupay.png" alt="RuPay" className="pd-pay-img" />
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
          <a href="#" className="pd-cd-share">
            <i className="fas fa-share-alt" /> Share with your loved ones
          </a>
          <a href="#" className="pd-cd-share whatsapp">
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
              <p className="pd-benefit-text">{b.text}</p>
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
      <div className="pd-packages-wrap">
        <div className="pd-pkg-eyebrow">
          <span className="pd-eyebrow-line" />
          <i className="fas fa-om" /> Choose Your Puja Package{" "}
          <i className="fas fa-om" />
          <span className="pd-eyebrow-line" />
        </div>
        <div className="pd-pkg-grid">
          {[
            {
              type: "Individual",
              ideal: "Ideal for 1 person",
              price: `₹${pujaDetails?.price}`,
              per: "per person",
              img: "/assets/img/about/devotee-woman (3).png",
            },
            {
              type: "Family",
              ideal: "Ideal for Family Participation",
              price: `₹${pujaDetails?.family_price}`,
              per: "per family /time",
              img: "/assets/img/about/family.png",
            },
          ].map((pkg, i) => (
            <div key={i} className="pd-pkg-card">
              <img
                className="pd-pkg-img"
                src={pkg.img}
                alt={pkg.type}
                onError={(e) => {
                  e.target.style.background = "#e8d5c0";
                  e.target.removeAttribute("src");
                }}
              />
              <div className="pd-pkg-info">
                <div className="pd-pkg-type">{pkg.type}</div>
                <div className="pd-pkg-ideal">{pkg.ideal}</div>
                <div className="pd-pkg-price">{pkg.price}</div>
                <div className="pd-pkg-per">{pkg.per}</div>
                <button
                  className="pd-pkg-btn"
                  onClick={() =>
                    handleSelectPackage(
                      pkg.type === "Family" ? "family" : "individual"
                    )
                  }
                >
                  Select Package
                </button>
              </div>
            </div>
          ))}
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
      <ReviewsSection />

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
          {FAQS.map((f, i) => (
            <FaqItem key={i} num={i + 1} q={f.q} a={f.a} />
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
          className="pd-bc-btn"
          onClick={() => handleSelectPackage("individual")}
        >
          Select Puja Package
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default PujaDetails;