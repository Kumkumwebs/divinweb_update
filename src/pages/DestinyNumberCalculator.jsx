import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import FaqSection from '../components/sections/FAQSection';

const DestinyNumberCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Numerology" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        universalDay: "5",
        energy: "Mercury / Communication",
        time: "02:37:15 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        // --- DESTINY NUMBER LOGIC (Sum of DOB) ---
        const dobValue = e.target.date.value; // YYYY-MM-DD
        const digits = dobValue.replace(/-/g, '').split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);
        
        // Reduce to single digit (1-9)
        while (sum > 9) {
            sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }

        const descriptions = {
            1: "The Leader: Independent, creative, and ambitious.",
            2: "The Diplomat: Sensitive, intuitive, and cooperative.",
            3: "The Expressor: Artistic, social, and optimistic.",
            4: "The Builder: Practical, disciplined, and reliable.",
            5: "The Adventurer: Versatile, energetic, and freedom-loving.",
            6: "The Nurturer: Responsible, loving, and harmonious.",
            7: "The Seeker: Analytical, spiritual, and introspective.",
            8: "The Achiever: Authoritative, business-minded, and powerful.",
            9: "The Humanitarian: Compassionate, idealistic, and creative."
        };

        setTimeout(() => {
            setResult({
                name: e.target.name.value,
                destinyNumber: sum,
                rulingPlanet: ["", "Sun", "Moon", "Jupiter", "Rahu", "Mercury", "Venus", "Ketu", "Saturn", "Mars"][sum],
                nature: descriptions[sum].split(':')[0],
                description: descriptions[sum].split(':')[1],
                luckyColor: ["", "Gold/Yellow", "White", "Yellow", "Grey", "Green", "White/Pink", "Light Blue", "Deep Blue", "Red"][sum]
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
                background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                padding: '100px 0'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-white">
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sub-title style1 text-theme">Numerology Science</motion.span>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="breadcumb-title text-white mb-3">Destiny Number Finder</motion.h1>
                            <p className="opacity-75 mb-0">Uncover your Bhagyank—the single most important number that defines your life's ultimate purpose and path.</p>
                        </div>

                        {/* LIVE TOP BAR CARD - ORIGINAL STRUCTURE */}
                        <div className="col-lg-5 mt-4 mt-lg-0">
                            <motion.div whileHover={{ scale: 1.02 }} className="celestial-card p-4 rounded-25 text-white animate-float">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 small uppercase tracking-wider">Universal Vibration</h5>
                                    <div className="pulse-live"></div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <p className="small opacity-50 mb-1">Universal Day</p>
                                        <h3 className="text-theme mb-0">Number {todayData.universalDay}</h3>
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
                        {/* FORM SIDE */}
                        <div className="col-lg-5">
                            <div className="bg-white py-20 px-20 rounded-25 shadow-sm border border-light h-100">
                                <h3 className="h4 mb-30">Calculate Your Bhagyank</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Full Name</label>
                                        <input name="name" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Rahul Sharma" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Email Address</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="rahul@diviniq.com" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="small fw-bold mb-2">Date of Birth</label>
                                        <input name="date" type="date" className="form-control input-modern py-3 rounded-inner" required />
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner border-0 shadow-lg">
                                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Reveal My Destiny"}
                                    </button>
                                </form>
                                <div className="mt-4 p-2 bg-light rounded-15 border border-dashed text-center">
                                    <p className="xsmall text-muted mb-0" style={{fontSize: '11px'}}>
                                        *Your data is encrypted. We use Pythagorean numerology for precision.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RESULT SIDE */}
                        <div className="col-lg-7">
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-100 rounded-25 border-2 border-dashed border-light d-flex align-items-center justify-content-center text-center p-5 bg-white">
                                        <div className="opacity-30">
                                            <img src="assets/img/icon/about_1_1.svg" width="60" className="mb-3" alt="" />
                                            <p>Enter your birth date to unlock <br/> your destiny number analysis.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30 text-center">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Your Destiny Number</span>
                                            <h2 className="text-white display-3 mb-1 mt-2">{result.destinyNumber}</h2>
                                            <div className="badge bg-white-10 text-theme px-3 py-2 rounded-pill">The {result.nature}</div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Ruling Planet", v: result.rulingPlanet },
                                                { l: "Lucky Color", v: result.luckyColor },
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
                                            <p className="small text-theme fw-bold mb-1">DivinIQ Life Path Insight:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.description}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small shadow-none">Full Career Report</button>
                                            <span className="text-white-50 small">Bhagyank for {result.name}</span>
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
                        <span className="sub-title style1 text-theme">Numerical Secrets</span>
                        <h2 className="info-title">The Power of <span className="text-gradient">Destiny Numbers</span></h2>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="bento-card">
                                <div className="icon-circle shadow-sm">
                                    <img src="assets/img/icon/about_1_1.svg" width="30" alt="" />
                                </div>
                                <h3 className="h4 fw-bold">What is a Destiny Number?</h3>
                                <p className="text-muted leading-relaxed">
                                    While your Psychic Number (Mulank) shows who you are internally, your **Destiny Number (Bhagyank)** reveals where your life is heading. It is the vibration of your purpose—the work you are meant to do and the legacy you are destined to leave behind.
                                </p>
                                <div className="mt-4">
                                    <span className="feature-pill">Life Purpose</span>
                                    <span className="feature-pill">Karmic Path</span>
                                    <span className="feature-pill">Bhagyank Science</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="bento-card bg-title text-white">
                                <h3 className="h5 text-white fw-bold mb-4">Calculation Method</h3>
                                <p className="small opacity-75 leading-relaxed">
                                    DivinIQ uses the full reduction method: <br/><br/>
                                    <strong>Example:</strong> Dec 20, 1995 <br/>
                                    1+2 + 2+0 + 1+9+9+5 = 29 <br/>
                                    2+9 = 11 | 1+1 = <b>2</b>
                                </p>
                                <div className="mt-4 p-3 bg-white-10 rounded-15 border border-white-10">
                                    <span className="small text-theme fw-bold">Result:</span> <span className="small">Your destiny is governed by the Moon.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FaqSection faq={[
                {
                    question: "How is Destiny Number different from Moolank?",
                    answer: "Moolank (Psychic Number) is derived only from your birth date (e.g., the 20th). Bhagyank (Destiny Number) is the total sum of your entire date, month, and year of birth."
                },
                {
                    question: "Can I change my Destiny Number?",
                    answer: "No. Your birth date is fixed. However, you can change the spelling of your name (Name Number) to align with your Destiny Number for better luck and harmony."
                },
                {
                    question: "What is a Master Number?",
                    answer: "In some systems, 11, 22, and 33 are Master Numbers. However, in traditional Vedic reduction, we simplify them further to 2, 4, and 6 to find the core planetary ruler."
                }
            ]} />

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default DestinyNumberCalculator;