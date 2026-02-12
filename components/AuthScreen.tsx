
import React, { useState } from 'react';
import { AppRole, UserProfile } from '../types';
import { Button } from './Button';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
  onRegister: (user: UserProfile) => void;
  onClose: () => void;
  registeredUsers: UserProfile[];
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onRegister, onClose, registeredUsers }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<AppRole>(AppRole.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Simple login logic
      const user = registeredUsers.find(u => u.email === email && u.password === password && u.role === role);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials or role mismatch.');
      }
    } else {
      // Simple register logic
      if (registeredUsers.some(u => u.email === email)) {
        setError('User already exists with this email.');
        return;
      }
      
      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: AppRole.USER, // Only users can register via this form
        bio: 'Professional background goes here...',
        skills: []
      };
      onRegister(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 relative animate-scaleIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
            <i className="fas fa-rocket text-2xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Enter your credentials to access your dashboard" : "Join our community of professionals"}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            onClick={() => { setRole(AppRole.USER); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === AppRole.USER ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Candidate
          </button>
          <button 
            onClick={() => { setRole(AppRole.ADMIN); setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === AppRole.ADMIN ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Employer
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full py-3 shadow-lg shadow-indigo-100">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>

          {role === AppRole.USER && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </button>
            </div>
          )}
          
          {role === AppRole.ADMIN && isLogin && (
            <p className="text-center text-xs text-gray-400">
              Admin accounts must be provisioned by the system administrator.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
