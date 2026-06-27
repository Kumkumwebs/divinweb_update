import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
	return (
		<div
			className={`th-menu-wrapper onepage-nav ${
				isOpen ? 'th-body-visible' : ''
			}`}
		>
			<div className="th-menu-area text-center">
				<button className="th-menu-toggle" onClick={onClose}>
					<i className="fal fa-times"></i>
				</button>
				<div className="mobile-logo">
					<Link to="/">
						<img src="/assets/img/logo123.svg" alt="DivinIQ" />
					</Link>
				</div>
				<div className="th-mobile-menu">
					<ul>
						<li className="">
							<Link className="active" to="/">
								Home
							</Link>
							
						</li>
						<li>
							<Link to="/about_us">About Us</Link>
						</li>
						<li>
							<Link to="/puja">Book a Puja</Link>
						</li>
						<li>
							<Link to="/puja">Chat with Astrologer</Link>
						</li>
						<li>
							<Link to="/chadhava">Book a Chadhava</Link>
						</li>
						<li>
							<Link to="/my_chadhava_booking">Chadhava Booking</Link>
						</li>
						<li>
							<Link to="/my_puja_booking">Puja Booking</Link>
						</li>
						{/* <li className="menu-item-has-children">
							<a href="#">Destination</a>
							<ul className="sub-menu">
								<li>
									<Link to="/destination">Destination</Link>
								</li>
								<li>
									<Link to="/destination-details">Destination Details</Link>
								</li>
							</ul>
						</li>
						<li className="menu-item-has-children">
							<a href="#">Service</a>
							<ul className="sub-menu">
								<li>
									<Link to="/service">Services</Link>
								</li>
								<li>
									<Link to="/service-details">Service Details</Link>
								</li>
							</ul>
						</li>
						<li className="menu-item-has-children">
							<a href="#">Activities</a>
							<ul className="sub-menu">
								<li>
									<Link to="/activities">Activities</Link>
								</li>
								<li>
									<Link to="/activities-details">Activities Details</Link>
								</li>
							</ul>
						</li>
						<li className="menu-item-has-children">
							<a href="#">Pages</a>
							<ul className="sub-menu">
								<li className="menu-item-has-children">
									<a href="#">Shop</a>
									<ul className="sub-menu">
										<li>
											<Link to="/shop">Shop</Link>
										</li>
										<li>
											<Link to="/shop-details">Shop Details</Link>
										</li>
										<li>
											<Link to="/cart">Cart Page</Link>
										</li>
										<li>
											<Link to="/checkout">Checkout</Link>
										</li>
										<li>
											<Link to="/wishlist">Wishlist</Link>
										</li>
									</ul>
								</li>
								<li>
									<Link to="/gallery">Gallery</Link>
								</li>
								<li>
									<Link to="/tour">Our Tour</Link>
								</li>
								<li>
									<Link to="/tour-details">Tour Details</Link>
								</li>
								<li>
									<Link to="/resort">Resort page</Link>
								</li>
								<li>
									<Link to="/resort-details">Resort Details</Link>
								</li>
								<li>
									<Link to="/tour-guide">Tour Guider</Link>
								</li>
								<li>
									<Link to="/tour-guider-details">Tour Guider Details</Link>
								</li>
								<li>
									<Link to="/faq">Faq Page</Link>
								</li>
								<li>
									<Link to="/price">Price Package</Link>
								</li>
								<li>
									<Link to="/error">Error Page</Link>
								</li>
							</ul>
						</li>
						<li className="menu-item-has-children">
							<a href="#">Blog</a>
							<ul className="sub-menu">
								<li>
									<Link to="/blog">Blog</Link>
								</li>
								<li>
									<Link to="/blog-details">Blog Details</Link>
								</li>
							</ul>
						</li> */}
						<li>
							<Link to="/contact">Contact us</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MobileMenu;
