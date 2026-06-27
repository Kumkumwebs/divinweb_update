import React, { useState } from 'react';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import SideMenu from '../components/layout/SideMenu';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import { motion } from 'framer-motion';

function ContactUs() {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <div className="main-wrapper">
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
                onLoginClick={() => setShowLoginModal(true)}
            />

            {/* ===== BREADCRUMB SECTION ===== */}
            <div className="breadcumb-wrapper" style={{ background: '#0f172a', padding: '100px 0' }}>
                <div className="container text-center">
                    <span className="sub-title style1 text-theme">Connect with Divinity</span>
                    <h1 className="breadcumb-title text-white">Contact Divin<span className="text-theme">IQ</span></h1>
                </div>
            </div>

            {/* ===== CONTACT INFO CARDS ===== */}
            <section className="space-top">
                <div className="container">
                    <div className="row g-4">
                        {[
                            { icon: "fas fa-phone-alt", title: "Speak to Us", text: "+91 98765 43210", sub: "Mon - Sat: 9AM - 8PM" },
                            { icon: "fas fa-envelope-open", title: "Write to Us", text: "support@diviniq.in", sub: "Instant response within 24hrs" },
                            { icon: "fas fa-map-marker-alt", title: "Sacred Office", text: "DLF Cyber City, Gurugram", sub: "Haryana, India" }
                        ].map((item, i) => (
                            <div className="col-lg-4 col-md-6" key={i}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="contact-info-box"
                                >
                                    <div className="contact-info-icon">
                                        <i className={item.icon}></i>
                                    </div>
                                    <h4 className="h5 fw-bold mb-2">{item.title}</h4>
                                    <p className="mb-1 fw-bold text-dark">{item.text}</p>
                                    <p className="small text-muted mb-0">{item.sub}</p>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CONTACT FORM SECTION ===== */}
            <section className="space">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5">
                            <div className="title-area mb-35">
                                <span className="sub-title style1">🌸 Reach Out</span>
                                <h2 className="sec-title text-gradient">Seeking Spiritual <br/> Clarity?</h2>
                                <p className="mt-3 text-muted">Whether you have questions about your Kundli, need ritual assistance, or require app support, our team is here to guide you.</p>
                            </div>
                            <div className="social-links mt-4">
                                <h6 className="mb-3">Follow our Journey:</h6>
                                <div className="d-flex gap-3">
                                    <a href="#" className="th-btn style3 py-2 px-3 rounded-pill"><i className="fab fa-instagram"></i></a>
                                    <a href="#" className="th-btn style3 py-2 px-3 rounded-pill"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#" className="th-btn style3 py-2 px-3 rounded-pill"><i className="fab fa-whatsapp"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="contact-form-wrap mt-5 mt-lg-0"
                            >
                                <form className="contact-form">
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <input type="text" placeholder="Your Name" />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <input type="email" placeholder="Email Address" />
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <select>
                                                <option value="">Subject of Inquiry</option>
                                                <option value="astrology">Astrology Consultation</option>
                                                <option value="puja">Rituals/Puja Services</option>
                                                <option value="app">App Support</option>
                                                <option value="business">Business Partnership</option>
                                            </select>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <textarea placeholder="How can we guide you today?"></textarea>
                                        </div>
                                        <div className="col-md-12">
                                            <button className="th-btn style3 w-100 py-3 rounded-pill">
                                                Send Message <i className="fas fa-paper-plane ms-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MAP SECTION ===== */}
            <div className="map-sec pb-5">
                <div className="container">
                    <div className="rounded-40 overflow-hidden shadow-lg" style={{ height: '400px' }}>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.138495068228!2d77.0871926!3d28.4842183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193ed6e27607%3A0xc6c76c0222a7f50a!2sCyber%20City!5e0!3m2!1sen!2sin!4v1692222222222!5m2!1sen!2sin" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>

            <Footer />
            <ScrollTop />
        </div>
    );
}

export default ContactUs;