import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import SideMenu from '../components/layout/SideMenu';
import ScrollTop from '../components/common/ScrollTop';

function Careers() {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const openings = [
        { title: "// Tech & Dev", icon: "💻", items: ["Full Stack Engineer", "UI/UX Designer", "Product Manager"] },
        { title: "// Spiritual Masters", icon: "🕉️", items: ["Vedic Astrologer", "Ritual Specialist", "Vastu Expert"] },
        { title: "// Growth & Marketing", icon: "📈", items: ["Content Strategist", "SEO Specialist", "Social Media lead"] },
        { title: "// Support", icon: "🤝", items: ["Customer Care", "Operations", "Legal & Compliance"] },
    ];

    const stats = [
        { value: "50+", label: "Team Members" },
        { value: "12+", label: "Expert Domains" },
        { value: "4.9★", label: "Culture Rating" },
        { value: "100%", label: "Remote Friendly" },
    ];

    return (
        <div className="pp-root">
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
            />

            {/* ── Hero ── */}
            <section
                style={{
                    padding: "40px 0",
                    background: "#fff",
                }}
            >
                <div
                    className="container"
                    style={{
                        maxWidth: "1400px",
                    }}
                >
                    <div
                        className="pp-hero"
                        style={{
                            position: "relative",
                            backgroundImage: 'url("/assets/img/images/profile-hero-banner.jpeg")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "30px",
                            overflow: "hidden",
                            minHeight: "320px",
                            boxShadow: "0 18px 45px rgba(65, 15, 25, 0.18)",
                        }}
                    >
                        {/* Dark Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, rgba(45,8,18,.85) 0%, rgba(70,10,25,.65) 45%, rgba(0,0,0,.20) 100%)",
                            }}
                        />

                        {/* Decorative Blur */}
                        <div
                            style={{
                                position: "absolute",
                                width: "350px",
                                height: "350px",
                                background: "rgba(255,170,40,.12)",
                                filter: "blur(120px)",
                                top: "-120px",
                                left: "-100px",
                                borderRadius: "50%",
                            }}
                        />

                        {/* Content */}
                        <div
                            className="container pp-hero__inner"
                            style={{
                                position: "relative",
                                zIndex: 2,
                                minHeight: "320px",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 70px",
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span
                                    className="pp-hero__eyebrow"
                                    style={{
                                        color: "#F6B63F",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        letterSpacing: "3px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    EXPERT PORTAL REGISTRATION
                                </span>

                                <h1
                                    className="pp-hero__title"
                                    style={{
                                        color: "#fff",
                                        fontSize: "58px",
                                        fontWeight: 800,
                                        marginTop: "18px",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Join the{" "}
                                    <span style={{ color: "#F6B63F" }}>
                                        Divine Lineage
                                    </span>
                                </h1>

                                <p
                                    className="pp-hero__sub"
                                    style={{
                                        color: "rgba(255,255,255,.85)",
                                        maxWidth: "620px",
                                        fontSize: "18px",
                                        marginTop: "20px",
                                    }}
                                >
                                    Register as a verified astrologer and start guiding seekers on
                                    DivinIQ.
                                </p>

                                <div
                                    className="pp-hero__dash"
                                    style={{
                                        width: "150px",
                                        height: "4px",
                                        background: "#F6B63F",
                                        borderRadius: "50px",
                                        marginTop: "30px",
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Golden Border */}
                        <div
                            style={{
                                position: "absolute",
                                inset: "12px",
                                border: "1px solid rgba(246,182,63,.45)",
                                borderRadius: "22px",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* ── Content ── */}
            <section className="pp-section">
                <div className="pp-container pp-layout">

                    {/* Sidebar */}
                    <aside className="pp-sidebar">
                        {stats.map((s, i) => (
                            <div className="pp-sidebar__card" key={i}>
                                <div className="pp-sidebar__icon pp-sidebar__icon--stat">{s.value}</div>
                                <div>
                                    <p className="pp-sidebar__label">{s.label}</p>
                                </div>
                            </div>
                        ))}

                        <div className="pp-sidebar__card">
                            <div className="pp-sidebar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .6 3a2 2 0 01-.5 2.1L8 10a16 16 0 006 6z" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-sidebar__label">Careers Team</p>
                                <p className="pp-sidebar__value">careers@diviniq.in</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="pp-main">
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="pp-card"
                        >
                            <h2 className="pp-heading">Uncover your new career path</h2>
                            <p className="pp-prose" style={{ marginBottom: "32px" }}>
                                Be part of a community of innovators, from spiritual masters to tech visionaries,
                                working together to redefine spiritual wellness.
                            </p>

                            {/* Career grid */}
                            <div className="pp-career-grid">
                                {openings.map((col, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="pp-career-col"
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.08 }}
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="pp-career-col__header">
                                            <span className="pp-career-col__icon">{col.icon}</span>
                                            <span className="pp-career-col__tag">{col.title}</span>
                                        </div>
                                        <div className="pp-career-col__list">
                                            {col.items.map((job, i) => (
                                                <a key={i} href="#" className="pp-job-link">
                                                    <span className="pp-job-link__dot" />
                                                    {job}
                                                    <svg className="pp-job-link__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                                    </svg>
                                                </a>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="pp-cta"
                        >
                            <div className="pp-cta__left">
                                <div className="pp-cta__icon">✉️</div>
                                <div>
                                    <h4 className="pp-cta__heading">Don't see your role?</h4>
                                    <p className="pp-cta__sub">
                                        Send your CV to <strong>careers@diviniq.in</strong>
                                    </p>
                                </div>
                            </div>
                            <a href="#" className="pp-print-btn pp-apply-btn">
                                Apply Now
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </a>
                        </motion.div>

                        {/* Footer strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="pp-strip"
                        >
                            <div className="pp-strip__contact">
                                <div className="pp-strip__avatar">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M2 7l10 6 10-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="pp-strip__label">Questions about a role?</p>
                                    <a className="pp-strip__email" href="mailto:careers@diviniq.in">careers@diviniq.in</a>
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </section>

            <Footer />
            <ScrollTop />

            <style>{`
        :root {
          --pp-bg: #faf9f7;
          --pp-gold: #c9882a;
          --pp-gold-light: #f0a93b;
          --pp-maroon: #3a1330;
          --pp-maroon-deep: #2b0f23;
          --pp-ink: #1a1118;
          --pp-muted: #6b6070;
          --pp-line: #ede8eb;
          --pp-card: #ffffff;
          --pp-radius: 18px;
        }

        /* ── Reset ── */
        .pp-root { background: var(--pp-bg); font-family: 'Poppins', sans-serif; color: var(--pp-ink); }
        .pp-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        /* ── Layout ── */
        .pp-section { padding: 60px 0 80px; }
        .pp-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .pp-sidebar { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 24px; }

        .pp-sidebar__card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 2px 8px rgba(60,20,40,0.04);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .pp-sidebar__card:hover {
          box-shadow: 0 6px 20px rgba(60,20,40,0.09);
          transform: translateY(-2px);
        }
        .pp-sidebar__icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #c2185b;
        }
        .pp-sidebar__icon--stat {
          width: 52px; height: 42px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          color: var(--pp-maroon);
          background: #fdeef0;
        }
        .pp-sidebar__label { font-size: 12px; color: var(--pp-muted); font-weight: 500; margin: 0; }
        .pp-sidebar__value { font-size: 13.5px; font-weight: 600; color: var(--pp-ink); margin: 0; }

        /* ── Print / action button ── */
        .pp-print-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--pp-gold-light), var(--pp-gold));
          border: none;
          color: #fff;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pp-print-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(201,136,42,0.35);
          color: #fff;
        }
        .pp-apply-btn { padding: 14px 30px; border-radius: 50px; white-space: nowrap; }

        /* ── Main card ── */
        .pp-card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: var(--pp-radius);
          padding: 48px 52px;
          box-shadow: 0 4px 24px rgba(60,20,40,0.06);
        }
        .pp-heading { font-size: 24px; font-weight: 800; color: var(--pp-maroon); margin: 0 0 10px; }
        .pp-prose { font-size: 15.5px; line-height: 1.85; color: #3d343b; }

        /* ── Career grid ── */
        .pp-career-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .pp-career-col {
          border: 1px solid var(--pp-line);
          border-radius: 16px;
          padding: 22px 20px;
          background: #fbf6f4;
          transition: box-shadow 0.2s ease;
        }
        .pp-career-col:hover { box-shadow: 0 10px 26px rgba(58,19,48,0.10); }
        .pp-career-col__header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .pp-career-col__icon { font-size: 24px; line-height: 1; }
        .pp-career-col__tag {
          font-size: 12.5px; font-weight: 700; letter-spacing: 0.3px;
          font-family: 'Courier New', monospace; color: var(--pp-gold);
        }
        .pp-career-col__list { display: flex; flex-direction: column; gap: 4px; }

        .pp-job-link {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 10px; border-radius: 10px;
          color: var(--pp-muted); text-decoration: none;
          font-size: 13.5px; font-weight: 500;
          transition: background 0.17s ease, color 0.17s ease, padding-left 0.17s ease;
        }
        .pp-job-link:hover { background: #fdeef0; color: var(--pp-maroon); padding-left: 14px; text-decoration: none; }
        .pp-job-link__dot { width: 6px; height: 6px; border-radius: 50%; background: #c2185b; flex-shrink: 0; opacity: 0.6; }
        .pp-job-link__arrow { margin-left: auto; opacity: 0; transition: opacity 0.17s ease; color: var(--pp-gold); flex-shrink: 0; }
        .pp-job-link:hover .pp-job-link__arrow { opacity: 1; }

        /* ── CTA ── */
        .pp-cta {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
          background: linear-gradient(135deg, var(--pp-maroon-deep) 0%, #7a1a4a 100%);
          border-radius: 20px; padding: 30px 36px; margin-top: 20px;
        }
        .pp-cta__left { display: flex; align-items: center; gap: 18px; }
        .pp-cta__icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .pp-cta__heading { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 4px; }
        .pp-cta__sub { font-size: 13.5px; color: rgba(255,255,255,0.65); margin: 0; }
        .pp-cta__sub strong { color: var(--pp-gold-light); font-weight: 600; }

        /* ── Bottom strip ── */
        .pp-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: 16px;
          padding: 20px 28px;
          margin-top: 20px;
          box-shadow: 0 2px 10px rgba(60,20,40,0.04);
        }
        .pp-strip__contact { display: flex; align-items: center; gap: 16px; }
        .pp-strip__avatar {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          color: #c2185b;
          flex-shrink: 0;
        }
        .pp-strip__label { font-size: 12px; color: var(--pp-muted); margin: 0 0 3px; }
        .pp-strip__email {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--pp-maroon);
          text-decoration: none;
        }
        .pp-strip__email:hover { color: var(--pp-gold); }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .pp-layout { grid-template-columns: 1fr; }
          .pp-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
          .pp-sidebar__card { flex: 1 1 160px; }
          .pp-card { padding: 28px 22px; }
        }
        @media (max-width: 640px) {
          .pp-career-grid { grid-template-columns: 1fr; }
          .pp-cta { flex-direction: column; text-align: center; padding: 26px 22px; }
          .pp-cta__left { flex-direction: column; text-align: center; }
        }
        @media (max-width: 520px) {
          .pp-sidebar { flex-direction: row; flex-wrap: wrap; }
          .pp-strip { flex-direction: column; align-items: flex-start; }
        }

        /* =========================================================
           HERO — RESPONSIVE (uses !important to override the
           fixed-pixel inline styles set in JSX; inline styles always
           beat plain CSS, so this is required to make it responsive)
           ========================================================= */
        @media (max-width: 992px) {
          .pp-hero { min-height: 280px !important; }
          .pp-hero__inner { min-height: 280px !important; padding: 0 40px !important; }
          .pp-hero__title { font-size: 42px !important; }
          .pp-hero__sub { font-size: 16px !important; }
        }
        @media (max-width: 768px) {
          .pp-hero { min-height: 260px !important; border-radius: 20px !important; }
          .pp-hero__inner { min-height: 260px !important; padding: 0 28px !important; }
          .pp-hero__eyebrow { font-size: 12px !important; letter-spacing: 2px !important; }
          .pp-hero__title { font-size: 32px !important; margin-top: 12px !important; }
          .pp-hero__sub { font-size: 14.5px !important; margin-top: 14px !important; }
          .pp-hero__dash { width: 100px !important; margin-top: 20px !important; }
        }
        @media (max-width: 480px) {
          .pp-hero { min-height: 230px !important; border-radius: 16px !important; }
          .pp-hero__inner { min-height: 230px !important; padding: 0 20px !important; }
          .pp-hero__eyebrow { font-size: 11px !important; letter-spacing: 1.5px !important; }
          .pp-hero__title { font-size: 26px !important; }
          .pp-hero__sub { font-size: 13.5px !important; }
        }

        /* ── Sidebar stat cards: 2 per row on small phones ──
           (the last card, "Careers Team", stays full-width since
           it has more content and shouldn't be squeezed) */
        @media (max-width: 520px) {
          .pp-sidebar__card { flex: 1 1 calc(50% - 7px); }
          .pp-sidebar__card:last-child { flex: 1 1 100%; }
        }

        /* ── Main card padding on small phones ── */
        @media (max-width: 480px) {
          .pp-card { padding: 20px 16px; }
          .pp-heading { font-size: 20px; }
          .pp-prose { font-size: 14px; }
        }

        /* ── CTA button full-width on small phones ── */
        @media (max-width: 480px) {
          .pp-apply-btn { width: 100%; justify-content: center; }
        }
      `}</style>
        </div>
    );
}

export default Careers;