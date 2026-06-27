import React, { useState, useEffect } from "react";
import { useStorage } from "../context/StorageContext"; // one level up only
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   FIX SUMMARY:
   • Reads existing user from sessionStorage on open
   • Sets devoteeDetails in StorageContext so pages 4+5 can read it
   • Navigates to /puja_review_booking with { pujaData, selectedPackage }
     in location.state — exactly what PujaReviewBookingPage expects
   • "Edit" inline pattern kept intact
───────────────────────────────────────────── */

const PujaUserDetailsModal = ({
  isOpen,
  onClose,
  cart,          // selectedPackage object  (used as cart reference)
  page,          // "puja" | "chadhava"
  puja,          // pujaData object
  selectedPackage,
}) => {
  const navigate = useNavigate();
  const { setDevoteeDetails, setActiveCart } = useStorage();

  const [formData, setFormData] = useState({ name: "", whatsapp: "" });
  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState({ name: "", whatsapp: "" });

  /* ─────────────────────────────────────────────
     Pre-fill from sessionStorage on every open
  ───────────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;

    let name = "";
    let whatsapp = "";

    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "null");
      if (user) {
        name = user.name || "";
        whatsapp = user.number || user.whatsapp || "";
      }
    } catch (e) {
      console.warn("Error reading user from sessionStorage", e);
    }

    setFormData({ name, whatsapp });
    setEditingField(null);
  }, [isOpen]);

  const handleEditClick = (field) => {
    setTempData({ ...formData });
    setEditingField(field);
  };

  const handleSaveField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: tempData[field] }));
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempData({ ...formData });
  };

  /* ─────────────────────────────────────────────
     FIX: On submit
       1. Save devoteeDetails to StorageContext
          (pages 4 & 5 read from here)
       2. Save activeCart so PujaFillForm can use it
       3. Close modal
       4. Navigate to the correct review page
          passing pujaData + selectedPackage in state
  ───────────────────────────────────────────── */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Persist to context (shared across pages 4 & 5)
    setDevoteeDetails({
      name: formData.name,
      whatsapp: formData.whatsapp,
      sankalp: "",
    });

    // Also persist to sessionStorage so data survives soft refreshes
    try {
      const existing = JSON.parse(sessionStorage.getItem("user") || "{}");
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...existing, name: formData.name, number: formData.whatsapp })
      );
    } catch (_) {}

    setActiveCart(cart);
    onClose();

    if (page === "chadhava") {
      if (window.location.pathname.includes("chadhava_review_booking")) {
        window.location.reload();
      } else {
        navigate("/chadhava_review_booking");
      }
    } else {
      // ── puja flow ──
      if (window.location.pathname.includes("puja_review_booking")) {
        window.location.reload();
      } else {
        navigate("/puja_review_booking", {
          state: {
            pujaData: puja,            // full puja object
            selectedPackage: selectedPackage, // { _id, packageName, packagePrice }
          },
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          maxWidth: "560px",
          width: "100%",
          boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent line */}
        <div
          style={{
            height: 4,
            background: "linear-gradient(to right, #7c3aed, #4f46e5)",
            borderRadius: "24px 24px 0 0",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            cursor: "pointer",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
          }}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ padding: "32px", textAlign: "center" }}>
          {/* Icon */}
          <div
            style={{
              width: 80,
              height: 80,
              background: "#ede9fe",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              margin: "0 auto 20px",
            }}
          >
            👤
          </div>

          <h3 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
            Update Details
          </h3>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>
            Ensure your details are correct for the Sankalp
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
            {/* Full Name */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#111827",
                  marginBottom: 10,
                }}
              >
                Full Name
              </label>

              {editingField !== "name" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f9fafb",
                    borderRadius: 10,
                    padding: "14px 16px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <span style={{ color: "#1f2937" }}>
                    {formData.name || "Enter your name"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEditClick("name")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#7c3aed",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    ✎ Edit
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="eg. Rahul Sharma"
                    required
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #7c3aed",
                      borderRadius: 10,
                      fontSize: 15,
                      outline: "none",
                      boxSizing: "border-box",
                      marginBottom: 10,
                    }}
                    value={tempData.name}
                    onChange={(e) =>
                      setTempData((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => handleSaveField("name")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#7c3aed",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#fff",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#111827",
                  marginBottom: 10,
                }}
              >
                Phone Number (WhatsApp)
              </label>

              {editingField !== "whatsapp" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f9fafb",
                    borderRadius: 10,
                    padding: "14px 16px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        padding: "6px 10px",
                        background: "#fff",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        color: "#7c3aed",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      📱 +91
                    </span>
                    <span style={{ color: "#1f2937" }}>
                      {formData.whatsapp || "Enter your number"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEditClick("whatsapp")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#7c3aed",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✎ Edit
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span
                      style={{
                        padding: "12px 14px",
                        background: "#fff",
                        border: "1px solid #d1d5db",
                        borderRadius: 10,
                        color: "#7c3aed",
                        fontWeight: 600,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
                      📱 +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      pattern="[0-9]{10}"
                      required
                      autoFocus
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        border: "2px solid #7c3aed",
                        borderRadius: 10,
                        fontSize: 15,
                        outline: "none",
                      }}
                      value={tempData.whatsapp}
                      onChange={(e) =>
                        setTempData((p) => ({ ...p, whatsapp: e.target.value }))
                      }
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => handleSaveField("whatsapp")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#7c3aed",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      style={{
                        flex: 1,
                        padding: "10px",
                        background: "#fff",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Info banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#f5f3ff",
                borderRadius: 10,
                padding: "14px 16px",
                border: "1px solid #ddd6fe",
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 22 }}>🔒</span>
              <p style={{ margin: 0, color: "#374151", fontSize: 13 }}>
                We will use this number to contact you on WhatsApp
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(to right, #7c3aed, #6d28d9)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 17,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: 0.3,
              }}
            >
              Save & Continue →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PujaUserDetailsModal;