import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideMenu from '../components/layout/SideMenu';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import ScrollTop from '../components/common/ScrollTop';
import apiService from '../services/apiServices';
import NewAppDownloadModal from '../components/common/NewAppDownloadModel';
import './AstrologerList.css';

/* helpers */
const COLORS = ['#7c3aed','#059669','#dc2626','#d97706','#2563eb','#db2777'];
const initials = (n='') => n.trim().split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
const avColor  = (n='') => COLORS[(n.charCodeAt(0)||0) % COLORS.length];

/* Custom Radio */
const RadioOpt = ({ label, checked, onChange }) => (
  <div className="al-opt" onClick={onChange}>
    <span className={`al-opt-circle${checked?' on':''}`} />
    <span>{label}</span>
  </div>
);

/* Custom Checkbox */
const CheckOpt = ({ label, checked, onChange }) => (
  <div className="al-opt" onClick={onChange}>
    <span className={`al-chk-box${checked?' on':''}`} />
    <span>{label}</span>
  </div>
);

/* Skeleton Card */
const SkeletonCard = () => (
  <div className="al-card">
    <div style={{display:'flex',justifyContent:'center',marginTop:22,marginBottom:10}}>
      <div className="al-sk rounded-circle" style={{width:82,height:82}} />
    </div>
    <div className="al-sk mx-auto mb-2" style={{height:13,width:'58%'}} />
    <div className="al-sk mx-auto mb-3" style={{height:11,width:'38%'}} />
    <div className="d-flex justify-content-center gap-1 mb-3">
      {[46,42,46].map((w,i)=><div key={i} className="al-sk" style={{height:20,width:w,borderRadius:20}} />)}
    </div>
    <div className="al-sk mb-3" style={{height:1}} />
    <div className="d-flex justify-content-between mb-3 px-1">
      <div className="al-sk" style={{height:18,width:58}} />
      <div className="al-sk" style={{height:16,width:52}} />
    </div>
    <div className="al-sk" style={{height:36,borderRadius:9}} />
  </div>
);

/* Astrologer Card */
const AstrologerCard = ({ astro, onChat }) => {
  const [liked,  setLiked]  = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const cats   = astro.category?.slice(0,3).map(c=>c.name) || ['Vedic'];
  const online = astro.is_online == 1;
  const busy   = astro.is_busy   == 1;
  const dotCls = online ? 'dn' : busy ? 'db' : 'do';

  return (
    <motion.div className="al-card"
      initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.28}}
      style={{cursor:'pointer'}}
      onClick={()=>onChat(astro, 'view')}>
      <span className="al-exp">{astro.experience||'5'}+ Yrs Exp</span>
      <button className={`al-heart${liked?' on':''}`} onClick={(e)=>{e.stopPropagation();setLiked(!liked)}}>
        <i className={liked?'fas fa-heart':'far fa-heart'} />
      </button>

      <div className="al-av-wrap">
        <div className="al-av-clip">
          {astro.profile_img && !imgErr
            ? <img src={astro.profile_img} alt={astro.name} onError={()=>setImgErr(true)} />
            : <div className="al-av-init" style={{background:`linear-gradient(135deg,${avColor(astro.name)},${avColor(astro.name)}bb)`}}>
                {initials(astro.name)}
              </div>
          }
        </div>
        <span className={`al-dot ${dotCls}`} />
      </div>

      <div className="al-cname">{astro.name}</div>
      <div className="al-crole">Vedic Astrologer</div>
      <div className="al-tags">
        {cats.map((c,i)=><span key={i} className="al-tag">{c}</span>)}
      </div>
      <div className="al-stats">
        <div className="al-rat">
          <i className="fas fa-star" />
          <span>{parseFloat(astro.avg_rate||4.8).toFixed(1)}</span>
          <span className="al-rev">({astro.total_review||80})</span>
        </div>
        <div className="al-price">₹{astro.per_min_chat||'5'}/min</div>
      </div>
      <div className="al-actions">
        <button className="al-chat" onClick={()=>onChat(astro, 'chat')}>Chat Now</button>
        <button className="al-call" onClick={()=>onChat(astro, 'call')} title="Call">
          <i className="fas fa-phone" />
        </button>
      </div>
    </motion.div>
  );
};

