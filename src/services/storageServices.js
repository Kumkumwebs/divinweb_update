// --- Utility: Sanitize input to prevent XSS ---
const sanitize = value => {
	if (typeof value !== 'string') return value;
	return value
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
};

// --- Utility: Safe JSON parse ---
const safeJsonParse = (value, fallback = null) => {
	if (!value || value === 'undefined') return fallback;
	try {
		return JSON.parse(value);
	} catch (e) {
		console.error('storageService: JSON parse error', e);
		return fallback;
	}
};

const storageService = {
	setToken: token => {
		const sanitized = sanitize(token);
		if (sanitized) {
			localStorage.setItem('token', sanitized);
		} else {
			localStorage.removeItem('token');
		}
	},
	getToken: () => localStorage.getItem('token'),

	setUser: user => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
	},
	getUser: () => safeJsonParse(localStorage.getItem('user')),

	clear: () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		sessionStorage.clear();
	},
};

export default storageService;
