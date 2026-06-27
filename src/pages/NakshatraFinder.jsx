import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Ensure framer-motion is installed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import FaqSection from '../components/sections/FAQSection'
const NakshatraFinder = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Nakshatra" for Delhi
    const [todayData] = useState({
        location: "Delhi, India",
        nakshatra: "Mool",
        pada: "Pada 1",
        rashi: "Sagittarius",
        time: "01:22:49 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setResult({
                name: e.target[0].value,
                nakshatra: "Pushya",
                pada: "Pada 2",
                rashi: "Cancer",
                alphabet: "Hu",
                zodiac: "Cancer",
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="main-wrapper bg-white">
            <Header />

            {/* CELESTIAL HERO */}
            <div className="breadcumb-wrapper position-relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '100px 0'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-white">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="sub-title style1 text-theme"
                            >
                                Celestial Insights
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="breadcumb-title text-white mb-3"
                            >
                                Nakshatra Finder
                            </motion.h1>
                            <p className="opacity-75 mb-0">Discover the lunar mansion that governs your inner consciousness and life's purpose.</p>
                        </div>

                        {/* TODAY'S NAKSHATRA WIDGET (Delhi Default) */}
                        <div className="col-lg-5 mt-4 mt-lg-0">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="celestial-card p-4 rounded-20 text-white animate-float"
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 small uppercase tracking-wider">Today in {todayData.location}</h5>
                                    <span className="badge bg-theme text-dark">Live</span>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <p className="small opacity-50 mb-1">Current Star</p>
                                        <h3 className="text-theme mb-0">{todayData.nakshatra}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-4">
                                        <p className="small opacity-50 mb-1">Moon in</p>
                                        <h4 className="text-white mb-0 h5">{todayData.rashi}</h4>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-top border-white-10 d-flex justify-content-between small opacity-75">
                                    <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long' })}</span>
                                    <span>{todayData.time}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE CALCULATOR */}
            <section className="py-30">
                <div className="container">
                    <div className="row g-5 align-items-stretch">

                        {/* INPUT FORM SIDE */}
                        <div className="col-lg-5">
                            <div className="bg-white px-20 py-20 rounded-25 shadow-sm border border-light h-100">
                                <h3 className="h4 mb-30">Enter Birth Details</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Full Name</label>
                                        <input name="name" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Rahul Sharma" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Email Address</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="rahul@example.com" required />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Date of Birth</label>
                                            <input name="date" type="date" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Time of Birth</label>
                                            <input name="time" type="time" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="small fw-bold mb-2">Place of Birth</label>
                                        <input name="place" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="City, State" required />
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner">
                                        {loading ? "Aligning Stars..." : "Calculate My Nakshatra"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* PREMIUM RESULT SIDE */}
                        <div className="col-lg-7 ">
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="h-100 rounded-25 border-2 border-dashed border-light d-flex align-items-center justify-content-center text-center p-5"
                                    >
                                        <div>
                                            <img src="assets/img/icon/about_1_1.svg" width="60" className="opacity-20 mb-3" alt="" />
                                            <p className="text-muted small">Your customized Nakshatra report <br /> will appear here after calculation.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="result-card-premium px-40 py-40  p-md-50 rounded-25 h-100 overflow-hidden"
                                    >
                                        {/* Result Header */}
                                        <div className="d-flex justify-content-between align-items-start mb-40 ">
                                            <div>
                                                <span className="text-theme small fw-bold uppercase tracking-widest">Your Janma Nakshatra</span>
                                                <h2 className="text-white display-6 mb-0">{result.nakshatra}</h2>
                                            </div>
                                            <div className="bg-white-10 p-3 rounded-inner backdrop-blur">
                                                <img src="assets/img/icon/about_1_2.svg" width="40" alt="" style={{ filter: 'brightness(0) invert(1)' }} />
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <div className="glass-stat p-3 rounded-inner">
                                                    <p className="small text-white opacity-40 mb-1">Moon Sign (Rashi)</p>
                                                    <p className="text-white fw-bold mb-0">{result.rashi}</p>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="glass-stat p-3 rounded-inner">
                                                    <p className="small text-white opacity-40 mb-1">Nakshatra Pada</p>
                                                    <p className="text-white fw-bold mb-0">{result.pada}</p>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="glass-stat p-3 rounded-inner">
                                                    <p className="small text-white opacity-40 mb-1">Name Alphabet</p>
                                                    <p className="text-white fw-bold mb-0">{result.alphabet}</p>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="glass-stat p-3 rounded-inner">
                                                    <p className="small text-white opacity-40 mb-1">Zodiac Sign</p>
                                                    <p className="text-white fw-bold mb-0">{result.zodiac}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Action */}
                                        <div className="mt-40 pt-30 border-top border-white-10 d-flex flex-column flex-md-row justify-content-between align-items-center">
                                            <p className="text-white small mb-3 mb-md-0 opacity-50 text-center text-md-start">
                                                Report generated for <span className="text-white opacity-100">{result.name}</span> <br />
                                                Born in {result.location}
                                            </p>
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small shadow-none">Talk to Astrologer</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-10 overflow-hidden">
                <div className="container">
                    {/* MODERN HEADER */}
                    <div className="row justify-content-center mb-60">
                        <div className="col-lg-8 text-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="info-title"
                            >
                                The Science Behind <span className="text-gradient">DivinIQ Precision</span>
                            </motion.h2>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* LARGE FEATURE CARD */}
                        <div className="col-lg-8">
                            <div className="bento-card shadow-sm">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <div className="icon-circle shadow-sm">
                                            <img src="assets/img/icon/about_1_1.svg" width="30" alt="" />
                                        </div>
                                        <h3 className="h4 fw-bold">What Is a Nakshatra Finder?</h3>
                                        <p className="text-muted leading-relaxed">
                                            Unlike standard sun-sign tools, the DivinIQ Nakshatra Finder maps the
                                            Moon's exact transit through 27 lunar mansions. This identifies your
                                            <strong> Janma Nakshatra</strong>—the celestial blueprint of your
                                            subconscious mind.
                                        </p>
                                        <div className="mt-3">
                                            <span className="feature-pill">27 Lunar Mansions</span>
                                            <span className="feature-pill">Moon Coordinate Mapping</span>
                                            <span className="feature-pill">Vedic Accuracy</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-none d-md-block">
                                        <img src="assets/img/normal/about_3_1.jpg" className="w-100 rounded-25 shadow-lg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SMALL VERTICAL CARD */}
                        <div className="col-lg-4">
                            <div className="bento-card bg-title text-white">
                                <h3 className="h4 fw-bold text-white mb-4">The Essentials</h3>
                                <div className="space-y-4">
                                    <div className="d-flex gap-3 mb-4 border-bottom border-white-10 pb-3">
                                        <div className="text-theme fw-bold h4">01</div>
                                        <div>
                                            <h6 className="text-white mb-1">Date of Birth</h6>
                                            <p className="small opacity-50 mb-0">The foundational anchor.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3 mb-4 border-bottom border-white-10 pb-3">
                                        <div className="text-theme fw-bold h4">02</div>
                                        <div>
                                            <h6 className="text-white mb-1">Birth Time</h6>
                                            <p className="small opacity-50 mb-0">For precise Moon degrees.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <div className="text-theme fw-bold h4">03</div>
                                        <div>
                                            <h6 className="text-white mb-1">Location</h6>
                                            <p className="small opacity-50 mb-0">To calculate local sunrise.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COMPARISON CARD */}
                        <div className="col-lg-5">
                            <div className="bento-card border-theme">
                                <h3 className="h5 fw-bold mb-3">Nakshatra vs Rashi</h3>
                                <p className="small text-muted mb-4">While your Rashi (Zodiac) shows your external world, the Nakshatra reveals your inner soul.</p>
                                <div className="d-flex flex-column gap-3">
                                    <div className="p-3 bg-light rounded-15 d-flex justify-content-between">
                                        <span className="fw-bold small">Rashi Coverage</span>
                                        <span className="badge bg-title rounded-pill">30° Degrees</span>
                                    </div>
                                    <div className="p-3 bg-indigo-100 rounded-15 d-flex justify-content-between border border-indigo-200">
                                        <span className="fw-bold small text-primary">Nakshatra Precision</span>
                                        <span className="badge bg-primary rounded-pill">13°20' Degrees</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BENEFITS GRID */}
                        <div className="col-lg-7">
                            <div className="bento-card shadow-sm border-0 bg-white">
                                <h3 className="h5 fw-bold mb-4">Spiritual & Practical Benefits</h3>
                                <div className="row g-3">
                                    {[
                                        { t: "Kundli Milan", d: "Marriage compatibility matching." },
                                        { t: "Self Awareness", d: "Personal growth & behavior." },
                                        { t: "Shubh Muhurat", d: "Auspicious dates for events." },
                                        { t: "Life Guidance", d: "Career & spiritual path." }
                                    ].map((item, i) => (
                                        <div className="col-md-6" key={i}>
                                            <div className="p-3 border rounded-20 h-100">
                                                <h6 className="mb-1 small fw-bold">{item.t}</h6>
                                                <p className="small text-muted mb-0">{item.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <FaqSection faq={[
                {
                    question: "What exactly is a Nakshatra Finder?",
                    answer: "A Nakshatra Finder is a high-precision digital tool that identifies your 'Birth Star' by mapping the Moon's exact longitudinal position against the 27 lunar mansions at the moment of your birth."
                },
                {
                    question: "Can I find my Nakshatra using only my Date of Birth?",
                    answer: "While Date of Birth provides a general idea, DivinIQ requires your exact Time and Place of Birth for 100% accuracy, as the Moon moves through a Nakshatra roughly every 24 hours."
                },
                {
                    question: "What is the difference between Rashi and Nakshatra?",
                    answer: "Rashi (Moon Sign) covers a broad 30° arc of the zodiac, whereas a Nakshatra is a highly specific 13°20' segment. Your Nakshatra offers much deeper insights into your subconscious behavior than your Rashi alone."
                },
                {
                    question: "How does knowing my Nakshatra benefit my daily life?",
                    answer: "It helps you align with cosmic timing (Muhurats), choose the most compatible life partner (Guna Milan), select the right career path, and even identify auspicious starting letters for names."
                },
                {
                    question: "What does 'Janma Nakshatra' mean?",
                    answer: "Janma Nakshatra refers specifically to the Nakshatra the Moon was transiting at the exact second you were born. It is considered the most important point in your entire Vedic birth chart."
                },
                {
                    question: "Why does DivinIQ ask for my birth location?",
                    answer: "Birth location is vital because the Moon’s relative position and the exact timing of sunrise/sunset vary by geography, which directly impacts the precision of your Nakshatra calculation."
                },
                {
                    question: "Are there remedies associated with my Nakshatra?",
                    answer: "Yes. Every Nakshatra has a ruling deity and planet. DivinIQ can suggest specific mantras, colors, and gemstones to balance your energy based on your unique birth star."
                }
            ]} />

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default NakshatraFinder;