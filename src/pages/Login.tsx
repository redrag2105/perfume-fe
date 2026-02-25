import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react'; // <-- The toggle icons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 bg-white">
      <div className="w-full max-w-sm space-y-8">
        
        {/* Elegant Header */}
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
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-0 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent placeholder:text-gray-400"
              />
            </div>
            
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-0 pr-10 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent placeholder:text-gray-400"
              />
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <Button className="w-full h-12 text-sm tracking-widest uppercase mt-4" type="submit">
            Sign In
          </Button>
          
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