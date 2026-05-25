import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Header } from '../components/Header';
import { Plus, Search, Eye, Trash2, X, Printer, CheckCircle, Edit } from 'lucide-react';

const initialInvoices = [
  {
    id: 'INV-2026-001',
    jobId: 'JOB-001',
    customer: 'สมชาย ใจดี',
    phone: '081-234-5678',
    vehicleModel: 'Honda Wave 110i',
    licensePlate: '1กข 1234',
    date: '2026-05-23',
    items: [
      { description: 'ค่าแรง - ถ่ายน้ำมันเครื่อง', qty: 1, unit: 'งาน', unitPrice: 100 },
      { description: 'น้ำมันเครื่อง Castrol 4T 10W-40', qty: 1, unit: 'ลิตร', unitPrice: 120 },
      { description: 'ค่าแรง - เช็คเบรก', qty: 1, unit: 'งาน', unitPrice: 80 },
      { description: 'ผ้าเบรกหน้า Honda Wave', qty: 1, unit: 'ชุด', unitPrice: 250 },
    ],
    status: 'ชำระแล้ว',
    paymentMethod: 'เงินสด',
  },
  {
    id: 'INV-2026-002',
    jobId: 'JOB-003',
    customer: 'มานะ ขยันดี',
    phone: '085-555-1234',
    vehicleModel: 'Honda PCX 150',
    licensePlate: '3คง 9012',
    date: '2026-05-23',
    items: [
      { description: 'ค่าแรง - เปลี่ยนยางหลัง', qty: 1, unit: 'งาน', unitPrice: 150 },
      { description: 'ยางนอกหลัง IRC 80/90-17', qty: 1, unit: 'เส้น', unitPrice: 750 },
      { description: 'ยางใน', qty: 1, unit: 'เส้น', unitPrice: 80 },
    ],
    status: 'รอชำระ',
    paymentMethod: '',
  },
];

const emptyItem = { description: '', qty: 1, unit: 'งาน', unitPrice: 0 };

const initialForm = {
  jobId: '',
  customer: '',
  phone: '',
  vehicleModel: '',
  licensePlate: '',
  items: [{ ...emptyItem }],
  paymentMethod: 'เงินสด',
};

const calcTotal = (items) => items.reduce((sum, i) => sum + (Number(i.qty) * Number(i.unitPrice)), 0);

