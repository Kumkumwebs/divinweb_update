import '../../pages/home.css';

const FALLBACK_ITEMS = [
	{ id: 1, name: 'Mahakal Chadhava', temple: '', image: '', price: 751 },
	{ id: 2, name: 'Kashi Vishwanath Chadhava', temple: '', image: '', price: 651 },
	{ id: 3, name: 'Ayodhya Ram Mandir Chadhava', temple: '', image: '', price: 551 },
	{ id: 4, name: 'Khatu Shyam Chadhava', temple: '', image: '', price: 499 },
	{ id: 5, name: 'Vaishno Devi Chadhava', temple: '', image: '', price: 651 },
	{ id: 6, name: 'Tirupati Balaji Chadhava', temple: '', image: '', price: 601 },
];

// Inline SVG Om placeholder — no network request, so it can't fail/loop.
const PLACEHOLDER =
	"data:image/svg+xml;charset=UTF-8," +
	encodeURIComponent(`
		<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
			<rect width="400" height="300" fill="#f5ede0"/>
			<text x="50%" y="52%" font-size="130" text-anchor="middle" dominant-baseline="middle" fill="#c9962f" font-family="serif">ॐ</text>
		</svg>
	`);

const handleImgError = (e) => {
	const img = e.currentTarget;
	if (img.dataset.fallback === 'done') return;
	img.dataset.fallback = 'done';
	img.src = PLACEHOLDER;
};

// API still returns some image URLs hosted on the old domain — rewrite to the current one.
const fixImgHost = (url) =>
	typeof url === 'string' ? url.replace('admin.astrogurujii.com', 'admin.vaidikguru.com') : url;

const ChadhavaSection = ({ chadhava }) => {
	const rawItems = chadhava?.length ? chadhava : null;

	// Only webImage counts as a "real" image now — it's the field
	// specifically meant for this (web) listing. Records without it fall
	// straight to the placeholder, even if chadhavaImage/bannerImages etc.
	// are populated.
	const hasRealImage = (c) => Boolean(c.webImage);

	// Items with a real image show first; items without one (which would
	// otherwise render the placeholder) sink to the bottom. Within each
	// group, most recently added Chadhava comes first.
	const sortedItems = rawItems
		? [...rawItems].sort((a, b) => {
			const aHasImg = hasRealImage(a);
			const bHasImg = hasRealImage(b);
			if (aHasImg !== bHasImg) return aHasImg ? -1 : 1;

			const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
			const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
			if (dateB !== dateA) return dateB - dateA;
			return (b._id || '').localeCompare(a._id || '');
		})
		: null;

	const items = sortedItems
		? sortedItems.map((c) => ({
			id: c._id,
			name: c.title,
			temple: c.templeName,
			// webImage only — no fallback chain to chadhavaImage /
			// bannerImages / etc. Records without webImage show the
			// placeholder. Still run through fixImgHost in case webImage
			// itself ever comes back on the old domain.
			image: fixImgHost(c.webImage) || PLACEHOLDER,
			price: c.price,
		}))
		: FALLBACK_ITEMS.map((c) => ({ ...c, image: c.image || PLACEHOLDER }));

	return (
		<section className="dq-section dq-section-cream">
			<style>{`
				.dq-btn-gradient {
					display: block;
					width: 100%;
					box-sizing: border-box;
					background: linear-gradient(135deg, #c0392b, #4a1024);
					color: #fff;
					border: none;
					padding: 10px 32px;
					text-align: center;
					transition: opacity 0.2s ease, transform 0.2s ease;
				}
				.dq-btn-gradient:hover {
					opacity: 0.9;
					transform: translateY(-1px);
					color: #fff;
				}

				/* ── Equal-height cards ──
				   home.css's .dq-puja-card sizes to its own content, so a
				   2-line title (or a missing temple line / "Free Seva" vs a
				   priced item) made cards in the same row different heights.
				   Scoped to this section (.dq-section-cream) only, so the Puja
				   section elsewhere on the page isn't affected. The column,
				   card, and body all stretch to fill the row height via flex;
				   the title is clamped to a fixed 2-line box so short/long
				   names take up the same space either way; and the price +
				   button footer is pinned to the bottom with margin-top: auto
				   so "Book Now" lines up across every card in the row. */
				.dq-section-cream .row.g-md-5.g-3 {
					align-items: stretch;
				}
				.dq-section-cream .row > [class*="col-"] {
					display: flex;
				}
				.dq-section-cream .dq-puja-card {
					display: flex;
					flex-direction: column;
					width: 100%;
					height: 100%;
				}
				.dq-section-cream .dq-puja-card img {
					flex-shrink: 0;
				}
				.dq-section-cream .dq-puja-body {
					display: flex;
					flex-direction: column;
					flex: 1 1 auto;
				}
				.dq-section-cream .dq-puja-body h4 {
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					min-height: 2.6em;
				}
				.dq-section-cream .dq-puja-sub {
					min-height: 1.4em;
				}
				.dq-section-cream .dq-puja-footer {
					margin-top: auto;
					padding-top: 12px;
				}
			`}</style>
			<div className="dq-container">
				<div className="dq-section-head-row">
					<h2>Sacred Chadhava Delivered with Devotion</h2>
					<a href="/chadhava">Explore Chadhava</a>
				</div>

				{/* Same card markup/classes as PujaListSection's dq-puja-card —
				    reusing dq-puja-card / dq-puja-body / dq-puja-footer /
				    dq-puja-price from home.css directly, so this card is
				    structurally and visually identical to the Puja card
				    (fixed 130px image height, same padding, same price+button
				    footer layout) rather than the old custom dq-chadhava-*
				    styling. */}
				<div className="row g-md-5 g-3">
					{items.map((item) => (
						<div key={item.id} className="col-12 col-md-6 col-lg-4">
							<a href={`/chadhava/${item.id}`} className="dq-puja-card">
								<img
									src={item.image}
									alt={item.name}
									loading="lazy"
									onError={handleImgError}
								/>
								<div className="dq-puja-body">
									<h4>{item.name}</h4>
									{item.temple && <div className="dq-puja-sub">{item.temple}</div>}
									<div className="dq-puja-footer" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
										<span className="dq-puja-price">
											{item.price > 0 ? `₹${item.price}` : 'Free Seva'}
										</span>
										<span className="dq-btn dq-btn-sm dq-btn-gradient">Book Now</span>
									</div>
								</div>
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ChadhavaSection;