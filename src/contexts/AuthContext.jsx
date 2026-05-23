import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

const defaultUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'ผู้ดูแลระบบ' },
  { username: 'staff', password: 'staff123', role: 'user', name: 'พนักงานช่าง' }
];

const defaultMenuPermissions = {
  '/':          { admin: true, user: true,  label: 'แดชบอร์ด' },
  '/jobs':      { admin: true, user: true,  label: 'จัดการงานซ่อม' },
  '/customers': { admin: true, user: true,  label: 'จัดการลูกค้าและรถ' },
  '/inventory': { admin: true, user: true,  label: 'คลังอะไหล่' },
  '/billing':   { admin: true, user: false, label: 'ระบบคิดเงิน' },
  '/settings':  { admin: true, user: false, label: 'ตั้งค่าระบบ' },
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('motofix_users', defaultUsers);
  const [menuPermissions, setMenuPermissions] = useLocalStorage('motofix_menu_permissions', defaultMenuPermissions);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = window.localStorage.getItem('motofix_local_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        const isValid = users.some(u => u.username === user.username && u.password === user.password);
        if (isValid) {
          setCurrentUser(user);
        } else {
          window.localStorage.removeItem('motofix_local_session');
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, [users]);

  useEffect(() => {
    if (menuPermissions) {
      const hasMissingKeys = Object.keys(defaultMenuPermissions).some(key => !menuPermissions[key]);
      if (hasMissingKeys) {
        setMenuPermissions(prev => ({ ...defaultMenuPermissions, ...prev }));
      }
    }
  }, [menuPermissions]);

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      window.localStorage.setItem('motofix_local_session', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, message: 'ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง' };
  };

  const logout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem('motofix_local_session');
  };

  const canAccess = (path) => {
    if (!currentUser) return false;
    if (path === '/settings' && currentUser.role === 'admin') return true;
    const perm = menuPermissions[path];
    if (!perm) return true;
    return perm[currentUser.role] === true;
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, users, setUsers, menuPermissions, setMenuPermissions, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

