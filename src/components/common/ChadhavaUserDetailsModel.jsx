import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../../context/StorageContext";

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
      debugger;

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

    // If we are already on the checkout page, we just need to refresh the data
    // If not, we navigate to it.
    if (page == "chadhava") {
      if (window.location.pathname.includes("chadhava_review_booking")) {
        window.location.reload(); // Quickest way to refresh the parent view
      } else {
        navigate("/chadhava_review_booking");
      }
    } else {
      if (window.location.pathname.includes("puja_review_booking")) {
        window.location.reload(); // Quickest way to refresh the parent view
      } else {
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
    <div className="diviniq-modal-overlay" onClick={onClose}>
      <div className="diviniq-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-accent-line"></div>

        <button className="modal-close-icon" onClick={onClose}>
          &times;
        </button>

        <div className="modal-body-content text-center">
          <div className="diviniq-icon-circle">👤</div>
          <h3 className="modal-title">Update Details</h3>
          <p className="modal-subtitle">
            Ensure your details are correct for the Sankalp
          </p>

          <form
            onSubmit={handleSubmit}
            className="diviniq-form-container text-start"
          >
            <div className="input-wrapper-field">
              <label className="fw-bold mb-1 d-block">Full Name</label>
              <input
                type="text"
                placeholder="eg. Rahul Sharma"
                required
                className="form-control py-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="input-wrapper-field mt-3">
              <label className="fw-bold mb-1 d-block">WhatsApp Number</label>
              <div className="phone-input-row d-flex gap-2">
                <span className="country-code-tag p-2 bg-light border rounded">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  pattern="[0-9]{10}"
                  required
                  className="form-control py-2"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                />
              </div>
            </div>

            <button type="submit" className="diviniq-submit-btn mt-4 w-100">
              Save & Continue <span className="ms-2">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
