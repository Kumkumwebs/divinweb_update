import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import { motion } from 'framer-motion';
import axios from 'axios';

const CancellationAndRefund = () => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                // Fetching from your admin API endpoint
                const res = await axios.get('https://admin.diviniq.in/links/cancleandrefund');
                // Binding the HTML content from response
                setContent(res.data.content || res.data.data || res.data);
            } catch (error) {
                console.error("Error fetching policy:", error);
                setContent("<p class='text-center'>Policy content is temporarily unavailable. Please contact support.</p>");
            } finally {
                setLoading(false);
            }
        };
        fetchPolicy();
    }, []);

    return (
        <div className="main-wrapper bg-light">
            <ScrollTop />
            <Header />

            {/* --- Premium Hero Section --- */}
            <section className="breadcumb-wrapper" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0b845c 100%)', padding: '80px 0' }}>
                <div className="container text-center">
                    <motion.span 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-theme fw-bold uppercase tracking-widest d-block mb-2"
                    >
                        // Customer Assurance
                    </motion.span>
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        className="text-white fw-bold mb-0"
                    >
                        Cancellation & <span className="text-theme">Refund</span>
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
                                        <p className="mt-3 text-muted">Loading Policy Details...</p>
                                    </div>
                                ) : (
                                    <div 
                                        className="policy-content-area"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                )}

                                {/* Refund Process Assistance Box */}
                                <div className="mt-5 p-4 rounded-20 bg-smoke d-flex flex-wrap align-items-center justify-content-between gap-4 border-start border-4 border-theme">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box bg-white shadow-sm rounded-circle p-3 me-3 text-theme">
                                            <i className="fas fa-hand-holding-usd fa-lg"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Need assistance with a refund?</h6>
                                            <p className="mb-0 small text-muted">Our support team typically responds within 24 hours.</p>
                                        </div>
                                    </div>
                                    <div className="text-md-end">
                                        <a href="mailto:support@diviniq.in" className="th-btn rounded-pill px-4">
                                            Contact Support
                                        </a>
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

export default CancellationAndRefund;