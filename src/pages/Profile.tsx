import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '@/hooks/useAuth';
import { membersApi } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Shield, ChevronDown, Check } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({ name: '', YOB: '', gender: 'true' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Gender dropdown state
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  // Animation refs
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [personalRef, personalInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [securityRef, securityInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const profile = await membersApi.getProfile();
        setProfileData({
          name: profile.name || '',
          YOB: profile.YOB?.toString() || '',
          gender: profile.gender === false ? 'false' : 'true',
        });
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Close gender dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setGenderDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      await membersApi.updateProfile({
        name: profileData.name,
        YOB: parseInt(profileData.YOB),
        gender: profileData.gender === 'true'
      });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
      } else {
        setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    try {
      await membersApi.changePassword(passData);
      setPassMsg({ type: 'success', text: 'Password changed successfully.' });
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPassMsg({ type: 'error', text: err.response?.data?.message || 'Incorrect password.' });
      } else {
        setPassMsg({ type: 'error', text: 'Incorrect password.' });
      }
    }
  };

  const handleGenderSelect = (value: string) => {
    setProfileData({...profileData, gender: value});
    setGenderDropdownOpen(false);
  };

  if (!user) return <Navigate to="/login" replace />;
  
  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
        <span className="text-xs tracking-[0.3em] uppercase text-neutral-400">Loading profile...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Header Section - Clean Light Design */}
      <div 
        ref={headerRef}
        className={`relative bg-white border-b border-neutral-200 py-16 md:py-20 overflow-hidden ${headerInView ? 'animate-slide-up' : 'opacity-0'}`}
      >
        {/* Subtle decorative accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#C9A86C] to-transparent opacity-60" />
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 bg-linear-to-br from-[#C9A86C] to-[#B89A5C] flex items-center justify-center text-white text-3xl md:text-4xl font-serif shadow-xl">
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-3">{profileData.name || 'Your Account'}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 text-neutral-600 text-xs tracking-wide">
                  <User size={12} />
                  Collector
                </span>
                {user?.isAdmin && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C9A86C]/10 text-[#B8974E] text-xs tracking-wide">
                    <Shield size={12} />
                    Administrator
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Personal Details */}
          <div 
            ref={personalRef}
            className={`bg-white shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden ${personalInView ? 'animate-slide-in-left animate-delay-200' : 'opacity-0'}`}
          >
            {/* Card Header */}
            <div className="bg-linear-to-r from-neutral-50 to-white px-8 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-black">Personal Details</h2>
              </div>
            </div>
            
            <div className="p-8">
              {profileMsg.text && (
                <div className={`p-4 mb-6 text-xs tracking-wide text-center border flex items-center justify-center gap-2 ${profileMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {profileMsg.type === 'success' && <Check size={14} />}
                  {profileMsg.text}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Full Name</label>
                  <Input 
                    required 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="h-12 px-4 border border-neutral-200 focus-visible:ring-0 focus-visible:border-black rounded-none bg-neutral-50 text-black text-sm transition-colors hover:border-neutral-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Year of Birth</label>
                    <Input 
                      type="number" 
                      min="1900" max="2026" required 
                      value={profileData.YOB}
                      onChange={(e) => setProfileData({...profileData, YOB: e.target.value})}
                      className="h-12 px-4 border border-neutral-200 focus-visible:ring-0 focus-visible:border-black rounded-none bg-neutral-50 text-black text-sm transition-colors hover:border-neutral-300"
                    />
                  </div>
                  
                  {/* Gender Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Gender</label>
                    <div className="relative" ref={genderDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
                        className="h-12 w-full px-4 border border-neutral-200 rounded-none bg-neutral-50 text-black text-sm flex items-center justify-between cursor-pointer transition-colors hover:border-neutral-300 focus:border-black focus:outline-none"
                      >
                        <span>{profileData.gender === 'true' ? 'Male' : 'Female'}</span>
                        <ChevronDown 
                          size={16} 
                          className={`text-neutral-400 transition-transform duration-200 ${genderDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className={`absolute left-0 right-0 top-full mt-1 bg-white border border-neutral-200 shadow-lg z-50 transition-all duration-200 origin-top ${genderDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                        <button
                          type="button"
                          onClick={() => handleGenderSelect('true')}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between cursor-pointer transition-colors ${profileData.gender === 'true' ? 'bg-neutral-100 text-black font-medium' : 'text-neutral-600 hover:bg-neutral-50'}`}
                        >
                          <span>Male</span>
                          {profileData.gender === 'true' && <Check size={14} className="text-black" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenderSelect('false')}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between cursor-pointer transition-colors border-t border-neutral-100 ${profileData.gender === 'false' ? 'bg-neutral-100 text-black font-medium' : 'text-neutral-600 hover:bg-neutral-50'}`}
                        >
                          <span>Female</span>
                          {profileData.gender === 'false' && <Check size={14} className="text-black" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-neutral-800 transition-all rounded-none shadow-lg shadow-neutral-300/50 hover:shadow-xl hover:shadow-neutral-300/50 hover:-translate-y-0.5">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>

          {/* Security */}
          <div 
            ref={securityRef}
            className={`bg-white shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden ${securityInView ? 'animate-slide-in-right animate-delay-300' : 'opacity-0'}`}
          >
            {/* Card Header */}
            <div className="bg-linear-to-r from-neutral-50 to-white px-8 py-5 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-[#C9A86C] to-[#B89A5C] flex items-center justify-center">
                  <Shield size={14} className="text-white" />
                </div>
                <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-black">Security</h2>
              </div>
            </div>
            
            <div className="p-8">
              {passMsg.text && (
                <div className={`p-4 mb-6 text-xs tracking-wide text-center border flex items-center justify-center gap-2 ${passMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {passMsg.type === 'success' && <Check size={14} />}
                  {passMsg.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Current Password</label>
                  <div className="relative group">
                    <Input 
                      type={showOldPass ? "text" : "password"} 
                      required 
                      value={passData.oldPassword}
                      onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                      className="h-12 px-4 pr-12 border border-neutral-200 focus-visible:ring-0 focus-visible:border-black rounded-none bg-neutral-50 text-black text-sm transition-colors hover:border-neutral-300"
                    />
                    <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer transition-colors">
                      {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">New Password</label>
                  <div className="relative group">
                    <Input 
                      type={showNewPass ? "text" : "password"} 
                      required 
                      value={passData.newPassword}
                      onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                      className="h-12 px-4 pr-12 border border-neutral-200 focus-visible:ring-0 focus-visible:border-black rounded-none bg-neutral-50 text-black text-sm transition-colors hover:border-neutral-300"
                    />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer transition-colors">
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="outline" className="w-full h-14 text-xs tracking-[0.2em] uppercase border-2 border-black text-black hover:bg-black hover:text-white transition-all rounded-none hover:-translate-y-0.5">
                  Update Password
                </Button>
              </form>
              
              {/* Security tip */}
              <div className="mt-8 p-4 bg-neutral-50 border border-neutral-100">
                <p className="text-[10px] tracking-wide text-neutral-400 leading-relaxed">
                  <span className="text-neutral-600 font-medium">Security Tip:</span> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
