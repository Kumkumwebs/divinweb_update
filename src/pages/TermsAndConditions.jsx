import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import { motion } from 'framer-motion';
import axios from 'axios';

const TermsAndConditions = () => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                // Fetching from your admin API endpoint
                const res = await axios.get('https://admin.diviniq.in/links/termandcondition');
                // Binding the HTML content from response
                setContent(res.data.content || res.data.data || res.data);
            } catch (error) {
                console.error("Error fetching terms:", error);
                setContent("<p class='text-center text-muted'>Terms and Conditions are currently being updated. Please check back shortly.</p>");
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
    }, []);

    return (
        <div className="main-wrapper bg-light">
            <ScrollTop />
            <Header />

            {/* --- Premium Hero Section --- */}
            <section className="breadcumb-wrapper" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0b845c 100%)', padding: '80px 0' }}>
                <div className="container text-center">
                    <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-theme fw-bold uppercase tracking-widest d-block mb-2"
                    >
                        // Usage Agreement
                    </motion.span>
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        className="text-white fw-bold mb-0"
                    >
                        Terms & <span className="text-theme">Conditions</span>
                    </motion.h1>
                </div>
            </section>

            {/* --- Content Area --- */}
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
                                        <p className="mt-3 text-muted">Loading Agreement Details...</p>
                                    </div>
                                ) : (
                                    <div 
                                        className="policy-content-area"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                )}

                                {/* Legal Disclaimer Footer Box */}
                                <div className="mt-5 p-4 rounded-20 bg-smoke d-flex align-items-center border-start border-4 border-theme">
                                    <div className="icon-box bg-white shadow-sm rounded-circle p-3 me-4 text-theme">
                                        <i className="fas fa-gavel fa-lg"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Agreement of Service</h6>
                                        <p className="mb-0 small text-muted">
                                            By using DivinIQ, you agree to follow our guidelines and respect the sacred nature of the services offered.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsAndConditions;