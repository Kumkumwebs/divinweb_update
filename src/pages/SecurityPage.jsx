import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import SideMenu from '../components/layout/SideMenu';
import ScrollTop from '../components/common/ScrollTop';

function Security() {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const securityColumns = [
        { title: "// Data Privacy", desc: "Your cosmic data and birth details are protected by AES-256 military-grade encryption standards." },
        { title: "// Secure Access", desc: "Multi-factor authentication and secure token-based sessions for every spiritual consultation." },
        { title: "// Master Vetting", desc: "A rigorous 5-step background verification for every Vedic Master before they join our platform." },
        { title: "// Vault Storage", desc: "Private, decentralized cloud storage ensuring your ritual records are never accessible by third parties." }
    ];

    return (
        <div className="main-wrapper bg-white">
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
            />

            {/* Breadcrumb matching About Us Style */}
            <div className="breadcumb-wrapper" style={{ background: '#0f172a', padding: '100px 0' }}>
                <div className="container text-center">
                    <span className="sub-title style1 text-theme">Divine Protection</span>
                    <h1 className="breadcumb-title text-white">Security & <span className="text-theme">Privacy</span></h1>
                </div>
            </div>

            <section className="security-page-canvas">
                <div className="container-fluid p-0 position-relative z-index-1">
                    
                    {/* --- Top Branding Section --- */}
                    <div className="text-center mb-120">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                            <img src="/assets/img/logo123.svg" width="180" alt="DivinIQ" className="mb-40" />
                            <h2 className="text-dark fw-bold display-5 mb-20">Uncover our approach to security</h2>
                            <p className="text-muted mx-auto" style={{maxWidth: '650px'}}>
                                We combine the sanctity of ancient tradition with the strength of modern cybersecurity. Your spiritual journey is protected at every step.
                            </p>
                        </motion.div>
                    </div>

                    {/* --- 4-Column Minimalist Grid --- */}
                    <div className="row justify-content-between g-5">
                        {securityColumns.map((col, idx) => (
                            <div key={idx} className="col-6 col-md-3 col-xl-auto">
                                <div className="sec-info-block">
                                    <span className="sec-header-tag">{col.title}</span>
                                    <p className="sec-description">
                                        {col.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Bottom App & Legal Bar (Lineless) --- */}
                    <div className="row align-items-center mt-120 pt-40 border-top border-light">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <div className="d-flex gap-4">
                                <a href="#" className="text-muted text-decoration-none small hover-theme">
                                    <i className="fab fa-apple fs-5 me-2"></i> iOS Security
                                </a>
                                <a href="#" className="text-muted text-decoration-none small hover-theme">
                                    <i className="fab fa-google-play fs-5 me-2 text-warning"></i> Android Safety
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 text-md-end">
                            <p className="small text-muted opacity-50 mb-0">
                                © 2025 DivinIQ Security. Built for Sacred Privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <ScrollTop />
        </div>
    );
}

export default Security;