/* Recommend Card */
const RecommendCard = ({ onChat }) => (
  <div className="al-rec">
    <div className="al-rec-ico"><i className="fas fa-magic" /></div>
    <div className="al-rec-t">Can't find the right match?</div>
    <p className="al-rec-s">Let us help you connect with the best-suited astrologer</p>
    <button className="al-rec-btn" onClick={()=>onChat(null)}>Get Free Recommendation</button>
    <div style={{fontSize:11,color:'#9ca3af',marginBottom:8}}>Trusted by 50K+ users</div>
    <div>
      {['#7c3aed','#059669','#dc2626','#d97706','#2563eb'].map((c,i)=>(
        <span key={i} className="al-rec-av" style={{background:c}}>{['A','M','R','S','V'][i]}</span>
      ))}
    </div>
  </div>
);

/* Sidebar Content */
const SidebarContent = ({ filters, setFilters, onApply }) => {
  const set    = (k,v) => setFilters(f=>({...f,[k]:v}));
  const toggle = (s)   => setFilters(f=>({...f, specs: f.specs.includes(s)?f.specs.filter(x=>x!==s):[...f.specs,s]}));
  const reset  = ()    => setFilters({experience:'all',payBucket:'',sortBy:'relevant',specs:[],language:''});
  const [rv, setRv]    = useState(50);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="al-sb-title">Filters</span>
        <button className="al-sb-reset" onClick={reset}>Reset</button>
      </div>

      <div className="al-fh">Experience</div>
      {[['all','All Experience'],['0-2','0 – 2 Years'],['3-5','3 – 5 Years'],['5-10','5 – 10 Years'],['10+','10+ Years']].map(([v,l])=>(
        <RadioOpt key={v} label={l} checked={filters.experience===v} onChange={()=>set('experience',v)} />
      ))}

      <div className="al-div" />

      <div className="al-fh">Payment Range</div>
      <input type="range" className="al-range-input" min={0} max={50} value={rv}
        onChange={e=>setRv(+e.target.value)}
        style={{background:`linear-gradient(to right,#7c3aed ${rv*2}%,#e5e7eb ${rv*2}%)`}}
      />
      <div className="al-range-ends"><span>₹0</span><span>₹50/min+</span></div>
      <div className="al-buckets">
        {[['₹0-₹10','0-10'],['₹10-₹20','10-20'],['₹20+','20+']].map(([l,v])=>(
          <button key={v} className={`al-bucket${filters.payBucket===v?' on':''}`}
            onClick={()=>set('payBucket',filters.payBucket===v?'':v)}>{l}</button>
        ))}
      </div>

      <div className="al-div" />

      <div className="al-fh">Sort By</div>
      {[['relevant','Most Relevant'],['exp_high','Experience: High to Low'],['exp_low','Experience: Low to High'],
        ['price_low','Payment: Low to High'],['price_high','Payment: High to Low'],['highest_rated','Highest Rated']
      ].map(([v,l])=>(
        <RadioOpt key={v} label={l} checked={filters.sortBy===v} onChange={()=>set('sortBy',v)} />
      ))}

      <div className="al-div" />

      <div className="al-fh">Specialization</div>
      {['Career','Marriage','Health','Finance','Kids','Business'].map(s=>(
        <CheckOpt key={s} label={s} checked={filters.specs.includes(s)} onChange={()=>toggle(s)} />
      ))}

      <div className="al-div" />

      <div className="al-fh">Language</div>
      <select className="al-lang" value={filters.language} onChange={e=>set('language',e.target.value)}>
        <option value="">Select Language</option>
        {['Hindi','English','Tamil','Telugu','Bengali','Marathi'].map(l=><option key={l}>{l}</option>)}
      </select>

      <button className="al-apply" onClick={onApply}>
        <i className="fas fa-filter" /> Apply Filters
      </button>
    </>
  );
};

