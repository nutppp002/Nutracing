import { Settings, User } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from '../contexts/AuthContext';

export const Header = ({ title }) => {
  const [settings] = useLocalStorage('motofix_settings', { storeName: 'MotoFix' });
  const { currentUser } = useAuth();
  
  return (
    <header className="header animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{title}</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage your shop operations efficiently.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
