import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wrench, Users, Box, FileText, Settings } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { name: 'แดชบอร์ด', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'จัดการงานซ่อม', path: '/jobs', icon: <Wrench size={20} /> },
    { name: 'จัดการลูกค้าและรถ', path: '/customers', icon: <Users size={20} /> },
    { name: 'คลังอะไหล่', path: '/inventory', icon: <Box size={20} /> },
    { name: 'ระบบคิดเงิน', path: '/billing', icon: <FileText size={20} /> },
    { name: 'ตั้งค่าระบบ', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '1rem 0', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
          <Wrench size={24} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>MotoFix</h2>
          <p style={{ fontSize: '0.75rem', marginBottom: 0, color: 'var(--primary)' }}>ระบบจัดการร้าน</p>
        </div>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'white' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, var(--primary), var(--primary-hover))' : 'transparent',
                fontWeight: isActive ? '500' : '400',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 14px rgba(99, 102, 241, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
