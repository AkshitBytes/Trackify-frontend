import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '1rem 0'
    }}>
      <div className="page-container" style={{ padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '10px', 
            background: 'linear-gradient(135deg, var(--accent-primary), #a855f7)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Terminal size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>Trackify</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tracking make you consistent</span>
          </div>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hey, <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong></span>
              
              <button 
                onClick={handleLogout}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem', color: 'var(--text-muted)',
                  borderRadius: 'var(--radius-md)'
                }}
                className="btn-secondary"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
