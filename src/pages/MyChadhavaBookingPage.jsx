import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { motion } from "framer-motion";
import AppDownloadModal from "../components/common/AppDownloadModal";

const ChadhavaBookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const navigate = useNavigate();

  // ----------------------------------------------------
  // FETCH CHADHAVA BOOKINGS
  // ----------------------------------------------------
  useEffect(() => {
    const fetchChadhava = async () => {
      try {
        const res = await apiService.postBearer('https://admin.diviniq.in/puja/mychdhavabookings', {});
        if (res && res.status) {
          setBookings(res.data);
        }
      } catch (error) {
        console.error("Chadhava Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChadhava();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return { color: '#0b845c', bg: '#e7f3ef' };
      case 'pending': return { color: '#f59e0b', bg: '#fff8eb' };
      case 'failed': return { color: '#ef4444', bg: '#fef2f2' };
      default: return { color: '#64748b', bg: '#f1f5f9' };
    }
  };

  return (
    <div className="main-wrapper bg-light">
      <ScrollToTop />
      <Header />

      {/* --- Breadcrumb --- */}
      <div className="breadcumb-wrapper" style={{ background: '#0f172a', padding: '50px 0' }}>
        <div className="container">
          <span className="text-theme fw-bold">// Sacred Contributions</span>
          <h2 className="text-white mb-0">Chadhava <span className="text-theme">History</span></h2>
        </div>
      </div>

      <div className="container py-60">
        {loading ? (
          <div className="text-center py-100">
            <div className="spinner-border text-theme" role="status"></div>
          </div>
        ) : bookings.length === 0 ? (
          /* --- EMPTY STATE --- */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-100 bg-white rounded-20 shadow-sm border"
          >
            <div className="mb-4" style={{ fontSize: '70px', color: '#cbd5e1' }}>
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <h4 className="fw-bold">No Chadhava Offerings Found</h4>
            <p className="text-muted mb-4">You haven't made any sacred offerings yet.</p>
            <button className="th-btn rounded-pill" onClick={() => navigate('/chadhava')}>
              Offer Chadhava Now
            </button>
          </motion.div>
        ) : (
          /* --- GRID VIEW --- */
          <div className="row g-4 py-30">
            {bookings.map((item) => {
              const status = getStatusStyle(item.payment_status);
              return (
                <div key={item._id} className="col-xl-4 col-md-6">
                  <div className="bg-white rounded-20 shadow-sm overflow-hidden border h-100 hover-shadow transition">
                    
                    {/* Chadhava Image Header */}
                    <div className="position-relative">
                      <img 
                        src={item.chadhava_id?.chadhavaImage} 
                        alt="Chadhava" 
                        className="w-100 object-fit-cover" 
                        style={{ height: '180px' }} 
                      />
                      <div 
                        className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill small fw-bold"
                        style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.color}30` }}
                      >
                        {item.payment_status}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-3">
                        <span className="extra-small text-theme fw-bold uppercase">{item.chadhava_booking_id}</span>
                        <h6 className="fw-bold mb-1 text-truncate-2 mt-1" style={{ minHeight: '44px' }}>
                          {item.chadhava_id?.title}
                        </h6>
                      </div>

                      <div className="bg-light p-3 rounded-15 mb-4">
                        <div className="d-flex justify-content-between mb-2 small">
                          <span className="text-muted">Offer Date:</span>
                          <span className="fw-bold">
                            {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 small">
                          <span className="text-muted">Devotee:</span>
                          <span className="fw-bold">{item.userDetails?.name}</span>
                        </div>
                        <div className="d-flex justify-content-between small">
                          <span className="text-muted">Payment:</span>
                          <span className="fw-bold">{item.payment_mode}</span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-muted extra-small d-block">Total Amount</span>
                          <h5 className="text-theme fw-bold mb-0">₹{item.chadhava_amount}</h5>
                        </div>
                        <button 
                          className="th-btn style3 py-2 px-3 rounded-pill btn-sm"
                          onClick={() => setIsAppModalOpen(true)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* App Redirect Modal */}
      <AppDownloadModal 
        isOpen={isAppModalOpen} 
        onClose={() => setIsAppModalOpen(false)} 
      />

      <Footer />
    </div>
  );
};

export default ChadhavaBookingListPage;