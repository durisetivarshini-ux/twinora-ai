import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Camera, 
  Save, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Field({ label, value, onChange, type = 'text', disabled, placeholder }) {
  return (
    <div>
      <label className="section-label mb-1.5 block">{label}</label>
      <input 
        type={type} 
        value={value || ''} 
        onChange={e => onChange?.(e.target.value)} 
        disabled={disabled}
        className="input" 
        placeholder={placeholder || `Enter ${label.toLowerCase()}…`} 
      />
    </div>
  );
}

export default function Profile() {
  const { user, merchant, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    businessName: '',
    businessCategory: '',
    location: '',
    timezone: '',
    avatarUrl: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'Store Owner',
        businessName: user.businessName || merchant?.businessName || 'NovaCart Electronics',
        businessCategory: user.businessCategory || merchant?.businessCategory || 'D2C Retail & Electronics',
        location: user.location || 'San Francisco, CA',
        timezone: user.timezone || 'Asia/Kolkata',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user, merchant]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveSuccess(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setFormData(prev => ({ ...prev, avatarUrl: base64Data }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      if (updateProfile) {
        await updateProfile(formData);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="page-canvas space-y-4 max-w-[860px]">
      {/* Header */}
      <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Operator Profile</h1>
          <p className="page-subtitle">Manage your authenticated account identity, permissions, and business settings.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDFAF5] border border-[#BBF7D0] text-[11.5px] font-semibold text-[#05875F] self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Authenticated Account</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#FEF1F1] border border-[#FECACA] text-[#D92E2E] text-[12.5px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="fade-up fade-up-delay-1 panel p-6 space-y-6">
        
        {/* Avatar & Header Identity */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-[#E4E7ED]">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-[22px] text-white bg-gradient-to-br from-[#4F52E8] to-[#12B5C6] shadow-md border-2 border-white overflow-hidden">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(formData.fullName)
              )}
            </div>

            <label className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white border border-[#E4E7ED] text-[#4F52E8] hover:bg-[#EEF0FF] cursor-pointer shadow-sm transition-all">
              <Camera className="w-3.5 h-3.5" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-[18px] font-bold text-[#0E1117]">{formData.fullName || 'Business Operator'}</h2>
            <p className="text-[12.5px] text-[#4F52E8] font-semibold">{formData.email}</p>
            <p className="text-[12px] text-[#9BA3B0]">{formData.role} · {formData.businessName}</p>
          </div>
        </div>

        {/* Personal Details */}
        <div>
          <h3 className="text-[14px] font-bold text-[#0E1117] mb-3">Personal Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={formData.fullName} onChange={v => handleChange('fullName', v)} />
            <Field label="Email Address" value={formData.email} disabled />
            <Field label="Phone Number" value={formData.phone} onChange={v => handleChange('phone', v)} placeholder="+91 98765 43210" />
            <Field label="Role / Title" value={formData.role} onChange={v => handleChange('role', v)} />
          </div>
        </div>

        {/* Business Profile */}
        <div className="pt-2 border-t border-[#E4E7ED]">
          <h3 className="text-[14px] font-bold text-[#0E1117] mb-3">Business Profile</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Business Name" value={formData.businessName} onChange={v => handleChange('businessName', v)} />
            <Field label="Industry Category" value={formData.businessCategory} onChange={v => handleChange('businessCategory', v)} />
            <Field label="Location" value={formData.location} onChange={v => handleChange('location', v)} />
            <div>
              <label className="section-label mb-1.5 block">Timezone</label>
              <select 
                value={formData.timezone} 
                onChange={e => handleChange('timezone', e.target.value)} 
                className="input"
              >
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">GMT / London</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="pt-4 border-t border-[#E4E7ED] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {saveSuccess && (
                <motion.span 
                  initial={{ opacity: 0, x: -4 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-[12.5px] text-[#05875F] font-semibold"
                >
                  <Check className="w-4 h-4" /> Changes saved successfully
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary !h-10 px-5 text-[13px] gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
