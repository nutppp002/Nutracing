import { Settings } from 'lucide-react';

import { useLocalStorage } from '../hooks/useLocalStorage';

export const Header = ({ title }) => {
  const [settings] = useLocalStorage('motofix_settings', { storeName: 'MotoFix' });
  const initial = settings?.storeName ? settings.storeName.charAt(0).toUpperCase() : 'M';
  
  return (
    <header className="header animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{title}</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage your shop operations efficiently.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-secondary">
          <Settings size={18} />
        </button>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {initial}
        </div>
      </div>
    </header>
  );
};
