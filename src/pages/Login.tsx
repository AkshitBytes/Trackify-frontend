import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '56px', height: '56px', borderRadius: '16px', 
            background: 'linear-gradient(135deg, var(--accent-primary), #a855f7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-glow)'
          }}>
            <LogIn size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue your DSA journey</p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.1)', 
            color: 'var(--accent-danger)', borderRadius: 'var(--radius-md)', 
            marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.875rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ fontWeight: 600 }}>Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
