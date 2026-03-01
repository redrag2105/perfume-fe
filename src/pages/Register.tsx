import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { authApi } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ChevronDown, ArrowLeft } from 'lucide-react';
import { validateRegisterForm, isRegisterFormValid } from '@/lib/validation';
import { GENDER_OPTIONS } from '@/constants';

const currentYear = new Date().getFullYear();

export default function Register() {
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', YOB: '', gender: 'true'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const navigate = useNavigate();

  const errors = useMemo(() => 
    validateRegisterForm(formData.name, formData.email, formData.password, formData.YOB), 
    [formData]
  );
  
  const isFormValid = isRegisterFormValid(errors);
  const isButtonDisabled = isSubmitting || (hasSubmitted && !isFormValid);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    if (!isFormValid) return;
    
    setError('');
    setIsSubmitting(true);
    try {
      await authApi.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        YOB: parseInt(formData.YOB),
        gender: formData.gender === 'true'
      });
      navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to register');
      } else {
        setError('Failed to register');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = (field: keyof typeof errors) => hasSubmitted && errors[field];
  const selectedGender = GENDER_OPTIONS.find(g => g.value === formData.gender);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {/* Back to Home - Fixed Position */}
      <Link 
        to="/" 
        className="fixed top-8 left-8 group flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 z-10"
      >
        <ArrowLeft size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-xs tracking-[0.15em] uppercase">Back to Home</span>
      </Link>

      <div className="w-full max-w-md space-y-10">
        
        {/* Header - Editorial */}
        <div className="space-y-4 text-center animate-slide-up">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-serif text-white tracking-tight">Pétale</span>
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">Join Us</h1>
          <p className="text-sm text-white/40 tracking-[0.15em] uppercase">Begin your journey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8 animate-slide-up animate-delay-200">
          {error && (
            <div className="p-4 text-xs tracking-wide text-center text-red-400 bg-red-950/30 border border-red-900/50">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <Input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`h-14 px-0 border-0 border-b-2 focus-visible:ring-0 rounded-none bg-transparent placeholder:text-white/30 text-white text-sm tracking-wide transition-colors duration-300 ${showError('name') ? 'border-red-500 focus-visible:border-red-500' : 'border-white/20 focus-visible:border-white'}`}
              />
              {showError('name') && (
                <p className="mt-2 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`h-14 px-0 border-0 border-b-2 focus-visible:ring-0 rounded-none bg-transparent placeholder:text-white/30 text-white text-sm tracking-wide transition-colors duration-300 ${showError('email') ? 'border-red-500 focus-visible:border-red-500' : 'border-white/20 focus-visible:border-white'}`}
              />
              {showError('email') && (
                <p className="mt-2 text-xs text-red-400">{errors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`h-14 px-0 pr-12 border-0 border-b-2 focus-visible:ring-0 rounded-none bg-transparent placeholder:text-white/30 text-white text-sm tracking-wide transition-colors duration-300 ${showError('password') ? 'border-red-500 focus-visible:border-red-500' : 'border-white/20 focus-visible:border-white'}`}
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white focus:outline-none cursor-pointer transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
              {showError('password') && (
                <p className="mt-2 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Year of Birth & Gender */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Input 
                  type="number" 
                  placeholder="Year of Birth"
                  min="1900" 
                  max={currentYear}
                  value={formData.YOB}
                  onChange={(e) => setFormData({...formData, YOB: e.target.value})}
                  className={`h-14 px-0 border-0 border-b-2 focus-visible:ring-0 rounded-none bg-transparent placeholder:text-white/30 text-white text-sm tracking-wide [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors duration-300 ${showError('YOB') ? 'border-red-500 focus-visible:border-red-500' : 'border-white/20 focus-visible:border-white'}`}
                />
                {showError('YOB') && (
                  <p className="mt-2 text-xs text-red-400">{errors.YOB}</p>
                )}
              </div>
              
              {/* Gender Dropdown - Dark Theme */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setGenderOpen(!genderOpen)}
                  className="w-full h-14 flex items-center justify-between border-b-2 border-white/20 text-white text-sm tracking-wide cursor-pointer hover:border-white/40 transition-colors"
                >
                  <span className={selectedGender ? 'text-white' : 'text-white/30'}>
                    {selectedGender?.label || 'Gender'}
                  </span>
                  <ChevronDown size={16} className={`text-white/40 transition-transform ${genderOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {genderOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-white/10 z-10">
                    {GENDER_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData({...formData, gender: option.value});
                          setGenderOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm tracking-wide transition-colors cursor-pointer ${
                          formData.gender === option.value ? 'bg-white text-black' : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-xs tracking-[0.2em] uppercase mt-6 bg-white text-black hover:bg-white/90 transition-all duration-300" 
            type="submit"
            disabled={isButtonDisabled}
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </Button>
          
          <div className="text-center pt-4">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:opacity-60 underline underline-offset-4 decoration-1 transition-opacity duration-300">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
