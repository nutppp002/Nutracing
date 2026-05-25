import { useState } from 'react';
import { User, RefreshCw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { triggerRefresh } from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/AuthContext';

export const Header = ({ title }) => {
  const [settings] = useLocalStorage('motofix_settings', { storeName: 'MotoFix' });
  const { currentUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    triggerRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };
  
  return (
    <header className="header animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{title}</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage your shop operations efficiently.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={handleRefresh}
          title="รีเฟรชข้อมูล"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid var(--glass-border)',
            background: isRefreshing ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)',
            color: isRefreshing ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!isRefreshing) {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRefreshing) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--glass-border)';
            }
          }}
        >
          <RefreshCw
            size={18}
            style={{
              animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none',
            }}
          />
        </button>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', marginRight: '0.5rem' }}>
          <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{currentUser?.name || 'ผู้ใช้งาน'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'พนักงาน'}
          </span>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          <User size={20} color="white" />
        </div>
      </div>
    </header>
  );
};
