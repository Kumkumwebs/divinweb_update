import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideMenu from '../components/layout/SideMenu';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import ScrollTop from '../components/common/ScrollTop';
import NewAppDownloadModal from '../components/common/NewAppDownloadModel';
import WalletConnectModal from '../components/common/WalletConnectModal';
import UserDetailsModal from '../components/common/UserDetailsModal';
import apiService from '../services/apiServices';
import './AstrologerDetail.css';

/* helpers */
const initials = n => (n || '').trim().split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
const COLORS = ['#7c3aed', '#059669', '#dc2626', '#d97706', '#2563eb'];
const avColor = n => COLORS[((n || '').charCodeAt(0) || 65) % COLORS.length];

const Stars = ({ val = 5 }) => (
  <span className="ad-pc-stars">
    {[1, 2, 3, 4, 5].map(i => (
      <i key={i} className={`fa${i <= Math.round(val) ? 's' : 'r'} fa-star`} style={{ fontSize: 13 }} />
    ))}
  </span>
);
const RevStars = ({ val = 5 }) => (
  <div className="ad-rev-stars">
    {[1, 2, 3, 4, 5].map(i => (
      <i key={i} className={`fa${i <= Math.round(val) ? 's' : 'r'} fa-star`} />
    ))}
  </div>
);
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="ad-faq-item" onClick={() => setOpen(o => !o)}>
      <div className="ad-faq-q">{q}<i className={`fas fa-chevron-${open ? 'up' : 'down'}`} /></div>
      {open && <div className="ad-faq-a">{a}</div>}
    </div>
  );
};

/* View All Popup */
const ViewAllPopup = ({ title, onClose, children }) => (
  <AnimatePresence>
    <motion.div className="ad-popup-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div className="ad-popup-box"
        initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .95 }}
        transition={{ duration: .2 }}
        onClick={e => e.stopPropagation()}>
        <div className="ad-popup-head">
          <h5>{title}</h5>
          <button className="ad-popup-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>
        <div className="ad-popup-body">{children}</div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const FALLBACK_SIMILAR = [
  { id: 'f1', name: 'Guru Dayal Ji', avg_rate: 4.8, total_review: 80, per_min_chat: 20, profile_img: '' },
  { id: 'f2', name: 'Acharya Ajay', avg_rate: 4.9, total_review: 120, per_min_chat: 12, profile_img: '' },
  { id: 'f3', name: 'Acharya Ruchi', avg_rate: 4.9, total_review: 95, per_min_chat: 15, profile_img: '' },
  { id: 'f4', name: 'Acharya Vaidhik', avg_rate: 4.8, total_review: 60, per_min_chat: 18, profile_img: '' },
];

const REVIEWS_ALL = [
  { name: 'Ritika Sharma', av: '/assets/img/user/user1.jpg', time: '5 days ago', stars: 5, text: 'Acharya ji predicted my situation so accurately and guided me in the right direction. My marriage issue got resolved. Really blessed!', tag: 'Marriage Consultation', helpful: 125 },
  { name: 'Ankit Verma', av: '/assets/img/user/user2.jpg', time: '1 week ago', stars: 5, text: 'His guidance helped me in my career decision. Very humble and knowledgeable person. Highly recommended!', tag: 'Career Consultation', helpful: 98 },
  { name: 'Neha Kapoor', av: '/assets/img/user/user3.jpg', time: '2 weeks ago', stars: 5, text: 'Thank you Acharya ji for your accurate predictions and simple solutions. My confidence has improved a lot.', tag: 'Love & Relationship', helpful: 76 },
  { name: 'Priya Singh', av: '/assets/img/user/user1.jpg', time: '3 weeks ago', stars: 4, text: 'Very knowledgeable and helpful. Gave me clear guidance on my career path.', tag: 'Career Consultation', helpful: 54 },
  { name: 'Rahul Gupta', av: '/assets/img/user/user2.jpg', time: '1 month ago', stars: 5, text: 'Excellent consultation. The remedies suggested actually worked for me.', tag: 'Vedic Astrology', helpful: 89 },
  { name: 'Sunita Devi', av: '/assets/img/user/user3.jpg', time: '1 month ago', stars: 5, text: 'Best astrologer I have consulted. Very accurate and helpful.', tag: 'Kundli Reading', helpful: 112 },
];

