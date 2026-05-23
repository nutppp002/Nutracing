import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Header } from '../components/Header';
import { Plus, Search, Edit2, Trash2, Eye, X, Users, Car, Phone, History, ChevronDown, ChevronUp } from 'lucide-react';

export const Customers = () => {
  const [customers, setCustomers] = useLocalStorage('motofix_customers', [
    {
      id: 'C-001',
      name: 'สมชาย ใจดี',
      phone: '081-234-5678',
      lineId: '@somchai',
      address: '123 ถ.สุขุมวิท กรุงเทพฯ',
      note: 'ลูกค้าประจำ ชอบเปลี่ยนน้ำมันเครื่องทุก 3 เดือน',
      vehicles: [
        { plate: '1กข 1234 กทม.', model: 'Honda Wave 110i', year: '2023', color: 'น้ำเงิน', vin: 'MLHJA5610P5000123' },
        { plate: '5จน 9988 กทม.', model: 'Honda PCX 160', year: '2025', color: 'ดำ', vin: 'MLHJA5610P5000456' },
      ],
      totalJobs: 5,
      lastVisit: '2026-05-23',
      createdAt: '2025-01-15',
    },
    {
      id: 'C-002',
      name: 'สมศรี สุขสวัสดิ์',
      phone: '089-876-5432',
      lineId: '',
      address: '456 ถ.เพชรบุรี กรุงเทพฯ',
      note: '',
      vehicles: [
        { plate: '2ขค 5678 กทม.', model: 'Yamaha Fino 125', year: '2024', color: 'ขาว', vin: '' },
      ],
      totalJobs: 2,
      lastVisit: '2026-05-23',
      createdAt: '2025-06-20',
    },
    {
      id: 'C-003',
      name: 'มานะ พากเพียร',
      phone: '085-555-1234',
      lineId: '@mana_p',
      address: '789 ถ.ลาดพร้าว กรุงเทพฯ',
      note: 'ต้องโทรแจ้งก่อนรับรถทุกครั้ง',
      vehicles: [
        { plate: '3คง 9012 กทม.', model: 'Honda Click 150i', year: '2024', color: 'แดง', vin: 'MLHJA5610P5000789' },
      ],
      totalJobs: 8,
      lastVisit: '2026-05-22',
      createdAt: '2024-11-01',
    },
    {
      id: 'C-004',
      name: 'วิชัย รักเรียน',
      phone: '092-333-4567',
      lineId: '',
      address: '321 ถ.รามคำแหง กรุงเทพฯ',
      note: '',
      vehicles: [
        { plate: '7ภม 3344 กทม.', model: 'Yamaha NMAX 155', year: '2025', color: 'เทา', vin: '' },
        { plate: '9สท 1122 กทม.', model: 'Honda CRF 300L', year: '2024', color: 'แดง-ขาว', vin: '' },
      ],
      totalJobs: 3,
      lastVisit: '2026-05-20',
      createdAt: '2025-09-10',
    },
    {
      id: 'C-005',
      name: 'ปรีชา แก้วมณี',
      phone: '063-999-8888',
      lineId: '@preecha99',
      address: '55 ถ.บางนา-ตราด กรุงเทพฯ',
      note: 'สั่งอะไหล่ล่วงหน้าเสมอ',
      vehicles: [
        { plate: '4ธร 5566 กทม.', model: 'Kawasaki Ninja 400', year: '2025', color: 'เขียว', vin: '' },
      ],
      totalJobs: 1,
      lastVisit: '2026-05-18',
      createdAt: '2026-04-05',
    },
  ]);

  const [modalMode, setModalMode] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const emptyVehicle = { plate: '', model: '', year: '', color: '', vin: '' };

  const initialFormState = {
    name: '',
    phone: '',
    lineId: '',
    address: '',
    note: '',
    vehicles: [{ ...emptyVehicle }],
  };
  const [formData, setFormData] = useState(initialFormState);

  // Summary
  const totalCustomers = customers.length;
  const totalVehicles = customers.reduce((sum, c) => sum + c.vehicles.length, 0);
  const totalJobsAll = customers.reduce((sum, c) => sum + c.totalJobs, 0);
  const recentCustomers = customers.filter(c => {
    const diff = (new Date() - new Date(c.lastVisit)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const summaryCards = [
    { label: 'ลูกค้าทั้งหมด', value: totalCustomers + ' คน', icon: Users, color: '#6366f1' },
    { label: 'รถที่ลงทะเบียน', value: totalVehicles + ' คัน', icon: Car, color: '#14b8a6' },
    { label: 'งานซ่อมรวม', value: totalJobsAll + ' งาน', icon: History, color: '#f59e0b' },
    { label: 'ลูกค้าสัปดาห์นี้', value: recentCustomers + ' คน', icon: Phone, color: '#10b981' },
  ];

  // Search filter
  const filteredCustomers = customers.filter(c => {
    if (searchTerm === '') return true;
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.id.toLowerCase().includes(term) ||
      c.vehicles.some(v => v.plate.toLowerCase().includes(term) || v.model.toLowerCase().includes(term))
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (index, field, value) => {
    setFormData(prev => {
      const newVehicles = [...prev.vehicles];
      newVehicles[index] = { ...newVehicles[index], [field]: value };
      return { ...prev, vehicles: newVehicles };
    });
  };

  const addVehicleRow = () => {
    setFormData(prev => ({ ...prev, vehicles: [...prev.vehicles, { ...emptyVehicle }] }));
  };

  const removeVehicleRow = (index) => {
    if (formData.vehicles.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };

  const openModal = (mode, customer = null) => {
    setModalMode(mode);
    if (customer) {
      setSelectedCustomerId(customer.id);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        lineId: customer.lineId || '',
        address: customer.address || '',
        note: customer.note || '',
        vehicles: customer.vehicles.length > 0 ? customer.vehicles.map(v => ({ ...v })) : [{ ...emptyVehicle }],
      });
    } else {
      setSelectedCustomerId(null);
      setFormData({ ...initialFormState, vehicles: [{ ...emptyVehicle }] });
    }
  };

  const closeModal = () => {
    setModalMode(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanVehicles = formData.vehicles.filter(v => v.plate.trim() !== '' || v.model.trim() !== '');
    if (modalMode === 'add') {
      const newCustomer = {
        id: 'C-' + String(customers.length + 1).padStart(3, '0'),
        name: formData.name,
        phone: formData.phone,
        lineId: formData.lineId,
        address: formData.address,
        note: formData.note,
        vehicles: cleanVehicles,
        totalJobs: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers([newCustomer, ...customers]);
    } else if (modalMode === 'edit') {
      setCustomers(customers.map(c =>
        c.id === selectedCustomerId
          ? { ...c, name: formData.name, phone: formData.phone, lineId: formData.lineId, address: formData.address, note: formData.note, vehicles: cleanVehicles }
          : c
      ));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลลูกค้านี้ใช่หรือไม่? ข้อมูลจะไม่สามารถกู้คืนได้')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="animate-fade-in">
      <Header title="จัดการลูกค้าและรถ" />

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {summaryCards.map((card, i) => (
          <div key={i} className="glass-panel" style={{ borderTop: `4px solid ${card.color}`, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{card.label}</p>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>{card.value}</h3>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={22} style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="ค้นหาจากชื่อ, เบอร์โทร, ป้ายทะเบียน..."
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => openModal('add')}>
            <Plus size={18} /> เพิ่มลูกค้าใหม่
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>รหัส</th>
                <th>ชื่อลูกค้า</th>
                <th>เบอร์โทร</th>
                <th>รถจักรยานยนต์</th>
                <th>งานซ่อม</th>
                <th>เข้าใช้บริการล่าสุด</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Users size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>ไม่พบข้อมูลลูกค้าที่ค้นหา</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <>
                    <tr key={cust.id}>
                      <td>
                        <button
                          onClick={() => toggleExpand(cust.id)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                          title="ดูข้อมูลรถ"
                        >
                          {expandedRow === cust.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td style={{ fontWeight: '500', color: 'var(--primary)' }}>{cust.id}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{cust.name}</div>
                        {cust.lineId && <small style={{ color: 'var(--text-muted)' }}>LINE: {cust.lineId}</small>}
                      </td>
                      <td>
                        <a href={`tel:${cust.phone}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{cust.phone}</a>
                      </td>
                      <td>
                        <span style={{
                          background: 'rgba(20, 184, 166, 0.1)',
                          color: 'var(--accent)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          {cust.vehicles.length} คัน
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600' }}>{cust.totalJobs}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> งาน</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{cust.lastVisit}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="ดูรายละเอียด" onClick={() => openModal('view', cust)}>
                            <Eye size={14} />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="แก้ไข" onClick={() => openModal('edit', cust)}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '0.4rem' }} title="ลบ" onClick={() => handleDelete(cust.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded vehicle row */}
                    {expandedRow === cust.id && (
                      <tr key={cust.id + '-vehicles'}>
                        <td colSpan="8" style={{ padding: '0 1rem 1rem 3rem', background: 'rgba(99, 102, 241, 0.02)' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {cust.vehicles.map((v, vi) => (
                              <div key={vi} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '0.85rem 1.2rem',
                                minWidth: '260px',
                                flex: '1',
                                maxWidth: '350px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <Car size={16} style={{ color: 'var(--accent)' }} />
                                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{v.model}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  <span>ทะเบียน: <strong style={{ color: 'var(--text-main)' }}>{v.plate}</strong></span>
                                  <span>ปี: {v.year || '-'}</span>
                                  <span>สี: {v.color || '-'}</span>
                                  <span>VIN: {v.vin ? v.vin.slice(-6) + '...' : '-'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>แสดง {filteredCustomers.length} จาก {customers.length} ลูกค้า</p>
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="modal-backdrop animate-fade-in" onClick={closeModal}>
          <div className="glass-panel modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>
              {modalMode === 'add' ? 'เพิ่มลูกค้าใหม่' : modalMode === 'edit' ? `แก้ไขข้อมูลลูกค้า ${selectedCustomerId}` : `รายละเอียดลูกค้า ${selectedCustomerId}`}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Customer Info Section */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.05)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} /> ข้อมูลลูกค้า
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">ชื่อ-นามสกุล</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required placeholder="เช่น สมชาย ใจดี" disabled={modalMode === 'view'} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">เบอร์โทรศัพท์</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" required placeholder="08x-xxx-xxxx" disabled={modalMode === 'view'} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">LINE ID</label>
                    <input type="text" name="lineId" value={formData.lineId} onChange={handleInputChange} className="form-control" placeholder="(ไม่บังคับ)" disabled={modalMode === 'view'} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label">ที่อยู่</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" placeholder="(ไม่บังคับ)" disabled={modalMode === 'view'} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">หมายเหตุ</label>
                  <textarea name="note" value={formData.note} onChange={handleInputChange} className="form-control" rows="2" placeholder="บันทึกข้อมูลเพิ่มเติมเกี่ยวกับลูกค้า..." disabled={modalMode === 'view'}></textarea>
                </div>
              </div>

              {/* Vehicles Section */}
              <div style={{
                background: 'rgba(20, 184, 166, 0.05)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(20, 184, 166, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Car size={16} /> ข้อมูลรถจักรยานยนต์
                  </h4>
                  {modalMode !== 'view' && (
                    <button type="button" className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={addVehicleRow}>
                      <Plus size={14} /> เพิ่มรถ
                    </button>
                  )}
                </div>

                {formData.vehicles.map((vehicle, index) => (
                  <div key={index} style={{
                    background: 'rgba(0,0,0,0.15)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: index < formData.vehicles.length - 1 ? '0.75rem' : 0,
                    position: 'relative'
                  }}>
                    {modalMode !== 'view' && formData.vehicles.length > 1 && (
                      <button type="button" onClick={() => removeVehicleRow(index)} style={{
                        position: 'absolute', top: '0.5rem', right: '0.5rem',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '6px', color: 'var(--danger)', cursor: 'pointer',
                        padding: '0.2rem 0.4rem', fontSize: '0.7rem'
                      }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>
                      รถคันที่ {index + 1}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>ป้ายทะเบียน</label>
                        <input type="text" value={vehicle.plate} onChange={(e) => handleVehicleChange(index, 'plate', e.target.value)} className="form-control" placeholder="เช่น 1กข 1234 กทม." disabled={modalMode === 'view'} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>ยี่ห้อ / รุ่น</label>
                        <input type="text" value={vehicle.model} onChange={(e) => handleVehicleChange(index, 'model', e.target.value)} className="form-control" placeholder="เช่น Honda Wave 110i" disabled={modalMode === 'view'} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>ปีรถ</label>
                        <input type="text" value={vehicle.year} onChange={(e) => handleVehicleChange(index, 'year', e.target.value)} className="form-control" placeholder="เช่น 2025" disabled={modalMode === 'view'} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>สี</label>
                        <input type="text" value={vehicle.color} onChange={(e) => handleVehicleChange(index, 'color', e.target.value)} className="form-control" placeholder="เช่น แดง, ดำ" disabled={modalMode === 'view'} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>เลข VIN / เลขตัวถัง</label>
                      <input type="text" value={vehicle.vin} onChange={(e) => handleVehicleChange(index, 'vin', e.target.value)} className="form-control" placeholder="(ไม่บังคับ)" disabled={modalMode === 'view'} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer stats in view mode */}
              {modalMode === 'view' && selectedCustomerId && (() => {
                const cust = customers.find(c => c.id === selectedCustomerId);
                return cust ? (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.15)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-around',
                    textAlign: 'center'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>งานซ่อมรวม</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--warning)', margin: 0 }}>{cust.totalJobs} งาน</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>เข้าใช้บริการล่าสุด</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--warning)', margin: 0 }}>{cust.lastVisit}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>ลงทะเบียนเมื่อ</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--warning)', margin: 0 }}>{cust.createdAt}</p>
                    </div>
                  </div>
                ) : null;
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                {modalMode === 'view' ? (
                  <button type="button" className="btn btn-primary" onClick={closeModal}>ปิดหน้าต่าง</button>
                ) : (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>ยกเลิก</button>
                    <button type="submit" className="btn btn-primary">บันทึกข้อมูล</button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
