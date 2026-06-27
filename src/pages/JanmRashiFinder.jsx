import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import FaqSection from '../components/sections/FAQSection';

const JanmaRashiFinder = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Rashi" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        rashi: "Sagittarius",
        symbol: "Archer",
        element: "Fire",
        time: "02:08:44 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate Rashi Calculation logic
        setTimeout(() => {
            setResult({
                name: e.target.name.value,
                rashi: "Cancer",
                sanskritName: "Karka",
                symbol: "Crab",
                element: "Water",
                rulingPlanet: "Moon",
                quality: "Cardinal",
                description: "Nurturing, intuitive, and deeply protective of loved ones."
            });
            setLoading(false);
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
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sub-title style1 text-theme">Vedic Moon Sign</motion.span>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="breadcumb-title text-white mb-3">Janma Rashi Finder</motion.h1>
                            <p className="opacity-75 mb-0">Identify your Vedic Moon Sign to unlock the secrets of your emotional DNA and mental state.</p>
                        </div>

                        {/* LIVE RASHI WIDGET */}
                        <div className="col-lg-5 mt-4 mt-lg-0">
                            <motion.div whileHover={{ scale: 1.02 }} className="celestial-card p-4 rounded-25 text-white animate-float">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 small uppercase tracking-wider">Today's Moon Transit</h5>
                                    <div className="pulse-live"></div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <p className="small opacity-50 mb-1">Current Rashi</p>
                                        <h3 className="text-theme mb-0">{todayData.rashi}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-4">
                                        <p className="small opacity-50 mb-1">Element</p>
                                        <h4 className="text-white mb-0 h5">{todayData.element}</h4>
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
                                        {loading ? "Calculating Rashi..." : "Find My Moon Sign"}
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
                                            <p>Results will be displayed here <br/> based on your lunar placement.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-40">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Calculated Moon Sign</span>
                                            <h2 className="text-white display-5 mb-0">{result.rashi} <small className="h5 opacity-50">({result.sanskritName})</small></h2>
                                            <p className="text-white-50 mt-2">{result.description}</p>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Symbol", v: result.symbol },
                                                { l: "Element", v: result.element },
                                                { l: "Ruling Planet", v: result.rulingPlanet },
                                                { l: "Quality", v: result.quality }
                                            ].map((item, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="glass-stat p-3 rounded-inner">
                                                        <p className="small text-white-50 mb-1">{item.l}</p>
                                                        <p className="text-white fw-bold mb-0">{item.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small">Free Prediction</button>
                                            <span className="text-white-50 small">DivinIQ Precision v2.1</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCIENCE OF RASHI (BENTO GRID) */}
           {/* EXPANDED SCIENCE OF RASHI (BENTO GRID) */}
<section className="space">
    <div className="container">
        <div className="text-center mb-60">
            <span className="sub-title style1 text-theme">Vedic Wisdom</span>
            <h2 className="info-title">The Influence of <span className="text-gradient">Janma Rashi</span></h2>
        </div>
        
        <div className="row g-4">
            {/* CARD 1: MAIN EXPLANATION */}
            <div className="col-lg-7">
                <div className="bento-card">
                    <div className="icon-circle shadow-sm">
                        <img src="assets/img/icon/about_1_1.svg" width="30" alt="" />
                    </div>
                    <h3 className="h4 fw-bold">Understanding Your Moon Sign</h3>
                    <p className="text-muted leading-relaxed">
                        While the Sun Sign represents your outer personality and ego, the **Janma Rashi (Moon Sign)** reveals your inner emotional landscape. In the DivinIQ system, we prioritize the Moon because 
                        it governs the <i>Manas</i> (mind), determining how you process experiences and interact 
                        with the world on a subconscious level.
                    </p>
                    <div className="mt-4">
                        <span className="feature-pill">Lunar Mindset</span>
                        <span className="feature-pill">Subconscious Habits</span>
                        <span className="feature-pill">Karmic Memory</span>
                    </div>
                </div>
            </div>

            {/* CARD 2: THE FOUR ELEMENTS */}
            <div className="col-lg-5">
                <div className="bento-card bg-title text-white">
                    <h3 className="h5 text-white fw-bold mb-4">The Elemental Temperament</h3>
                    <div className="space-y-3">
                        <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                            <span className="small opacity-75">🔥 Fire (Agni)</span>
                            <span className="small fw-bold text-theme">Action & Passion</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                            <span className="small opacity-75">🌱 Earth (Prithvi)</span>
                            <span className="small fw-bold text-theme">Stability & Logic</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom border-white-10 pb-2">
                            <span className="small opacity-75">💨 Air (Vayu)</span>
                            <span className="small fw-bold text-theme">Intellect & Flow</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span className="small opacity-75">💧 Water (Jala)</span>
                            <span className="small fw-bold text-theme">Intuition & Emotion</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARD 3: SADE SATI & TRANSITS */}
            <div className="col-lg-4">
                <div className="bento-card border-theme">
                    <h3 className="h5 fw-bold mb-3">Life Cycles (Sade Sati)</h3>
                    <p className="small text-muted mb-0">
                        Knowing your Janma Rashi is the only way to track your **Sade Sati**—the 7.5-year 
                        cycle of Saturn. This period is crucial for significant life transformations and 
                        spiritual maturity.
                    </p>
                </div>
            </div>

            {/* CARD 4: NAMING & TRADITION */}
            <div className="col-lg-4">
                <div className="bento-card shadow-sm border-0">
                    <h3 className="h5 fw-bold mb-3">Traditional Alignment</h3>
                    <p className="small text-muted mb-0">
                        Your Rashi determines the 'Nama Akshara'—the specific starting sound for your name 
                        to ensure your life path vibrates in harmony with the cosmos.
                    </p>
                </div>
            </div>

            {/* CARD 5: COMPATIBILITY */}
            <div className="col-lg-4">
                <div className="bento-card bg-light border-0">
                    <h3 className="h5 fw-bold mb-3 text-primary">Relationship Harmony</h3>
                    <p className="small text-muted mb-0">
                        In Vedic matchmaking, Rashi compatibility (Bhakoot) is 1 of the most critical 
                        parameters to ensure emotional longevity between partners.
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

            <FaqSection faq={[
    {
        question: "What is a Janma Rashi?",
        answer: "Janma Rashi is the zodiac sign the Moon was transiting at the exact time of your birth. It is a fundamental pillar of Vedic Astrology that defines your mental and emotional state."
    },
    {
        question: "Is Janma Rashi more important than my Sun Sign?",
        answer: "In Vedic traditions, yes. While the Sun represents your soul's purpose, the Moon (Rashi) represents your daily mind, emotions, and how you perceive reality, which has a more immediate impact on your life."
    },
    {
        question: "How do I find my Rashi if I don't know my exact birth time?",
        answer: "While DivinIQ works best with exact time for precision, the Moon stays in one Rashi for roughly 2.25 days. If you know your birth window, we can identify your Rashi with high probability."
    },
    {
        question: "Can my Rashi change over time?",
        answer: "No. Your Janma Rashi is fixed at birth. However, planets transiting 'over' your Rashi (Gochar) change constantly, which is why your horoscope changes every day."
    },
    {
        question: "How does my Rashi affect my career?",
        answer: "Your Rashi determines your natural inclinations. For example, Earth signs (Taurus, Virgo, Capricorn) excel in management, while Water signs (Cancer, Scorpio, Pisces) thrive in creative or healing professions."
    },
    {
        question: "What is the connection between Rashi and Nakshatra?",
        answer: "Rashi is the larger house (30 degrees), and Nakshatra is the specific room inside (13.20 degrees). Every Rashi contains approximately 2 and a quarter Nakshatras."
    },
    {
        question: "Does my Rashi determine my name?",
        answer: "Yes. In Vedic culture, each Rashi has assigned syllables. Choosing a name that starts with your Rashi's syllable is believed to bring luck and prosperity."
    },
    {
        question: "What is 'Rashi Lord'?",
        answer: "Each Rashi is ruled by a planet (e.g., Mars rules Aries). The strength of your Rashi Lord in your birth chart determines how much support you get from the universe."
    },
    {
        question: "Why does DivinIQ need my birth location?",
        answer: "Astronomical calculations for the Moon's position vary slightly based on the coordinates of the observer on Earth. Precise location ensures your chart is perfectly aligned."
    },
    {
        question: "Can I use Janma Rashi for marriage matching?",
        answer: "Absolutely. Bhakoot Dosha, which is 7 points out of 36 in Guna Milan, is calculated based entirely on the relative positions of the couple's Janma Rashis."
    }
]} />

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default JanmaRashiFinder;