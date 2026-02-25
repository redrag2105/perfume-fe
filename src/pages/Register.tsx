import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', YOB: '', gender: 'true'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', {
        ...formData,
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
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 bg-white">
      <div className="w-full max-w-sm space-y-8">
        
        {/* Elegant Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-serif tracking-tight text-primary">Create Account</h1>
          <p className="text-sm text-muted-foreground tracking-wide">Join the Aura community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 mt-8">
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
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="h-12 px-0 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-12 px-0 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent placeholder:text-gray-400"
              />
            </div>
            
            {/* Password with toggle */}
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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

            {/* Year of Birth & Gender in a row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Input 
                  type="number" 
                  placeholder="Year of Birth"
                  min="1900" 
                  max="2026" 
                  required 
                  value={formData.YOB}
                  onChange={(e) => setFormData({...formData, YOB: e.target.value})}
                  className="h-12 px-0 border-0 border-b border-gray-300 focus-visible:ring-0 focus-visible:border-black rounded-none bg-transparent placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="h-12 w-full px-0 border-0 border-b border-gray-300 focus:ring-0 focus:border-black outline-none rounded-none bg-transparent text-sm text-gray-600"
                >
                  <option value="true">Male</option>
                  <option value="false">Female</option>
                </select>
              </div>
            </div>
          </div>

          <Button className="w-full h-12 text-sm tracking-widest uppercase mt-4" type="submit">
            Create Account
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