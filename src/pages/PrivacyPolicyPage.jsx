import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import { motion } from 'framer-motion';
import axios from 'axios';

const PrivacyPolicy = () => {
    const [policyContent, setPolicyContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                // Fetching from your provided API
                const res = await axios.get('https://admin.diviniq.in/links/privacypolicy');
                // Adjusting based on standard API response structures
                // If it's a direct string or inside a data object
                setPolicyContent(res.data.content || res.data.data || res.data);
            } catch (error) {
                console.error("Error fetching privacy policy:", error);
                setPolicyContent("<p className='text-center'>Unable to load Privacy Policy. Please try again later.</p>");
            } finally {
                setLoading(false);
            }
        };
        fetchPolicy();
    }, []);

    return (
        <div className="main-wrapper bg-light">
            <Header />

            {/* --- Hero Section --- */}
            <section className="breadcumb-wrapper" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0b845c 100%)', padding: '80px 0' }}>
                <div className="container text-center">
                    <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-theme fw-bold uppercase tracking-widest d-block mb-2"
                    >
                        // Legal & Safety
                    </motion.span>
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        className="text-white fw-bold mb-0"
                    >
                        Privacy <span className="text-theme">Policy</span>
                    </motion.h1>
                </div>
            </section>

            {/* --- Policy Content Container --- */}
            <section className="py-60">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-10">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-4 p-md-5 rounded-40 shadow-sm border border-light"
                            >
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-theme" role="status"></div>
                                        <p className="mt-3 text-muted">Fetching Policy...</p>
                                    </div>
                                ) : (
                                    <div 
                                        className="policy-content-area"
                                        dangerouslySetInnerHTML={{ __html: policyContent }}
                                    />
                                )}

                                {/* Bottom Support Badge */}
                                <div className="mt-5 pt-4 border-top d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-theme-subtle p-3 rounded-circle text-theme me-3">
                                            <i className="fas fa-envelope-open-text"></i>
                                        </div>
                                        <div>
                                            <p className="mb-0 small text-muted">Questions? Email us</p>
                                            <h6 className="mb-0 fw-bold">support@diviniq.in</h6>
                                        </div>
                                    </div>
                                    <button className="th-btn style3 py-2 px-4 rounded-pill btn-sm" onClick={() => window.print()}>
                                        <i className="fas fa-print me-2"></i> Print Policy
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default PrivacyPolicy;