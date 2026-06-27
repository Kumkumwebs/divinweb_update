import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MobileMenu from "../components/layout/MobileMenu";
import PopupSearch from "../components/layout/PopupSearch";
import ScrollTop from "../components/common/ScrollTop";
import PujaService from "../services/pujaServices";
import "./PujaListing.css";

/* ── helpers ── */
const BADGE_MAP = [
  { label: "Most Popular", cls: "popular", icon: "fas fa-fire" },
  { label: "Bestseller", cls: "best", icon: "fas fa-star" },
  { label: "New", cls: "new", icon: "fas fa-bolt" },
  { label: "Trending", cls: "trending", icon: "fas fa-chart-line" },
];
const getBadge = (i) => BADGE_MAP[i % BADGE_MAP.length];

/* ── Custom Radio ── */
const RadioOpt = ({ label, count, checked, onChange }) => (
  <div className="pj-opt" onClick={onChange}>
    <span className={`pj-opt-circle${checked ? " on" : ""}`} />
    <span>{label}</span>
    {count !== undefined && (
      <span className="pj-opt-count">({count})</span>
    )}
  </div>
);

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div className="pj-card">
    <div className="pj-sk" style={{ height: 185, borderRadius: "16px 16px 0 0" }} />
    <div style={{ padding: "14px 16px" }}>
      <div className="pj-sk mb-2" style={{ height: 14, width: "80%" }} />
      <div className="pj-sk mb-2" style={{ height: 11, width: "45%" }} />
      <div className="pj-sk mb-1" style={{ height: 11, width: "90%" }} />
      <div className="pj-sk mb-3" style={{ height: 11, width: "65%" }} />
      <div className="pj-sk" style={{ height: 1, marginBottom: 10 }} />
      <div className="d-flex justify-content-between">
        <div className="pj-sk" style={{ height: 18, width: 70 }} />
        <div className="pj-sk" style={{ height: 18, width: 90 }} />
      </div>
    </div>
  </div>
);

