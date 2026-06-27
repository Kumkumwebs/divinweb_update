import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../services/apiServices';
import './AudioCall.css';

const initials = (n) => (n||'').trim().split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
const COLORS = ['#7c3aed','#059669','#dc2626','#d97706','#2563eb'];
const avColor = (n) => COLORS[((n||'').charCodeAt(0)||65) % COLORS.length];
const fmt = (s) => {
  const h = String(Math.floor(s/3600)).padStart(2,'0');
  const m = String(Math.floor((s%3600)/60)).padStart(2,'0');
  const sec = String(s%60).padStart(2,'0');
  return `${h}:${m}:${sec}`;
};

const GIFTS = [
  {name:'Rose',         price:'₹51',  icon:'fas fa-spa',       img:'/assets/img/gift/rose.png'},
  {name:'Fruits Basket',price:'₹101', icon:'fas fa-apple-alt', img:'/assets/img/gift/fruits.png'},
  {name:'Diya',         price:'₹251', icon:'fas fa-fire',      img:'/assets/img/gift/diya.png'},
  {name:'Puja Samagri', price:'₹501', icon:'fas fa-pray',      img:'/assets/img/gift/puja.png'},
  {name:'Blessings Shawl',price:'₹751',icon:'fas fa-tshirt',  img:'/assets/img/gift/shawl.png'},
  {name:'Premium Gift', price:'₹1100',icon:'fas fa-gift',      img:'/assets/img/gift/gift.png'},
];

const BARS = [
  {lbl:'5 Stars',pct:82,color:'#f5a623'},
  {lbl:'4 Stars',pct:13,color:'#f5a623'},
  {lbl:'3 Stars',pct:3, color:'#f5c842'},
  {lbl:'2 Stars',pct:1, color:'#ddd'},
  {lbl:'1 Star', pct:1, color:'#ddd'},
];

const AudioCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [astro,   setAstro]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgErr,  setImgErr]  = useState(false);
  const [secs,    setSecs]    = useState(504);
  const [muted,   setMuted]   = useState(false);
  const [spk,     setSpk]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.postBearer(
        'https://admin.diviniq.in/user_api/astrologer_list',
        {search:'',page:'1',is_chat:'on',followAstro:'',is_voice_call:'on',
         is_video_call:'on',cat_id:'',language_id:'',gender:'',sort_val:'relevant',
         is_question:'',skill_id:'',country:'',report_id:'',expert_astro:''}
      );
      if (res?.results?.length) {
        const f = res.results.find(a=>String(a.id)===String(id)||String(a._id)===String(id));
        setAstro(f || res.results[0]);
      }
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(()=>{ load(); },[load]);
  useEffect(()=>{ const t=setInterval(()=>setSecs(p=>p+1),1000); return ()=>clearInterval(t); },[]);

  const name    = astro?.name || 'Acharya Rohit Sharma';
  const cats    = astro?.category?.map(c=>c.name) || ['Vedic Astrology','Numerology','Vastu','Kundli Matching','Career Guidance'];
  const lang    = astro?.language?.map(l=>l.name).join(', ') || 'Hindi';
  const price   = astro?.per_min_chat || 15;
  const rating  = parseFloat(astro?.avg_rate || 4.9);
  const reviews = astro?.total_review || '12,456';
  const exp     = astro?.experience || '15';
  const orders  = astro?.total_orders || '25,000';
  const pImg    = astro?.profile_img || '';

  if (loading) return (
    <div className="ac-page">
      <div className="ac-main" style={{alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center',color:'#999'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize:26,color:'#7b1a3a',marginBottom:8}}/>
          <p style={{fontSize:13}}>Connecting call...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ac-page">
      <div className="ac-main">

        {/* ══ LEFT ══ */}
        <div className="ac-left">
          <motion.div className="ac-lcard"
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.22}}>
            <div className="ac-lcard-title"><i className="fas fa-calendar-check"/> Consultation Details</div>
            {[
              {lbl:'Topic',      val:'Career Guidance'},
              {lbl:'Astrologer', val:name, icon:true},
              {lbl:'Experience', val:`${exp}+ Years`},
              {lbl:'Language',   val:lang},
              {lbl:'Call Type',  val:'Audio Call'},
              {lbl:'Rate',       val:`₹${price} / min`},
              {lbl:'Remaining Balance', val:'₹210'},
            ].map(r=>(
              <div key={r.lbl} className="ac-drow">
                <div className="ac-dlbl">{r.lbl}</div>
                <div className="ac-dval">{r.val}{r.icon && <i className="fas fa-check-circle"/>}</div>
              </div>
            ))}
            <button className="ac-more-btn">View More Details <i className="fas fa-chevron-right"/></button>
          </motion.div>

          <motion.div className="ac-lcard"
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.22,delay:0.07}}>
            <div className="ac-rtitle"><i className="fas fa-star"/> Astrologer Rating</div>
            <div className="ac-rscore"><i className="fas fa-star"/><span>{rating.toFixed(1)} ({reviews} Reviews)</span></div>
            {BARS.map(b=>(
              <div key={b.lbl} className="ac-brow">
                <span className="ac-blbl">{b.lbl}</span>
                <div className="ac-btrack"><div className="ac-bfill" style={{width:`${b.pct}%`,background:b.color}}/></div>
                <span className="ac-bpct">{b.pct}%</span>
              </div>
            ))}
            <button className="ac-rall">View All Reviews <i className="fas fa-chevron-right"/></button>
          </motion.div>
        </div>

        {/* ══ CENTER ══ */}
        <div className="ac-center">
          <motion.div className="ac-callcard"
            initial={{opacity:0,scale:0.98}} animate={{opacity:1,scale:1}} transition={{duration:0.26}}>

            {/* Encrypt + Info */}
            <div className="ac-enc">
              <i className="fas fa-lock"/>
              <div>
                <div className="ac-enc-t">End-to-end Encrypted</div>
                <div className="ac-enc-s">Your privacy is 100% protected</div>
              </div>
            </div>
            <button className="ac-infobtn"><i className="fas fa-info-circle"/> Call Info</button>

            {/* Title + Timer */}
            <div className="ac-calltop">
              <div className="ac-calllbl">
                Audio Call
                <div className="ac-wave">{[1,2,3,4,5].map(i=><div key={i} className="ac-wb"/>)}</div>
              </div>
              <div className="ac-timer">{fmt(secs)}</div>
            </div>

            {/* Avatar */}
            <div className="ac-avwrap">
              <div className="ac-av">
                {pImg && !imgErr
                  ? <img src={pImg} alt={name} onError={()=>setImgErr(true)}/>
                  : <div className="ac-avinit" style={{background:`linear-gradient(135deg,${avColor(name)},${avColor(name)}99)`}}>{initials(name)}</div>
                }
              </div>
              <div className="ac-avbadge"><i className="fas fa-check"/></div>
            </div>

            {/* Name + verified */}
            <div className="ac-namerow">
              <span className="ac-name">{name}</span>
              <span className="ac-pill"><i className="fas fa-check-circle"/> Verified Expert</span>
            </div>
            <div className="ac-ratingrow">
              <i className="fas fa-star"/>
              <span>{rating.toFixed(1)} ({reviews} Reviews)</span>
            </div>

            {/* Skills — wrap pills */}
            <div className="ac-skills">
              {cats.map((c,i)=>(
                <span key={i} className="ac-spill"><i className="fas fa-om"/> {c}</span>
              ))}
            </div>

            {/* Controls */}
            <div className="ac-ctrls">
              <button className="ac-cb" onClick={()=>setMuted(p=>!p)}>
                <div className="ac-cico"><i className="fas fa-microphone-slash" style={{color:muted?'#d32f2f':'#333'}}/></div>
                <span className="ac-clbl">Mute</span>
              </button>
              <button className="ac-cb" onClick={()=>setSpk(p=>!p)}>
                <div className="ac-cico"><i className={`fas ${spk?'fa-volume-up':'fa-volume-mute'}`} style={{color:spk?'#333':'#d32f2f'}}/></div>
                <span className="ac-clbl">Speaker</span>
              </button>
              <button className="ac-cb end" onClick={()=>navigate(-1)}>
                <div className="ac-cico"><i className="fas fa-phone-slash"/></div>
                <span className="ac-clbl">End Call</span>
              </button>
              <button className="ac-cb">
                <div className="ac-cico"><i className="fas fa-th"/></div>
                <span className="ac-clbl">Keypad</span>
              </button>
              <button className="ac-cb">
                <div className="ac-cico"><i className="fas fa-ellipsis-h"/></div>
                <span className="ac-clbl">More</span>
              </button>
            </div>
          </motion.div>

          {/* Bottom actions */}
          <motion.div className="ac-actions"
            initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.2,delay:0.12}}>
            {[
              {icon:'fas fa-share-alt',  lbl:'Share Details', sub:'Share your birth details or documents'},
              {icon:'fas fa-sticky-note',lbl:'Notes',         sub:'Take notes during your consultation'},
              {icon:'fas fa-record-vinyl',lbl:'Record Call',  sub:'Record this call for your reference'},
              {icon:'fas fa-gift',       lbl:'Send Gift',     sub:'Show your gratitude with a gift'},
            ].map(a=>(
              <div key={a.lbl} className="ac-act">
                <div className="ac-aico"><i className={a.icon}/></div>
                <span className="ac-albl">{a.lbl}</span>
                <span className="ac-asub">{a.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="ac-right">
          <motion.div className="ac-sum"
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.22,delay:0.1}}>
            <div className="ac-sumtitle"><i className="fas fa-calendar-check"/> Consultation Summary</div>
            {[
              {lbl:'Topic',    val:'Career Guidance'},
              {lbl:'Call Type',val:'Audio Call'},
              {lbl:'Rate',     val:`₹${price} / min`},
              {lbl:'Duration', val:fmt(secs)},
            ].map(r=>(
              <div key={r.lbl} className="ac-srow">
                <div className="ac-slbl">{r.lbl}</div>
                <div className="ac-sval">{r.val}</div>
              </div>
            ))}
            <div className="ac-srow">
              <div className="ac-slbl">Remaining Balance</div>
              <div className="ac-sval big">₹210</div>
            </div>
            <button className="ac-sumbtn">View More Details <i className="fas fa-chevron-right"/></button>
          </motion.div>

          <motion.div className="ac-gifts"
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.22,delay:0.16}}>
            <div className="ac-gtitle"><i className="fas fa-gift"/> Send Blessings Gift</div>
            <div className="ac-ggrid">
              {GIFTS.map(g=>(
                <div key={g.name} className="ac-gitem">
                  <div className="ac-gbox">
                    <img src={g.img} alt={g.name}
                      onError={e=>{e.target.style.display='none';e.target.parentNode.innerHTML=`<i class="${g.icon}"></i>`;}}/>
                  </div>
                  <span className="ac-gname">{g.name}</span>
                  <span className="ac-gprice">{g.price}</span>
                </div>
              ))}
            </div>
            <button className="ac-gbtn">View More Gifts</button>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AudioCall;