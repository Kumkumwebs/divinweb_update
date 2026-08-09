import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --- Utility: Sanitize input to prevent XSS ---
const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// --- Utility: Deep sanitize object ---
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitize(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[sanitize(key)] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

// --- Utility: Safe JSON parse ---
const safeJsonParse = (value, fallback = null) => {
  if (!value || value === 'undefined') return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('StorageContext: JSON parse error', e);
    return fallback;
  }
};

// --- Context Creation ---
const StorageContext = createContext(null);

// --- Storage Keys ---
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  DEVOTEE_DETAILS: 'devoteeDetails',
  ACTIVE_CHADHAVA_ID: 'activeChadhavaId',
  ACTIVE_CART: 'activeCart',
};

// --- Provider Component ---
export const StorageProvider = ({ children }) => {
  console.log('[STORAGE BOOT]', {
    local_token: localStorage.getItem('token'),
    session_token: sessionStorage.getItem('token'),
    local_user: localStorage.getItem('user'),
    session_user: sessionStorage.getItem('user'),
  });
  // Initialize state from sessionStorage
  const [token, setTokenState] = useState(() => {
    const t = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN) || null;
    // keep both in sync on reload — apiServices reads localStorage,
    // Liveconfig.getToken() reads sessionStorage
    if (t) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, t);
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, t);
    }
    return t;
  });
const [user, setUserState] = useState(() => safeJsonParse(localStorage.getItem(STORAGE_KEYS.USER)));
  const [devoteeDetails, setDevoteeDetailsState] = useState(() => 
    safeJsonParse(sessionStorage.getItem(STORAGE_KEYS.DEVOTEE_DETAILS), { name: '', whatsapp: '' })
  );
  const [activeChadhavaId, setActiveChadhavaIdState] = useState(() => 
    sessionStorage.getItem(STORAGE_KEYS.ACTIVE_CHADHAVA_ID) || null
  );
  const [activeCart, setActiveCartState] = useState(() => 
    safeJsonParse(sessionStorage.getItem(STORAGE_KEYS.ACTIVE_CART))
  );

  // --- Setters with sessionStorage sync ---
  const setToken = useCallback((newToken) => {
    setTokenState(newToken || null);
    if (newToken) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }, []);

  // Supports both setUser(obj) and setUser(prev => obj) — Profile.jsx and
  // Header.jsx use the updater form. Persisting is done in the effect below
  // so JSON.stringify never receives a function (which produced the literal
  // string "undefined" in localStorage and logged the user out on refresh).
  const setUser = useCallback((newUser) => {
    setUserState((prev) => {
      const resolved = typeof newUser === 'function' ? newUser(prev) : newUser;
      if (!resolved) return resolved;
      const sanitized = sanitizeObject(resolved);
      // profile_img is a URL, not user-facing text — sanitizing it corrupts
      // the slashes and requires lossy workarounds to undo. Keep it raw.
      return { ...sanitized, profile_img: resolved.profile_img };
    });
  }, []);

  // Persist user whenever it changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error('StorageContext: failed to persist user', e);
    }
  }, [user]);

  const setDevoteeDetails = useCallback((newDetails) => {
    const sanitized = sanitizeObject(newDetails);
    setDevoteeDetailsState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.DEVOTEE_DETAILS, JSON.stringify(sanitized));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.DEVOTEE_DETAILS);
    }
  }, []);

  const setActiveChadhavaId = useCallback((newId) => {
    const sanitized = sanitize(newId);
    setActiveChadhavaIdState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.ACTIVE_CHADHAVA_ID, sanitized);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_CHADHAVA_ID);
    }
  }, []);

  const setActiveCart = useCallback((newCart) => {
    const sanitized = sanitizeObject(newCart);
    setActiveCartState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.ACTIVE_CART, JSON.stringify(sanitized));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_CART);
    }
  }, []);

  // --- Clear all storage ---
  const clearStorage = useCallback(() => {
    setTokenState(null);
    setUserState(null);
    setDevoteeDetailsState({ name: '', whatsapp: '' });
    setActiveChadhavaIdState(null);
    setActiveCartState(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.clear();
  }, []);

  // --- Context Value ---
  const value = {
		// State
		token,
		user,
		devoteeDetails,
		activeChadhavaId,
		activeCart,
		// Setters
		setToken,
		setUser,
		setDevoteeDetails,
		setActiveChadhavaId,
		setActiveCart,
		clearStorage,
		logout: clearStorage, // Alias for semantic usage
		// Helpers
		isLoggedIn: !!token,
	};

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

// --- Custom Hook ---
export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export default StorageContext;
