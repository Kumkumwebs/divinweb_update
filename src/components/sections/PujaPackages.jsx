import React, { useEffect, useState } from "react";
import UserDetailsModal from "../common/ChadhavaUserDetailsModel";

const PACKAGE_TYPE_IMAGES = {
  individual: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
  partner: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
  family: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
  joint: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
};

const PujaPackages = ({ puja }) => {
  if (!puja) return null;
 const [isModalOpen, setIsModalOpen] = useState(false);
  // auto-select recommended / popular package
  const recommendedPkg =
    puja.packages.find(p => p.isPopular) || puja.packages[0];

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (recommendedPkg) {
      setSelected(recommendedPkg);
    }
  }, [recommendedPkg]);
const handleSelectPackage = (pkg) => {
  setSelected(pkg); // Save the whole object: { packageName, packagePrice, ... }
  setIsModalOpen(true);    // Open the devotee details modal
};
  return (
    <div className="container">
      <div className="puja-package-wrapper">
        <h2 className="puja-package-title">Choose Your Puja Package</h2>

        <div className="puja-package-grid">
          {puja.packages.map(pkg => {
            const typeKey = pkg.packageType?.toLowerCase() || "individual";

            return (
              <div
                key={pkg._id}
                className={`puja-package-card ${
                  selected === pkg._id ? "active" : ""
                }`}
              >
                {/* ⭐ MOST POPULAR */}
                {pkg.isPopular && (
                  <span className="popular-badge">⭐ Most Popular</span>
                )}

                {/* 🖼️ PACKAGE TYPE IMAGE */}
                <div className="puja-type-image">
                  <img
                    src={PACKAGE_TYPE_IMAGES[typeKey]}
                    alt={pkg.packageType}
                  />
                </div>

                {/* HEADER */}
                <div className="puja-card-header">
                  <h3>{pkg.packageName}</h3>
                  <span className="puja-people">{pkg.packageType}</span>
                </div>

                {/* PRICE */}
                <div className="puja-price">₹{pkg.packagePrice}</div>

                {/* FEATURES */}
                <ul className="puja-features">
                  {pkg.packageDescription.map((item, i) => (
                    <li key={i}>✔ {item}</li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className="puja-select-btn"
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {selected === pkg._id ? "Selected" : "Select Package"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <UserDetailsModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        cart={{}} 
        page={"puja"}
        puja={puja}
        selectedPackage={selected}
      />
    </div>
  );
};

export default PujaPackages;
