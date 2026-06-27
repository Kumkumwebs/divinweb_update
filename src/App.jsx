import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import AboutUs from './pages/AboutUs';
import ChadhavaListing from './pages/ChadhavaListing';
import PujaListing from './pages/pujaListing';
import ChadhavaDetails from './pages/ChadhavaDetails';
import PujaDetails from './pages/PujaDetails';
import AstrologerGrid from './pages/AstrologerList';
import NakshatraFinder from './pages/NakshatraFinder';
import JanmaRashiFinder from './pages/JanmRashiFinder';
import MangalDoshaCalculator from './pages/MangalDoshCalculator';
import LoveCalculator from './pages/LoveCalculator';
import FriendshipCalculator from './pages/FriendShipCalculator';
import DestinyNumberCalculator from './pages/DestinyNumberCalculator';
import MobileNumerologyCalculator from './pages/MobileNumberNumerologyCalculator';
import AstrologyCalculatorHub from './pages/AstrologyCalculatorTools';
import ContactUs from './pages/ContactUs';
import Security from './pages/SecurityPage';
import Careers from './pages/Careers';
import ScrollToTop from './components/common/ScrollToTop';
import CursorFollower from './components/common/CursorFollower';
import ChadhavaCartPage from './components/common/ChadhavaCartInfo';
import PujaReviewBookingPage from './pages/PujaReviewBookingPage';
import PujaFillForm from './pages/PujaReviewForm';
import PujaBookingListPage from './pages/PujaBookingPage';
import ChadhavaBookingListPage from './pages/MyChadhavaBookingPage';
import PrivacyPolicy from './pages/PrivacyPolicyPage';
import TermsAndConditions from './pages/TermsAndConditions';
import CancellationAndRefund from './pages/CancellationAndRefund';
import HelpCenter from './pages/HelpCenter';
import PanchangPage from './pages/PanchangPage';
import AstrologerRegistration from './pages/AstrologerRegistration';
import Profile from './pages/Profile';
import AstrologerList from './pages/AstrologerList';
import AstrologerDetail from './pages/AstrologerDetail';
import ChatConsultation from './pages/Chatconsultation';
import AudioCall from './pages/AudioCall';
import Check from './pages/check';

function App() {
	return (
		<Router>
			<ScrollToTop />
			{/* Cursor Follower - Same as original */}
			<CursorFollower />
			{/* Slider Drag Cursor - Same as original */}
			<div className="slider-drag-cursor">
				<i className="fas fa-angle-left me-2"></i> DRAG{' '}
				<i className="fas fa-angle-right ms-2"></i>
			</div>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about_us" element={<AboutUs />} />
				<Route path="/chadhava" element={<ChadhavaListing />} />
				<Route path="/puja" element={<PujaListing />} />
				<Route path="/chadhava/:name/:id" element={<ChadhavaDetails />} />
				<Route path="/puja/:name/:id" element={<PujaDetails />} />
				<Route path="/astrologer" element={<AstrologerList />} />
				<Route path="/astrologer/:id" element={<AstrologerDetail />} />
				<Route path="/nakshatra_finder" element={<NakshatraFinder />} />
				<Route path="/janm_rashi_finder" element={<JanmaRashiFinder />} />
				<Route path="/panchang" element={<PanchangPage />} />
				<Route path="/consultation/chat/:id" element={<ChatConsultation />} />
				

				<Route
					path="/mangal_dosh_calculator"
					element={<MangalDoshaCalculator />}
				/>
				<Route path="/love_calculator" element={<LoveCalculator />} />
				<Route
					path="/friendship_calculator"
					element={<FriendshipCalculator />}
				/>
				<Route
					path="/destiny_number_calculator"
					element={<DestinyNumberCalculator />}
				/>
				<Route
					path="/astrologer_registration"
					element={<AstrologerRegistration />}
				/>
				<Route
					path="/mobile_numerology_calculator"
					element={<MobileNumerologyCalculator />}
				/>
				<Route
					path="/astrology_calculator_hub"
					element={<AstrologyCalculatorHub />}
				/>
				<Route path="/contact_us" element={<ContactUs />} />
				<Route path="/security" element={<Security />} />
				<Route path="/careers" element={<Careers />} />
				<Route path="/help" element={<HelpCenter />} />
				<Route path="/chadhava_review_booking" element={<ChadhavaCartPage />} />
				<Route path="/consultation/call/:id" element={<AudioCall />} />
				<Route path="/consultation/check" element={<Check />} />
				<Route
					path="/puja_review_booking"
					element={<PujaReviewBookingPage />}
				/>
				<Route path="/puja_fill_form" element={<PujaFillForm />} />
				<Route path="/my_puja_booking" element={<PujaBookingListPage />} />
				
				<Route
					path="/my_chadhava_booking"
					element={<ChadhavaBookingListPage />}
				/>
				<Route path="/privacy_policy" element={<PrivacyPolicy />} />
				<Route path="/terms_of_use" element={<TermsAndConditions />} />
				<Route
					path="/cancellation_refund_policy"
					element={<CancellationAndRefund />}
				/>
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</Router>
	);
}

export default App;