/* ── Puja Card ── */
const PujaCard = ({ item, index, onView }) => {
  const [liked, setLiked] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const { label, cls, icon } = getBadge(index);

  const minPrice = item.packages?.length
    ? Math.min(...item.packages.map((p) => Number(p.packagePrice || 0)))
    : item.price || 0;

  return (
    <motion.div
      className="pj-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.32) }}
      onClick={() => onView(item)}
    >
      <div className="pj-badge-wrap">
        <span className={`pj-badge ${cls}`}>
          <i className={icon} />
          {label}
        </span>
      </div>

      <button
        className={`pj-heart${liked ? " on" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setLiked(!liked);
        }}
      >
        <i className={liked ? "fas fa-heart" : "far fa-heart"} />
      </button>

      <div className="pj-img-wrap">
        {!imgErr && (item.pujaImage || item.image) ? (
          <img
            src={item.pujaImage || item.image}
            alt={item.title}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="pj-img-placeholder">
            <i className="fas fa-fire-flame-curved" />
            <span>Sacred Puja</span>
          </div>
        )}
      </div>

      <div className="pj-card-body">
        <div className="pj-card-name">{item.title}</div>
        {item.purposeOfPooja && (
          <div className="pj-card-purpose">
            <i className="fas fa-map-marker-alt" />
            {item.purposeOfPooja}
          </div>
        )}
        {item.mandirName && (
          <div className="pj-card-loc">
            <i className="fas fa-gopuram" />
            {item.mandirName}
          </div>
        )}
        <div className="pj-card-desc">
          {item.description ||
            item.about ||
            "Experience divine blessings through this sacred puja ritual."}
        </div>
      </div>

      <div className="pj-card-footer">
        <div>
          <span className="pj-price-from">Starting from</span>
          <div className="pj-price">
            {minPrice > 0
              ? `₹${minPrice.toLocaleString("en-IN")}`
              : "Free"}
          </div>
        </div>
        <button
          className="pj-details-btn"
          onClick={(e) => {
            e.stopPropagation();
            onView(item);
          }}
        >
          Details View <i className="fas fa-arrow-right" />
        </button>
      </div>
    </motion.div>
  );
};

/* ── Recommend Card ── */
const RecommendCard = () => (
  <div className="pj-rec">
    <div className="pj-rec-ico">
      <i className="fas fa-fire-flame-curved" />
    </div>
    <div className="pj-rec-t">Can't find the right pooja?</div>
    <p className="pj-rec-s">
      Share your requirement and our team will help you find the best pooja for
      you.
    </p>
    <button className="pj-rec-btn">Get Personalized Recommendation</button>
    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>
      Trusted by 50K+ Devotees
    </div>
    <div>
      {["#c0392b", "#e67e22", "#27ae60", "#2980b9", "#8e44ad"].map((c, i) => (
        <span key={i} className="pj-rec-av" style={{ background: c }}>
          {["A", "M", "R", "S", "V"][i]}
        </span>
      ))}
    </div>
  </div>
);

/* ── Sidebar ── */
const SidebarContent = ({
  filters,
  setFilters,
  onApply,
  searchVal,
  setSearchVal,
}) => {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const reset = () => {
    setFilters({
      category: "all",
      priceBucket: "",
      duration: "all",
      sortBy: "popular",
      temple: "",
      search: "",
    });
    setSearchVal("");
  };
  const [rv, setRv] = useState(25000);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="pj-sb-title">Filters</span>
        <button className="pj-sb-reset" onClick={reset}>
          Reset All
        </button>
      </div>

      <div className="pj-sb-search">
        <input
          type="text"
          className="pj-sb-search-input"
          placeholder="Search poojas..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onApply()}
        />
        <button className="pj-sb-search-btn" onClick={onApply}>
          <i className="fas fa-search" />
        </button>
      </div>

      <div className="pj-div" />

      <div className="pj-fh">Category</div>
      {[
        { v: "all", l: "All Poojas", c: 58 },
        { v: "health", l: "Health & Healing", c: 12 },
        { v: "wealth", l: "Wealth & Prosperity", c: 15 },
        { v: "protection", l: "Protection & Relief", c: 11 },
        { v: "marriage", l: "Marriage & Love", c: 8 },
        { v: "pitru", l: "Pitru Dosha", c: 5 },
        { v: "other", l: "Other Poojas", c: 7 },
      ].map(({ v, l, c }) => (
        <RadioOpt
          key={v}
          label={l}
          count={c}
          checked={filters.category === v}
          onChange={() => set("category", v)}
        />
      ))}

      <div className="pj-div" />

      <div className="pj-fh">Price Range</div>
      <input
        type="range"
        className="pj-range-input"
        min={0}
        max={25000}
        step={100}
        value={rv}
        onChange={(e) => setRv(+e.target.value)}
        style={{
          background: `linear-gradient(to right,#c0392b ${rv / 250}%,#e5e7eb ${rv / 250}%)`,
        }}
      />
      <div className="pj-range-ends">
        <span>₹0</span>
        <span>₹25,000+</span>
      </div>
      <div className="pj-buckets">
        {[
          ["₹0-₹499", "0-499"],
          ["₹500-₹1499", "500-1499"],
          ["₹1500-₹4999", "1500-4999"],
          ["₹5000+", "5000+"],
        ].map(([l, v]) => (
          <button
            key={v}
            className={`pj-bucket${filters.priceBucket === v ? " on" : ""}`}
            onClick={() =>
              set("priceBucket", filters.priceBucket === v ? "" : v)
            }
          >
            {l}
          </button>
        ))}
      </div>

      <div className="pj-div" />

      <div className="pj-fh">Duration</div>
      {[
        ["all", "All Durations"],
        ["1-2", "1 - 2 Hours"],
        ["2-4", "2 - 4 Hours"],
        ["4-8", "4 - 8 Hours"],
        ["1d", "1+ Days"],
      ].map(([v, l]) => (
        <RadioOpt
          key={v}
          label={l}
          checked={filters.duration === v}
          onChange={() => set("duration", v)}
        />
      ))}

      <div className="pj-div" />

      <div className="pj-fh">Temple</div>
      <select
        className="pj-sel"
        value={filters.temple}
        onChange={(e) => set("temple", e.target.value)}
      >
        <option value="">All Temples</option>
        {[
          "Kashi Vishwanath",
          "Tirupati Balaji",
          "Mahalakshmi Temple",
          "Gaya Ji, Bihar",
          "Meenakshi Temple, Madurai",
        ].map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <div className="pj-div" />

      <div className="pj-fh">Sort By</div>
      {[
        ["popular", "Most Popular"],
        ["price_low", "Price: Low to High"],
        ["price_high", "Price: High to Low"],
        ["recent", "Recently Added"],
        ["az", "A - Z"],
      ].map(([v, l]) => (
        <RadioOpt
          key={v}
          label={l}
          checked={filters.sortBy === v}
          onChange={() => set("sortBy", v)}
        />
      ))}

      <button className="pj-apply" onClick={onApply}>
        <i className="fas fa-filter" /> Apply Filters
      </button>
    </>
  );
};

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
const PujaListing = () => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    priceBucket: "",
    duration: "all",
    sortBy: "popular",
    temple: "",
    search: "",
  });
  const ITEMS_PER_PAGE = 9;

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  /* ── Fetch ── */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await PujaService.getPujaList(null);
      if (res?.status && res?.data?.[0]?.result) {
        setAllItems(res.data[0].result);
      } else if (res?.results) {
        setAllItems(res.results);
      } else if (Array.isArray(res)) {
        setAllItems(res);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /* ── Filter + sort + paginate ── */
  useEffect(() => {
    if (!allItems.length) return;

    let list = [...allItems];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          (i.title || "").toLowerCase().includes(q) ||
          (i.mandirName || "").toLowerCase().includes(q) ||
          (i.purposeOfPooja || "").toLowerCase().includes(q)
      );
    }

    if (filters.temple) {
      list = list.filter((i) =>
        (i.mandirName || "").includes(filters.temple)
      );
    }

    if (filters.priceBucket) {
      const [min, max] = filters.priceBucket.split("-").map(Number);
      list = list.filter((i) => {
        const p = i.packages?.length
          ? Math.min(...i.packages.map((pkg) => Number(pkg.packagePrice || 0)))
          : Number(i.price || 0);
        if (filters.priceBucket === "5000+") return p >= 5000;
        return p >= min && p <= max;
      });
    }

    if (filters.sortBy === "price_low") {
      list.sort((a, b) => {
        const pa = a.packages?.length
          ? Math.min(...a.packages.map((p) => Number(p.packagePrice || 0)))
          : Number(a.price || 0);
        const pb = b.packages?.length
          ? Math.min(...b.packages.map((p) => Number(p.packagePrice || 0)))
          : Number(b.price || 0);
        return pa - pb;
      });
    } else if (filters.sortBy === "price_high") {
      list.sort((a, b) => {
        const pa = a.packages?.length
          ? Math.min(...a.packages.map((p) => Number(p.packagePrice || 0)))
          : Number(a.price || 0);
        const pb = b.packages?.length
          ? Math.min(...b.packages.map((p) => Number(p.packagePrice || 0)))
          : Number(b.price || 0);
        return pb - pa;
      });
    } else if (filters.sortBy === "az") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    const total = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
    setTotalPages(total);
    const start = (page - 1) * ITEMS_PER_PAGE;
    setItems(list.slice(start, start + ITEMS_PER_PAGE));
  }, [allItems, filters, page]);

  /* ─────────────────────────────────────────────────
     FIX: Navigate to PujaDetails with name slug + id
     Route must be: /puja/:name/:id
  ───────────────────────────────────────────────── */
  const handleView = (item) => {
    // Build a URL-safe slug from the puja title
    const slug = (item.title || "puja")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const id = item._id || item.instaId;
    navigate(`/puja/${slug}/${id}`);
  };

  const handleApply = () => {
    setPage(1);
    setDrawerOpen(false);
  };
  const goPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const pages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, i) => i + 1
  );

  return (
    <div className="main-wrapper" style={{ paddingTop: 0, marginTop: 0 }}>
      <ScrollTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
      />
      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      {/* ══ HERO ══ */}
      <div className="pj-hero-outer">
        <div className="container">
          <div className="pj-hero">
            <img
              src="/assets/img/bg/pooja.png"
              alt="Explore Sacred Poojas"
              className="pj-hero-img"
            />
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="pj-body">
        <div className="container">
          {/* Mobile top bar */}
          <div className="pj-mob-top">
            <button
              className="pj-filter-mob-btn"
              onClick={() => setDrawerOpen(true)}
            >
              <i className="fas fa-sliders-h" /> Filters
            </button>
            <select
              className="pj-sort-sel"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sortBy: e.target.value }))
              }
            >
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low–High</option>
              <option value="price_high">Price: High–Low</option>
              <option value="recent">Recently Added</option>
              <option value="az">A – Z</option>
            </select>
          </div>

          {/* Drawer */}
          <div className="pj-drawer-wrap">
            <div
              className={`pj-drawer-overlay${drawerOpen ? " show" : ""}`}
              onClick={() => setDrawerOpen(false)}
            />
            <div className={`pj-drawer${drawerOpen ? " open" : ""}`}>
              <SidebarContent
                filters={filters}
                setFilters={setFilters}
                onApply={handleApply}
                searchVal={searchVal}
                setSearchVal={setSearchVal}
              />
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-md-3 pj-sidebar-desktop">
              <div className="pj-sidebar-box">
                <SidebarContent
                  filters={filters}
                  setFilters={setFilters}
                  onApply={handleApply}
                  searchVal={searchVal}
                  setSearchVal={setSearchVal}
                />
              </div>
            </div>

            {/* Main */}
            <div className="col-md-9 col-12">
              <div className="pj-mhdr">
                <div className="pj-mhdr-left">
                  <h2>Sacred Poojas</h2>
                  <p>
                    Choose from our wide range of powerful Poojas for every
                    purpose and need.
                  </p>
                </div>
                <div className="pj-mhdr-right">
                  {!loading && (
                    <span className="pj-showing">
                      Showing{" "}
                      {items.length > 0
                        ? `${(page - 1) * 9 + 1}–${Math.min(
                            page * 9,
                            allItems.length
                          )}`
                        : "0"}{" "}
                      of {allItems.length} poojas
                    </span>
                  )}
                  <select
                    className="pj-sort-sel"
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, sortBy: e.target.value }))
                    }
                  >
                    <option value="popular">Top Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="recent">Recently Added</option>
                    <option value="az">A – Z</option>
                  </select>
                </div>
              </div>

              {error && !loading && (
                <div className="text-center py-5">
                  <i
                    className="fas fa-exclamation-circle fa-3x d-block mb-3"
                    style={{ color: "#d1d5db" }}
                  />
                  <p className="fw-bold text-dark mb-1">
                    Unable to load poojas
                  </p>
                  <p className="small text-muted mb-3">
                    Please check your connection and try again.
                  </p>
                  <button
                    className="pj-apply"
                    style={{
                      width: "auto",
                      display: "inline-flex",
                      padding: "10px 28px",
                      borderRadius: 9,
                    }}
                    onClick={fetchItems}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!error && (
                <div className="row g-3">
                  {loading
                    ? Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="col-6 col-md-4">
                          <SkeletonCard />
                        </div>
                      ))
                    : items.map((item, i) => (
                        <div key={item._id || i} className="col-6 col-md-4">
                          <PujaCard
                            item={item}
                            index={i}
                            onView={handleView}
                          />
                        </div>
                      ))}
                  {!loading && <div className="col-6 col-md-4"><RecommendCard /></div>}
                </div>
              )}

              {!loading && !error && items.length > 0 && (
                <div className="pj-pg">
                  <button
                    className="pj-pg-btn"
                    disabled={page === 1}
                    onClick={() => goPage(page - 1)}
                  >
                    <i className="fas fa-chevron-left" style={{ fontSize: 11 }} />
                  </button>
                  {pages.map((p) => (
                    <button
                      key={p}
                      className={`pj-pg-btn${page === p ? " cur" : ""}`}
                      onClick={() => goPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  {totalPages > 5 && (
                    <>
                      <span className="pj-pg-dots">…</span>
                      <button
                        className="pj-pg-btn"
                        onClick={() => goPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button
                    className="pj-pg-btn"
                    disabled={page === totalPages}
                    onClick={() => goPage(page + 1)}
                  >
                    <i
                      className="fas fa-chevron-right"
                      style={{ fontSize: 11 }}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PujaListing;