import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserDetailsModal.css';

/**
 * UserDetailsModal — collect birth details before connecting
 * Props:
 *  - isOpen     boolean
 *  - onClose    fn
 *  - astrologer { name, profile_img }
 *  - mode       'chat' | 'call'
 *  - onSubmit   fn(details)  -> proceeds to connect
 *  - initial    optional prefilled values
 */
const UserDetailsModal = ({
  isOpen, onClose, astrologer = {}, mode = 'chat', onSubmit, initial = {},
}) => {
  const [form, setForm] = useState({
    name:       initial.name       || '',
    gender:     initial.gender     || '',
    dob:        initial.dob        || '',
    tob:        initial.tob        || '',
    birthPlace: initial.birthPlace || '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name = 'Please enter your name';
    if (!form.gender)            e.gender = 'Select gender';
    if (!form.dob)               e.dob = 'Date of birth is required';
    if (!form.birthPlace.trim()) e.birthPlace = 'Birth place is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit && onSubmit(form);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="ud-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div className="ud-box"
            initial={{ opacity: 0, scale: .94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .94, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={e => e.stopPropagation()}>

            <button className="ud-close" onClick={onClose}><i className="fas fa-times" /></button>

            {/* Header */}
            <div className="ud-head">
              <div className="ud-head-ico"><i className="fas fa-user-edit" /></div>
              <div>
                <div className="ud-title">Fill Your Details</div>
                <div className="ud-sub">
                  Share your birth details to start your {mode === 'call' ? 'call' : 'chat'} with{' '}
                  <strong>{astrologer.name || 'the astrologer'}</strong>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="ud-form">

              {/* Name */}
              <div className="ud-field">
                <label className="ud-label">Full Name <span>*</span></label>
                <input
                  className={`ud-input${errors.name ? ' err' : ''}`}
                  type="text" placeholder="Enter your full name"
                  value={form.name} onChange={e => set('name', e.target.value)}
                />
                {errors.name && <span className="ud-err">{errors.name}</span>}
              </div>

              {/* Gender */}
              <div className="ud-field">
                <label className="ud-label">Gender <span>*</span></label>
                <div className="ud-gender">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} type="button"
                      className={`ud-gender-btn${form.gender === g ? ' active' : ''}`}
                      onClick={() => set('gender', g)}>
                      <i className={`fas fa-${g === 'Male' ? 'mars' : g === 'Female' ? 'venus' : 'genderless'}`} />
                      {g}
                    </button>
                  ))}
                </div>
                {errors.gender && <span className="ud-err">{errors.gender}</span>}
              </div>

              {/* DOB + TOB */}
              <div className="ud-row">
                <div className="ud-field">
                  <label className="ud-label">Date of Birth <span>*</span></label>
                  <input
                    className={`ud-input${errors.dob ? ' err' : ''}`}
                    type="date" value={form.dob} onChange={e => set('dob', e.target.value)}
                  />
                  {errors.dob && <span className="ud-err">{errors.dob}</span>}
                </div>
                <div className="ud-field">
                  <label className="ud-label">Time of Birth</label>
                  <input
                    className="ud-input"
                    type="time" value={form.tob} onChange={e => set('tob', e.target.value)}
                  />
                </div>
              </div>

              {/* Birth Place */}
              <div className="ud-field">
                <label className="ud-label">Birth Place <span>*</span></label>
                <input
                  className={`ud-input${errors.birthPlace ? ' err' : ''}`}
                  type="text" placeholder="City, State, Country"
                  value={form.birthPlace} onChange={e => set('birthPlace', e.target.value)}
                />
                {errors.birthPlace && <span className="ud-err">{errors.birthPlace}</span>}
              </div>

            </div>

            {/* Submit */}
            <button className="ud-submit" onClick={handleSubmit}>
              <i className={`fas fa-${mode === 'call' ? 'phone' : 'comment-dots'}`} />
              Start {mode === 'call' ? 'Call' : 'Chat'}
            </button>

            <div className="ud-foot">
              <i className="fas fa-lock" /> Your details are private & secure
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;