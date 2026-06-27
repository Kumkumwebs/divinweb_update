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
        { title: "// Tech & Dev", items: ["Full Stack Engineer", "UI/UX Designer", "Product Manager"] },
        { title: "// Spiritual Masters", items: ["Vedic Astrologer", "Ritual Specialist", "Vastu Expert"] },
        { title: "// Growth & Marketing", items: ["Content Strategist", "SEO Specialist", "Social Media lead"] },
        { title: "// Support", items: ["Customer Care", "Operations", "Legal & Compliance"] }
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

            {/* --- Breadcrumb matching About Style --- */}
            <div className="breadcumb-wrapper" style={{ background: '#0f172a', padding: '100px 0' }}>
                <div className="container text-center">
                    <span className="sub-title style1 text-theme">Work with Wisdom</span>
                    <h1 className="breadcumb-title text-white">Join Our <span className="text-theme">Lineage</span></h1>
                </div>
            </div>

            <section className="career-canvas-elite">
                <div className="container-fluid p-0 position-relative z-index-1">
                    
                    {/* --- 1. Top Section --- */}
                    <div className="text-center mb-120">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                            <img src="/assets/img/logo123.svg" width="180" alt="DivinIQ" className="mb-40" />
                            <h2 className="text-dark fw-bold display-5 mb-20">Uncover your new career path</h2>
                            <p className="text-muted mx-auto" style={{maxWidth: '650px'}}>
                                Be part of a community of innovators, from spiritual masters to tech visionaries, working together to redefine spiritual wellness.
                            </p>
                        </motion.div>
                    </div>

                    {/* --- 2. 4-Column Career Grid --- */}
                    <div className="row justify-content-between g-5">
                        {openings.map((col, idx) => (
                            <div key={idx} className="col-6 col-md-3 col-xl-auto">
                                <span className="career-tag-elite">{col.title}</span>
                                <div className="nav flex-column">
                                    {col.items.map((job, i) => (
                                        <a key={i} href="#" className="text-muted text-decoration-none small mb-3 hover-theme d-block" style={{fontSize: '15px'}}>
                                            {job}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- 3. CTA & Bottom Section --- */}
                    <div className="row align-items-center mt-120 pt-40 border-top border-light">
                        <div className="col-lg-6">
                            <h4 className="text-dark h5 mb-2">Don't see your role?</h4>
                            <p className="small text-muted mb-0">Send your CV to <span className="fw-bold">careers@diviniq.in</span></p>
                        </div>
                        <div className="col-lg-6 text-md-end mt-4 mt-lg-0">
                            <a href="#" className="th-btn style3 rounded-pill px-5 border-0">
                                Apply Now <i className="fas fa-arrow-right ms-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <ScrollTop />
        </div>
    );
}

export default Careers;