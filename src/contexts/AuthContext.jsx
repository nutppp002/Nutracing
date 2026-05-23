import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

const defaultUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'ผู้ดูแลระบบ' },
  { username: 'staff', password: 'staff123', role: 'user', name: 'พนักงานช่าง' }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('motofix_users', defaultUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load session from purely local browser storage (NOT synced to server)
    const savedSession = window.localStorage.getItem('motofix_local_session');
    if (savedSession) {
      try {
        const user = JSON.parse(savedSession);
        // Verify user still exists in synced users list
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

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, users, setUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
