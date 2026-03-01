import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { authApi } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { DropdownSelect } from '@/components/dashboard/dialogs/components';
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
  const navigate = useNavigate();

  const errors = useMemo(() => 
    validateRegisterForm(formData.name, formData.email, formData.password, formData.YOB), 
    [formData]
  );
  
  const isFormValid = isRegisterFormValid(errors);

  // After first submit, button is disabled until form is valid
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

  // Show errors only after first submission
  const showError = (field: keyof typeof errors) => hasSubmitted && errors[field];

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 bg-white">
      <div className="w-full max-w-sm space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center animate-slide-up">
          <h1 className="text-4xl font-serif tracking-tight text-primary">Create Account</h1>
          <p className="text-sm text-muted-foreground tracking-wide">Join the Aura community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 mt-8 animate-slide-up animate-delay-200">
          {error && (
            <div className="p-3 text-xs tracking-wide text-center text-red-800 bg-red-50 border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <Input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`h-12 px-0 border-0 border-b focus-visible:ring-0 rounded-none bg-transparent placeholder:text-gray-400 transition-colors ${showError('name') ? 'border-red-500 focus-visible:border-red-500' : 'border-gray-300 focus-visible:border-black'}`}
              />
              {showError('name') && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`h-12 px-0 border-0 border-b focus-visible:ring-0 rounded-none bg-transparent placeholder:text-gray-400 transition-colors ${showError('email') ? 'border-red-500 focus-visible:border-red-500' : 'border-gray-300 focus-visible:border-black'}`}
              />
              {showError('email') && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Password with toggle */}
            <div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`h-12 px-0 pr-10 border-0 border-b focus-visible:ring-0 rounded-none bg-transparent placeholder:text-gray-400 transition-colors ${showError('password') ? 'border-red-500 focus-visible:border-red-500' : 'border-gray-300 focus-visible:border-black'}`}
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              {showError('password') && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Year of Birth & Gender in a row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input 
                  type="number" 
                  placeholder="Year of Birth"
                  min="1900" 
                  max={currentYear}
                  value={formData.YOB}
                  onChange={(e) => setFormData({...formData, YOB: e.target.value})}
                  className={`h-12 px-0 border-0 border-b focus-visible:ring-0 rounded-none bg-transparent placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors ${showError('YOB') ? 'border-red-500 focus-visible:border-red-500' : 'border-gray-300 focus-visible:border-black'}`}
                />
                {showError('YOB') && (
                  <p className="mt-1 text-xs text-red-500">{errors.YOB}</p>
                )}
              </div>
              
              {/* Gender Dropdown */}
              <DropdownSelect
                value={formData.gender}
                options={GENDER_OPTIONS}
                onChange={(value) => setFormData({...formData, gender: value})}
                variant="underline"
                placeholder="Select Gender"
              />
            </div>
          </div>

          <Button 
            className="w-full h-12 text-sm tracking-widest uppercase mt-4" 
            type="submit"
            disabled={isButtonDisabled}
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-black hover:text-gray-600 underline underline-offset-4 decoration-1 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}