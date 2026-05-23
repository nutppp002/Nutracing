import { useState } from 'react';
import { Header } from '../components/Header';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Save, Store, MapPin, Phone, FileText, Palette } from 'lucide-react';

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
    </div>
  );
};
