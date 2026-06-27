import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import SideMenu from '../components/layout/SideMenu';
import ScrollTop from '../components/common/ScrollTop';

function HelpCenter() {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
const suggestedQuestions = [
    "How do I book a consultation?",
    "What services does DivinIQ offer?",
    "How do refunds work?",
    "How can I reschedule my session?",
    "Is my personal data secure?",
    "How do I contact customer support?"
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

            {/* Breadcrumb */}
            <div
                className="breadcumb-wrapper"
                style={{ background: '#0f172a', padding: '100px 0' }}
            >
                <div className="container text-center">
                    <span className="sub-title style1 text-theme">
                        Support & Assistance
                    </span>
                    <h1 className="breadcumb-title text-white">
                        Help <span className="text-theme">Center</span>
                    </h1>
                </div>
            </div>

            {/* Main Help Section */}
            <section className="help-center-pro py-120">
                <div className="container">

                    {/* Intro */}
                    <motion.div
                        className="text-center mb-80"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <img
                            src="/assets/img/logo123.svg"
                            width="160"
                            alt="DivinIQ"
                            className="mb-30"
                        />
                        <h2 className="fw-bold text-dark mb-15">
                            How can we help you?
                        </h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '620px' }}>
                            Get quick assistance, guidance, and expert support for
                            all DivinIQ services — simple, transparent, and reliable.
                        </p>
                    </motion.div>

                    {/* Search Box */}
                    <motion.div
                        className="help-search-box mx-auto mb-80"
                        style={{ maxWidth: '720px' }}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                    >
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control form-control-lg rounded-pill ps-5"
                                placeholder="Search help articles, services, or topics..."
                            />
                            <i
                                className="fas fa-search position-absolute text-muted"
                                style={{ left: '22px', top: '50%', transform: 'translateY(-50%)' }}
                            />
                        </div>
                    </motion.div>
                    {/* Suggested Questions */}
<motion.div
    className="text-center mb-80"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
>
    <h6 className="text-muted mb-4">
        Suggested questions
    </h6>

    <div
        className="d-flex flex-wrap justify-content-center gap-3"
        style={{ maxWidth: '900px', margin: '0 auto' }}
    >
        {suggestedQuestions.map((question, index) => (
            <a
                key={index}
                href="#"
                className="border rounded-pill px-4 py-2 text-muted small text-decoration-none hover-theme"
                style={{ background: '#f8fafc' }}
            >
                {question}
            </a>
        ))}
    </div>
</motion.div>


                    {/* Support Card */}
                    <motion.div
                        className="row justify-content-center pt-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <div className="col-lg-10">
                            <div className="border rounded-4 p-5 d-flex flex-column flex-lg-row align-items-center justify-content-between">
                                <div className="mb-4 mb-lg-0">
                                    <h4 className="text-dark mb-2">
                                        Need personal assistance?
                                    </h4>
                                    <p className="text-muted mb-0">
                                        Our support team is available to assist you
                                        with bookings, payments, and consultations.
                                    </p>
                                </div>

                                <div className="text-center text-lg-end">
                                    <a
                                        href="mailto:support@diviniq.in"
                                        className="th-btn style3 rounded-pill px-5"
                                    >
                                        Contact Support
                                        <i className="fas fa-arrow-right ms-2"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            <Footer />
            <ScrollTop />
        </div>
    );
}

export default HelpCenter;