export const Billing = () => {
  const [invoices, setInvoices] = useLocalStorage('motofix_invoices', initialInvoices);
  const [settings] = useLocalStorage('motofix_settings', {
    storeName: 'MotoFix',
    address: '123 ซอยช่างยนต์ ถนนมอเตอร์ไซค์ กรุงเทพฯ 10110',
    phone: '02-123-4567, 089-999-8888',
    taxId: '0105555555555',
    invoicePrefix: 'INV-',
  });
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.id.includes(search) || inv.customer.includes(search) || inv.jobId.includes(search);
    let matchDate = true;
    if (startDate) matchDate = matchDate && inv.date >= startDate;
    if (endDate) matchDate = matchDate && inv.date <= endDate;
    return matchSearch && matchDate;
  });

  const openModal = (mode, inv = null) => {
    setModalMode(mode);
    if (inv) {
      setSelectedId(inv.id);
      setFormData({
        jobId: inv.jobId,
        customer: inv.customer,
        phone: inv.phone,
        vehicleModel: inv.vehicleModel,
        licensePlate: inv.licensePlate,
        items: inv.items,
        paymentMethod: inv.paymentMethod || 'เงินสด',
      });
    } else {
      setSelectedId(null);
      setFormData(initialForm);
    }
  };

  const closeModal = () => setModalMode(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => setFormData(prev => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  const removeItem = (i) => setFormData(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'edit') {
      setInvoices(invoices.map(inv =>
        inv.id === selectedId ? { ...inv, ...formData } : inv
      ));
    } else {
      const newInv = {
        id: `${settings.invoicePrefix}2026-00${invoices.length + 1}`,
        ...formData,
        date: new Date().toISOString().split('T')[0],
        status: 'รอชำระ',
      };
      setInvoices([newInv, ...invoices]);
    }
    closeModal();
  };

  const markAsPaid = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'ชำระแล้ว' } : inv));
  };

  const handleDelete = (id) => {
    if (window.confirm('ต้องการลบใบเสร็จนี้ใช่หรือไม่?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const totalRevenue = filtered.filter(i => i.status === 'ชำระแล้ว').reduce((s, inv) => s + calcTotal(inv.items), 0);
  const totalPending = filtered.filter(i => i.status === 'รอชำระ').reduce((s, inv) => s + calcTotal(inv.items), 0);

  const isView = modalMode === 'view';
  const currentInvoice = isView ? invoices.find(i => i.id === selectedId) : null;

  return (
    <div className="animate-fade-in">
      <Header title="ระบบคิดเงิน" />

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ borderTop: '4px solid var(--success)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>รายรับที่ชำระแล้ว</p>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 0, color: 'var(--success)' }}>฿{totalRevenue.toLocaleString()}</h2>
        </div>
        <div className="glass-panel" style={{ borderTop: '4px solid var(--warning)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>รอชำระเงิน</p>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 0, color: 'var(--warning)' }}>฿{totalPending.toLocaleString()}</h2>
        </div>
        <div className="glass-panel" style={{ borderTop: '4px solid var(--primary)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ใบเสร็จทั้งหมด</p>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 0 }}>{filtered.length} ใบ</h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="form-control" placeholder="ค้นหาเลขใบเสร็จ, ชื่อลูกค้า..." style={{ paddingLeft: '2.5rem' }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ตั้งแต่:</span>
              <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '140px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ถึง:</span>
              <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '140px' }} />
            </div>
            {(startDate || endDate || search) && (
              <button className="btn btn-secondary" onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); }} style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                ล้างตัวกรอง
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => openModal('add')} style={{ flexShrink: 0 }}>
            <Plus size={18} /> ออกใบเสร็จใหม่
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>เลขใบเสร็จ</th>
                <th>อ้างอิงงาน</th>
                <th>วันที่</th>
                <th>ลูกค้า</th>
                <th>ยอดรวม</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{inv.id}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{inv.jobId}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{inv.date}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{inv.customer}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inv.vehicleModel} · {inv.licensePlate}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>฿{calcTotal(inv.items).toLocaleString()}</td>
                  <td>
                    {inv.status === 'ชำระแล้ว'
                      ? <span className="badge badge-completed">{inv.status}</span>
                      : <span className="badge badge-pending">{inv.status}</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => openModal('view', inv)} title="ดูใบเสร็จ"><Eye size={14} /></button>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--primary)', borderColor: 'rgba(99,102,241,0.3)' }} onClick={() => openModal('edit', inv)} title="แก้ไขใบเสร็จ"><Edit size={14} /></button>
                      {inv.status === 'รอชำระ' && (
                        <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--success)', borderColor: 'rgba(16,185,129,0.3)' }} onClick={() => markAsPaid(inv.id)} title="ยืนยันการชำระเงิน">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => handleDelete(inv.id)} title="ลบ"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>ไม่พบใบเสร็จ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Invoice */}
      {isView && currentInvoice && (
        <div className="modal-backdrop animate-fade-in" onClick={closeModal}>
          <div className="glass-panel modal-content print-area" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <button className="modal-close" onClick={closeModal}><X size={24} /></button>

            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
                  {settings.storeName.charAt(0)}
                </div>
                <div>
                  <h2 style={{ marginBottom: '0.25rem', fontSize: '1.25rem' }}>{settings.storeName}</h2>
                  <p style={{ fontSize: '0.8rem', marginBottom: '0.1rem', maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{settings.address}</p>
                  <p style={{ fontSize: '0.8rem', marginBottom: '0.1rem' }}>โทร: {settings.phone}</p>
                  {settings.taxId && <p style={{ fontSize: '0.8rem', marginBottom: 0 }}>เลขประจำตัวผู้เสียภาษี: {settings.taxId}</p>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary)', fontSize: '1.5rem' }}>ใบเสร็จรับเงิน</h2>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{currentInvoice.id}</p>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>วันที่: <strong>{currentInvoice.date}</strong></p>
                <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>อ้างอิง: <span style={{ color: 'var(--primary)' }}>{currentInvoice.jobId}</span></p>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ลูกค้า</span><p style={{ margin: 0, fontWeight: 500 }}>{currentInvoice.customer}</p></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>เบอร์โทร</span><p style={{ margin: 0 }}>{currentInvoice.phone}</p></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>รถ</span><p style={{ margin: 0 }}>{currentInvoice.vehicleModel}</p></div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ทะเบียน</span><p style={{ margin: 0 }}>{currentInvoice.licensePlate}</p></div>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th style={{ textAlign: 'center' }}>จำนวน</th>
                  <th style={{ textAlign: 'center' }}>หน่วย</th>
                  <th style={{ textAlign: 'right' }}>ราคา/หน่วย</th>
                  <th style={{ textAlign: 'right' }}>รวม</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description}</td>
                    <td style={{ textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{item.unit}</td>
                    <td style={{ textAlign: 'right' }}>฿{Number(item.unitPrice).toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>฿{(item.qty * item.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ยอดรวม</span>
                  <span>฿{calcTotal(currentInvoice.items).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span>ยอดสุทธิ</span>
                  <span>฿{calcTotal(currentInvoice.items).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
              <div>
                {currentInvoice.status === 'ชำระแล้ว'
                  ? <span className="badge badge-completed">ชำระแล้ว {currentInvoice.paymentMethod && `(${currentInvoice.paymentMethod})`}</span>
                  : <span className="badge badge-pending">รอชำระเงิน</span>
                }
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => window.print()}><Printer size={16} /> พิมพ์</button>
                <button className="btn btn-primary" onClick={closeModal}>ปิดหน้าต่าง</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Invoice */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="modal-backdrop animate-fade-in" onClick={closeModal}>
          <div className="glass-panel modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{modalMode === 'edit' ? 'แก้ไขใบเสร็จ' : 'ออกใบเสร็จใหม่'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">อ้างอิงรหัสงาน</label>
                  <input type="text" name="jobId" value={formData.jobId} onChange={handleChange} className="form-control" placeholder="เช่น JOB-001" />
                </div>
                <div className="form-group">
                  <label className="form-label">ชื่อลูกค้า</label>
                  <input type="text" name="customer" value={formData.customer} onChange={handleChange} className="form-control" required placeholder="สมชาย ใจดี" />
                </div>
                <div className="form-group">
                  <label className="form-label">เบอร์โทร</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="08x-xxx-xxxx" />
                </div>
                <div className="form-group">
                  <label className="form-label">ยี่ห้อ/รุ่นรถ</label>
                  <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="form-control" placeholder="Honda Wave 110i" />
                </div>
                <div className="form-group">
                  <label className="form-label">ป้ายทะเบียน</label>
                  <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange} className="form-control" placeholder="1กข 1234" />
                </div>
                <div className="form-group">
                  <label className="form-label">วิธีชำระเงิน</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="form-control">
                    <option value="เงินสด">เงินสด</option>
                    <option value="โอนเงิน">โอนเงิน</option>
                    <option value="บัตรเครดิต">บัตรเครดิต</option>
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>รายการ</h3>
                  <button type="button" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }} onClick={addItem}>
                    <Plus size={14} /> เพิ่มรายการ
                  </button>
                </div>
                {formData.items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input type="text" value={item.description} onChange={e => handleItemChange(i, 'description', e.target.value)} className="form-control" required placeholder="รายการ..." style={{ fontSize: '0.875rem' }} />
                    <input type="number" value={item.qty} onChange={e => handleItemChange(i, 'qty', e.target.value)} className="form-control" required min="1" placeholder="จำนวน" style={{ fontSize: '0.875rem' }} />
                    <input type="text" value={item.unit} onChange={e => handleItemChange(i, 'unit', e.target.value)} className="form-control" placeholder="หน่วย" style={{ fontSize: '0.875rem' }} />
                    <input type="number" value={item.unitPrice} onChange={e => handleItemChange(i, 'unitPrice', e.target.value)} className="form-control" required min="0" placeholder="ราคา" style={{ fontSize: '0.875rem' }} />
                    <button type="button" onClick={() => removeItem(i)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem' }} disabled={formData.items.length === 1}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.1rem' }}>
                    ยอดรวม: ฿{calcTotal(formData.items).toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>ยกเลิก</button>
                <button type="submit" className="btn btn-primary">{modalMode === 'edit' ? 'บันทึกการแก้ไข' : 'ออกใบเสร็จ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
