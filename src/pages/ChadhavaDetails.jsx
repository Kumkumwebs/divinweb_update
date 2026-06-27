import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ChadhavaDetail.css';
import Header from '../components/layout/Header';


const useCountdown = () => {
  const [t, setT] = useState({ d: 1, h: 8, m: 36, s: 24 });
  useEffect(() => {
    const tick = setInterval(() => {
      setT(p => {
        let { d, h, m, s } = p;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d--; }
        return { d: Math.max(0, d), h: Math.max(0, h), m: Math.max(0, m), s: Math.max(0, s) };
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);
  return t;
};

const pad = n => String(n).padStart(2, '0');

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

/* demo image fallbacks */
const DEMO_PRASAD = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop',
];
const DEMO_SIM = [
  'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop',
];
const DEMO_ADDON = [
  'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=300&h=150&fit=crop',
  'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=150&fit=crop',
];
const DEMO_GAL = [
  'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=120&h=90&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=90&fit=crop',
  'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=120&h=90&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=90&fit=crop',
];
const DEMO_AVATAR = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
];

/* ══════════════════════════════════════ */
const ChadhavaDetail = () => {
  const timer = useCountdown();
  const [revDot, setRevDot] = useState(0);
  const [simIdx, setSimIdx] = useState(0);

  // ✅ Fixed: added missing state variables
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const SIM_VISIBLE = 4;

  const REVIEWS = [
    { rating: 4.9, text: 'The experience was divine! I received photos and updates throughout the ritual. Prasad was delivered on time and was very pure.', name: 'Ramesh Verma', city: 'Delhi', avatar: DEMO_AVATAR[0], img: DEMO_PRASAD[0] },
    { rating: 5.0, text: 'Absolutely blessed experience! The pandits performed the puja with full devotion. I could feel the divine energy through the live updates sent on WhatsApp.', name: 'Priya Sharma', city: 'Mumbai', avatar: DEMO_AVATAR[1], img: DEMO_PRASAD[1] },
    { rating: 4.8, text: 'Booking was super easy and the entire process was seamless. The prasad packaging was beautiful and arrived fresh. Will definitely book again!', name: 'Ankit Gupta', city: 'Jaipur', avatar: DEMO_AVATAR[2], img: DEMO_PRASAD[2] },
    { rating: 5.0, text: 'I have been seeking blessings for my business for a long time. After this Chadhava, things turned around within a week. Truly miraculous!', name: 'Sunita Patel', city: 'Ahmedabad', avatar: DEMO_AVATAR[3], img: DEMO_PRASAD[3] },
  ];

  const ADDONS = [
    { name: 'Aasan & Vastra For Deity', sub: 'Enhance the divine experience', price: '₹878', img: DEMO_ADDON[0] },
    { name: 'Pushpanjali Seva', sub: 'Special flowers offering', price: '₹1,151', img: DEMO_ADDON[1] },
    { name: 'Deep Daan Seva', sub: 'Light the lamp of devotion', price: '₹1,251', img: DEMO_ADDON[2] },
    { name: 'Gau Seva Donation', sub: 'Contribute to cow welfare', price: '₹2,101', img: DEMO_ADDON[3] },
  ];

  const INC = [
    { icon: 'fas fa-user-edit', name: 'Sankalp', sub: 'In your name' },
    { icon: 'fas fa-fire', name: 'Vedic Rituals', sub: 'By Expert Pandits' },
    { icon: 'fas fa-music', name: 'Mantra Chanting', sub: 'For Divine Blessings' },
    { icon: 'fas fa-box', name: 'Prasad', sub: 'Blessed & Pure' },
    { icon: 'fas fa-video', name: 'Photos & Videos', sub: 'Live Updates' },
  ];

  const HOW = [
    { num: '01', label: 'Choose Your Chadhava' },
    { num: '02', label: 'Make Secure Payment' },
    { num: '03', label: 'Puja Performed By Pandits' },
    { num: '04', label: 'Receive Prasad & Updates' },
  ];

  const ABOUT_ITEMS = [
    'It removes financial obstacles and debt',
    'Brings harmony, peace & family happiness',
    'Blessings for career growth & success',
    'Protection from Shani Dosha & bad karma',
  ];

  const FAQS = [
    { q: 'How do I begin the process of purchasing a Chadhava?', a: 'Simply select your desired Chadhava, fill in your Sankalp details, and complete the secure payment. Our team will handle the rest.' },
    { q: 'What are closing costs and who typically pays them?', a: 'The price shown includes all ritual costs. There are no hidden charges. Prasad delivery has a nominal fee.' },
    { q: 'What should I look for when selecting a Chadhava?', a: 'Consider the deity, the significance of the day, and your personal intention. Our experts are available to guide you.' },
    { q: 'How can I negotiate effectively when buying property?', a: 'For Chadhava queries, please contact our support team via WhatsApp or call center.' },
    { q: 'How can I determine the right Chadhava for me?', a: 'Share your birth details and current challenges with our astrologers. They will recommend the most beneficial Chadhava.' },
    { q: 'Is a home inspection really necessary?', a: 'All our pandits are verified and experienced. You will receive real-time video updates during the ritual.' },
  ];

  const SIMILAR = [
    { name: 'Purnima 5 Temple Chadhava', price: '₹15,999', rating: 4.8, img: DEMO_SIM[0] },
    { name: 'Amavasya Pitru Shanti Chadhava', price: '₹11,999', rating: 4.9, img: DEMO_SIM[1] },
    { name: 'Maha Shivaratri Rudrabhishek', price: '₹8,999', rating: 4.9, img: DEMO_SIM[2] },
    { name: 'Sankashti Chaturthi Chadhava', price: '₹8,999', rating: 4.8, img: DEMO_SIM[3] },
    { name: 'Navratri Durga Chadhava', price: '₹12,999', rating: 5.0, img: DEMO_SIM[4] },
    { name: 'Ganesh Chaturthi Seva', price: '₹9,999', rating: 4.7, img: DEMO_SIM[5] },
    { name: 'Kali Puja Mahachadhava', price: '₹13,999', rating: 4.8, img: DEMO_SIM[6] },
    { name: 'Ram Navami Temple Seva', price: '₹7,999', rating: 4.9, img: DEMO_SIM[7] },
  ];

  const simMax = SIMILAR.length - SIM_VISIBLE;

  return (
    <div className="pd-page">
      {/* ✅ Fixed: removed undefined ScrollTop, SideMenu, PopupSearch, MobileMenu components.
          Import and restore them once they exist in your project:
            import ScrollTop from '../components/common/ScrollTop';
            import SideMenu from '../components/layout/SideMenu';
            import PopupSearch from '../components/layout/PopupSearch';
            import MobileMenu from '../components/layout/MobileMenu';
          Then uncomment the lines below:
            <ScrollTop />
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      */}
      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      {/* ── BREADCRUMB ── */}
      <div className="cd-bc">
        <Link to="/">Home</Link>&nbsp;›&nbsp;
        <Link to="/chadhava">Chadhava</Link>&nbsp;›&nbsp;
        <span>Saturday Maha Ekadashi Panch Devi-Devta 5 Temple Chadhava</span>
      </div>

      {/* ══ HERO ══ */}
      <div className="cd-hero">
        <div className="cd-hero-left">
          <div className="cd-hero-bg" />
          <img className="cd-hero-deity-img" src="/assets/img/chadawa_detail/pooja_group.png" alt="Panch Devi-Devta"
            onError={e => { e.target.style.display = 'none'; }} />
          <div className="cd-hero-bg-overlay" />
          <div className="cd-hero-body">
            <div className="cd-auspicious"><i className="fas fa-crown" /> Most Auspicious – Limited Day</div>
            <h1 className="cd-hero-h1">
              Saturday Maha Ekadashi Panch Devi-Devta 5 Temple<em>Chadhava</em>
            </h1>
            <div className="cd-hero-meta">
              <div className="cd-meta-item">
                <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                &nbsp;4.9 (12,456 Reviews)
              </div>
              <span className="cd-meta-sep">|</span>
              <div className="cd-meta-item"><i className="fas fa-users" /> 50K+ Devotees</div>
              <span className="cd-meta-sep">|</span>
              <div className="cd-meta-item"><i className="fas fa-gopuram" /> Temple Certified</div>
            </div>
            <div className="cd-features">
              <div className="cd-feat"><i className="fas fa-gopuram" /> 5 Sacred Temples</div>
              <div className="cd-feat"><i className="fas fa-om" /> 5 Powerful Deities</div>
              <div className="cd-feat"><i className="fas fa-user-graduate" /> Expert Pandits</div>
              <div className="cd-feat"><i className="fas fa-box-open" /> Holy Prasad</div>
            </div>
            <div className="cd-gallery">
              {DEMO_GAL.map((src, i) => (
                <img key={i} className="cd-gal-img"
                  src={`/assets/img/chadawa_detail/gallery${i + 1}.png`} alt={`Gallery ${i + 1}`}
                  onError={e => { e.target.src = src; e.target.onerror = null; }} />
              ))}
              <div className="cd-gal-more">
                <span className="gm-num">View</span><br />
                <span className="gm-num">25+</span><br />
                <span className="gm-lbl">Photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT booking card */}
        <div className="cd-hero-right">
          <div className="cd-avail-bar">
            <div className="cd-avail-pill"><i className="fas fa-exclamation-circle" /> Limited Availability</div>
            <div className="cd-seats-pill">Only 23 Seats Left</div>
          </div>
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
          <div className="cd-feat-badge"><i className="fas fa-fire" /> Featured Offering</div>
          <div className="cd-book-price">₹18,999 <span>per person</span></div>
          <div className="cd-price-desc">Seek the blessings of 5 deities on the most auspicious Saturday Maha Ekadashi tithi from 5 ancient Indian temples with just 1 click! 🔮</div>
          <span className="cd-read-more">Read More</span>
          <div className="cd-shri"><i className="fas fa-gopuram" /> Shri Mandir Chadhava Seva</div>
          <button className="cd-reserve-btn">Reserve Your Offering <i className="fas fa-arrow-right" /></button>
          <div className="cd-secure"><i className="fas fa-lock" /> 100% Secure Payments</div>
          <div className="pd-bc-pay-icons">
            <img src="/assets/img/about/upi.png" alt="UPI" className="pd-pay-img" />
            <img src="/assets/img/about/visa.png" alt="Visa" className="pd-pay-img" />
            <img src="/assets/img/about/mastercard.png" alt="Mastercard" className="pd-pay-img pd-pay-img--mc" />
            <img src="/assets/img/about/rupay.png" alt="RuPay" className="pd-pay-img" />
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

      {/* ══ ADD-ONS ══ */}
      <div className="cd-addons">
        <div className="cd-addons-head">
          <div className="cd-addons-title">✨ Enhance Your Seva (Add-ons)</div>
          <a href="#" className="cd-view-all">View All Add-ons</a>
        </div>
        <div className="cd-addons-scroll">
          <button className="cd-addons-arr left"><i className="fas fa-chevron-left" /></button>
          <div className="cd-addons-row">
            {ADDONS.map((a, i) => (
              <div key={i} className="cd-addon-card">
                <img className="cd-addon-img" src={a.img} alt={a.name} />
                <div className="cd-addon-body">
                  <div className="cd-addon-name">{a.name}</div>
                  <div className="cd-addon-sub">{a.sub}</div>
                  <div className="cd-addon-price">{a.price}</div>
                  <button className="cd-add-btn"><i className="fas fa-plus" /> Add</button>
                </div>
              </div>
            ))}
          </div>
          <button className="cd-addons-arr right"><i className="fas fa-chevron-right" /></button>
        </div>
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
          <div className="cd-about-title">About Saturday Maha Ekadashi</div>
          <div className="cd-about-text">Maha Ekadashi that falls on Saturday is considered extremely powerful. It pleases Shani Dev and Lord Vishnu, removes karmic doshas and brings prosperity, health, peace and protection from all negative energies.</div>
          <div className="cd-about-list">
            {ABOUT_ITEMS.map((item, i) => (
              <div key={i} className="cd-about-item"><i className="fas fa-om" />{item}</div>
            ))}
          </div>
          <span className="cd-about-om">ॐ</span>
        </div>
        <div>
          <div className="cd-video-title">Watch Ritual Preview</div>
          <div className="cd-video-wrap">
            <img className="cd-video-thumb"
              src="/assets/img/chadawa_detail/pooja_group_video.png" alt="Ritual Preview"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1609429019995-8c40f49535a5?w=600&h=300&fit=crop'; e.target.onerror = null; }} />
            <div className="cd-video-play"><i className="fas fa-play" /></div>
            <div className="cd-video-dur">⏱ 02:45</div>
          </div>
        </div>
      </div>

      {/* ══ REVIEWS + STATS ══ */}
      <div className="cd-reviews-sec">
        <div className="cd-rev-head">
          <div className="cd-rev-htitle"><i className="fas fa-star" /> Devotee Experiences</div>
          <a href="#" style={{ fontSize: 12.5, color: '#7b1a3a', fontWeight: 600 }}>View All Reviews</a>
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
                          <img className="cd-rev-av" src={r.avatar} alt={r.name} />
                          <div>
                            <div className="cd-rev-name">{r.name}</div>
                            <div className="cd-rev-loc">{r.city}</div>
                          </div>
                        </div>
                      </div>
                      <img className="cd-rev-img" src={r.img} alt="Prasad" />
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
                { icon: 'fas fa-users', num: '50,000+', lbl: 'Devotees Served' },
                { icon: 'fas fa-star', num: '4.9', lbl: 'Average Rating', star: true },
                { icon: 'fas fa-gopuram', num: '108+', lbl: 'Temples' },
                { icon: 'fas fa-shield-alt', num: '99%', lbl: 'Satisfaction Rate' },
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
              <div key={i} className="cd-sim-card">
                <img className="cd-sim-img" src={s.img} alt={s.name} />
                <div className="cd-sim-info">
                  <div className="cd-sim-name">{s.name}</div>
                  <div className="cd-sim-price">{s.price}</div>
                  <div className="cd-sim-stars">
                    {[1, 2, 3, 4, 5].map(st => <i key={st} className={`fa${st <= Math.floor(s.rating) ? 's' : 'r'} fa-star`} />)}
                    <span>{s.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
        <button className="cd-cta-btn">Reserve Your Offering Now <i className="fas fa-arrow-right" /></button>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="cd-footer">
        <div className="cd-ft-top">
          <div className="cd-ft-brand">
            <div className="cd-logo">
              <span className="cd-logo-star">✦</span>
              <span className="cd-logo-text">Divini<em>Q</em></span>
            </div>
            <p>Your trusted companion on the path of devotion.</p>
            <div className="cd-social">
              <a href="#"><i className="fab fa-facebook-f" /></a>
              <a href="#"><i className="fab fa-instagram" /></a>
              <a href="#"><i className="fab fa-youtube" /></a>
              <a href="#"><i className="fab fa-x-twitter" /></a>
            </div>
          </div>
          <div className="cd-ft-col">
            <h5>Services</h5>
            <ul>{['Puja', 'Chadhava', 'Panchang', 'Astrology Tools'].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="cd-ft-col">
            <h5>Support</h5>
            <ul>{['Help Center', 'Consult with Astrologer', 'Register as Astrologer', 'Refund Policy'].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="cd-ft-col">
            <h5>Company</h5>
            <ul>{['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="cd-ft-col">
            <h5>Download Our App</h5>
            <div className="cd-app-btns">
              <a href="#" className="cd-app-btn">
                <i className="fab fa-google-play" />
                <div><div className="cd-app-sm">GET IT ON</div><div className="cd-app-lg">Google Play</div></div>
              </a>
              <a href="#" className="cd-app-btn">
                <i className="fab fa-apple" />
                <div><div className="cd-app-sm">Download on the</div><div className="cd-app-lg">App Store</div></div>
              </a>
            </div>
          </div>
        </div>
        <div className="cd-ft-bottom">© 2025 DiviniQ. All rights reserved.</div>
      </div>

    </div>
  );
};

export default ChadhavaDetail;