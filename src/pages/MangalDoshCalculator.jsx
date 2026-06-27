import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import FaqSection from '../components/sections/FAQSection';

const MangalDoshaCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Mars Status" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        marsPosition: "Leo",
        energy: "Fiery / Intense",
        time: "02:22:45 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate Mangal Dosha Logic
        setTimeout(() => {
            setResult({
                name: e.target.name.value,
                status: "Anshik Manglik",
                intensity: 42,
                marsPlacement: "12th House",
                neutralized: "Yes (Jupiter Aspect)",
                remedy: "Chant 'Om Angarkaya Namah' 108 times on Tuesdays.",
                description: "Your Martian energy is directed towards spiritual growth. Minor impacts on sleep patterns noted."
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="main-wrapper bg-white">
            <Header />

            {/* CELESTIAL HERO */}
            <div className="breadcumb-wrapper position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #450a0a 0%, #0f172a 100%)',
                padding: '100px 0'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-white">
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sub-title style1 text-theme">Marriage Science</motion.span>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="breadcumb-title text-white mb-3">Mangal Dosha Finder</motion.h1>
                            <p className="opacity-75 mb-0">Analyze Martian influence on your birth chart to ensure long-term relationship harmony and peace.</p>
                        </div>

                        {/* LIVE TOP BAR CARD */}
                        <div className="col-lg-5 mt-4 mt-lg-0">
                            <motion.div whileHover={{ scale: 1.02 }} className="celestial-card p-4 rounded-25 text-white animate-float">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 small uppercase tracking-wider">Mars Transit Today</h5>
                                    <div className="pulse-live" style={{ backgroundColor: '#ef4444' }}></div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <p className="small opacity-50 mb-1">Current Transit</p>
                                        <h3 className="text-theme mb-0">{todayData.marsPosition}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-4">
                                        <p className="small opacity-50 mb-1">Energy Type</p>
                                        <h4 className="text-white mb-0 h5">{todayData.energy}</h4>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-top border-white-10 small opacity-75 d-flex justify-content-between">
                                    <span>{todayData.location}</span>
                                    <span>{todayData.time}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CALCULATOR SECTION */}
            <section className="py-10 bg-smoke">
                <div className="container">
                    <div className="row g-5 align-items-stretch">
                        {/* FORM */}
                        <div className="col-lg-5">
                            <div className="bg-white py-20 px-20 rounded-25 shadow-sm border border-light h-100">
                                <h3 className="h4 mb-30">Enter Birth Details</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Full Name</label>
                                        <input name="name" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Rahul Sharma" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Email Address</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="rahul@diviniq.com" required />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Birth Date</label>
                                            <input type="date" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Birth Time</label>
                                            <input type="time" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="small fw-bold mb-2">Birth Location</label>
                                        <input name="place" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="City, Country" required />
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner border-0">
                                        {loading ? "Analyzing Mars..." : "Check Manglik Status"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RESULT BOX */}
                        <div className="col-lg-7">
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-100 rounded-25 border-2 border-dashed border-light d-flex align-items-center justify-content-center text-center p-5 bg-white">
                                        <div className="opacity-30">
                                            <img src="assets/img/icon/about_1_1.svg" width="60" className="mb-3" alt="" />
                                            <p>Mars placement and dosha <br/> analysis will appear here.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Mangal Dosha Report</span>
                                            <h2 className="text-white display-5 mb-3 mt-2">{result.status}</h2>
                                            
                                            {/* INTENSITY METER */}
                                            <div className="mt-4">
                                                <div className="d-flex justify-content-between small text-white-50 mb-2">
                                                    <span>Dosha Intensity</span>
                                                    <span>{result.intensity}%</span>
                                                </div>
                                                <div className="progress bg-white-10" style={{ height: '10px', borderRadius: '10px' }}>
                                                    <motion.div 
                                                        initial={{ width: 0 }} 
                                                        animate={{ width: `${result.intensity}%` }} 
                                                        className="progress-bar bg-theme"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Mars Placement", v: result.marsPlacement },
                                                { l: "Cancellation", v: result.neutralized },
                                            ].map((item, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="glass-stat p-3 rounded-inner">
                                                        <p className="small text-white-50 mb-1">{item.l}</p>
                                                        <p className="text-white fw-bold mb-0">{item.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 bg-white-10 p-3 rounded-inner border border-white-10">
                                            <p className="small text-theme fw-bold mb-1">DivinIQ Expert Insight:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.description}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small">Remedy Guide</button>
                                            <span className="text-white-50 small">Generated for {result.name}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO GRID INFO */}
            <section className="space">
                <div className="container">
                    <div className="text-center mb-60">
                        <span className="sub-title style1 text-theme">The Martian Power</span>
                        <h2 className="info-title">The Science of <span className="text-gradient">Mangal Dosha</span></h2>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="bento-card">
                                <div className="icon-circle shadow-sm">
                                    <img src="assets/img/icon/about_1_1.svg" width="30" alt="" />
                                </div>
                                <h3 className="h4 fw-bold">Understanding Manglik Status</h3>
                                <p className="text-muted leading-relaxed">
                                    Mangal Dosha is a celestial condition identified by DivinIQ when Mars is positioned in the 1st, 4th, 7th, 8th, or 12th house. While commonly feared, Vedic science views it as a specific high-intensity energy profile that requires conscious balancing for marital success.
                                </p>
                                <div className="mt-4">
                                    <span className="feature-pill">Energy Analysis</span>
                                    <span className="feature-pill">Kuja Dosha</span>
                                    <span className="feature-pill">Relationship Heat</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="bento-card bg-title text-white">
                                <h3 className="h5 text-white fw-bold mb-4">Critical Placements</h3>
                                <div className="space-y-3">
                                    <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                                        <span className="small opacity-75">7th House</span>
                                        <span className="small fw-bold text-theme">Direct Union Impact</span>
                                    </div>
                                    <div className="col-lg-12 pt-2">
                                        <p className="small opacity-50 mb-0 leading-relaxed">Mars here creates direct heat in partnerships, often requiring a similar energy profile in a spouse.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bento-card border-theme">
                                <h3 className="h5 fw-bold mb-3">Does it Cancel?</h3>
                                <p className="small text-muted mb-0">
                                    DivinIQ accounts for over 20 cancellation rules, including Jupiter's aspect or Mars in its own sign, which can neutralize even a heavy Dosha.
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bento-card shadow-sm border-0">
                                <h3 className="h5 fw-bold mb-3">The Age 28 Factor</h3>
                                <p className="small text-muted mb-0">
                                    Mars reaches full maturity at 28. Usually, the impulsiveness of the Dosha naturally stabilizes after this birthday.
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bento-card bg-light border-0">
                                <h3 className="h5 fw-bold mb-3 text-primary">Compatibility</h3>
                                <p className="small text-muted mb-0">
                                    Mangal Dosha is a key metric in Guna Milan, ensuring that two life-forces vibrate at a compatible frequency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FaqSection faq={[
                {
                    question: "Can a Manglik marry a non-Manglik?",
                    answer: "Yes, provided the charts are matched for 'Dosha Samya' (balancing factors). DivinIQ analysis can identify if a non-Manglik chart has enough planetary strength to handle a Manglik spouse."
                },
                {
                    question: "What is Anshik vs Purna Manglik?",
                    answer: "Anshik (Partial) Manglik is low-intensity, occurring in the 1st, 4th, or 12th houses. Purna (Full) is high-intensity, occurring in the 7th or 8th houses."
                },
                {
                    question: "Why does DivinIQ need my birth time?",
                    answer: "Houses in astrology change every 2 hours. Without an exact birth time, we cannot pinpoint which house Mars occupies, making the result inaccurate."
                },
                {
                    question: "Are remedies permanent?",
                    answer: "Vedic remedies like Mantras or charity work serve to balance the 'fire' element of Mars. Consistency helps in maintaining emotional equilibrium in life."
                }
            ]} />

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default MangalDoshaCalculator;