import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiServices';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TestimonialSection from '../components/sections/TestimonialSection';
import ScrollTop from '../components/common/ScrollTop';
import SideMenu from '../components/layout/SideMenu';
import PopupSearch from '../components/layout/PopupSearch';
import MobileMenu from '../components/layout/MobileMenu';
import './astrooger.css'
const AstrologerRegistration = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [animateKey, setAnimateKey] = useState(0);
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [skills, setSkills] = useState([]);
    const [countries, setCountries] = useState([]);

    const [formData, setFormData] = useState({
        email: "", name: "", displayname: "", number: "", password: "",
        about: "", experience: "", address: "", country_id: "", state_id: "",
        city_id: "", language: "", skill: "", category: "", report_type: "",
        dob: "", gender: "Male", account_type: "Saving", account_holder_name: "",
        account_no: "", bank: "", ifsc: "", aadhar_card_no: "",
        is_chat: "off", is_voice_call: "off", is_video_call: "off",
        per_min_chat: 0, per_min_voice_call: 0, per_min_video_call: 0,
        contact_no2: "", working: "", pincode: "", pan_card: "", gst: "", bio: "",
        deviceType: "Web", deviceID: "Web_Portal", deviceToken: "Web_Token",
        profile_img: null, aadhar_card_img: null, pan_card_img: null
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catRes, langRes, skillRes, countryRes] = await Promise.all([
                    apiService.post('astrologer_api/category_list', {}),
                    apiService.post('astrologer_api/language_list', {}),
                    apiService.post('astrologer_api/skill_list', {}),
                    apiService.post('astrologer_api/location_list', {})
                ]);

                if (catRes.status) setCategories(catRes.results);
                if (langRes.status) setLanguages(langRes.results);
                if (skillRes.status) setSkills(skillRes.results);
                if (countryRes.status) setCountries(countryRes.results);
            } catch (err) {
                console.error("API load failed", err);
            }
        };
        fetchMetadata();
    }, []);

    const toggleMultiSelect = (field, value) => {
        const current = formData[field] ? formData[field].split(', ').filter(v => v !== "") : [];
        let updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setFormData(prev => ({ ...prev, [field]: updated.join(', ') }));

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked ? "on" : "off" }));
        } else if (type === "file") {
            setFormData(prev => ({ ...prev, [name]: files ? files[0] : null }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};

        switch (currentStep) {
            case 1:
                if (!formData.name.trim()) newErrors.name = 'Full name is required';
                if (!formData.displayname.trim()) newErrors.displayname = 'Display name is required';
                if (!formData.email.trim()) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
                if (!formData.number.trim()) newErrors.number = 'Mobile number is required';
                else if (!/^\d{10}$/.test(formData.number)) newErrors.number = 'Mobile number must be 10 digits';
                if (!formData.password.trim()) newErrors.password = 'Password is required';
                else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
                break;

            case 2:
                if (!formData.category.trim()) newErrors.category = 'Please select at least one category';
                if (!formData.skill.trim()) newErrors.skill = 'Please select at least one skill';
                if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
                if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
                break;

            case 3:
                if (formData.is_chat === 'on' && (!formData.per_min_chat || formData.per_min_chat <= 0)) {
                    newErrors.per_min_chat = 'Chat rate is required';
                }
                if (formData.is_voice_call === 'on' && (!formData.per_min_voice_call || formData.per_min_voice_call <= 0)) {
                    newErrors.per_min_voice_call = 'Voice call rate is required';
                }
                if (formData.is_video_call === 'on' && (!formData.per_min_video_call || formData.per_min_video_call <= 0)) {
                    newErrors.per_min_video_call = 'Video call rate is required';
                }
                if (formData.is_chat === 'off' && formData.is_voice_call === 'off' && formData.is_video_call === 'off') {
                    newErrors.services = 'Please enable at least one service';
                }
                break;

            case 4:
                if (!formData.account_holder_name.trim()) newErrors.account_holder_name = 'Account holder name is required';
                if (!formData.bank.trim()) newErrors.bank = 'Bank name is required';
                if (!formData.account_no.trim()) newErrors.account_no = 'Account number is required';
                if (!formData.ifsc.trim()) newErrors.ifsc = 'IFSC code is required';
                if (!formData.pan_card.trim()) newErrors.pan_card = 'PAN card number is required';
                if (!formData.aadhar_card_no.trim()) newErrors.aadhar_card_no = 'Aadhar card number is required';
                break;

            case 5:
                if (!formData.profile_img) newErrors.profile_img = 'Profile photo is required';
                if (!formData.aadhar_card_img) newErrors.aadhar_card_img = 'Aadhar copy is required';
                if (!formData.pan_card_img) newErrors.pan_card_img = 'PAN copy is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
            setAnimateKey(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(5)) return;

        setLoading(true);
        const data = new FormData();

        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });

        try {
            const res = await apiService.postMultipart('astrologer_api/astrologer_register', data);
            if (res.status) {
                alert('Registration successful! Your application has been submitted.');
            } else {
                alert(res.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stepTitles = ['Identity', 'Expertise', 'Rates', 'Payouts', 'KYC'];

    return (
        <div className="main-wrapper">
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
                onLoginClick={() => setShowLoginModal(true)}
            />
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
                <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .step-content {
          animation: fadeInSlide 0.3s ease-out;
        }
      `}</style>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Join the <span className="text-indigo-600">Divine Lineage</span>
                        </h1>
                        <p className="text-gray-600">Expert Portal Registration</p>
                    </div>

                    {/* <div className="flex justify-between items-center mb-12 max-w-3xl mx-auto">
                        {stepTitles.map((title, index) => {
                            const stepNum = index + 1;
                            const isActive = step === stepNum;
                            const isCompleted = step > stepNum;

                            return (
                                <div key={stepNum} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${isCompleted ? 'bg-green-500 text-white' :
                                            isActive ? 'bg-indigo-600 text-white' :
                                                'bg-gray-200 text-gray-500'
                                            }`}>
                                            {isCompleted ? '✓' : stepNum}
                                        </div>
                                        <span className={`text-xs mt-2 ${isActive ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                                            {title}
                                        </span>
                                    </div>
                                    {stepNum < 5 && (
                                        <div className={`h-0.5 flex-1 mx-2 ${step > stepNum ? 'bg-green-500' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div> */}

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div key={animateKey} className="step-content">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Identity Verification</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                                name="name"
                                                onChange={handleChange}
                                                value={formData.name}
                                                placeholder="Enter your full name"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.displayname ? 'border-red-500' : 'border-gray-300'}`}
                                                name="displayname"
                                                onChange={handleChange}
                                                value={formData.displayname}
                                                placeholder="Name to display to clients"
                                            />
                                            {errors.displayname && <p className="text-red-500 text-sm mt-1">{errors.displayname}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                            <input
                                                type="email"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                name="email"
                                                onChange={handleChange}
                                                value={formData.email}
                                                placeholder="your.email@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                                            <input
                                                type="tel"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
                                                name="number"
                                                onChange={handleChange}
                                                value={formData.number}
                                                placeholder="10-digit mobile number"
                                                maxLength="10"
                                            />
                                            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                            <input
                                                type="password"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                                name="password"
                                                onChange={handleChange}
                                                value={formData.password}
                                                placeholder="Minimum 6 characters"
                                            />
                                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                                            <select
                                                name="gender"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                onChange={handleChange}
                                                value={formData.gender}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                name="dob"
                                                onChange={handleChange}
                                                value={formData.dob}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                            <select
                                                name="country_id"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                onChange={handleChange}
                                                value={formData.country_id}
                                            >
                                                <option value="">Select Country</option>
                                                {countries.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Professional Mastery</h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Categories *</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(c => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.category.includes(c.name)
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    onClick={() => toggleMultiSelect('category', c.name)}
                                                >
                                                    {c.name}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Languages *</label>
                                        <div className="flex flex-wrap gap-2">
                                            {languages.map(l => (
                                                <button
                                                    key={l.id}
                                                    type="button"
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.language.includes(l.name)
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    onClick={() => toggleMultiSelect('language', l.name)}
                                                >
                                                    {l.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Skills *</label>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map(s => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.skill.includes(s.name)
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    onClick={() => toggleMultiSelect('skill', s.name)}
                                                >
                                                    {s.name}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.skill && <p className="text-red-500 text-sm mt-1">{errors.skill}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                                            <input
                                                type="number"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
                                                name="experience"
                                                onChange={handleChange}
                                                value={formData.experience}
                                                placeholder="Years of experience"
                                                min="0"
                                            />
                                            {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio *</label>
                                        <textarea
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
                                            name="bio"
                                            rows="4"
                                            onChange={handleChange}
                                            value={formData.bio}
                                            placeholder="Tell us about your expertise and approach..."
                                        />
                                        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Pricing & Rates</h2>
                                    {errors.services && <p className="text-red-500 text-sm mb-4">{errors.services}</p>}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-900">Chat Service</h3>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="is_chat"
                                                        onChange={handleChange}
                                                        checked={formData.is_chat === "on"}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                            <label className="block text-sm text-gray-700 mb-2">Rate per Minute (₹)</label>
                                            <input
                                                type="number"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.per_min_chat ? 'border-red-500' : 'border-gray-300'}`}
                                                name="per_min_chat"
                                                onChange={handleChange}
                                                value={formData.per_min_chat}
                                                disabled={formData.is_chat === "off"}
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.per_min_chat && <p className="text-red-500 text-sm mt-1">{errors.per_min_chat}</p>}
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-900">Voice Call</h3>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="is_voice_call"
                                                        onChange={handleChange}
                                                        checked={formData.is_voice_call === "on"}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                            <label className="block text-sm text-gray-700 mb-2">Rate per Minute (₹)</label>
                                            <input
                                                type="number"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.per_min_voice_call ? 'border-red-500' : 'border-gray-300'}`}
                                                name="per_min_voice_call"
                                                onChange={handleChange}
                                                value={formData.per_min_voice_call}
                                                disabled={formData.is_voice_call === "off"}
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.per_min_voice_call && <p className="text-red-500 text-sm mt-1">{errors.per_min_voice_call}</p>}
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-900">Video Call</h3>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="is_video_call"
                                                        onChange={handleChange}
                                                        checked={formData.is_video_call === "on"}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                            <label className="block text-sm text-gray-700 mb-2">Rate per Minute (₹)</label>
                                            <input
                                                type="number"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.per_min_video_call ? 'border-red-500' : 'border-gray-300'}`}
                                                name="per_min_video_call"
                                                onChange={handleChange}
                                                value={formData.per_min_video_call}
                                                disabled={formData.is_video_call === "off"}
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.per_min_video_call && <p className="text-red-500 text-sm mt-1">{errors.per_min_video_call}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.account_holder_name ? 'border-red-500' : 'border-gray-300'}`}
                                                name="account_holder_name"
                                                onChange={handleChange}
                                                value={formData.account_holder_name}
                                                placeholder="As per bank records"
                                            />
                                            {errors.account_holder_name && <p className="text-red-500 text-sm mt-1">{errors.account_holder_name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.bank ? 'border-red-500' : 'border-gray-300'}`}
                                                name="bank"
                                                onChange={handleChange}
                                                value={formData.bank}
                                                placeholder="Enter bank name"
                                            />
                                            {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.account_no ? 'border-red-500' : 'border-gray-300'}`}
                                                name="account_no"
                                                onChange={handleChange}
                                                value={formData.account_no}
                                                placeholder="Bank account number"
                                            />
                                            {errors.account_no && <p className="text-red-500 text-sm mt-1">{errors.account_no}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.ifsc ? 'border-red-500' : 'border-gray-300'}`}
                                                name="ifsc"
                                                onChange={handleChange}
                                                value={formData.ifsc}
                                                placeholder="11-digit IFSC code"
                                            />
                                            {errors.ifsc && <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                                            <select
                                                name="account_type"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                onChange={handleChange}
                                                value={formData.account_type}
                                            >
                                                <option value="Saving">Saving</option>
                                                <option value="Current">Current</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Number *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.pan_card ? 'border-red-500' : 'border-gray-300'}`}
                                                name="pan_card"
                                                onChange={handleChange}
                                                value={formData.pan_card}
                                                placeholder="10-character PAN"
                                                maxLength="10"
                                            />
                                            {errors.pan_card && <p className="text-red-500 text-sm mt-1">{errors.pan_card}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Number *</label>
                                            <input
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.aadhar_card_no ? 'border-red-500' : 'border-gray-300'}`}
                                                name="aadhar_card_no"
                                                onChange={handleChange}
                                                value={formData.aadhar_card_no}
                                                placeholder="12-digit Aadhar number"
                                                maxLength="12"
                                            />
                                            {errors.aadhar_card_no && <p className="text-red-500 text-sm mt-1">{errors.aadhar_card_no}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number (Optional)</label>
                                            <input
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                name="gst"
                                                onChange={handleChange}
                                                value={formData.gst}
                                                placeholder="GST number if applicable"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Secure Verification</h2>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo *</label>
                                            <input
                                                type="file"
                                                name="profile_img"
                                                onChange={handleChange}
                                                accept="image/*"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.profile_img ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.profile_img && <p className="text-red-500 text-sm mt-1">{errors.profile_img}</p>}
                                            <p className="text-gray-500 text-sm mt-1">Upload a clear photo of yourself</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card Copy *</label>
                                            <input
                                                type="file"
                                                name="aadhar_card_img"
                                                onChange={handleChange}
                                                accept="image/*,application/pdf"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.aadhar_card_img ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.aadhar_card_img && <p className="text-red-500 text-sm mt-1">{errors.aadhar_card_img}</p>}
                                            <p className="text-gray-500 text-sm mt-1">Upload scanned copy of your Aadhar card</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card Copy *</label>
                                            <input
                                                type="file"
                                                name="pan_card_img"
                                                onChange={handleChange}
                                                accept="image/*,application/pdf"
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.pan_card_img ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            {errors.pan_card_img && <p className="text-red-500 text-sm mt-1">{errors.pan_card_img}</p>}
                                            <p className="text-gray-500 text-sm mt-1">Upload scanned copy of your PAN card</p>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                                        <p className="text-sm text-blue-800">
                                            <strong>Privacy Notice:</strong> All documents are encrypted and stored securely.
                                            They will only be used for verification purposes and will not be shared with third parties.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-10">
                            {step > 1 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                                >
                                    Back
                                </button>
                            )}

                            {step < 5 ? (
                                <button
                                    onClick={handleNext}
                                    className="ml-auto px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`ml-auto px-6 py-3 rounded-lg text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                >
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <TestimonialSection />
            <Footer />
            <ScrollTop />
        </div>
    )
}



export default AstrologerRegistration;