import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { motion } from "framer-motion";
import AppDownloadModal from "../components/common/AppDownloadModal";

const PujaBookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  const handleViewDetails = (id) => {
    setSelectedBookingId(id);
    setIsAppModalOpen(true);
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.postBearer('https://admin.diviniq.in/puja/mypujabookings', {});
        if (res && res.status) {
          setBookings(res.bookPooja);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return '#0b845c';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="main-wrapper bg-light">
      <ScrollToTop />
      <Header />

      <div className="breadcumb-wrapper " style={{ background: '#0f172a', padding: '60px 0' }}>
        <div className="container">
          <span className="text-theme fw-bold">// My Devotion</span>
          <h2 className="text-white mb-0">Puja <span className="text-theme">History</span></h2>
        </div>
      </div>

      <div className="container py-60">
        {loading ? (
          <div className="text-center py-100">
            <div className="spinner-border text-theme" role="status"></div>
          </div>
        ) : bookings.length === 0 ? (
          /* --- NO BOOKING FOUND STATE --- */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-100 bg-white rounded-20 shadow-sm border border-dashed"
          >
            <div className="mb-4" style={{ fontSize: '80px', color: '#f1f5f9' }}>
              <i className="fas fa-om"></i>
            </div>
            <h3 className="fw-bold mb-2">No Bookings Found</h3>
            <p className="text-muted mb-4">You haven't initiated any sacred rituals yet.<br/>Explore our pujas to start your spiritual journey.</p>
            <button className="th-btn rounded-pill" onClick={() => navigate('/pujas')}>
              Browse All Pujas <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </motion.div>
        ) : (
          /* --- GRID VIEW --- */
          <div className="row g-4 py-40">
            {bookings.map((item) => (
              <div key={item._id} className="col-xl-4 col-md-6">
                <div className="bg-white rounded-20 shadow-sm overflow-hidden border h-100 position-relative hover-shadow">
                  {/* Status Indicator */}
                  <div 
                    className="position-absolute top-0 end-0 m-3 px-3 py-1 rounded-pill small fw-bold"
                    style={{ 
                      backgroundColor: `${getStatusColor(item.payment_status)}20`, 
                      color: getStatusColor(item.payment_status),
                      border: `1px solid ${getStatusColor(item.payment_status)}40`
                    }}
                  >
                    {item.payment_status}
                  </div>

                  <div className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-theme-subtle p-3 rounded-15 me-3 text-theme">
                        <i className="fas fa-calendar-check fa-lg"></i>
                      </div>
                      <div>
                        <span className="extra-small text-muted d-block uppercase fw-bold">ID: {item.puja_booking_id}</span>
                        <h6 className="fw-bold mb-0">{item.puja_type} Puja Offering</h6>
                      </div>
                    </div>

                    <div className="booking-details-list bg-light p-3 rounded-15 mb-4">
                      <div className="d-flex justify-content-between mb-2 small">
                        <span className="text-muted">Ritual Date:</span>
                        <span className="fw-bold text-dark">
                          {new Date(item.puja_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 small">
                        <span className="text-muted">Payment:</span>
                        <span className="fw-bold text-dark uppercase">{item.payment_mode}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">Addons:</span>
                        <span className="fw-bold text-dark">{item.addons_selected.length + item.home_addons_selected.length} Selected</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-muted extra-small d-block">Total Amount</span>
                        <h5 className="text-theme fw-bold mb-0">₹{item.puja_amount}</h5>
                      </div>
                      <button 
                        className="th-btn style3 py-2 px-4 rounded-pill btn-sm"
                       onClick={() => handleViewDetails(item._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AppDownloadModal
        isOpen={isAppModalOpen} 
        onClose={() => setIsAppModalOpen(false)} 
        bookingId={selectedBookingId}
      />
      <Footer />
    </div>
  );
};

export default PujaBookingListPage;