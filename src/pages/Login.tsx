import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { validateLoginForm, isLoginFormValid } from '@/lib/validation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const errors = useMemo(() => validateLoginForm(email, password), [email, password]);
  const isFormValid = isLoginFormValid(errors);

  const isButtonDisabled = isSubmitting || (hasSubmitted && !isFormValid);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    if (!isFormValid) return;
    
    setError('');
    setIsSubmitting(true);
    try {
      const res = await authApi.login({ email, password });
      login(res.accessToken);
      toast.success('Welcome back to Pétale');
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setError('');
    setIsSubmitting(true);
    try {
      const res = await authApi.googleLogin({ 
        credential: credentialResponse.credential! 
      });
      login(res.accessToken);
      toast.success('Welcome back to Pétale');
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Google authentication failed.');
      } else {
        setError('Google authentication failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed.');
  };

  const showEmailError = hasSubmitted && errors.email;
  const showPasswordError = hasSubmitted && errors.password;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {/* Back to Home */}
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
          <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tight">Sign In</h1>
          <p className="text-sm text-white/40 tracking-[0.15em] uppercase">Welcome back</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 animate-slide-up animate-delay-200">
          {error && (
            <div className="p-4 text-xs tracking-wide text-center text-red-400 bg-red-950/30 border border-red-900/50">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-14 px-0 border-0 border-b-2 focus-visible:ring-0 rounded-none bg-transparent placeholder:text-white/30 text-white text-sm tracking-wide transition-colors duration-300 ${showEmailError ? 'border-red-500 focus-visible:border-red-500' : 'border-white/20 focus-visible:border-white'}`}
              />
              {showEmailError && (
                <p className="mt-2 text-xs text-red-400">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-14 px-0 pr-12 border-0 border-b-2 focus-visible:ring-0 rounded-none bg-transparent placeholder:text-white/30 text-white text-sm tracking-wide transition-colors duration-300 ${showPasswordError ? 'border-red-500 focus-visible:border-red-500' : 'border-white/20 focus-visible:border-white'}`}
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white focus:outline-none cursor-pointer transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                </button>
              </div>
              {showPasswordError && (
                <p className="mt-2 text-xs text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <Button 
            className="w-full h-14 text-xs tracking-[0.2em] uppercase mt-6 bg-white text-black hover:bg-white/90 transition-all duration-300" 
            type="submit"
            disabled={isButtonDisabled}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0A0A0A] px-6 text-white/30 tracking-[0.2em]">Or</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              width="400"
              text="signin_with"
            />
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-white/40">
              New to Pétale?{' '}
              <Link to="/register" className="text-white hover:opacity-60 underline underline-offset-4 decoration-1 transition-opacity duration-300">
                Create Account
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
