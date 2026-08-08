import '../../pages/home.css';

const FEATURES = [
	{
		title: 'Verified & Experienced Pandits',
		desc: 'Only qualified and experienced pandits for authentic rituals.',
	},
	{
		title: 'Secure & Easy Payments',
		desc: 'Multiple payment options with 100% secure transactions.',
	},
	{
		title: 'Live Video Puja',
		desc: 'Watch your puja live from the temple in real-time.',
	},
	{
		title: 'Pan India Delivery',
		desc: 'Chadhava and prasad delivered across India.',
	},
	{
		title: 'Personalized Rituals',
		desc: 'Tailored pujas and sankalps as per your needs.',
	},
	{
		title: '24x7 Customer Support',
		desc: 'We are here to help you anytime, anywhere.',
	},
];

const WhyTrustSection = () => {
	return (
		<section className="dq-section dq-section-cream">
			{/* Same gradient used by the "Book Now" buttons (PujaListSection /
			    ChadhavaSection) so this CTA matches that style instead of the
			    default solid-maroon .dq-btn look.
			    NOTE: intentionally NOT reusing the ".dq-btn-gradient" class
			    name — PujaListSection/ChadhavaSection define a class with
			    that same name via a plain (unscoped) <style> tag too, and
			    theirs sets display:block; width:100%; padding:10px 32px.
			    Since these style tags aren't CSS-modules-scoped, whichever
			    one mounts last on the page would win the cascade and could
			    silently resize this button. Using a unique class name here,
			    with size explicitly pinned to match the original .dq-btn,
			    avoids that entirely. */}
			<style>{`
				.dq-btn-gradient-trust {
					display: inline-block;
					width: auto;
					padding: 12px 26px;
					border-radius: 6px;
					font-size: 14px;
					font-weight: 500;
					background: linear-gradient(135deg, #c0392b, #4a1024);
					border: none;
					color: #fff;
					text-decoration: none;
					transition: opacity 0.2s ease, transform 0.2s ease;
				}
				.dq-btn-gradient-trust:hover {
					opacity: 0.9;
					transform: translateY(-1px);
					color: #fff;
				}
			`}</style>
			<div className="dq-container">
				<div className="dq-why-trust">
					<div
						className="dq-video-thumb"
						style={{ backgroundImage: `url(/assets/img/home/video_image.webp)` }}
					>
						<button className="dq-play-btn" aria-label="Play video">▶</button>
					</div>

					<div className="dq-why-content">
						<h2>Why Millions Trust DiviniQ</h2>
						<div className="dq-why-list">
							{FEATURES.map((f) => (
								<div className="dq-why-item" key={f.title}>
									<span className="chk">✓</span>
									<div>
										<strong>{f.title}</strong>
										<p>{f.desc}</p>
									</div>
								</div>
							))}
						</div>
						<a href="/about_us" className="dq-btn-gradient-trust">Know More About Us</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhyTrustSection;