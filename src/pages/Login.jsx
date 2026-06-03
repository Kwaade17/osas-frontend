import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the signed JWT token in localStorage securely
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin_name', data.user.name);
        
        // Redirect directly to the dashboard
        navigate('/admin');
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection refused. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
        
        <div className="text-center">
          <span className="text-4xl">🔐</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-3">Portal Secure Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">Authorized Office Administration Staff Only</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-850 p-3 rounded text-xs text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="admin@lccc.edu.ph"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 font-bold text-white rounded text-sm transition shadow-sm ${
              isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900'
            }`}
          >
            {isLoading ? 'Authenticating Credentials...' : 'Sign In to Dashboard'}
          </button>
        </form>

      </div>
    </div>
  );
}