import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '@/hooks/useAuth';
import { membersApi } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // On-visit animations
  const [headerRef, headerInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [leftRef, leftInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [rightRef, rightInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Profile Form State
  const [profileData, setProfileData] = useState({ name: '', YOB: '', gender: 'true' });
  const [originalProfileData, setOriginalProfileData] = useState({ name: '', YOB: '', gender: 'true' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password Form State
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  // Fetch current user data on load
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const profile = await membersApi.getProfile();
        const data = {
          name: profile.name || '',
          YOB: profile.YOB?.toString() || '',
          gender: profile.gender === false ? 'false' : 'true',
        };
        setProfileData(data);
        setOriginalProfileData(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Handle Profile Update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      await membersApi.updateProfile({
        name: profileData.name,
        YOB: parseInt(profileData.YOB),
        gender: profileData.gender === 'true'
      });
      setProfileMsg({ type: 'success', text: 'Personal details updated successfully.' });
      setOriginalProfileData(profileData);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
      } else {
        setProfileMsg({ type: 'error', text: 'Failed to update profile.' });
      }
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    try {
      await membersApi.changePassword(passData);
      setPassMsg({ type: 'success', text: 'Password changed successfully.' });
      setPassData({ oldPassword: '', newPassword: '' }); // Clear form
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPassMsg({ type: 'error', text: err.response?.data?.message || 'Incorrect old password.' });
      } else {
        setPassMsg({ type: 'error', text: 'Incorrect old password.' });
      }
    }
  };

  // Check if profile data has changed
  const profileHasChanges = profileData.name !== originalProfileData.name || 
                            profileData.YOB !== originalProfileData.YOB || 
                            profileData.gender !== originalProfileData.gender;

  // Check if password fields are filled
  const passwordHasChanges = passData.oldPassword.length > 0 && passData.newPassword.length > 0;

  // Protect this route: If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;
  
  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif text-xl tracking-widest text-gray-400 animate-pulse">Loading Maison Aura...</div>;

  return (
    <div className="min-h-screen bg-white pb-24 pt-12">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Page Header */}
        <div ref={headerRef} className="border-b border-gray-200 pb-8 mb-12">
          <h1 className={`text-4xl font-serif text-primary mb-2 ${headerInView ? 'animate-slide-up' : 'opacity-0'}`}>My Maison</h1>
          <p className={`text-sm tracking-widest uppercase text-gray-500 ${headerInView ? 'animate-fade-in animate-delay-200' : 'opacity-0'}`}>Manage your account preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {/* LEFT COLUMN: Personal Details */}
          <div ref={leftRef} className={`bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.06)] transition-shadow duration-500 ${leftInView ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-8 text-black">Personal Details</h2>
            
            {profileMsg.text && (
              <div className={`p-3 mb-6 text-xs tracking-wide text-center border ${profileMsg.type === 'success' ? 'bg-[#F9F1D8]/30 border-[#D4AF37]/50 text-[#8B6508]' : 'bg-red-50 border-red-100 text-red-800'}`}>
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-8">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Full Name</label>
                <Input 
                  required 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="h-10 px-0 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Year of Birth</label>
                  <Input 
                    type="number" 
                    min="1900" max="2026" required 
                    value={profileData.YOB}
                    onChange={(e) => setProfileData({...profileData, YOB: e.target.value})}
                    className="h-10 px-0 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Gender</label>
                  <Select 
                    value={profileData.gender}
                    onValueChange={(value) => setProfileData({...profileData, gender: value})}
                  >
                    <SelectTrigger className="h-10 w-full px-0 border-0 border-b border-gray-300 focus:ring-0 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent text-sm shadow-none">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Male</SelectItem>
                      <SelectItem value="false">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" disabled={!profileHasChanges} className="w-full h-12 text-xs tracking-[0.2em] uppercase rounded-none bg-black hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed">
                Save Changes
              </Button>
            </form>
          </div>

          {/* RIGHT COLUMN: Security */}
          <div ref={rightRef} className={`bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_30px_rgba(0,0,0,0.06)] transition-shadow duration-500 ${rightInView ? 'animate-slide-in-right animate-delay-200' : 'opacity-0'}`}>
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-8 text-black">Security</h2>
            
            {passMsg.text && (
              <div className={`p-3 mb-6 text-xs tracking-wide text-center border ${passMsg.type === 'success' ? 'bg-[#F9F1D8]/30 border-[#D4AF37]/50 text-[#8B6508]' : 'bg-red-50 border-red-100 text-red-800'}`}>
                {passMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-8">
              
              <div className="space-y-1 relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Current Password</label>
                <div className="relative">
                  <Input 
                    type={showOldPass ? "text" : "password"} 
                    required 
                    value={passData.oldPassword}
                    onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                    className="h-10 px-0 pr-10 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent"
                  />
                  <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-0 bottom-2 text-gray-400 hover:text-black cursor-pointer">
                    {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">New Password</label>
                <div className="relative">
                  <Input 
                    type={showNewPass ? "text" : "password"} 
                    required 
                    value={passData.newPassword}
                    onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                    className="h-10 px-0 pr-10 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent"
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-0 bottom-2 text-gray-400 hover:text-black cursor-pointer">
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={!passwordHasChanges} variant="outline" className="w-full h-12 text-xs tracking-[0.2em] uppercase rounded-none border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black">
                Update Password
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}