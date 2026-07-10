import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ChadhavaService from '../services/chadhavaServices';
import apiService from '../services/apiServices';
import './ChadhavaDetail.css';
import Header from '../components/layout/Header';
import LoginOTPModal from '../components/accounts/LoginOTPModel';
import { useStorage } from '../context/StorageContext';
import Footer from "../components/layout/Footer";


const useCountdown = (targetDate) => {
  const calc = () => {
    if (!targetDate) return { d: 0, h: 0, m: 0, s: 0 };
    const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc());
  useEffect(() => {
    const tick = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);
  return t;
};

const pad = n => String(n).padStart(2, '0');

// Inline SVG placeholders — these are data URIs, so they never trigger a
// network request and can never themselves fail to load. Used whenever a
// real image URL (from the API or demo content) fails.
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

// Swaps to a placeholder exactly once — the dataset flag stops any
// possibility of a retry loop even if this somehow fires more than once.
const handleImgError = (fallbackSrc) => (e) => {
  const img = e.currentTarget;
  if (img.dataset.fallback === 'done') return;
  img.dataset.fallback = 'done';
  img.src = fallbackSrc;
};

const clampStyle = (expanded) =>
  !expanded
    ? {
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }
    : undefined;

const FaqItem = ({ num, q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="cd-faq-item" onClick={() => setOpen(o => !o)}>
      <div className="cd-faq-q">
        <span className="cd-faq-num">{pad(num)}</span>
        <span className="cd-faq-text">{q}</span>
        <div className="cd-faq-icon"><i className={`fas fa-${open ? 'minus' : 'plus'}`} /></div>
      </div>
      {open && <div className="cd-faq-ans">{a}</div>}
    </div>
  );
};

/* Simple "View All" popup — same pattern as AstrologerDetail's ViewAllPopup */
const ViewAllReviewsPopup = ({ reviews, onClose }) => (
  <div
    style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}
    onClick={onClose}
  >
    <div
      style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 640,
        maxHeight: '82vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 22px', borderBottom: '1px solid #f0e8e0',
      }}>
        <h5 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#7b1a3a' }}>All Devotee Reviews</h5>
        <button
          onClick={onClose}
          style={{
            width: 30, height: 30, borderRadius: '50%', border: '1.5px solid #e5e7eb',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <div style={{ padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {reviews.map((r, i) => (
          <div key={i} className="cd-rev-card" style={{ width: '100%' }}>
            <div className="cd-rev-card-body">
              <div className="cd-rev-stars">
                {[1, 2, 3, 4, 5].map(s => <i key={s} className={`fa${s <= Math.floor(r.rating) ? 's' : 'r'} fa-star`} />)}
                <span>{r.rating}</span>
              </div>
              <div className="cd-rev-text">{r.text}</div>
              <div className="cd-rev-user">
                <img className="cd-rev-av" src={r.avatar} alt={r.name} onError={handleImgError(AVATAR_PLACEHOLDER)} />
                <div>
                  <div className="cd-rev-name">{r.name}</div>
                  <div className="cd-rev-loc">{r.city}</div>
                </div>
              </div>
            </div>
            <img className="cd-rev-img" src={r.img} alt="Prasad" onError={handleImgError(IMAGE_PLACEHOLDER)} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* demo image fallbacks — only used until real images exist for these
   specific sections (reviews / similar / gallery), since the API doesn't
   appear to provide them yet */
// const DEMO_PRASAD = [
//   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
//   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
//   'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=200&h=200&fit=crop',
//   'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
// ];
// const DEMO_SIM = [
//   'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=150&h=150&fit=crop',
//   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
//   'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=150&h=150&fit=crop',
//   'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=150&h=150&fit=crop',
//   'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop',
//   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop',
//   'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=150&h=150&fit=crop',
//   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop',
// ];
// const DEMO_GAL = [
//   'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=120&h=90&fit=crop',
//   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=90&fit=crop',
//   'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=120&h=90&fit=crop',
//   'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=90&fit=crop',
// ];
// const DEMO_AVATAR = [
//   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
//   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
//   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
//   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
// ];

const DEFAULT_INC = [
  { icon: 'fas fa-user-edit', name: 'Sankalp', sub: 'In your name' },
  { icon: 'fas fa-fire', name: 'Vedic Rituals', sub: 'By Expert Pandits' },
  { icon: 'fas fa-music', name: 'Mantra Chanting', sub: 'For Divine Blessings' },
  { icon: 'fas fa-box', name: 'Prasad', sub: 'Blessed & Pure' },
  { icon: 'fas fa-video', name: 'Photos & Videos', sub: 'Live Updates' },
];

const DEFAULT_HOW = [
  { num: '01', label: 'Choose Your Chadhava' },
  { num: '02', label: 'Make Secure Payment' },
  { num: '03', label: 'Puja Performed By Pandits' },
  { num: '04', label: 'Receive Prasad & Updates' },
];

const DEFAULT_FAQS = [
  { q: 'How do I begin the process of purchasing a Chadhava?', a: 'Simply select your desired Chadhava, fill in your Sankalp details, and complete the secure payment. Our team will handle the rest.' },
  { q: 'What are closing costs and who typically pays them?', a: 'The price shown includes all ritual costs. There are no hidden charges. Prasad delivery has a nominal fee.' },
  { q: 'What should I look for when selecting a Chadhava?', a: 'Consider the deity, the significance of the day, and your personal intention. Our experts are available to guide you.' },
  { q: 'How can I negotiate effectively when buying property?', a: 'For Chadhava queries, please contact our support team via WhatsApp or call center.' },
  { q: 'How can I determine the right Chadhava for me?', a: 'Share your birth details and current challenges with our astrologers. They will recommend the most beneficial Chadhava.' },
  { q: 'Is a home inspection really necessary?', a: 'All our pandits are verified and experienced. You will receive real-time video updates during the ritual.' },
];

/* ══════════════════════════════════════ */
const ChadhavaDetails = () => {
  const { id } = useParams(); // route: /chadhava/:name/:id
  const navigate = useNavigate();
  const { isLoggedIn } = useStorage();

  const [chadhava, setChadhava] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  // Remembers which "Add" the user was trying to make when the login
  // modal interrupted them, so we can finish that action automatically
  // once they log in successfully.
  const [pendingAction, setPendingAction] = useState(null); // { type: 'addon' | 'prasad', id }

  const [revDot, setRevDot] = useState(0);
  const [simIdx, setSimIdx] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // --- Cart state ---
  const [addonQtys, setAddonQtys] = useState({});   // { addon_id: qty }
  const [prasadQtys, setPrasadQtys] = useState({}); // { prasad_id: qty }
  const [cartSyncing, setCartSyncing] = useState(false);

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Tracks whether the "select your package" (addons/prasad) section is
  // currently visible on screen, so the mobile sticky button can hide
  // itself there instead of overlapping that section.
  const [addonsSectionVisible, setAddonsSectionVisible] = useState(false);

  const SIM_VISIBLE = 4;

  useEffect(() => {
    let isMounted = true;
    const fetchChadhava = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await ChadhavaService.getChadhavaListById(id);
        if (!isMounted) return;
        if (res?.status) {
          const record = Array.isArray(res.data) ? res.data[0] : (res.data || res.chadhava || res);
          setChadhava(record || null);
          if (!record) setError(true);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Chadhava details fetch error:', err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (id) fetchChadhava();
    return () => { isMounted = false; };
  }, [id]);

  // --- Pre-fill cart quantities if this chadhava is already in the server cart ---
  useEffect(() => {
    let isMounted = true;
    const fetchCart = async () => {
      try {
        const res = await apiService.postBearer('https://admin.diviniq.in/puja/getChadhavaCart', {});
        if (!isMounted) return;
        if (res?.status && Array.isArray(res.data) && res.data.length > 0) {
          const rawData = res.data[0];
          if (rawData.chadhava_id?._id === chadhava?._id) {
            const aQ = {};
            (rawData.addons_selected || []).forEach(sel => { aQ[sel.addon_id] = sel.qty; });
            setAddonQtys(aQ);

            const pQ = {};
            (rawData.prasad_selected || []).forEach(sel => { pQ[sel.prasad_id] = sel.qty; });
            setPrasadQtys(pQ);
          }
        }
      } catch (err) {
        console.error('Cart fetch error:', err);
      }
    };
    // Skip the call entirely when logged out — the endpoint requires auth
    // and will always 401, so there's nothing useful to pre-fill yet.
    if (chadhava?._id && isLoggedIn) fetchCart();
    return () => { isMounted = false; };
  }, [chadhava?._id, isLoggedIn]);

  const timer = useCountdown(chadhava?.offerEndsAt);

  // Watch the "select your package" section so the mobile sticky button
  // can hide itself while that section is already on screen. Uses two
  // different thresholds for showing vs. hiding (hysteresis) so the
  // button doesn't flicker right at the boundary. Debounced on scroll
  // only (no 'resize' listener) — mobile browsers fire resize events
  // as their address bar auto-hides/shows while scrolling, which was
  // causing this to re-fire dozens of times a second and flicker.
  useEffect(() => {
    if (!chadhava) return undefined;
    const el = document.getElementById('addons-section');
    if (!el) return undefined;

    let debounceTimer = null;
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      setAddonsSectionVisible((prev) =>
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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [chadhava]);


  // Proceed no longer gates on login — by the time there's anything in the
  // cart, the user must already have logged in via the Add button flow below.
  const handleProceed = () => {
    navigate('/chadhava_review_booking', {
      state: {
        chadhavaId: chadhava._id,
        addonIds: Object.keys(addonQtys),
        prasadIds: Object.keys(prasadQtys),
      },
    });
  };

  // --- Sync current selections to server cart ---
  const syncCart = async (nextAddonQtys, nextPrasadQtys) => {
    if (!chadhava?._id) return;
    setCartSyncing(true);
    try {
      const payload = {
        chadhava_id: chadhava._id,
        addons_selected: Object.entries(nextAddonQtys)
          .filter(([, qty]) => qty > 0)
          .map(([addon_id, qty]) => ({ addon_id, qty })),
        prasad_selected: Object.entries(nextPrasadQtys)
          .filter(([, qty]) => qty > 0)
          .map(([prasad_id, qty]) => ({ prasad_id, qty })),
      };
      await apiService.postBearer('https://admin.diviniq.in/puja/ChadhavaaddToCart', payload);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setCartSyncing(false);
    }
  };

  const changeAddonQty = (addonId, delta) => {
    setAddonQtys((prev) => {
      const current = prev[addonId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[addonId];
      } else {
        updated[addonId] = next;
      }
      syncCart(updated, prasadQtys);
      return updated;
    });
  };

  const changePrasadQty = (prasadId, delta) => {
    setPrasadQtys((prev) => {
      const current = prev[prasadId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[prasadId];
      } else {
        updated[prasadId] = next;
      }
      syncCart(addonQtys, updated);
      return updated;
    });
  };

  // --- Gate the initial "Add" tap on login ---
  const handleAddonAddClick = (addonId) => {
    if (!isLoggedIn) {
      setPendingAction({ type: 'addon', id: addonId });
      setShowLoginModal(true);
      return;
    }
    changeAddonQty(addonId, 1);
  };

  const handlePrasadAddClick = (prasadId) => {
    if (!isLoggedIn) {
      setPendingAction({ type: 'prasad', id: prasadId });
      setShowLoginModal(true);
      return;
    }
    changePrasadQty(prasadId, 1);
  };

  // Once login succeeds while the modal was open, finish whichever
  // "Add" the user originally tapped.
  useEffect(() => {
    if (isLoggedIn && showLoginModal && pendingAction) {
      setShowLoginModal(false);
      if (pendingAction.type === 'addon') {
        changeAddonQty(pendingAction.id, 1);
      } else if (pendingAction.type === 'prasad') {
        changePrasadQty(pendingAction.id, 1);
      }
      setPendingAction(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="pd-page">
        <Header
          onMenuToggle={() => setShowMobileMenu(true)}
          onSideMenuToggle={() => setShowSideMenu(true)}
          onSearchToggle={() => setShowSearch(true)}
        />
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <div className="spinner-border text-theme" role="status"></div>
        </div>
      </div>
    );
  }

  if (error || !chadhava) {
    return (
      <div className="pd-page">
        <Header
          onMenuToggle={() => setShowMobileMenu(true)}
          onSideMenuToggle={() => setShowSideMenu(true)}
          onSearchToggle={() => setShowSearch(true)}
        />
        <div style={{ textAlign: 'center', padding: '120px 20px' }}>
          <h3>Chadhava Not Found</h3>
          <p>We couldn't load this offering. It may have been removed.</p>
          <Link to="/chadhava" className="th-btn rounded-pill mt-3 d-inline-block">
            Browse All Chadhava
          </Link>
        </div>
      </div>
    );
  }

  const title = chadhava.title || 'Chadhava Offering';
  const heroImage = chadhava.chadhavaImage || chadhava.bannerImages?.[0] || '/assets/img/chadawa_detail/pooja_group.png';
  const galleryImages = chadhava.galleryImages?.length ? chadhava.galleryImages : [IMAGE_PLACEHOLDER, IMAGE_PLACEHOLDER, IMAGE_PLACEHOLDER, IMAGE_PLACEHOLDER];  const rating = chadhava.rating || 4.9;
  const reviewsCount = chadhava.reviewsCount || chadhava.reviews?.length || 0;
  const devoteesCount = chadhava.devoteesCount || '50K+';
  const price = chadhava.price ?? 0;
  const priceDesc = chadhava.description || chadhava.short_description || '';
  const templeName = chadhava.templeName || 'Verified Temple';
  const seatsLeft = chadhava.seatsLeft;

  const features = chadhava.features?.length ? chadhava.features : [
    { icon: 'fas fa-gopuram', label: templeName },
    { icon: 'fas fa-om', label: 'Sacred Deity Blessings' },
    { icon: 'fas fa-user-graduate', label: 'Expert Pandits' },
    { icon: 'fas fa-box-open', label: 'Holy Prasad' },
  ];

  const ADDONS = chadhava.addons?.length
    ? chadhava.addons.map((a) => ({
        id: a._id || a.id,
        name: a.pname || a.name,
        sub: a.subtitle || a.description || '',
        price: a.pamount ? `₹${a.pamount}` : (a.price ? `₹${a.price}` : ''),
        rawPrice: a.pamount || a.price || 0,
        img: a.pimage || a.image,
      }))
    : [];

  const PRASAD = chadhava.prasad?.length
    ? chadhava.prasad.map((p) => ({
        id: p._id || p.id,
        name: p.name,
        sub: p.subtitle || p.description || '',
        price: p.amount ? `₹${p.amount}` : (p.price ? `₹${p.price}` : ''),
        rawPrice: p.amount || p.price || 0,
        img: p.image,
      }))
    : [];

  const addonsTotal = ADDONS.reduce((sum, a) => sum + (addonQtys[a.id] || 0) * a.rawPrice, 0);
  const prasadTotal = PRASAD.reduce((sum, p) => sum + (prasadQtys[p.id] || 0) * p.rawPrice, 0);
  const totalItemsCount =
    Object.values(addonQtys).reduce((s, q) => s + q, 0) +
    Object.values(prasadQtys).reduce((s, q) => s + q, 0);
  const cartTotalAmount = price + addonsTotal + prasadTotal;

  const INC = chadhava.included?.length
    ? chadhava.included.map((i) => ({ icon: i.icon || 'fas fa-check', name: i.name, sub: i.subtitle || '' }))
    : DEFAULT_INC;

  const HOW = chadhava.howItWorks?.length
    ? chadhava.howItWorks.map((h, i) => ({ num: pad(i + 1), label: h.label || h }))
    : DEFAULT_HOW;

  const aboutTitle = chadhava.aboutTitle || `About ${title}`;
  const aboutText = chadhava.aboutText || chadhava.description || '';
  const ABOUT_ITEMS = chadhava.aboutPoints?.length ? chadhava.aboutPoints : [
    'It removes financial obstacles and debt',
    'Brings harmony, peace & family happiness',
    'Blessings for career growth & success',
    'Protection from Shani Dosha & bad karma',
  ];

  const FAQS = chadhava.faqs?.length
    ? chadhava.faqs.map((f) => ({ q: f.question || f.q, a: f.answer || f.a }))
    : DEFAULT_FAQS;

  const REVIEWS = chadhava.reviews?.length
    ? chadhava.reviews.map((r) => ({
        rating: r.rating || 5,
        text: r.text || r.comment || '',
        name: r.name || r.userName || 'Devotee',
        city: r.city || '',
        avatar: r.avatar || AVATAR_PLACEHOLDER,
        img: r.image || IMAGE_PLACEHOLDER,
      }))
    : [];

  const slugify = (text) =>
    (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const SIMILAR = chadhava.similar?.length
    ? chadhava.similar.map((s) => ({
        name: s.title || s.name,
        price: s.price ? `₹${s.price}` : '',
        rating: s.rating || 4.8,
        img: s.chadhavaImage || s.image || IMAGE_PLACEHOLDER,
        id: s._id || s.id,
      }))
    : [];

  const simMax = Math.max(0, SIMILAR.length - SIM_VISIBLE);

  return (
    <div className="pd-page" style={{ paddingBottom: totalItemsCount > 0 ? '100px' : undefined }}>
      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      <LoginOTPModal
        isOpen={showLoginModal}
        onClose={() => { setShowLoginModal(false); setPendingAction(null); }}
      />

      <style>{`
        .cd-mobile-proceed-wrap { display: none; }
        @media (max-width: 767px) {
          .cd-mobile-proceed-wrap {
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
          .cd-mobile-proceed-btn {
            width: 100%;
            background: linear-gradient(135deg, #7B1C38, #5a1329);
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
      <div className="cd-bc">
        <Link to="/">Home</Link>&nbsp;›&nbsp;
        <Link to="/chadhava">Chadhava</Link>&nbsp;›&nbsp;
        <span>{title}</span>
      </div>

      {/* ══ HERO ══ */}
      <div className="cd-hero">
        <div className="cd-hero-left">
          <div className="cd-hero-bg" />
          {/* <img className="cd-hero-deity-img" src={heroImage} alt={title}
            onError={handleImgError(IMAGE_PLACEHOLDER)} /> */}
          <div className="cd-hero-bg-overlay" />
          <div className="cd-hero-body">
            <div className="cd-auspicious"><i className="fas fa-crown" /> Most Auspicious – Limited Day</div>
            <h1 className="cd-hero-h1">{title}</h1>
            <div className="cd-hero-meta">
              <div className="cd-meta-item">
                {[1, 2, 3, 4, 5].map(s => (
                  <i key={s} className={`fa${s <= Math.round(rating) ? 's' : 'r'} fa-star`} />
                ))}
                &nbsp;{rating} ({(reviewsCount || 0).toLocaleString?.() || reviewsCount} Reviews)
              </div>
              <span className="cd-meta-sep">|</span>
              <div className="cd-meta-item"><i className="fas fa-users" /> {devoteesCount} Devotees</div>
              <span className="cd-meta-sep">|</span>
              <div className="cd-meta-item"><i className="fas fa-gopuram" /> Temple Certified</div>
            </div>
            <div className="cd-features">
              {features.map((f, i) => (
                <div key={i} className="cd-feat"><i className={f.icon} /> {f.label}</div>
              ))}
            </div>
            <div className="cd-gallery">
              {galleryImages.slice(0, 4).map((src, i) => (
                <img key={i} className="cd-gal-img" src={src} alt={`Gallery ${i + 1}`}
                  onError={handleImgError(IMAGE_PLACEHOLDER)} />
              ))}
              <div className="cd-gal-more">
                <span className="gm-num">View</span><br />
                <span className="gm-num">{chadhava.galleryCount || `${galleryImages.length}+`}</span><br />
                <span className="gm-lbl">Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT booking card */}
       <div className="cd-hero-right">
          <img
            className="cd-hero-watermark"
            src="/assets/img/pooja_fill/lotuskalash.png"
            alt=""
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="cd-avail-bar">
            <div className="cd-avail-pill"><i className="fas fa-exclamation-circle" /> Limited Availability</div>
            {seatsLeft != null && (
              <div className="cd-seats-pill">Only {seatsLeft} Seats Left</div>
            )}
          </div>
          {chadhava.offerEndsAt && (
            <>
              <div className="cd-offer-row">
                <i className="cd-offer-ico fas fa-clock" />
                <span className="cd-offer-txt">Offer closes in</span>
              </div>
              <div className="cd-mini-timer">
                {[{ val: pad(timer.d), lbl: 'Days' }, null, { val: pad(timer.h), lbl: 'Hours' }, null, { val: pad(timer.m), lbl: 'Mins' }, null, { val: pad(timer.s), lbl: 'Secs' }].map((item, i) =>
                  item === null
                    ? <span key={i} className="cd-mini-sep">:</span>
                    : <div key={i} className="cd-mini-box"><div className="cd-mini-num">{item.val}</div><div className="cd-mini-lbl">{item.lbl}</div></div>
                )}
              </div>
            </>
          )}
          <div className="cd-feat-badge"><i className="fas fa-fire" /> Featured Offering</div>
          <div className="cd-book-price">{title}</div>
          <div className="cd-price-desc" style={clampStyle(false)}>
            {priceDesc}
          </div>
          <div className="cd-shri"><i className="fas fa-gopuram" /> {templeName}</div>
          <Link
            to="#"
            className="cd-reserve-btn"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('addons-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            Reserve Your Offering <i className="fas fa-arrow-right" />
          </Link>
          <div className="cd-secure"><i className="fas fa-lock" /> 100% Secure Payments</div>
          <div className="pd-bc-pay-icons">
            <img src="/assets/img/about/upi.png" alt="UPI" className="pd-pay-img"
              onError={e => { e.target.style.display = 'none'; }} />
            <img src="/assets/img/about/visa.png" alt="Visa" className="pd-pay-img"
              onError={e => { e.target.style.display = 'none'; }} />
            <img src="/assets/img/about/mastercard.png" alt="Mastercard" className="pd-pay-img pd-pay-img--mc"
              onError={e => { e.target.style.display = 'none'; }} />
            <img src="/assets/img/about/rupay.png" alt="RuPay" className="pd-pay-img"
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        </div>
      </div>

      {/* ══ TRUST STRIP ══ */}
      <div className="cd-trust">
        {[
          { icon: 'fas fa-gopuram', title: 'Temple Certified', sub: 'Authentic rituals from verified temples' },
          { icon: 'fas fa-user-check', title: 'Pandit Verified', sub: 'Experienced & background verified' },
          { icon: 'fas fa-box-open', title: 'Prasad Delivery', sub: 'Purified prasad delivered to your home' },
          { icon: 'fas fa-video', title: 'Live Updates', sub: 'Ritual updates & photos on WhatsApp & Email' },
        ].map((t, i) => (
          <div key={i} className="cd-trust-item">
            <div className="cd-trust-ico"><i className={t.icon} /></div>
            <div><div className="cd-trust-title">{t.title}</div><div className="cd-trust-sub">{t.sub}</div></div>
          </div>
        ))}
      </div>

      {/* ══ ADDONS + PRASAD ══ */}
      <div id="addons-section">
      {ADDONS.length > 0 && (
        <div className="cd-addons">
          <div className="cd-addons-head">
            <div className="cd-addons-title">✨ Enhance Your Seva (Add-ons)</div>
            {/* <a href="#" className="cd-view-all">View All Add-ons</a> */}
          </div>
          <div className="cd-addons-scroll">
            <button className="cd-addons-arr left"><i className="fas fa-chevron-left" /></button>
            <div className="cd-addons-row">
              {ADDONS.map((a, i) => {
                const qty = addonQtys[a.id] || 0;
                return (
                  <div key={a.id || i} className="cd-addon-card">
                    <img className="cd-addon-img" src={a.img} alt={a.name}
                      onError={handleImgError(IMAGE_PLACEHOLDER)} />
                    <div className="cd-addon-body">
                      <div className="cd-addon-name">{a.name}</div>
                      <div className="cd-addon-sub">{a.sub}</div>
                      <div className="cd-addon-price">{a.price}</div>
                      {qty === 0 ? (
                        <button
                          type="button"
                          className="cd-add-btn"
                          onClick={() => handleAddonAddClick(a.id)}
                        >
                          <i className="fas fa-plus" /> Add
                        </button>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#0b845c',
                            borderRadius: '20px',
                            padding: '4px 8px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => changeAddonQty(a.id, -1)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '16px', width: '22px', cursor: 'pointer' }}
                          >
                            −
                          </button>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>{qty}</span>
                          <button
                            type="button"
                            onClick={() => changeAddonQty(a.id, 1)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '16px', width: '22px', cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="cd-addons-arr right"><i className="fas fa-chevron-right" /></button>
          </div>
        </div>
      )}

      {/* ══ PRASAD ══ */}
      {PRASAD.length > 0 && (
        <div className="cd-addons">
          <div className="cd-addons-head">
            <div className="cd-addons-title">🙏 Add Blessed Prasad</div>
          </div>
          <div className="cd-addons-scroll">
            <div className="cd-addons-row">
              {PRASAD.map((p, i) => {
                const qty = prasadQtys[p.id] || 0;
                return (
                  <div key={p.id || i} className="cd-addon-card">
                    <img className="cd-addon-img" src={p.img} alt={p.name}
                      onError={handleImgError(IMAGE_PLACEHOLDER)} />
                    <div className="cd-addon-body">
                      <div className="cd-addon-name">{p.name}</div>
                      <div className="cd-addon-sub">{p.sub}</div>
                      <div className="cd-addon-price">{p.price}</div>
                      {qty === 0 ? (
                        <button
                          type="button"
                          className="cd-add-btn"
                          onClick={() => handlePrasadAddClick(p.id)}
                        >
                          <i className="fas fa-plus" /> Add
                        </button>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#0b845c',
                            borderRadius: '20px',
                            padding: '4px 8px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => changePrasadQty(p.id, -1)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '16px', width: '22px', cursor: 'pointer' }}
                          >
                            −
                          </button>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>{qty}</span>
                          <button
                            type="button"
                            onClick={() => changePrasadQty(p.id, 1)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', fontWeight: 700, fontSize: '16px', width: '22px', cursor: 'pointer' }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ══ INCLUDED + HOW ══ */}
      <div className="cd-inc-how">
        <div className="cd-inc-sec">
          <div className="cd-isec-title"><i className="fas fa-list-check" /> What's Included in Chadhava</div>
          <div className="cd-inc-row">
            {INC.map((item, i) => (
              <div key={i} className="cd-inc-item">
                <div className="cd-inc-ico"><i className={item.icon} /></div>
                <div className="cd-inc-name">{item.name}</div>
                <div className="cd-inc-sub">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cd-how-sec">
          <div className="cd-isec-title"><i className="fas fa-route" /> ✦ How It Works?</div>
          <div className="cd-how-steps">
            {HOW.map((s, i) => (
              <div key={i} className="cd-how-step">
                <div className="cd-step-circle">{s.num}</div>
                <div className="cd-step-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ ABOUT + VIDEO ══ */}
      <div className="cd-about-video">
        <div className="cd-about-wrap">
          <div className="cd-about-title">{aboutTitle}</div>
          <div className="cd-about-text" style={clampStyle(false)}>
            {aboutText}
          </div>
          <div className="cd-about-list">
            {ABOUT_ITEMS.map((item, i) => (
              <div key={i} className="cd-about-item"><i className="fas fa-om" />{item}</div>
            ))}
          </div>
          <span className="cd-about-om">ॐ</span>
        </div>
        {chadhava.videoThumbnail && (
          <div>
            <div className="cd-video-title">Watch Ritual Preview</div>
            <div className="cd-video-wrap">
              <img className="cd-video-thumb"
                src={chadhava.videoThumbnail} alt="Ritual Preview"
                onError={handleImgError(IMAGE_PLACEHOLDER)} />
              <div className="cd-video-play"><i className="fas fa-play" /></div>
              {chadhava.videoDuration && <div className="cd-video-dur">⏱ {chadhava.videoDuration}</div>}
            </div>
          </div>
        )}
      </div>

      {/* ══ REVIEWS + STATS ══ */}
      <div className="cd-reviews-sec">
        <div className="cd-rev-head">
          <div className="cd-rev-htitle"><i className="fas fa-star" /> Devotee Experiences</div>
         <a href="#"
            style={{ fontSize: 12.5, color: '#7b1a3a', fontWeight: 600 }}
            onClick={(e) => { e.preventDefault(); setShowAllReviews(true); }}
          >
            View All Reviews
          </a>
        </div>
        <div className="cd-rev-hsub">See what our devotees have to say</div>

        <div className="cd-rev-layout">
          {/* LEFT: slider + dots */}
          <div className="cd-rev-left">
            <div className="cd-rev-slider">
              <div className="cd-rev-track" style={{ transform: `translateX(-${revDot * 100}%)` }}>
                {REVIEWS.map((r, i) => (
                  <div key={i} className="cd-rev-slide">
                    <div className="cd-rev-card">
                      <div className="cd-rev-card-body">
                        <div className="cd-rev-stars">
                          {[1, 2, 3, 4, 5].map(s => <i key={s} className={`fa${s <= Math.floor(r.rating) ? 's' : 'r'} fa-star`} />)}
                          <span>{r.rating}</span>
                        </div>
                        <div className="cd-rev-text">{r.text}</div>
                        <div className="cd-rev-user">
                          <img className="cd-rev-av" src={r.avatar} alt={r.name}
                            onError={handleImgError(AVATAR_PLACEHOLDER)} />
                          <div>
                            <div className="cd-rev-name">{r.name}</div>
                            <div className="cd-rev-loc">{r.city}</div>
                          </div>
                        </div>
                      </div>
                      <img className="cd-rev-img" src={r.img} alt="Prasad"
                        onError={handleImgError(IMAGE_PLACEHOLDER)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cd-rev-dots">
              {REVIEWS.map((_, d) => (
                <div key={d} className={`cd-rev-dot${revDot === d ? ' active' : ''}`} onClick={() => setRevDot(d)} />
              ))}
            </div>
          </div>

          {/* RIGHT: stats + trusted bar */}
          <div className="cd-rev-right">
            <div className="cd-stats-row">
              {[
                { icon: 'fas fa-users', num: chadhava.stats?.devotees || '50,000+', lbl: 'Devotees Served' },
                { icon: 'fas fa-star', num: rating, lbl: 'Average Rating', star: true },
                { icon: 'fas fa-gopuram', num: chadhava.stats?.temples || '108+', lbl: 'Temples' },
                { icon: 'fas fa-shield-alt', num: chadhava.stats?.satisfaction || '99%', lbl: 'Satisfaction Rate' },
              ].map((s, i) => (
                <div key={i} className="cd-stat-cell">
                  <i className={`${s.icon} cd-stat-ico`} />
                  <div className="cd-stat-num">{s.star && <span className="cd-stat-star">★</span>}{s.num}</div>
                  <div className="cd-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
            <div className="cd-trusted-bar">Trusted by thousands of devotees across India &amp; worldwide</div>
          </div>
        </div>
      </div>

      {/* ══ SIMILAR ══ */}
      {SIMILAR.length > 0 && (
        <div className="cd-similar">
          <div className="cd-sec-label">
            <i className="fas fa-om" /> You May Also Like <i className="fas fa-om" />
          </div>
          <button className="cd-sim-arr left"
            onClick={() => setSimIdx(i => Math.max(0, i - 1))}
            disabled={simIdx === 0}
            style={{ opacity: simIdx === 0 ? 0.35 : 1 }}>
            <i className="fas fa-chevron-left" />
          </button>
          <button className="cd-sim-arr right"
            onClick={() => setSimIdx(i => Math.min(simMax, i + 1))}
            disabled={simIdx >= simMax}
            style={{ opacity: simIdx >= simMax ? 0.35 : 1 }}>
            <i className="fas fa-chevron-right" />
          </button>
          <div className="cd-sim-scroll">
            <div className="cd-sim-track" style={{ transform: `translateX(calc(-${simIdx * 25}% - ${simIdx * 14}px))` }}>
              {SIMILAR.map((s, i) => (
                <Link key={i} to={s.id ? `/chadhava/${slugify(s.name)}/${s.id}` : '#'} className="cd-sim-card">
                  <img className="cd-sim-img" src={s.img} alt={s.name}
                    onError={handleImgError(IMAGE_PLACEHOLDER)} />
                  <div className="cd-sim-info">
                    <div className="cd-sim-name">{s.name}</div>
                    <div className="cd-sim-price">{s.price}</div>
                    <div className="cd-sim-stars">
                      {[1, 2, 3, 4, 5].map(st => <i key={st} className={`fa${st <= Math.floor(s.rating) ? 's' : 'r'} fa-star`} />)}
                      <span>{s.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ FAQ ══ */}
      <div className="cd-faq">
        <div className="cd-sec-label">
          <i className="fas fa-om" /> Frequently Asked Questions <i className="fas fa-om" />
        </div>
        <div className="cd-faq-grid">
          {FAQS.map((f, i) => <FaqItem key={i} num={i + 1} q={f.q} a={f.a} />)}
        </div>
      </div>

      {/* ══ CTA ══ */}
      <div className="cd-cta">
        <img className="cd-cta-diya left" src="/assets/img/puja/diya.png" alt="" onError={e => e.target.style.display = 'none'} />
        <img className="cd-cta-diya right" src="/assets/img/puja/diya.png" alt="" onError={e => e.target.style.display = 'none'} />
        <div className="cd-cta-text">
          <div className="t1">Perform this auspicious Chadhava and seek divine blessings</div>
          <div className="t2">for you &amp; your family.</div>
        </div>
        <Link
          to="#"
          className="cd-cta-btn"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('addons-section')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
        >
          Reserve Your Offering Now <i className="fas fa-arrow-right" />
        </Link>
      </div>

      {showAllReviews && (
        <ViewAllReviewsPopup reviews={REVIEWS} onClose={() => setShowAllReviews(false)} />
      )}

      {/* ══ FOOTER ══ */}
      <Footer />

      {/* ══ MOBILE STICKY PROCEED BAR ══
          Only shown when the floating cart bar isn't already occupying
          the bottom of the screen (i.e. before anything's been added). */}
      {totalItemsCount === 0 && !addonsSectionVisible && (
        <div className="cd-mobile-proceed-wrap">
          <button
            type="button"
            className="cd-mobile-proceed-btn"
            onClick={() => {
              document.getElementById('addons-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            Select Chadhava Package <i className="fas fa-arrow-right" />
          </button>
        </div>
      )}

      {/* ══ FLOATING CART BAR ══ */}
      {totalItemsCount > 0 && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '20px',
            zIndex: 999,
            width: 'min(92%, 480px)',
            background: 'linear-gradient(135deg, #0b845c, #0a6e4c)',
            borderRadius: '18px',
            boxShadow: '0 10px 30px rgba(11,132,92,0.35)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ color: '#fff', minWidth: 0 }}>
            <div style={{ fontSize: '11px', opacity: 0.9, fontWeight: 600, letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-hands-praying" />
              {totalItemsCount} Add-on{totalItemsCount > 1 ? 's' : ''} Selected
              {cartSyncing && <span style={{ opacity: 0.75 }}>· Syncing…</span>}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
              ₹{cartTotalAmount.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            type="button"
            onClick={handleProceed}
            style={{
              background: '#fff',
              color: '#0b845c',
              fontWeight: 700,
              fontSize: '14px',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '999px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            Proceed <i className="fas fa-arrow-right" />
          </button>
        </div>
      )}

    </div>
  );
};

export default ChadhavaDetails;