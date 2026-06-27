import React, { useState } from 'react';
import { Calendar, Sun, Moon, Clock, MapPin, Star, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollTop from '../components/common/ScrollTop';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import SideMenu from '../components/layout/SideMenu';
import PopupSearch from '../components/layout/PopupSearch';
import MobileMenu from '../components/layout/MobileMenu';

const PanchangPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 4));
  const [location, setLocation] = useState('Lucknow, Uttar Pradesh, IN');
const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
  const panchangData = {
    date: 'Saturday, January 04, 2026',
    tithi: 'Pratipada Krishna-Paksha',
    tithiEnd: '12:31 PM',
    nakshatra: 'Punarvasu',
    nakshatraEnd: '3:12 PM',
    yoga: 'Vaidhriti',
    yogaEnd: '1:48 AM',
    karana: 'Kaulav',
    karanaEnd: '12:33 PM',
    paksha: 'Krishna-Paksha',
    month: 'Magha',
    season: 'Hemant',
    sunSign: 'Sagittarius',
    moonSign: 'Gemini',
    sunrise: '6:45 AM',
    sunset: '5:22 PM',
    moonrise: '6:25 PM',
    moonset: '7:36 AM',
    abhijitMuhurat: { start: '11:43 AM', end: '12:25 PM' },
    rahuKaal: { start: '4:03 PM', end: '5:22 PM' },
    gulikKaal: { start: '2:43 PM', end: '4:03 PM' },
    yamghantKaal: { start: '12:04 PM', end: '1:23 PM' },
    dishaShool: 'WEST',
    moonPlacement: 'WEST',
    festivals: ['Ishti', 'Magha Begins *North']
  };

  const upcomingFestivals = [
    { date: '6 January', name: 'Sakat Chauth' },
    { date: '6 January', name: 'Sankashti Chaturthi' },
    { date: '10 January', name: 'Kalashtami' },
    { date: '14 January', name: 'Lohri' },
    { date: '15 January', name: 'Makara Sankranti' },
    { date: '15 January', name: 'Pongal' }
  ];
  const styles = {
    pageContainer: {
      background: 'linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #f5f0ff 100%)',
      minHeight: '100vh',
      padding: '50px 0'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    headerBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#ffedd5',
      color: '#9a3412',
      padding: '8px 16px',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '20px'
    },
    mainTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '15px',
      textAlign: 'center'
    },
    titleSpan: {
      color: '#ea580c'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '18px',
      maxWidth: '600px',
      margin: '0 auto 40px',
      textAlign: 'center'
    },
    dateCard: {
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      padding: '30px',
      marginBottom: '30px',
      border: '1px solid #f3f4f6'
    },
    dateCardInner: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    dateDisplay: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    navButton: {
      padding: '8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    dateText: {
      textAlign: 'center'
    },
    dateMain: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    dateSub: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '5px'
    },
    locationSelect: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    select: {
      padding: '10px 20px',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      background: '#ffffff',
      color: '#374151',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '30px',
      marginBottom: '30px'
    },
    card: {
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      padding: '40px',
      border: '1px solid #f3f4f6'
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    panchangGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '25px'
    },
    panchangItem: {
      borderLeft: '4px solid',
      paddingLeft: '20px'
    },
    panchangLabel: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: '5px'
    },
    panchangValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '5px'
    },
    panchangTime: {
      fontSize: '14px',
      color: '#6b7280'
    },
    timingCard: {
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      padding: '25px',
      border: '1px solid #fed7aa'
    },
    timingCardBlue: {
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      border: '1px solid #bfdbfe'
    },
    timingHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px'
    },
    iconBox: {
      padding: '12px',
      borderRadius: '12px',
      background: '#ea580c',
      display: 'inline-flex'
    },
    iconBoxBlue: {
      background: '#3b82f6'
    },
    timingTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    timingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    timingLabel: {
      color: '#6b7280',
      fontSize: '14px'
    },
    timingValue: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#ea580c'
    },
    timingValueBlue: {
      color: '#3b82f6'
    },
    timingDivider: {
      borderTop: '1px solid rgba(0,0,0,0.1)',
      paddingTop: '15px',
      marginTop: '15px'
    },
    timingSmall: {
      fontSize: '14px',
      color: '#6b7280'
    },
    auspiciousCard: {
      background: '#f0fdf4',
      borderRadius: '15px',
      padding: '20px',
      border: '1px solid #bbf7d0',
      marginBottom: '15px'
    },
    inauspiciousCard: {
      background: '#fef2f2',
      borderRadius: '15px',
      padding: '20px',
      border: '1px solid #fecaca',
      marginBottom: '15px'
    },
    warningCard: {
      background: '#fffbeb',
      borderRadius: '15px',
      padding: '20px',
      border: '1px solid #fde68a'
    },
    festivalCard: {
      background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      padding: '25px',
      border: '1px solid #f3e8ff',
      marginBottom: '25px'
    },
    festivalItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      background: '#ffffff',
      borderRadius: '10px',
      padding: '15px',
      border: '1px solid #e9d5ff',
      marginBottom: '10px'
    },
    festivalDot: {
      width: '8px',
      height: '8px',
      background: '#a855f7',
      borderRadius: '50%'
    },
    upcomingItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background 0.3s',
      marginBottom: '10px'
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '25px',
      marginBottom: '30px'
    },
    educationCard: {
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      padding: '40px',
      border: '1px solid #f3f4f6'
    },
    educationTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '20px'
    },
    educationText: {
      color: '#374151',
      lineHeight: '1.8',
      fontSize: '16px',
      marginBottom: '20px'
    },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px'
    }
  };

  return (
    <div className="main-wrapper">
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
                onLoginClick={() => setShowLoginModal(true)}
            />
  <div style={styles.pageContainer}>
      <div style={styles.container}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={styles.headerBadge}>
            <Star size={16} />
            Daily Panchang
          </div>
          <h1 style={styles.mainTitle}>
            Hindu <span style={styles.titleSpan}>Panchang</span>
          </h1>
          <p style={styles.subtitle}>
            Plan your day with authentic Vedic wisdom and auspicious timings
          </p>
        </div>

        {/* Date Picker Card */}
        <div style={styles.dateCard}>
          <div style={styles.dateCardInner}>
            <div style={styles.dateDisplay}>
              <button style={styles.navButton} onMouseOver={(e) => e.target.style.background = '#f3f4f6'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
                <ChevronLeft size={24} color="#6b7280" />
              </button>
              <div style={styles.dateText}>
                <div style={styles.dateMain}>{panchangData.date}</div>
                <div style={styles.dateSub}>{panchangData.tithi}</div>
              </div>
              <button style={styles.navButton} onMouseOver={(e) => e.target.style.background = '#f3f4f6'} onMouseOut={(e) => e.target.style.background = 'transparent'}>
                <ChevronRight size={24} color="#6b7280" />
              </button>
            </div>
            
            <div style={styles.locationSelect}>
              <MapPin size={20} color="#ea580c" />
              <select style={styles.select}>
                <option>{location}</option>
                <option>New Delhi, Delhi, IN</option>
                <option>Mumbai, Maharashtra, IN</option>
                <option>Varanasi, UP, IN</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div style={styles.gridContainer}>
          
          {/* Left Column */}
          <div>
            
            {/* Panchang Elements Card */}
            <div style={{...styles.card, marginBottom: '30px'}}>
              <h2 style={styles.cardTitle}>
                <Calendar size={24} color="#ea580c" />
                Panchang Elements
              </h2>
              
              <div style={styles.panchangGrid}>
                <div>
                  <div style={{...styles.panchangItem, borderLeftColor: '#ea580c'}}>
                    <div style={styles.panchangLabel}>Tithi</div>
                    <div style={styles.panchangValue}>{panchangData.tithi}</div>
                    <div style={styles.panchangTime}>Till {panchangData.tithiEnd}</div>
                  </div>
                  
                  <div style={{...styles.panchangItem, borderLeftColor: '#a855f7', marginTop: '20px'}}>
                    <div style={styles.panchangLabel}>Nakshatra</div>
                    <div style={styles.panchangValue}>{panchangData.nakshatra}</div>
                    <div style={styles.panchangTime}>Till {panchangData.nakshatraEnd}</div>
                  </div>
                  
                  <div style={{...styles.panchangItem, borderLeftColor: '#3b82f6', marginTop: '20px'}}>
                    <div style={styles.panchangLabel}>Yoga</div>
                    <div style={styles.panchangValue}>{panchangData.yoga}</div>
                    <div style={styles.panchangTime}>Till {panchangData.yogaEnd}</div>
                  </div>
                </div>
                
                <div>
                  <div style={{...styles.panchangItem, borderLeftColor: '#10b981'}}>
                    <div style={styles.panchangLabel}>Karana</div>
                    <div style={styles.panchangValue}>{panchangData.karana}</div>
                    <div style={styles.panchangTime}>Till {panchangData.karanaEnd}</div>
                  </div>
                  
                  <div style={{...styles.panchangItem, borderLeftColor: '#6366f1', marginTop: '20px'}}>
                    <div style={styles.panchangLabel}>Paksha</div>
                    <div style={styles.panchangValue}>{panchangData.paksha}</div>
                  </div>
                  
                  <div style={{...styles.panchangItem, borderLeftColor: '#ec4899', marginTop: '20px'}}>
                    <div style={styles.panchangLabel}>Month</div>
                    <div style={styles.panchangValue}>{panchangData.month}</div>
                    <div style={styles.panchangTime}>{panchangData.season} Season</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sun & Moon Timings */}
            <div style={styles.gridTwo}>
              <div style={styles.timingCard}>
                <div style={styles.timingHeader}>
                  <div style={styles.iconBox}>
                    <Sun size={24} color="#ffffff" />
                  </div>
                  <h3 style={styles.timingTitle}>Sun Timings</h3>
                </div>
                <div>
                  <div style={styles.timingRow}>
                    <span style={styles.timingLabel}>Sunrise</span>
                    <span style={styles.timingValue}>{panchangData.sunrise}</span>
                  </div>
                  <div style={styles.timingRow}>
                    <span style={styles.timingLabel}>Sunset</span>
                    <span style={styles.timingValue}>{panchangData.sunset}</span>
                  </div>
                  <div style={styles.timingDivider}>
                    <div style={styles.timingSmall}>
                      Sun Sign: <strong>{panchangData.sunSign}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{...styles.timingCard, ...styles.timingCardBlue}}>
                <div style={styles.timingHeader}>
                  <div style={{...styles.iconBox, ...styles.iconBoxBlue}}>
                    <Moon size={24} color="#ffffff" />
                  </div>
                  <h3 style={styles.timingTitle}>Moon Timings</h3>
                </div>
                <div>
                  <div style={styles.timingRow}>
                    <span style={styles.timingLabel}>Moonrise</span>
                    <span style={{...styles.timingValue, ...styles.timingValueBlue}}>{panchangData.moonrise}</span>
                  </div>
                  <div style={styles.timingRow}>
                    <span style={styles.timingLabel}>Moonset</span>
                    <span style={{...styles.timingValue, ...styles.timingValueBlue}}>{panchangData.moonset}</span>
                  </div>
                  <div style={styles.timingDivider}>
                    <div style={styles.timingSmall}>
                      Moon Sign: <strong>{panchangData.moonSign}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Auspicious Timings */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <Clock size={24} color="#10b981" />
                Auspicious & Inauspicious Timings
              </h2>
              
              <div>
                <div style={styles.auspiciousCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: '14px', fontWeight: '600', color: '#166534', textTransform: 'uppercase'}}>
                        Abhijit Muhurat
                      </div>
                      <div style={{fontSize: '12px', color: '#16a34a', marginTop: '5px'}}>
                        Most Auspicious Time
                      </div>
                    </div>
                    <div style={{fontSize: '18px', fontWeight: 'bold', color: '#15803d'}}>
                      {panchangData.abhijitMuhurat.start} - {panchangData.abhijitMuhurat.end}
                    </div>
                  </div>
                </div>

                <div style={styles.inauspiciousCard}>
                  <div style={{display: 'flex', gap: '15px'}}>
                    <AlertTriangle size={20} color="#dc2626" style={{marginTop: '5px', flexShrink: 0}} />
                    <div style={{flex: 1}}>
                      <div style={{fontSize: '14px', fontWeight: '600', color: '#991b1b', textTransform: 'uppercase', marginBottom: '15px'}}>
                        Inauspicious Timings
                      </div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                          <span style={{color: '#b91c1c'}}>Rahu Kaal</span>
                          <span style={{fontWeight: '600', color: '#7f1d1d'}}>{panchangData.rahuKaal.start} - {panchangData.rahuKaal.end}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                          <span style={{color: '#b91c1c'}}>Gulika Kaal</span>
                          <span style={{fontWeight: '600', color: '#7f1d1d'}}>{panchangData.gulikKaal.start} - {panchangData.gulikKaal.end}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                          <span style={{color: '#b91c1c'}}>Yamghant Kaal</span>
                          <span style={{fontWeight: '600', color: '#7f1d1d'}}>{panchangData.yamghantKaal.start} - {panchangData.yamghantKaal.end}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.warningCard}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <div style={{fontSize: '14px', fontWeight: '600', color: '#92400e'}}>Disha Shool</div>
                      <div style={{fontSize: '12px', color: '#b45309', marginTop: '5px'}}>Avoid travel in this direction</div>
                    </div>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#b45309'}}>{panchangData.dishaShool}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightColumn}>
            
            {/* Today's Festivals */}
            {panchangData.festivals.length > 0 && (
              <div style={styles.festivalCard}>
                <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px'}}>
                  Today's Festivals
                </h3>
                <div>
                  {panchangData.festivals.map((festival, idx) => (
                    <div key={idx} style={styles.festivalItem}>
                      <div style={styles.festivalDot}></div>
                      <span style={{color: '#374151', fontWeight: '500'}}>{festival}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Festivals */}
            <div style={styles.card}>
              <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px'}}>
                Upcoming Festivals
              </h3>
              <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                {upcomingFestivals.map((festival, idx) => (
                  <div 
                    key={idx} 
                    style={styles.upcomingItem}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{color: '#374151', fontWeight: '500'}}>{festival.name}</span>
                    <span style={{fontSize: '14px', color: '#6b7280', fontWeight: '600'}}>{festival.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Card */}
            <div style={{
              background: 'linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)',
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              padding: '25px',
              border: '1px solid #c7d2fe'
            }}>
              <h3 style={{fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px'}}>
                Additional Details
              </h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280'}}>Moon Placement</span>
                  <span style={{fontWeight: '600', color: '#1f2937'}}>{panchangData.moonPlacement}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280'}}>Season</span>
                  <span style={{fontWeight: '600', color: '#1f2937'}}>{panchangData.season}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280'}}>Sun Sign</span>
                  <span style={{fontWeight: '600', color: '#1f2937'}}>{panchangData.sunSign}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280'}}>Moon Sign</span>
                  <span style={{fontWeight: '600', color: '#1f2937'}}>{panchangData.moonSign}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Section */}
        <div style={styles.educationCard}>
          <h2 style={styles.educationTitle}>What is Panchang?</h2>
          <p style={styles.educationText}>
            A Panchang is a Hindu calendar that provides details about important celestial occurrences and their influence on life. The term "Panchang" is derived from the Sanskrit words Pancha (five) and Anga (limb), meaning "five limbs" or components.
          </p>
          <p style={styles.educationText}>
            These five elements - Tithi (Lunar Day), Vara (Day of the Week), Nakshatra (Constellation), Yoga (Auspicious Combination), and Karana (Half of a Tithi) - help determine the most auspicious or inauspicious timings for daily life activities, ceremonies, and rituals.
          </p>
        </div>
      </div>
    </div>
     <Footer />
            <ScrollTop />
        </div>
  );
};

export default PanchangPage;