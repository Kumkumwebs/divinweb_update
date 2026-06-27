import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AppDownloadModal = ({ isOpen, onClose, bookingId }) => {
  if (!isOpen) return null;

  const handleDownload = (store) => {
    // Replace with your actual store links
    const links = {
      android: "https://play.google.com/store/apps/details?id=com.diviniq.app",
      ios: "https://play.google.com/store/apps/details?id=com.diviniq.app"
    };
    window.open(links[store], "_blank");
  };

  return (
    <AnimatePresence>
      <div className="diviniq-modal-overlay" onClick={onClose} style={{ zIndex: 12000 }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }}
          className="diviniq-modal-card p-0 overflow-hidden" 
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '450px' }}
        >
          {/* Top Visual Section */}
          <div className="modal-header-visual p-4 text-center text-white" style={{ background: 'linear-gradient(135deg, #0b845c 0%, #065f44 100%)' }}>
            <div className="mb-3">
               <i className="fas fa-video fa-3x mb-3 animate-pulse"></i>
               <h4 className="fw-bold mb-0">Experience the Divine Live</h4>
            </div>
            <p className="small opacity-75">Watch your personalized ritual in real-time or download the high-quality recording.</p>
          </div>

          <div className="p-4 text-center">
            <div className="bg-light p-3 rounded-20 mb-4 text-start">
              <div className="d-flex align-items-center mb-2">
                <i className="fas fa-play-circle text-theme me-2"></i>
                <span className="small fw-bold">Live Watching Available</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="fas fa-cloud-download-alt text-theme me-2"></i>
                <span className="small fw-bold">Download HD Puja Video After Completion</span>
              </div>
            </div>

            <h6 className="fw-bold mb-3 text-muted uppercase extra-small">Download DivinIQ App To Access</h6>
            
            <div className="d-flex flex-column gap-3">
              <button 
                className="btn btn-dark rounded-pill py-3 d-flex align-items-center justify-content-center"
                onClick={() => handleDownload('android')}
              >
                <i className="fab fa-google-play me-3 fa-lg"></i>
                <div className="text-start">
                  <small className="d-block extra-small opacity-75">GET IT ON</small>
                  <span className="fw-bold">Google Play Store</span>
                </div>
              </button>

              <button 
                className="btn btn-outline-dark rounded-pill py-3 d-flex align-items-center justify-content-center"
                onClick={() => handleDownload('ios')}
              >
                <i className="fab fa-apple me-3 fa-lg"></i>
                <div className="text-start">
                  <small className="d-block extra-small opacity-75">DOWNLOAD ON THE</small>
                  <span className="fw-bold">Apple App Store</span>
                </div>
              </button>
            </div>

            <button className="btn btn-link text-muted small mt-3 text-decoration-none" onClick={onClose}>
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default AppDownloadModal;