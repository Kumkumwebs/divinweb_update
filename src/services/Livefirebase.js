/**
 * liveFirebase.js
 *
 * Initializes Firebase (v9 modular) and exports the Realtime Database instance
 * used by the chat screen (Group/...) and the billing timer (CallSession/...).
 *
 * Requires the `firebase` package:  npm i firebase
 *
 * Config comes from liveConfig.js — fill FIREBASE_CONFIG there with DivinIq's
 * real project, otherwise messages will not sync with the astrologer app.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// import { FIREBASE_CONFIG } from '../config/liveConfig';
import { FIREBASE_CONFIG } from './Liveconfig';

// Guard against double-init during hot reload / multiple imports.
const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);

export const db = getDatabase(app);
export default app;