import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import FaqSection from '../components/sections/FAQSection';

const FriendshipCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Status" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        vibeStatus: "Harmonious",
        energy: "Mercury in Capricorn",
        time: "02:35:12 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate Name Vibrational Logic
        setTimeout(() => {
            const score = Math.floor(Math.random() * (100 - 45 + 1)) + 45; 
            setResult({
                name1: e.target.name1.value,
                name2: e.target.name2.value,
                score: score,
                status: score > 85 ? "Soul Siblings" : score > 70 ? "Best Friends" : "Good Pals",
                loyalty: score > 75 ? "Unwavering" : "Stable",
                trust: score > 80 ? "High" : "Building",
                remark: "Your name frequencies suggest a bond built on mutual respect and shared growth."
            });
            setLoading(false);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }, 1500);
    };

    return (
        <div className="main-wrapper bg-white">
            <Header />

            {/* CELESTIAL HERO */}
            <div className="breadcumb-wrapper position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
                padding: '100px 0'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-white">
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sub-title style1 text-theme">Social Science</motion.span>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="breadcumb-title text-white mb-3">Friendship Finder</motion.h1>
                            <p className="opacity-75 mb-0">Discover the vibrational compatibility between you and your friend based on Name Numerology.</p>
                        </div>

                        {/* LIVE TOP BAR CARD - EXACT STRUCTURE */}
                        <div className="col-lg-5 mt-4 mt-lg-0">
                            <motion.div whileHover={{ scale: 1.02 }} className="celestial-card p-4 rounded-25 text-white animate-float">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 small uppercase tracking-wider">Social Vibe Today</h5>
                                    <div className="pulse-live" style={{ backgroundColor: '#10b981' }}></div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <p className="small opacity-50 mb-1">Current Vibe</p>
                                        <h3 className="text-theme mb-0">{todayData.vibeStatus}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-4">
                                        <p className="small opacity-50 mb-1">Cosmic Energy</p>
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
                                <h3 className="h4 mb-30">Check Your Synergy</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Your Name</label>
                                        <input name="name1" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Your Name" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Friend's Name</label>
                                        <input name="name2" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Friend's Name" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="small fw-bold mb-2">Email Address</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="email@diviniq.com" required />
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner border-0 shadow-lg">
                                        {loading ? "Syncing Names..." : "Calculate Friendship %"}
                                    </button>
                                </form>
                                <div className="mt-4 p-2 bg-light rounded-15 border border-dashed text-center">
                                    <p className="xsmall text-muted mb-0" style={{fontSize: '11px'}}>
                                        *Note: This tool is based on Name Numerology for <strong>fun and entertainment purposes only</strong>.
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
                                            <p>Vibrational matching analysis <br/> will appear here.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30 text-center">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Bond Strength</span>
                                            <h2 className="text-white display-5 mb-1 mt-2">{result.score}%</h2>
                                            <div className="badge bg-white-10 text-theme px-3 py-2 rounded-pill">{result.status}</div>
                                            
                                            <div className="mt-4">
                                                <div className="progress bg-white-10" style={{ height: '10px', borderRadius: '10px' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.score}%` }} className="progress-bar bg-theme" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Loyalty Level", v: result.loyalty },
                                                { l: "Trust Factor", v: result.trust },
                                            ].map((item, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="glass-stat p-3 rounded-inner text-center">
                                                        <p className="small text-white-50 mb-1">{item.l}</p>
                                                        <p className="text-white fw-bold mb-0">{item.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 bg-white-10 p-3 rounded-inner border border-white-10">
                                            <p className="small text-theme fw-bold mb-1">DivinIQ Social Remark:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.remark}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small">Share Result</button>
                                            <span className="text-white-50 small">{result.name1} + {result.name2}</span>
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
                        <span className="sub-title style1 text-theme">Social Harmony</span>
                        <h2 className="info-title">The Science of <span className="text-gradient">Name Sync</span></h2>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="bento-card">
                                <div className="icon-circle shadow-sm">
                                    <img src="assets/img/icon/about_1_1.svg" width="30" alt="" />
                                </div>
                                <h3 className="h4 fw-bold">How Names Influence Bonds?</h3>
                                <p className="text-muted leading-relaxed">
                                    In Numerology, names aren't just labels—they are vibrational frequencies. When two names interact, their numeric values create either a harmonic resonance or a challenging frequency. DivinIQ analyzes these vibrations to determine the natural flow of your friendship.
                                </p>
                                <div className="mt-4">
                                    <span className="feature-pill">Vibrational Sync</span>
                                    <span className="feature-pill">Social Numerology</span>
                                    <span className="feature-pill">Energy Matching</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="bento-card bg-title text-white">
                                <h3 className="h5 text-white fw-bold mb-4">Compatibility Scale</h3>
                                <div className="space-y-3">
                                    <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                                        <span className="small opacity-75">90% - 100%</span>
                                        <span className="small fw-bold text-theme">Soul Siblings</span>
                                    </div>
                                    <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                                        <span className="small opacity-75">70% - 89%</span>
                                        <span className="small fw-bold text-theme">Best Friends</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="small opacity-75">Below 60%</span>
                                        <span>Casual Acquaintance</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FaqSection faq={[
                {
                    question: "How does name numerology calculate friendship?",
                    answer: "We assign values to letters based on the Chaldean system. The interaction between these total sums determines the vibrational synergy between two individuals."
                },
                {
                    question: "Does using a nickname change the score?",
                    answer: "Yes. In numerology, the vibration of the name used most frequently is the one that carries the most energy in your social interactions."
                },
                {
                    question: "Is this based on horoscopes?",
                    answer: "No. This tool focuses exclusively on name vibrations. For horoscope-based matching, please use our Janma Rashi or Nakshatra calculators."
                }
            ]} />

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default FriendshipCalculator;