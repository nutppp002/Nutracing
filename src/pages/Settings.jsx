import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Save, Store, MapPin, Phone, FileText, Palette, Users as UsersIcon, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const defaultSettings = {
  storeName: 'MotoFix',
  address: '123 ซอยช่างยนต์ ถนนมอเตอร์ไซค์ กรุงเทพฯ 10110',
  phone: '02-123-4567, 089-999-8888',
  taxId: '0105555555555',
  invoicePrefix: 'INV-',
  themeColor: '#6366f1',
};

export const Settings = () => {
  const [settings, setSettings] = useLocalStorage('motofix_settings', defaultSettings);
  const [formData, setFormData] = useState(settings);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <Header title="ตั้งค่าระบบหลังบ้าน" />
      
      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Store size={24} color="var(--primary)" /> 
          ข้อมูลร้านค้า (สำหรับออกใบเสร็จ)
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Store size={16} /> ชื่อร้านค้า
              </label>
              <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="form-control" required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} /> ที่อยู่ร้านค้า
              </label>
              <textarea name="address" value={formData.address} onChange={handleChange} className="form-control" rows="3" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} /> เบอร์โทรศัพท์
                </label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={16} /> เลขประจำตัวผู้เสียภาษี (ถ้ามี)
                </label>
                <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="form-control" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  คำนำหน้าเลขใบเสร็จ (เช่น INV-)
                </label>
                <input type="text" name="invoicePrefix" value={formData.invoicePrefix} onChange={handleChange} className="form-control" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Palette size={16} /> สีหลักของระบบ (Theme Color)
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input type="color" name="themeColor" value={formData.themeColor || '#6366f1'} onChange={handleChange} style={{ width: '50px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }} />
                  <span style={{ color: 'var(--text-muted)' }}>เลือกสีที่คุณต้องการ</span>
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            {savedMessage && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>บันทึกข้อมูลเรียบร้อยแล้ว</span>}
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <Save size={18} /> บันทึกการตั้งค่า
            </button>
          </div>
        </form>
      </div>

      <UserManagement />

      <MenuPermissionsManagement />

    </div>
  );
};

const UserManagement = () => {
  const { users, setUsers, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user', name: '' });

  const handleEdit = (user) => {
    setFormData(user);
    setIsEditing(user.username);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing === 'new') {
      if (users.find(u => u.username === formData.username)) {
        alert('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
        return;
      }
      setUsers([...users, formData]);
    } else {
      setUsers(users.map(u => u.username === isEditing ? formData : u));
    }
    setIsEditing(null);
  };

  const handleDelete = (username) => {
    if (username === currentUser.username) {
      alert('ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่ได้');
      return;
    }
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี ${username}?`)) {
      setUsers(users.filter(u => u.username !== username));
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '2rem auto 0', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <UsersIcon size={24} color="var(--primary)" /> 
          จัดการบัญชีผู้ใช้งาน
        </h2>
        <button className="btn btn-primary" onClick={() => { setFormData({ username: '', password: '', role: 'user', name: '' }); setIsEditing('new'); }}>
          + เพิ่มผู้ใช้ใหม่
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSave} style={{ background: 'var(--bg-panel)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="form-label">ชื่อผู้ใช้ (Username)</label>
              <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} disabled={isEditing !== 'new'} required />
            </div>
            <div>
              <label className="form-label">รหัสผ่าน (Password)</label>
              <input type="text" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            <div>
              <label className="form-label">ชื่อ-นามสกุล / ตำแหน่ง</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="form-label">ระดับสิทธิ์ (Role)</label>
              <select className="form-control" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="user">พนักงาน (User)</option>
                <option value="admin">ผู้ดูแลระบบ (Admin)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(null)}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary">บันทึกข้อมูล</button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>ชื่อผู้ใช้</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>รหัสผ่าน</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>ชื่อ-นามสกุล</th>
              <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>สิทธิ์</th>
              <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.username} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '0.75rem' }}>{u.username}</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.password}</td>
                <td style={{ padding: '0.75rem' }}>{u.name}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.75rem', 
                    background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: u.role === 'admin' ? 'var(--primary)' : 'var(--success)'
                  }}>
                    {u.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(u)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginRight: '1rem' }}>แก้ไข</button>
                  <button onClick={() => handleDelete(u.username)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} disabled={u.username === currentUser.username}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MenuPermissionsManagement = () => {
  const { menuPermissions, setMenuPermissions } = useAuth();
  const [localPermissions, setLocalPermissions] = useState(menuPermissions);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (menuPermissions) {
      setLocalPermissions(menuPermissions);
    }
  }, [menuPermissions]);

  const handleCheckboxChange = (path, role, checked) => {
    setLocalPermissions(prev => ({
      ...prev,
      [path]: {
        ...prev[path],
        [role]: checked
      }
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMenuPermissions(localPermissions);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  if (!localPermissions) return null;

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '2rem auto 0', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={24} color="var(--primary)" /> 
        ตั้งค่าสิทธิ์การเข้าถึงเมนู
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        กำหนดสิทธิ์การมองเห็นและการเข้าใช้งานเมนูต่างๆ ของผู้ใช้ระบบในแต่ละระดับสิทธิ์ (Admin และ Staff)
      </p>

      <form onSubmit={handleSave}>
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: '500' }}>ชื่อเมนู</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: '500' }}>ผู้ดูแลระบบ (Admin)</th>
                <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', color: 'var(--text-muted)', fontWeight: '500' }}>พนักงาน (Staff)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(localPermissions).map(([path, perm]) => (
                <tr key={path} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: '500' }}>{perm.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{path}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={perm.admin} 
                      disabled={path === '/settings'} 
                      onChange={(e) => handleCheckboxChange(path, 'admin', e.target.checked)}
                      style={{ 
                        width: '18px', 
                        height: '18px', 
                        cursor: path === '/settings' ? 'not-allowed' : 'pointer',
                        accentColor: 'var(--primary)'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={perm.user} 
                      onChange={(e) => handleCheckboxChange(path, 'user', e.target.checked)}
                      style={{ 
                        width: '18px', 
                        height: '18px', 
                        cursor: 'pointer',
                        accentColor: 'var(--primary)'
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          {savedMessage && <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>บันทึกสิทธิ์การใช้งานเรียบร้อยแล้ว</span>}
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <Save size={18} /> บันทึกสิทธิ์การใช้งาน
          </button>
        </div>
      </form>
    </div>
  );
};
