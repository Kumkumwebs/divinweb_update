import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../../context/StorageContext";
import "../sections/Userdetailsmodal.css";

const UserDetailsModal = ({
  isOpen,
  onClose,
  cart,
  page,
  puja,
  selectedPackage,
}) => {
  const navigate = useNavigate();
  const { devoteeDetails, setDevoteeDetails, setActiveCart } = useStorage();

  // Initialize state from context
  const [formData, setFormData] = useState({ name: "", whatsapp: "" });

  // This Effect runs whenever the modal opens to sync with saved data
  useEffect(() => {
    if (isOpen) {
      let name = "";
      let whatsapp = "";

      // Try to prefill from logged-in user in sessionStorage
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
          name = user.name || "";
          whatsapp = user.number || "";
        }
      } catch (e) {
        // ignore parse errors
        console.log("error while filling form", e);
      }

      // Override with devoteeDetails if available
      if (devoteeDetails?.name) name = devoteeDetails.name;
      if (devoteeDetails?.whatsapp) whatsapp = devoteeDetails.whatsapp;

      setFormData({ name, whatsapp });
    }
  }, [isOpen, devoteeDetails]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save updated details to context (which syncs to sessionStorage)
    setDevoteeDetails(formData);
    setActiveCart(cart);

    onClose();

    // If we are already on the checkout page, onClose() above already
    // triggers fetchCartFromServer() in the parent, so the devotee
    // details update without needing a disruptive full page reload.
    // Only navigate when we're NOT already on the relevant page.
    if (page == "chadhava") {
      if (!window.location.pathname.includes("chadhava_review_booking")) {
        navigate("/chadhava_review_booking");
      }
    } else {
      if (!window.location.pathname.includes("puja_review_booking")) {
        navigate("/puja_review_booking", {
          state: {
            pujaData: puja,
            selectedPackage: selectedPackage, // In Puja flow, 'cart' is usually the selected package object
          },
        });
      }
    }
  };

  return (
    <div className="udm-overlay" onClick={onClose}>
      <div className="udm-card" onClick={(e) => e.stopPropagation()}>
        {/* Header art strip */}
        <div className="udm-header">
          <img
            className="udm-header-img"
            src="/assets/img/chadawa_detail/kalashchadawa.png"
            alt=""
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="udm-header-pattern" />
          <div className="udm-handle" />
          <button className="udm-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Floating avatar straddling the header */}
        <div className="udm-avatar">
          <i className="fas fa-user"></i>
        </div>

        <div className="udm-body">
          <h3 className="udm-title">Update Details</h3>
          <div className="udm-subtitle-row">
            <span className="udm-line" />
            <i className="fas fa-spa"></i>
            <span className="udm-line" />
          </div>
          <p className="udm-subtitle">
            Ensure your details are correct for the Sankalp
          </p>

          <form onSubmit={handleSubmit} className="udm-form">
            <div className="udm-field">
              <label>
                <span className="udm-field-icon">
                  <i className="fas fa-user"></i>
                </span>
                Full Name
              </label>
              <input
                type="text"
                placeholder="eg. Rahul Sharma"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="udm-field">
              <label>
                <span className="udm-field-icon">
                  <i className="fab fa-whatsapp"></i>
                </span>
                WhatsApp Number
              </label>
              <div className="udm-phone-row">
                <span className="udm-country-code">
                  +91 <i className="fas fa-chevron-down"></i>
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  pattern="[0-9]{10}"
                  required
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="udm-secure-note">
              <span className="udm-secure-icon">
                <i className="fas fa-check"></i>
              </span>
              Your information is secure with us and will never be shared.
            </div>

            <button type="submit" className="udm-submit-btn">
              Save & Continue <i className="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;