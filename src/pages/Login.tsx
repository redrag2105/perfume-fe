import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
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

  // After first submit, button is disabled until form is valid
  const isButtonDisabled = isSubmitting || (hasSubmitted && !isFormValid);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    if (!isFormValid) return;
    
    setError('');
    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.accessToken);
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
      const res = await api.post('/auth/google', { 
        credential: credentialResponse.credential 
      });
      login(res.data.accessToken);
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

  // Show errors only after first submission
  const showEmailError = hasSubmitted && errors.email;
  const showPasswordError = hasSubmitted && errors.password;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 bg-white">
      <div className="w-full max-w-sm space-y-8">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-serif tracking-tight text-primary">Sign In</h1>
          <p className="text-sm text-muted-foreground tracking-wide">Enter your details to proceed.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-8">
          {error && (
            <div className="p-3 text-xs tracking-wide text-center text-red-800 bg-red-50 border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 px-0 border-0 border-b focus-visible:ring-0 rounded-none bg-transparent placeholder:text-gray-400 transition-colors ${showEmailError ? 'border-red-500 focus-visible:border-red-500' : 'border-gray-300 focus-visible:border-black'}`}
              />
              {showEmailError && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-12 px-0 pr-10 border-0 border-b focus-visible:ring-0 rounded-none bg-transparent placeholder:text-gray-400 transition-colors ${showPasswordError ? 'border-red-500 focus-visible:border-red-500' : 'border-gray-300 focus-visible:border-black'}`}
                />
                <button
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              {showPasswordError && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <Button 
            className="w-full h-12 text-sm tracking-widest uppercase mt-4" 
            type="submit"
            disabled={isButtonDisabled}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 tracking-widest">Or</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="350"
              text="signin_with"
            />
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              New to Aura?{' '}
              <Link to="/register" className="text-black hover:text-gray-600 underline underline-offset-4 decoration-1 transition-colors">
                Create an Account
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}