import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Lock, Mail, Shield, User, Smartphone, ArrowRight, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const { loginAs } = useApp();
  const [email, setEmail] = useState('admin@granitepro.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [roleSelection, setRoleSelection] = useState<UserRole>('admin');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setRoleSelection(role);
    if (role === 'admin') {
      setEmail('admin@granitepro.com');
      setPassword('admin@123');
    } else if (role === 'manager') {
      setEmail('manager@granitepro.com');
      setPassword('manager@123');
    } else if (role === 'driver') {
      setEmail('driver@granitepro.com');
      setPassword('driver@123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    // Authenticate
    loginAs(roleSelection);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <div className="p-6 max-w-7xl w-full mx-auto flex items-center justify-between z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Public Website
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Demo Authentication Portal
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-600/30 mb-4 ring-1 ring-white/20">
              🪨
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              GraniteTrack <span className="text-blue-500">Pro</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              "Manage Every Ton. Every Truck. Every Rupee."
            </p>
          </div>

          {/* Quick 1-Click Demo Accounts Selector */}
          <div className="mb-6 p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick 1-Click Demo Logins
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="btn-demo-admin"
                onClick={() => handleRoleSelect('admin')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  roleSelection === 'admin'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                id="btn-demo-manager"
                onClick={() => handleRoleSelect('manager')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  roleSelection === 'manager'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Manager</span>
              </button>

              <button
                type="button"
                id="btn-demo-driver"
                onClick={() => handleRoleSelect('driver')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  roleSelection === 'driver'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Driver</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@granitepro.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo environment: any password is accepted for demo accounts.'); }} className="text-[11px] text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span className="text-xs text-slate-400">Remember me</span>
              </label>

              <span className="text-[11px] text-emerald-400 font-mono">
                SSL Secured 256-bit
              </span>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Sign In to GraniteTrack Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Label demo credentials for portfolio */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">
              Demo Credentials (Active For Portfolio Review):
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500 space-y-0.5">
              <div>Admin: <span className="text-blue-400">admin@granitepro.com</span></div>
              <div>Manager: <span className="text-emerald-400">manager@granitepro.com</span></div>
              <div>Driver: <span className="text-amber-400">driver@granitepro.com</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 text-center text-slate-500 text-xs z-10">
        GraniteTrack Pro Logistics Software • Hosur • Madurai • Chimakurthy
      </div>
    </div>
  );
};