/* ═══════════════════════════ MAIN PAGE ═══════════════════════════ */
const AstrologerList = () => {
  const navigate = useNavigate();
  const [astrologers,   setAstrologers]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(false);
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(5);
  const [filters, setFilters] = useState({experience:'all',payBucket:'',sortBy:'relevant',specs:[],language:''});
  // Nav menus
  const [showSideMenu,   setShowSideMenu]   = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch,     setShowSearch]     = useState(false);

  const fetchAstrologers = useCallback(async (p=1) => {
    setLoading(true); setError(false);
    try {
      const res = await apiService.postBearer('https://admin.diviniq.in/user_api/astrologer_list',{
        search:'',page:String(p),is_chat:'on',followAstro:'',
        is_voice_call:'on',is_video_call:'on',cat_id:filters.specs.join(','),
        language_id:'',gender:'',sort_val:filters.sortBy,is_question:'',
        skill_id:'',country:'',report_id:'',expert_astro:''
      });
      if (res?.results){ setAstrologers(res.results); if(res.total_pages) setTotalPages(Number(res.total_pages)); }
      else setError(true);
    } catch { setError(true); }
    finally   { setLoading(false); }
  },[filters.specs,filters.sortBy]);

  useEffect(()=>{ fetchAstrologers(page); },[fetchAstrologers,page]);

  const goPage     = p => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}); };
  const handleApply = () => { setPage(1); fetchAstrologers(1); setDrawerOpen(false); };
  const pages = Array.from({length:Math.min(totalPages,5)},(_,i)=>i+1);

  return (
    <div className="main-wrapper" style={{paddingTop:0,marginTop:0}}>
      <SideMenu   isOpen={showSideMenu}   onClose={()=>setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch}    onClose={()=>setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={()=>setShowMobileMenu(false)} />
      <Header
        onMenuToggle={()=>setShowMobileMenu(true)}
        onSideMenuToggle={()=>setShowSideMenu(true)}
        onSearchToggle={()=>setShowSearch(true)}
      />

      {/* ══ HERO ══ */}
      <div className="al-hero-outer">
        <div className="container">
          <img
            src="/assets/img/bg/astroguruji.png"
            alt="Consult India's Verified Vedic Masters"
            className="al-hero-img"
          />
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="al-body">
        <div className="container">

          {/* Mobile top bar */}
          <div className="al-mob-top">
            <button className="al-filter-mob-btn" onClick={()=>setDrawerOpen(true)}>
              <i className="fas fa-sliders-h" /> Filters
            </button>
            <select className="al-sort-sel" value={filters.sortBy} onChange={e=>setFilters(f=>({...f,sortBy:e.target.value}))}>
              <option value="relevant">Relevance</option>
              <option value="exp_high">Exp: High–Low</option>
              <option value="exp_low">Exp: Low–High</option>
              <option value="price_low">Price: Low–High</option>
              <option value="price_high">Price: High–Low</option>
              <option value="highest_rated">Highest Rated</option>
            </select>
          </div>

          {/* Mobile Drawer */}
          <div className="al-drawer-wrap">
            <div className={`al-drawer-overlay${drawerOpen?' show':''}`} onClick={()=>setDrawerOpen(false)} />
            <div className={`al-drawer${drawerOpen?' open':''}`}>
              <SidebarContent filters={filters} setFilters={setFilters} onApply={handleApply} />
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-md-3 al-sidebar-desktop">
              <div className="al-sidebar-box">
                <SidebarContent filters={filters} setFilters={setFilters} onApply={handleApply} />
              </div>
            </div>

            {/* Main */}
            <div className="col-md-9 col-12">

              {/* Trust strip — 3 items in the content area */}
              <div className="al-trust-strip">
                {[
                  {ic:'fas fa-shield-alt',cls:'cg',lbl:'100% Verified',    sub:'All astrologers are verified'},
                  {ic:'fas fa-lock',      cls:'cp',lbl:'Secure & Private',  sub:'Your privacy is our priority'},
                  {ic:'fas fa-smile',     cls:'ce',lbl:'Satisfaction',       sub:'98% happy customers'},
                ].map(t=>(
                  <div key={t.lbl} className="al-trust-item">
                    <div className={`al-ti-icon ${t.cls}`}><i className={t.ic} /></div>
                    <div>
                      <div className="al-ti-lbl">{t.lbl}</div>
                      <div className="al-ti-sub">{t.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Header row */}
              <div className="al-mhdr">
                <div className="al-mhdr-left">
                  <h2>Find Your Perfect Guide</h2>
                  <p>Connect with experienced Vedic astrologers for accurate guidance and solutions.</p>
                </div>
                <div className="al-mhdr-right">
                  {!loading && <span className="al-showing">Showing 1–{astrologers.length} of {astrologers.length}+ astrologers</span>}
                  <select className="al-sort-sel" value={filters.sortBy} onChange={e=>setFilters(f=>({...f,sortBy:e.target.value}))}>
                    <option value="relevant">Relevance</option>
                    <option value="exp_high">Experience: High to Low</option>
                    <option value="exp_low">Experience: Low to High</option>
                    <option value="price_low">Payment: Low to High</option>
                    <option value="price_high">Payment: High to Low</option>
                    <option value="highest_rated">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Error */}
              {error && !loading && (
                <div className="text-center py-5">
                  <i className="fas fa-exclamation-circle fa-3x d-block mb-3" style={{color:'#d1d5db'}} />
                  <p className="fw-bold text-dark mb-1">Unable to load astrologers</p>
                  <p className="small text-muted mb-3">Please check your connection and try again.</p>
                  <button className="al-chat" style={{width:'auto',display:'inline-block',borderRadius:9,padding:'10px 28px'}}
                    onClick={()=>fetchAstrologers(page)}>Retry</button>
                </div>
              )}

              {/* Grid */}
              {!error && (
                <div className="row g-3">
                  {loading
                    ? Array.from({length:9}).map((_,i)=>(
                        <div key={i} className="col-6 col-md-4"><SkeletonCard /></div>
                      ))
                    : <>
                        {astrologers.map((a,i)=>(
                          <div key={a.id||i} className="col-6 col-md-4">
                            <AstrologerCard astro={a} onChat={(astro, type) => {
                              if (type === 'call') { setSelectedAstro(astro); }
                              else { navigate(`/astrologer/${astro.id || astro._id}`); }
                            }} />

                          </div>
                        ))}
                        <div className="col-6 col-md-4">
                          <RecommendCard onChat={setSelectedAstro} />
                        </div>
                      </>
                  }
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && astrologers.length > 0 && (
                <div className="al-pg">
                  <button className="al-pg-btn" disabled={page===1} onClick={()=>goPage(page-1)}>
                    <i className="fas fa-chevron-left" style={{fontSize:11}} />
                  </button>
                  {pages.map(p=>(
                    <button key={p} className={`al-pg-btn${page===p?' cur':''}`} onClick={()=>goPage(p)}>{p}</button>
                  ))}
                  {totalPages>5 && <span className="al-pg-dots">…</span>}
                  <button className="al-pg-btn" disabled={page===totalPages} onClick={()=>goPage(page+1)}>
                    <i className="fas fa-chevron-right" style={{fontSize:11}} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <NewAppDownloadModal
        isOpen={!!selectedAstro}
        onClose={()=>setSelectedAstro(null)}
        title={selectedAstro?`Consult ${selectedAstro.name}`:'Consult a Master'}
        subtitle={selectedAstro
          ?`Speak with ${selectedAstro.name} for clarity on ${selectedAstro.category?.[0]?.name||'Life'}.`
          :'Join thousands who found clarity.'}
      />
      <ScrollTop />
      <Footer />
    </div>
  );
};

export default AstrologerList;