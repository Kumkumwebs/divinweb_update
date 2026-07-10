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

const ChadhavaSection = ({ chadhava }) => {
	const rawItems = chadhava?.length ? chadhava : null;
	const items = rawItems
		? rawItems.map((c) => ({
				id: c._id,
				name: c.title,
				temple: c.templeName,
				image: c.chadhavaImage || PLACEHOLDER,
				price: c.price,
		  }))
		: FALLBACK_ITEMS.map((c) => ({ ...c, image: c.image || PLACEHOLDER }));

	return (
		<section className="dq-section dq-section-cream">
			<div className="dq-container">
				<div className="dq-section-head-row">
					<h2>Sacred Chadhava Delivered with Devotion</h2>
					<a href="/chadhava">Explore Chadhava</a>
				</div>

				<div className="dq-chadhava-grid">
					{items.map((item) => (
						<a
							href={`/chadhava/${item.id}`}
							className="dq-chadhava-item"
							key={item.id || item.name}
						>
							<div className="dq-chadhava-img-wrap">
								<img
									src={item.image}
									alt={item.name}
									loading="lazy"
									onError={handleImgError}
								/>
								<span className="dq-chadhava-price">
									{item.price > 0 ? `₹${item.price}` : 'Free Seva'}
								</span>
							</div>
							<div className="dq-chadhava-info">
								<span className="dq-chadhava-name" title={item.name}>{item.name}</span>
								{item.temple && (
									<small className="dq-chadhava-temple">{item.temple}</small>
								)}
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
};

export default ChadhavaSection;