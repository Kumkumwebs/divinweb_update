import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import styles from './Profile.module.css';
import AuthService from '../services/authServices';

// Layout Components
import SideMenu from '../components/layout/SideMenu';
import PopupSearch from '../components/layout/PopupSearch';
import MobileMenu from '../components/layout/MobileMenu';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import LoginModal from '../components/common/LoginModal';

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser, logout } = useStorage();
    
    // Layout State
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const [profile, setProfile] = useState({
        country: '',
        country_code: '91',
        name: '',
        number: '',
        email: '',
        gender: '',
        dob: '',
        tob: '',
        pob: '',
        gotra: '',
        marital_status: '',
        profession: '',
        profile_for: '',
        refer_code_user: '',
    });

    // Fetch profile on mount
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.phone) {
                setLoading(false);
                return;
            }

            try {
                const response = await AuthService.getProfile({
                    number: user.phone,
                    country_code: user.country_code || '91',
                });

                if (response.success && response.profile) {
                    setProfile(response.profile);
                } else {
                    setError(response.message || 'Failed to load profile');
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            // Pass phone number from stored user data, not from editable form
            const response = await AuthService.updateProfile(
                { number: user?.phone, country_code: user?.country_code || '91' },
                profile
            );

            if (response.success) {
                setSuccessMessage(response.message);
                setIsEditing(false);
                // Update the user context with new name if changed
                if (profile.name !== user?.name) {
                    setUser({ ...user, name: profile.name });
                }
            } else {
                setError(response.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="main-wrapper">
            {/* Layout Components */}
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
            
            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
                onLoginClick={() => setShowLoginModal(true)}
            />

            {/* Breadcrumb Section */}
            <div className="breadcumb-wrapper" style={{ background: '#0f172a', padding: '100px 0' }}>
                <div className="container text-center">
                    <span className="sub-title style1 text-theme">Welcome Back</span>
                    <h1 className="breadcumb-title text-white">My <span className="text-theme">Profile</span></h1>
                </div>
            </div>

            {/* Profile Content Section */}
            <section className="space">
                <div className="container">
                    {loading ? (
                         <div className={styles.profileContainer}>
                            <div className={styles.profileCard}>
                                <div className={styles.loading}>Loading profile...</div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.profileContainer}>
                            <div className={styles.profileCard}>
                                <h2 className={styles.title}>
                                    {isEditing ? 'Edit Profile' : 'My Profile'}
                                </h2>

                                {error && <div className={styles.errorMessage}>{error}</div>}
                                {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                                    </div>

                                    <div className={styles.details}>
                                        {/* Name */}
                                        <div className={styles.detailItem}>
                                            <label>Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profile.name}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                    placeholder="Enter your name"
                                                />
                                            ) : (
                                                <p>{profile.name || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Phone Number */}
                                        <div className={styles.detailItem}>
                                            <label>Phone Number</label>
                                            <p>+{profile.country_code} {profile.number || 'Not available'}</p>
                                        </div>

                                        {/* Email */}
                                        <div className={styles.detailItem}>
                                            <label>Email</label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profile.email}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                    placeholder="Enter your email"
                                                />
                                            ) : (
                                                <p>{profile.email || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Gender */}
                                        <div className={styles.detailItem}>
                                            <label>Gender</label>
                                            {isEditing ? (
                                                <select
                                                    name="gender"
                                                    value={profile.gender}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                <p>{profile.gender || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Date of Birth */}
                                        <div className={styles.detailItem}>
                                            <label>Date of Birth</label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={profile.dob}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                />
                                            ) : (
                                                <p>{profile.dob || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Time of Birth */}
                                        <div className={styles.detailItem}>
                                            <label>Time of Birth</label>
                                            {isEditing ? (
                                                <input
                                                    type="time"
                                                    name="tob"
                                                    value={profile.tob}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                />
                                            ) : (
                                                <p>{profile.tob || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Place of Birth */}
                                        <div className={styles.detailItem}>
                                            <label>Place of Birth</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="pob"
                                                    value={profile.pob}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                    placeholder="Enter place of birth"
                                                />
                                            ) : (
                                                <p>{profile.pob || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Gotra */}
                                        <div className={styles.detailItem}>
                                            <label>Gotra</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="gotra"
                                                    value={profile.gotra}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                    placeholder="Enter your gotra"
                                                />
                                            ) : (
                                                <p>{profile.gotra || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Marital Status */}
                                        <div className={styles.detailItem}>
                                            <label>Marital Status</label>
                                            {isEditing ? (
                                                <select
                                                    name="marital_status"
                                                    value={profile.marital_status}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                >
                                                    <option value="">Select Status</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Divorced">Divorced</option>
                                                    <option value="Widowed">Widowed</option>
                                                </select>
                                            ) : (
                                                <p>{profile.marital_status || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Profession */}
                                        <div className={styles.detailItem}>
                                            <label>Profession</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="profession"
                                                    value={profile.profession}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                    placeholder="Enter your profession"
                                                />
                                            ) : (
                                                <p>{profile.profession || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Profile For */}
                                        <div className={styles.detailItem}>
                                            <label>Profile For</label>
                                            {isEditing ? (
                                                <select
                                                    name="profile_for"
                                                    value={profile.profile_for}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Self">Self</option>
                                                    <option value="Family">Family</option>
                                                    <option value="Friend">Friend</option>
                                                </select>
                                            ) : (
                                                <p>{profile.profile_for || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Country */}
                                        <div className={styles.detailItem}>
                                            <label>Country</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={profile.country}
                                                    onChange={handleInputChange}
                                                    className={styles.input}
                                                    placeholder="Enter your country"
                                                />
                                            ) : (
                                                <p>{profile.country || 'Not set'}</p>
                                            )}
                                        </div>

                                        {/* Referral Code */}
                                        <div className={styles.detailItem}>
                                            <label>Referral Code</label>
                                            <p>{profile.refer_code_user || 'Not set'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    {isEditing ? (
                                        <>
                                            <button 
                                                onClick={handleSave} 
                                                className={styles.saveButton}
                                                disabled={saving}
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button 
                                                onClick={handleCancel} 
                                                className={styles.cancelButton}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => setIsEditing(true)} 
                                                className={styles.editButton}
                                            >
                                                Edit Profile
                                            </button>
                                            <button onClick={() => { logout(); navigate('/'); }} className={styles.logoutButton}>
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
            <ScrollTop />
            
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
};

export default Profile;