/* ══════════ MAIN ══════════ */
const AstrologerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const galleryRef = useRef(null);

  const [astro, setAstro] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [walletModal, setWalletModal] = useState(null); // null | 'chat' | 'call'
  const [walletBalance, setWalletBalance] = useState(0);
  const [detailsModal, setDetailsModal] = useState(null); // null | 'chat' | 'call'
  const [popup, setPopup] = useState(null); // 'gallery'|'reviews'|'skills'
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.postBearer(
        'https://admin.diviniq.in/user_api/astrologer_list',
        {
          search: '', page: '1', is_chat: 'on', followAstro: '', is_voice_call: 'on',
          is_video_call: 'on', cat_id: '', language_id: '', gender: '', sort_val: 'relevant',
          is_question: '', skill_id: '', country: '', report_id: '', expert_astro: ''
        }
      );
      if (res?.results?.length) {
        const found = res.results.find(a => String(a.id) === String(id) || String(a._id) === String(id));
        const target = found || res.results[0];
        setAstro(target);
        setSimilar(res.results.filter(a => a.id !== target.id && a._id !== target._id).slice(0, 4));
      }
      // Fetch wallet balance (adjust endpoint/keys to your real wallet API)
      try {
        const w = await apiService.getBearer('https://admin.diviniq.in/user_api/get_wallet');
        setWalletBalance(Number(w?.balance ?? w?.results?.wallet_balance ?? w?.wallet ?? 0));
      } catch (_) { setWalletBalance(0); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const scrollGallery = dir => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="main-wrapper">
      <Header onMenuToggle={() => setShowMobileMenu(true)} onSideMenuToggle={() => setShowSideMenu(true)} onSearchToggle={() => setShowSearch(true)} />
      <div className="ad-body"><div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div style={{ background: '#fff', borderRadius: 16, padding: 22, marginBottom: 14 }}>
              <div className="d-flex gap-3">
                <div className="ad-sk" style={{ width: 108, height: 108, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>{[55, 35, 80, 65, 50].map((w, i) => <div key={i} className="ad-sk mb-2" style={{ height: 13, width: `${w}%` }} />)}</div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
              {[50, 100, 100, 100].map((w, i) => <div key={i} className="ad-sk mb-3" style={{ height: i === 0 ? 32 : 44, borderRadius: 12, width: `${w}%` }} />)}
            </div>
          </div>
        </div>
      </div></div>
      <Footer />
    </div>
  );

  if (!astro) return (
    <div className="main-wrapper">
      <Header />
      <div className="text-center py-5"><p>Astrologer not found.</p><Link to="/astrologer">Browse All</Link></div>
      <Footer />
    </div>
  );

  const isOnline = astro.is_online == 1;
  const cats = astro.category?.map(c => c.name) || [];
  const langs = astro.language?.map(l => l.name).join(', ') || 'Hindi, English';
  const price = astro.per_min_chat || 5;
  const rating = parseFloat(astro.avg_rate || 4.9);

  const SKILLS = ['Vedic Astrology', 'Numerology', 'Palm Reading', 'Kundli Matching', 'Career Guidance', 'Love Problem', 'Business Growth', 'Vastu Consultation', 'Gemstone Suggestion', 'Prashna Kundli'];
  const FAQS = [
    { q: `How can I consult ${astro.name}?`, a: 'Click Chat Now or Call Now to connect instantly.' },
    { q: 'Is my personal information kept private?', a: 'Yes, 100%. All data is encrypted and never shared.' },
    { q: 'What details do I need to provide?', a: 'Basic birth details — name, date, time & place of birth.' },
    { q: 'Can I get remedies for my problems?', a: `Yes, ${astro.name} provides personalized remedies based on your Kundli.` },
    { q: 'What if the call gets disconnected?', a: 'You can reconnect anytime and continue the session.' },
    { q: 'Which languages are supported?', a: `${astro.name} consults in ${langs}.` },
  ];
  const GIFTS = [
    { name: 'Rose', price: '₹51', img: '/assets/img/gift/rose.png' },
    { name: 'Fruits Basket', price: '₹101', img: '/assets/img/gift/fruits.png' },
    { name: 'Diya', price: '₹251', img: '/assets/img/gift/diya.png' },
    { name: 'Puja Samagri', price: '₹501', img: '/assets/img/gift/puja.png' },
    { name: 'Blessings Shawl', price: '₹751', img: '/assets/img/gift/shawl.png' },
    { name: 'Premium Gift', price: '₹1100', img: '/assets/img/gift/gift.png' },
  ];
  const TRUST = [
    { ic: 'fas fa-check-circle', t: '100% Privacy Guaranteed' },
    { ic: 'fas fa-lock', t: 'Secure Payments' },
    { ic: 'fas fa-user-check', t: 'Verified Astrologer' },
    { ic: 'fas fa-headset', t: '24/7 Customer Support' },
  ];
  const GALLERY_IMGS = [1, 2, 3, 4, 5, 6, 7, 8].map(i => astro.profile_img || `/assets/img/gallery/gallery_${i}.jpg`);
  const simList = similar.length > 0 ? similar : FALLBACK_SIMILAR;

  return (
    <div className="main-wrapper ad-page" style={{ paddingTop: 0, marginTop: 0 }}>
      <ScrollTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <Header onMenuToggle={() => setShowMobileMenu(true)} onSideMenuToggle={() => setShowSideMenu(true)} onSearchToggle={() => setShowSearch(true)} />

      {/* Breadcrumb */}
      <div className="ad-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link><i className="fas fa-angle-right" />
          <Link to="/astrologer">Astrologers</Link><i className="fas fa-angle-right" />
          <span>{astro.name}</span>
        </div>
      </div>

      <div className="ad-body">
        <div className="container">
          <div className="row g-4">

            {/* ══ LEFT ══ */}
            <div className="col-lg-8">

              {/* Profile Card */}

              {/* Profile Card */}
              <motion.div className="ad-profile-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
                <div className="d-flex align-items-start gap-3">
                  {/* Avatar column with status below */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }}>
                    <div className="ad-av-wrap">
                      <div className="ad-av-clip">
                        {astro.profile_img && !imgErr
                          ? <img src={astro.profile_img} alt={astro.name} onError={() => setImgErr(true)} />
                          : <div className="ad-av-init" style={{ background: `linear-gradient(135deg,${avColor(astro.name)},${avColor(astro.name)}99)` }}>{initials(astro.name)}</div>
                        }
                      </div>
                      {/* <span className={`ad-av-dot ${isOnline ? 'on' : 'off'}`} /> */}
                    </div>
                    {/* Offline/Online status directly below avatar */}
                    <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginTop: '8px', whiteSpace: 'nowrap' }}>
                      {isOnline ? '● Online' : '● Offline'}
                    </div>
                  </div>

                  {/* Info right */}
                  <div className="ad-pc-right">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                      <span className="ad-pc-name">{astro.name}</span>
                      <span className="ad-pc-badge"><i className="fas fa-check-circle" /> Verified Expert</span>
                    </div>
                    <div className="ad-pc-stars-row">
                      <Stars val={rating} />
                      <span className="ad-pc-score">{rating.toFixed(1)}</span>
                      <span className="ad-pc-rcount">({astro.total_review || 0} Reviews)</span>
                      <span className="ad-pc-pipe">|</span>
                      <span className="ad-pc-consult"><i className="fas fa-sync-alt" />{astro.total_orders || '25,000'}+ Consultations</span>
                    </div>
                    <div className="ad-pc-meta">
                      <span className="ad-pc-meta-item"><i className="fas fa-briefcase" />{astro.experience || '5'}+ Years Experience</span>
                      <span className="ad-pc-meta-item"><i className="fas fa-map-marker-alt" />From {astro.city || 'India'}</span>
                      <span className="ad-pc-meta-item"><i className="fas fa-language" />Languages: {langs}</span>
                      <span className="ad-pc-meta-item"><i className="fas fa-users" />Followers: {astro.followers || '50K'}+</span>
                    </div>
                    <div className="ad-pc-tags">
                      {cats.slice(0, 6).map((c, i) => <span key={i} className="ad-pc-tag">{c}</span>)}
                      {cats.length > 6 && <span className="ad-pc-tag">+{cats.length - 6} more</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Stats Bar */}
              <div className="ad-stats-bar">
                {[
                  { ic: 'fas fa-medal', val: `${astro.experience || 15}+`, lbl: 'Years Experience' },
                  { ic: 'fas fa-check-circle', val: '25,000+', lbl: 'Orders Completed' },
                  { ic: 'fas fa-sync-alt', val: '87%', lbl: 'Repeat Customers' },
                  { ic: 'fas fa-star', val: '98%', lbl: 'Positive Feedback' },
                ].map(s => (
                  <div key={s.lbl} className="ad-stat">
                    <div className="ad-stat-ico"><i className={s.ic} /></div>
                    <div><div className="ad-stat-val">{s.val}</div><div className="ad-stat-lbl">{s.lbl}</div></div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="ad-card">
                <div className="ad-card-title"><i className="fas fa-user-circle" />About {astro.name}</div>
                <p className="ad-about-p">{astro.about || `${astro.name} is a renowned Vedic Astrologer with more than ${astro.experience || 15} years of experience in Vedic Astrology, Numerology, Vastu Shastra and Spiritual Guidance. He has helped more than 25,000+ clients across the globe with accurate predictions and effective remedies.`}</p>
                <p className="ad-about-p">His expertise lies in solving problems related to career, marriage, love, business, health and financial growth.</p>
                <div className="ad-feat-pills">
                  {['Accurate Predictions', 'Personalized Guidance', 'Effective Remedies', '100% Confidential'].map(f => (
                    <span key={f} className="ad-feat-pill"><i className="fas fa-check-circle" />{f}</span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="ad-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="ad-card-title mb-0"><i className="fas fa-star" />Skills & Expertise</div>
                  <button className="btn btn-link p-0" style={{ fontSize: 12, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }} onClick={() => setPopup('skills')}>View All</button>
                </div>
                <div className="ad-skills">
                  {SKILLS.map(s => <span key={s} className="ad-skill"><i className="fas fa-circle" />{s}</span>)}
                </div>
              </div>

              {/* Gallery + Video side by side — 65% height */}
              <div className="row g-3 mb-3" style={{ height: '280px' }}>
                {/* Gallery — left */}
                <div className="col-lg-6">
                  <div className="ad-card" style={{ marginBottom: 0, height: '65%', display: 'flex', flexDirection: 'column' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="ad-card-title mb-0" style={{ fontSize: '13px', marginBottom: 0 }}><i className="fas fa-images" />Gallery</div>
                      <button className="btn btn-link p-0" style={{ fontSize: 11, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }} onClick={() => setPopup('gallery')}>View All</button>
                    </div>
                    {/* Scrollable gallery with arrows */}
                    <div className="ad-gallery-wrap" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <button className="ad-gal-arrow left" onClick={() => scrollGallery(-1)}>
                        <i className="fas fa-chevron-left" />
                      </button>
                      <div className="ad-gallery" ref={galleryRef} style={{ flex: 1 }}>
                        {GALLERY_IMGS.map((src, i) => (
                          <img key={i} className="ad-gal-img" src={src} alt={`Gallery ${i + 1}`}
                            onClick={() => setPopup('gallery')}
                            onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                        ))}
                      </div>
                      <button className="ad-gal-arrow right" onClick={() => scrollGallery(1)}>
                        <i className="fas fa-chevron-right" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video — right */}
                <div className="col-lg-6">
                  <div className="ad-card" style={{ marginBottom: 0, height: '65%', display: 'flex', flexDirection: 'column' }}>
                    <div className="ad-card-title mb-2" style={{ fontSize: '13px', marginBottom: '8px' }}><i className="fas fa-play-circle" />Introduction Video</div>
                    <div className="ad-vid-wrap" style={{ flex: 1 }}>
                      <img src={astro.profile_img || '/assets/img/team/team_1_1.jpg'} alt="intro" style={{ height: '100%' }}
                        onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                      <button className="ad-vid-play"><i className="fas fa-play" /></button>
                    </div>
                    <div className="ad-vid-lbl">▶ Watch Introduction Video</div>
                  </div>
                </div>
              </div>

            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <div className="col-lg-4">
              <div className="ad-sticky">
                <div className="ad-fee-card">
                  <div className="ad-fee-lbl">Consultation Fee</div>
                  <div className="ad-fee-row">
                    <span className="ad-fee-amt">₹{price}</span>
                    <span className="ad-fee-unit">/min</span>
                  </div>
                  <div className="ad-avail-row">
                    <span className="ad-avail-dot" />
                    <span className="ad-avail-txt">Available Now</span>
                  </div>
                  <div className="ad-resp-time">Avg. Response Time: &lt; 2 min</div>
                  <button className="ad-btn-chat" onClick={() => setWalletModal('chat')}>
                    <div className="ad-btn-chat-main"><i className="fas fa-comment-dots" style={{ fontSize: 16 }} />Chat Now</div>
                    <div className="ad-btn-chat-sub">Get instant guidance</div>
                  </button>
                  <button className="ad-btn-call" onClick={() => setWalletModal('call')}>
                    <div className="ad-btn-call-main"><i className="fas fa-phone" style={{ fontSize: 15 }} />Call Now</div>
                    <div className="ad-btn-call-sub">Start a call session</div>
                  </button>
                  <button className="ad-btn-gift">
                    <i className="ad-btn-gift-ico fas fa-gift" />
                    <div className="ad-btn-gift-body">
                      <span className="ad-btn-gift-lbl">Send a Gift</span>
                      <span className="ad-btn-gift-sub">Show your appreciation</span>
                    </div>
                    <i className="ad-btn-gift-arr fas fa-chevron-right" />
                  </button>
                  <ul className="ad-trust-list">
                    {TRUST.map(x => <li key={x.t}><i className={x.ic} />{x.t}</li>)}
                  </ul>
                </div>
                <div className="ad-gifts-card">
                  <div className="ad-gifts-title"><i className="fas fa-gift" />Send Blessings Gift</div>
                  <div className="ad-gift-grid">
                    {GIFTS.map(g => (
                      <div key={g.name} className="ad-gift-item">
                        <img className="ad-gift-img" src={g.img} alt={g.name} onError={e => { e.target.style.display = 'none' }} />
                        <div className="ad-gift-name">{g.name}</div>
                        <div className="ad-gift-price">{g.price}</div>
                      </div>
                    ))}
                  </div>
                  <button className="ad-gift-more">View More Gifts</button>
                </div>
              </div>
            </div>

          </div>

          {/* ══ FULL-WIDTH SECTIONS BELOW ══ */}
          <div style={{ marginTop: 4 }}>

            {/* Consultation Process + Reviews — single row */}
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="row g-4">
                {/* Consultation Process — left */}
                <div className="col-lg-3 col-md-4">
                  <div className="ad-card-title"><i className="fas fa-route" />Consultation Process</div>
                  <div className="ad-process-vert">
                    {[
                      { ic: 'fas fa-calendar-check', name: 'Book Consultation', desc: 'Choose chat or call and book your slot.' },
                      { ic: 'fas fa-user-edit', name: 'Share Your Details', desc: 'Tell us your birth details and issue.' },
                      { ic: 'fas fa-comment-dots', name: 'Get Astrologer', desc: 'Connect with Acharya and discuss your concerns.' },
                    ].map((s, i) => (
                      <div key={i} className="ad-proc-row">
                        <div className="ad-proc-ico"><i className={s.ic} /></div>
                        <div>
                          <div className="ad-proc-name">{s.name}</div>
                          <div className="ad-proc-desc">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews — right */}
                <div className="col-lg-9 col-md-8">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="ad-card-title mb-0"><i className="fas fa-comments" />Customer Reviews</div>
                    <button className="btn btn-link p-0" style={{ fontSize: 12, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }} onClick={() => setPopup('reviews')}>View All</button>
                  </div>
                  <div className="row g-3">
                    {REVIEWS_ALL.slice(0, 3).map((r, i) => (
                      <div key={i} className="col-md-4">
                        <div className="ad-rev-card">
                          <div className="ad-rev-user">
                            <img className="ad-rev-av" src={r.av} alt={r.name} onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                            <div>
                              <div className="ad-rev-name">{r.name}</div>
                              <div className="ad-rev-veri">✓ Verified Purchase</div>
                            </div>
                            <span className="ad-rev-time">{r.time}</span>
                          </div>
                          <RevStars val={r.stars} />
                          <div className="ad-rev-text">{r.text}</div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="ad-rev-tag">{r.tag}</span>
                            <span className="ad-rev-help"><i className="far fa-thumbs-up me-1" />Helpful ({r.helpful})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ + You May Also Like — side by side */}
            <div className="row g-4">
              {/* FAQ — left */}
              <div className="col-lg-5">
                <div className="ad-card" style={{ marginBottom: 0, height: '100%' }}>
                  <div className="ad-card-title"><i className="fas fa-question-circle" />Frequently Asked Questions</div>
                  {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
                </div>
              </div>
              {/* You May Also Like — right */}
              <div className="col-lg-7">
                <div className="ad-card" style={{ marginBottom: 0, height: '100%' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="ad-card-title mb-0">
                      <i className="fas fa-heart" style={{ color: '#7c1d40' }} />You May Also Like
                    </div>
                    <Link to="/astrologer" style={{ fontSize: 12, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }}>View All</Link>
                  </div>
                  <div className="row g-3">
                    {simList.map((s, i) => (
                      <div key={i} className="col-6 col-sm-3 d-flex">
                        <div className="ad-sim-card w-100" onClick={() => navigate(`/astrologer/${s.id || s._id}`)}>
                          <div className="ad-sim-av-box">
                            {s.profile_img
                              ? <img src={s.profile_img} alt={s.name} onError={e => { e.target.style.display = 'none' }} />
                              : <div className="ad-sim-av-init" style={{ background: `linear-gradient(135deg,${avColor(s.name)},${avColor(s.name)}99)` }}>{initials(s.name)}</div>
                            }
                          </div>
                          <div className="ad-sim-name">{s.name}</div>
                          <div className="ad-sim-rating">
                            <i className="fas fa-star" />
                            <span>{parseFloat(s.avg_rate || 4.0).toFixed(1)}</span>
                            <span style={{ color: '#9ca3af', fontSize: 11 }}>({s.total_review || 0})</span>
                          </div>
                          <div className="ad-sim-price">₹{s.per_min_chat || 5}/min</div>
                          <button className="ad-sim-btn" onClick={e => { e.stopPropagation(); setShowModal(true) }}>Chat Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Trust Bottom Bar */}
          <div className="">
        <div className="container ad-bottom-bar">
          <div className="ad-bottom-inner">
            {[
              {ic:'fas fa-users',       t:'Trusted by 50 Lakh+ Users'},
              {ic:'fas fa-lock',        t:'100% Privacy & Confidentiality'},
              {ic:'fas fa-credit-card', t:'Secure & Encrypted Payments'},
              {ic:'fas fa-user-check',  t:'Verified & Experienced Experts'},
            ].map(b=><div key={b.t} className="ad-bottom-item"><i className={b.ic}/>{b.t}</div>)}
          </div>
        </div>
      </div>


      {/* ── POPUPS ── */}
      {popup === 'gallery' && (
        <ViewAllPopup title="Gallery Photos" onClose={() => setPopup(null)}>
          <div className="ad-gallery-grid">
            {GALLERY_IMGS.map((src, i) => (
              <img key={i} src={src} alt={`Gallery ${i + 1}`}
                onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
            ))}
          </div>
        </ViewAllPopup>
      )}

      {popup === 'reviews' && (
        <ViewAllPopup title={`All Reviews for ${astro.name}`} onClose={() => setPopup(null)}>
          {REVIEWS_ALL.map((r, i) => (
            <div key={i} className="ad-popup-rev">
              <div className="ad-rev-user mb-2">
                <img className="ad-rev-av" src={r.av} alt={r.name} onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                <div>
                  <div className="ad-rev-name">{r.name}</div>
                  <div className="ad-rev-veri">✓ Verified Purchase</div>
                </div>
                <span className="ad-rev-time">{r.time}</span>
              </div>
              <RevStars val={r.stars} />
              <div className="ad-rev-text">{r.text}</div>
              <div className="d-flex justify-content-between">
                <span className="ad-rev-tag">{r.tag}</span>
                <span className="ad-rev-help"><i className="far fa-thumbs-up me-1" />Helpful ({r.helpful})</span>
              </div>
            </div>
          ))}
        </ViewAllPopup>
      )}

      {popup === 'skills' && (
        <ViewAllPopup title="Skills & Expertise" onClose={() => setPopup(null)}>
          <div className="ad-skills">
            {[...SKILLS, 'Numerology', 'Kundli Analysis', 'Nadi Astrology', 'Gemology', 'Prashna Shastra', 'Muhurta', 'Vedic Remedies', 'Mantra Therapy'].map(s => (
              <span key={s} className="ad-skill"><i className="fas fa-circle" />{s}</span>
            ))}
          </div>
        </ViewAllPopup>
      )}

      <WalletConnectModal
        isOpen={!!walletModal}
        onClose={() => setWalletModal(null)}
        astrologer={astro}
        walletBalance={walletBalance}
        mode={walletModal || 'chat'}
        onConnect={(mode) => {
          // Step 2 → after wallet check, collect user details
          setDetailsModal(mode);
          setWalletModal(null);
        }}
        onRecharge={() => {
          setWalletModal(null);
          navigate('/wallet');
        }}
      />

      <UserDetailsModal
        isOpen={!!detailsModal}
        onClose={() => setDetailsModal(null)}
        astrologer={astro}
        mode={detailsModal || 'chat'}
        onSubmit={(details) => {
          setDetailsModal(null);
          // Step 3 → proceed to the live session with collected details
          navigate(`/consultation/${astro.id || astro._id}?mode=${detailsModal}`, { state: { details } });
        }}
      />

      <NewAppDownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Consult ${astro.name}`}
        subtitle={`Get guidance from ${astro.name}.`}
      />
      <Footer />
    </div>
  );
};

export default AstrologerDetail;