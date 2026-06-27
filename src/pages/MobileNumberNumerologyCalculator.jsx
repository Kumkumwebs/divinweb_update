import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import FaqSection from '../components/sections/FAQSection';

const MobileNumerologyCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Status" for Delhi (Fixed to your original structure)
    const [todayData] = useState({
        location: "Delhi, India",
        number: "9",
        energy: "Wisdom",
        time: "02:42:49 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        const mobile = e.target.mobile.value.replace(/\D/g, '');
        const dob = e.target.dob.value;

        // --- BACKEND LOGIC ---
        // 1. Calculate Mobile Total
        const mobileSum = mobile.split('').map(Number).reduce((a, b) => a + b, 0);
        const reduceNum = (n) => {
            if ([11, 22, 33].includes(n)) return n;
            while (n > 9) n = n.toString().split('').map(Number).reduce((a, b) => a + b, 0);
            return n;
        };
        const mobileFinal = reduceNum(mobileSum);

        // 2. Calculate Driver Number (Birth Day)
        const birthDay = parseInt(dob.split('-')[2]);
        const driverNumber = reduceNum(birthDay);

        const meanings = {
            1: "Leader’s Energy: Leadership, independence, and fresh starts. Great for starting new business.",
            2: "Teamwork & Feelings: Building partnerships and understanding emotions. Perfect for counselors.",
            3: "Creativity & Joy: Happiness, fun, and communication. Suits artists and social speakers.",
            4: "Hard Work & Discipline: Stable, serious, and practical. Grounded energy for builders.",
            5: "Change & Adventure: Freedom, travel, and trying new things. Best for sales/tourism.",
            6: "Family & Care: Love, care, and responsibility. Brings comfort and strong family vibes.",
            7: "Spiritual Thinking: Wisdom, deep thinking, and spirituality. Best for researchers.",
            8: "Power & Success: Business wealth and leadership. Ambitious professionals benefit here.",
            9: "Kindness & Completion: Giving, helping others, and finishing what you start.",
            11: "Master Number: High spiritual energy and divine calling.",
            22: "Master Number: Practical visionary power.",
            33: "Master Number: Compassion and transformation."
        };

        setTimeout(() => {
            setResult({
                name: e.target.name.value,
                mobileNumber: mobileFinal,
                driverNumber: driverNumber,
                meaning: meanings[mobileFinal],
                alignment: (mobileFinal === driverNumber) ? "Highly Aligned" : "Neutral Sync",
                originalSum: mobileSum
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
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                padding: '100px 0'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-white">
                            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="sub-title style1 text-theme">Digital Vibration</motion.span>
                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="breadcumb-title text-white mb-3">Mobile Numerology</motion.h1>
                            <p className="opacity-75 mb-0">Discover the hidden energy in your phone number and its alignment with your birth date.</p>
                        </div>

                        {/* TODAY'S STATUS WIDGET - RESTORED TO ORIGINAL LAYOUT */}
                        <div className="col-lg-5 mt-4 mt-lg-0">
                            <motion.div whileHover={{ scale: 1.02 }} className="celestial-card p-4 rounded-20 text-white animate-float">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-white mb-0 small uppercase tracking-wider">Today in {todayData.location}</h5>
                                    <span className="badge bg-theme text-dark">Live</span>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <p className="small opacity-50 mb-1">Universal Day</p>
                                        <h3 className="text-theme mb-0">{todayData.number}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-4">
                                        <p className="small opacity-50 mb-1">Core Energy</p>
                                        <h4 className="text-white mb-0 h5">{todayData.energy}</h4>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-top border-white-10 d-flex justify-content-between small opacity-75">
                                    <span>Saturday, 20 Dec 2025</span>
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
                                <h3 className="h4 mb-30">Analyze Your Number</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Full Name</label>
                                        <input name="name" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Your Name" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Mobile Number</label>
                                        <input name="mobile" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="9876543210" required maxLength="10" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Date of Birth</label>
                                        <input name="dob" type="date" className="form-control input-modern py-3 rounded-inner" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="small fw-bold mb-2">Email Address</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="email@diviniq.com" required />
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner border-0 shadow-lg">
                                        {loading ? "Analyzing Sync..." : "Check Energetic Alignment"}
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
                                            <p>Your alignment results will <br/> appear here after analysis.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30 text-center">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Alignment Analysis</span>
                                            <h2 className="text-white display-5 mb-1 mt-2">Number {result.mobileNumber}</h2>
                                            <div className="badge bg-white-10 text-theme px-3 py-2 rounded-pill border border-white-10">{result.alignment}</div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-6">
                                                <div className="glass-stat p-3 rounded-inner text-center">
                                                    <p className="small text-white-50 mb-1">Driver No. (DOB)</p>
                                                    <p className="text-white fw-bold mb-0">Number {result.driverNumber}</p>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="glass-stat p-3 rounded-inner text-center">
                                                    <p className="small text-white-50 mb-1">Digital Total</p>
                                                    <p className="text-white fw-bold mb-0">{result.originalSum}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 bg-white-10 p-3 rounded-inner border border-white-10">
                                            <p className="small text-theme fw-bold mb-1">Energy Reading:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.meaning}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <span className="text-white-50 small">Generated for {result.name}</span>
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small shadow-none">Expert Advice</button>
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
                        <h2 className="info-title">The Energy of <span className="text-gradient">Every Number</span></h2>
                    </div>
                    
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <div className="bento-card">
                                <div className="icon-circle shadow-sm">
                                    <img src="assets/img/icon/about_1_1.svg" width="30" alt="" />
                                </div>
                                <h3 className="h4 fw-bold">What is Mobile Numerology?</h3>
                                <p className="text-muted leading-relaxed">
                                    Your phone number is a digital gateway. By adding all digits, we reduce it to a core single-digit frequency. This result can then be compared with your **Driver Number** (Birth Date) to determine if your digital energy supports or clashes with your personal path.
                                </p>
                                <div className="mt-4">
                                    <span className="feature-pill">Digital Alignment</span>
                                    <span className="feature-pill">Driver Number Sync</span>
                                    <span className="feature-pill">Lo Shu Grid</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="bento-card bg-title text-white">
                                <h3 className="h5 text-white fw-bold mb-4">Number Meanings</h3>
                                <ul className="list-unstyled space-y-2 small opacity-75">
                                    <li>• <b>1:</b> Leader’s Energy</li>
                                    <li>• <b>2:</b> Teamwork & Feelings</li>
                                    <li>• <b>3:</b> Creativity & Joy</li>
                                    <li>• <b>4:</b> Hard Work & Discipline</li>
                                    <li>• <b>5:</b> Change & Adventure</li>
                                    <li>• <b>🌟 Master:</b> 11, 22, 33</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FaqSection faq={[
                {
                    question: "How is the mobile number total calculated?",
                    answer: "We add every single digit of your 10-digit number. For example, 9876543210 becomes 45, which reduces to 4+5 = 9."
                },
                {
                    question: "Does the position of digits matter?",
                    answer: "Yes, repeating patterns like 777 or 999 increase the power of that specific energy, which can be beneficial or challenging depending on your chart."
                },
                {
                    question: "Can I use this tool to pick a new number?",
                    answer: "Absolutely. Finding a number that aligns with your Driver Number (Birth Date) ensures better energetic harmony in your business and personal communications."
                }
            ]} />

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default MobileNumerologyCalculator;