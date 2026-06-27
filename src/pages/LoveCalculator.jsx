import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import FaqSection from '../components/sections/FAQSection';

const LoveCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Love Energy" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        venusPosition: "Pisces (Exalted)",
        energy: "High / Romantic",
        time: "02:27:32 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        
        // --- VEDIC BACKEND LOGIC (Simulated Guna Milan) ---
        setTimeout(() => {
            const gunas = Math.floor(Math.random() * (36 - 16 + 1)) + 16; 
            let verdict = "Average Match";
            if (gunas >= 30) verdict = "Celestial Union";
            else if (gunas >= 25) verdict = "Highly Compatible";
            else if (gunas >= 18) verdict = "Good Compatibility";
            else verdict = "Requires Guidance";

            setResult({
                name1: e.target.name1.value,
                name2: e.target.name2.value,
                score: gunas,
                status: verdict,
                bhakoot: gunas > 25 ? "Strong" : "Balanced",
                yoni: gunas > 20 ? "Friendly" : "Neutral",
                varna: "Compatible",
                verdict: gunas >= 18 
                    ? "Your planetary energies align for a harmonious long-term bond." 
                    : "Astrological frictions detected; mutual effort is essential."
            });
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="main-wrapper bg-white">
            <Header />

            {/* CELESTIAL HERO */}
            <div className="breadcumb-wrapper position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #4c1d95 0%, #0f172a 100%)',
                padding: '100px 0'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-white">
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sub-title style1 text-theme">Vedic Guna Milan</motion.span>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="breadcumb-title text-white mb-3">Vedic Love Finder</motion.h1>
                            <p className="opacity-75 mb-0">Calculate your relationship strength based on the ancient 36 Guna system of Indian Vedic Astrology.</p>
                        </div>

                        {/* LIVE TOP BAR CARD */}
                        <div className="col-lg-5 mt-4 mt-lg-0">
                            <motion.div whileHover={{ scale: 1.02 }} className="celestial-card p-4 rounded-25 text-white animate-float">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 small uppercase tracking-wider">Love Synergy Today</h5>
                                    <div className="pulse-live" style={{ backgroundColor: '#f02ad2' }}></div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <p className="small opacity-50 mb-1">Venus Transit</p>
                                        <h3 className="text-theme mb-0">{todayData.venusPosition.split(' ')[0]}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-4">
                                        <p className="small opacity-50 mb-1">Energy</p>
                                        <h4 className="text-white mb-0 h5">{todayData.energy.split(' ')[0]}</h4>
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
                                <h3 className="h4 mb-30">Check Your Bond</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Partner 1</label>
                                            <input name="name1" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="P1 Name" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Partner 2</label>
                                            <input name="name2" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="P2 Name" required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Contact Email</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="rahul@diviniq.com" required />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">P1 Birth Date</label>
                                            <input type="date" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">P2 Birth Date</label>
                                            <input type="date" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner border-0">
                                        {loading ? "Matching Stars..." : "Find Compatibility"}
                                    </button>
                                </form>
                                <div className="mt-4 p-2 bg-light rounded-15 border border-dashed text-center">
                                    <p className="xsmall text-muted mb-0" style={{fontSize: '11px'}}>
                                        *Note: This tool is based on generalized Vedic logic for <strong>fun and entertainment purposes only</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RESULT BOX */}
                        <div className="col-lg-7">
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-100 rounded-25 border-2 border-dashed border-light d-flex align-items-center justify-content-center text-center p-5 bg-white">
                                        <div className="opacity-30">
                                            <img src="assets/img/icon/about_1_1.svg" width="60" className="mb-3" alt="" />
                                            <p>Ashta Koota matching scores <br/> will appear here.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30 text-center">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Compatibility Result</span>
                                            <h2 className="text-white display-5 mb-1 mt-2">{result.score} <small className="h5 opacity-50">/ 36</small></h2>
                                            <div className="badge bg-white-10 text-theme px-3 py-2 rounded-pill">{result.status}</div>
                                            
                                            {/* GUNA PROGRESS BAR */}
                                            <div className="mt-4">
                                                <div className="progress bg-white-10" style={{ height: '10px', borderRadius: '10px' }}>
                                                    <motion.div 
                                                        initial={{ width: 0 }} 
                                                        animate={{ width: `${(result.score/36)*100}%` }} 
                                                        className="progress-bar bg-theme"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Mental Match", v: result.bhakoot },
                                                { l: "Temperament", v: result.varna },
                                                { l: "Nature (Yoni)", v: result.yoni },
                                                { l: "Lineage (Gan)", v: result.gan }
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
                                            <p className="small text-theme fw-bold mb-1">DivinIQ Vedic Verdict:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.verdict}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small">Manual Review</button>
                                            <span className="text-white-50 small">{result.name1} & {result.name2}</span>
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
                        <span className="sub-title style1 text-theme">The Science of Union</span>
                        <h2 className="info-title">Decoding the <span className="text-gradient">36 Gunas</span></h2>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="bento-card">
                                <div className="icon-circle shadow-sm">
                                    <img src="assets/img/icon/about_1_1.svg" width="30" alt="" />
                                </div>
                                <h3 className="h4 fw-bold">How Vedic Matching Works?</h3>
                                <p className="text-muted leading-relaxed">
                                    In the DivinIQ system, compatibility is assessed through **Ashta Koota Matching**. This maps 8 critical dimensions of life—from mental health and mutual attraction to longevity and potential for progeny. A score of 18 is the traditional baseline for stability.
                                </p>
                                <div className="mt-4">
                                    <span className="feature-pill">Mental Synergy</span>
                                    <span className="feature-pill">Emotional DNA</span>
                                    <span className="feature-pill">Nadi Match</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="bento-card bg-title text-white">
                                <h3 className="h5 text-white fw-bold mb-4">Score Interpretation</h3>
                                <div className="space-y-3">
                                    <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                                        <span className="small opacity-75">31 - 36 Points</span>
                                        <span className="small fw-bold text-theme">Excellent Bond</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                                        <span className="small opacity-75">21 - 30 Points</span>
                                        <span className="small fw-bold text-theme">Very Good</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="small opacity-75">Below 18 Points</span>
                                        <span className="small fw-bold text-danger">Guidance Needed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bento-card border-theme">
                                <h3 className="h5 fw-bold mb-3">Moon Sign Role</h3>
                                <p className="small text-muted mb-0">
                                    Compatibility is calculated based on the Moon's placement, as it governs the subconscious mind and emotional reactions.
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bento-card shadow-sm border-0">
                                <h3 className="h5 fw-bold mb-3">Nadi Koota</h3>
                                <p className="small text-muted mb-0">
                                    The most important factor (8 points), Nadi determines physiological compatibility and the health of future generations.
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bento-card bg-light border-0">
                                <h3 className="h5 fw-bold mb-3 text-primary">Soul Connection</h3>
                                <p className="small text-muted mb-0">
                                    Bhakoot analysis ensures that both souls vibrate at a frequency that supports mutual spiritual and mental growth.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FaqSection faq={[
                {
                    question: "Is this Love Calculator 100% accurate?",
                    answer: "This tool is based on generalized Vedic algorithms for entertainment purposes. For actual marriage decisions, a comprehensive manual Kundli Milan by a DivinIQ expert is advised."
                },
                {
                    question: "What if our Guna score is low?",
                    answer: "A low score isn't a failure notice. It highlights specific friction points (like communication or health) that partners can consciously work on or balance through remedies."
                },
                {
                    question: "Does this calculator check Mangal Dosha?",
                    answer: "No, this specific tool focuses on Ashta Koota (36 Gunas). Mangal Dosha is a separate analysis which can be checked on our dedicated Mangal Dosha Calculator."
                },
                {
                    question: "What is a good score for marriage?",
                    answer: "Traditionally, any score above 18 out of 36 is considered acceptable, provided there are no major 'Maha-Doshas' like Nadi or Bhakoot Dosha."
                }
            ]} />

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default LoveCalculator;