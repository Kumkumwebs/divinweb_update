import { useState, useEffect } from 'react';
import Preloader from '../components/layout/Preloader';
import SideMenu from '../components/layout/SideMenu';
import PopupSearch from '../components/layout/PopupSearch';
import MobileMenu from '../components/layout/MobileMenu';
import Header from '../components/layout/Header';
import HeroSection from '../components/sections/HeroSection';
import BookingSection from '../components/sections/BookingSection';
import CategorySection from '../components/sections/CategorySection';
import DestinationSection from '../components/sections/DestinationSection';
import AboutSection from '../components/sections/AboutSection';
import TourSection from '../components/sections/PujaListSection';
import GallerySection from '../components/sections/GallerySection';
import CounterSection from '../components/sections/CounterSection';
import TeamSection from '../components/sections/TeamSection';
import TestimonialSection from '../components/sections/TestimonialSection';
import BrandSection from '../components/sections/BrandSection';
import BlogSection from '../components/sections/BlogSection';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import LoginModal from '../components/common/LoginModal';
import AuthService from '../services/authServices';
import PujaListSection from '../components/sections/PujaListSection';

const Home = () => {
	const [showSideMenu, setShowSideMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [homeData, setHomeData] = useState(null);

	const fetchHomeData = async () => {
		// debugger;
		setLoading(true);
		setError(false);

		const res = await AuthService.getHomeData();

		if (res) {
			setHomeData(res);
		} else {
			setError(true);
		}

		setLoading(false);
	};
	useEffect(() => {
		fetchHomeData();
	}, []);

	return (
		<>
			{/* Preloader - Same as original (lines 85-106) */}
			{/* <Preloader /> */}

			{/* Sidemenu - Same as original (lines 110-190) */}
			<SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />

			{/* Popup Search - Same as original (lines 191-197) */}
			<PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />

			{/* Mobile Menu - Same as original (lines 200-285) */}
			<MobileMenu
				isOpen={showMobileMenu}
				onClose={() => setShowMobileMenu(false)}
			/>

			{/* Header - Same as original (lines 288-708) */}
			<Header
				onMenuToggle={() => setShowMobileMenu(true)}
				onSideMenuToggle={() => setShowSideMenu(true)}
				onSearchToggle={() => setShowSearch(true)}
				onLoginClick={() => setShowLoginModal(true)}
			/>

			{/* Hero Section - Same as original (lines 777-949) */}
			{homeData && <HeroSection astrologer={homeData.astrologer} />}

			{/* Booking Section - Same as original (lines 959-1040) */}
			{/* <BookingSection /> */}

			{/* Category Section - Same as original (lines 1044-1208) */}
			{/* <CategorySection /> */}

			{/* Destination Section - Same as original (lines 1212-1406) */}
			<DestinationSection />

			{/* About Section - Same as original (lines 1412-1486) */}
			<AboutSection />

			{/* Tour Section - Same as original (lines 1490-1670) */}
			{homeData && <PujaListSection puja={homeData.puja?.[0].result} />}
			{/* Gallery Section - Same as original (lines 1677-1759) */}
			<GallerySection />

			{/* Counter Section - Same as original (lines 1763-1822) */}
			<CounterSection />

			{/* Team Section - Same as original (lines 1826-2040) */}
			{homeData && <TeamSection astrologer={homeData.astrologer} />}

			{/* Testimonial Section - Same as original (lines 2044-2297) */}
			{homeData && <TestimonialSection testimonial={homeData.testimonials} />}

			{/* Brand Section - Same as original (lines 2301-2407) */}
			{/* <BrandSection /> */}

			{/* Blog Section - Same as original (lines 2411-2551) */}
			{homeData && <BlogSection blog={homeData.blog} />}

			{/* Footer - Same as original (lines 2555-2699) */}
			<Footer />

			{/* Scroll To Top - Same as original (lines 2706-2712) */}
			<ScrollTop />

			{/* Login Modal - Same as original (lines 2716-2793) */}
			<LoginModal
				isOpen={showLoginModal}
				onClose={() => setShowLoginModal(false)}
			/>
		</>
	);
};

export default Home;
