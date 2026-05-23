import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Header } from '../components/Header';
import { Plus, Search, Edit2, Trash2, Eye, X, Package, AlertTriangle, TrendingDown, Archive } from 'lucide-react';

export const Inventory = () => {
  const [parts, setParts] = useLocalStorage('motofix_inventory', [
    { id: 'P-001', name: 'น้ำมันเครื่อง 10W-40 (1L)', category: 'น้ำมัน', brand: 'PTT Performa', costPrice: 120, sellPrice: 180, stock: 25, minStock: 10, unit: 'ขวด' },
    { id: 'P-002', name: 'ผ้าเบรกหน้า Wave 110i', category: 'ระบบเบรก', brand: 'YASAKI', costPrice: 85, sellPrice: 150, stock: 12, minStock: 5, unit: 'ชุด' },
    { id: 'P-003', name: 'สายพาน Fino / Mio', category: 'ระบบส่งกำลัง', brand: 'BANDO', costPrice: 180, sellPrice: 350, stock: 3, minStock: 5, unit: 'เส้น' },
    { id: 'P-004', name: 'หัวเทียน NGK CR7HSA', category: 'ระบบจุดระเบิด', brand: 'NGK', costPrice: 45, sellPrice: 80, stock: 30, minStock: 10, unit: 'หัว' },
    { id: 'P-005', name: 'ยางนอก IRC 70/90-17', category: 'ยางรถ', brand: 'IRC', costPrice: 450, sellPrice: 750, stock: 2, minStock: 4, unit: 'เส้น' },
    { id: 'P-006', name: 'แบตเตอรี่ YTZ5S (12V 5Ah)', category: 'ระบบไฟฟ้า', brand: 'FB', costPrice: 350, sellPrice: 550, stock: 6, minStock: 3, unit: 'ลูก' },
    { id: 'P-007', name: 'โซ่สเตอร์ 420-120L (Wave)', category: 'ระบบส่งกำลัง', brand: 'SSS', costPrice: 280, sellPrice: 450, stock: 4, minStock: 3, unit: 'ชุด' },
    { id: 'P-008', name: 'กรองอากาศ Click 125i', category: 'ระบบอากาศ', brand: 'HONDA', costPrice: 60, sellPrice: 120, stock: 8, minStock: 5, unit: 'ชิ้น' },
  ]);

  const [modalMode, setModalMode] = useState(null);
  const [selectedPartId, setSelectedPartId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ทั้งหมด');

  const initialFormState = {
    name: '',
    category: 'น้ำมัน',
    brand: '',
    costPrice: '',
    sellPrice: '',
    stock: '',
    minStock: '',
    unit: 'ชิ้น',
  };
  const [formData, setFormData] = useState(initialFormState);

  const categories = ['ทั้งหมด', 'น้ำมัน', 'ระบบเบรก', 'ระบบส่งกำลัง', 'ระบบจุดระเบิด', 'ยางรถ', 'ระบบไฟฟ้า', 'ระบบอากาศ', 'อื่นๆ'];

  // Summary calculations
  const totalParts = parts.length;
  const totalStockValue = parts.reduce((sum, p) => sum + p.costPrice * p.stock, 0);
  const lowStockParts = parts.filter(p => p.stock <= p.minStock);
  const outOfStockParts = parts.filter(p => p.stock === 0);

  const summaryCards = [
    { label: 'รายการอะไหล่ทั้งหมด', value: totalParts + ' รายการ', icon: Package, color: '#6366f1' },
    { label: 'มูลค่าสต็อกรวม (ต้นทุน)', value: totalStockValue.toLocaleString() + ' ฿', icon: Archive, color: '#14b8a6' },
    { label: 'สต็อกต่ำ / ใกล้หมด', value: lowStockParts.length + ' รายการ', icon: TrendingDown, color: '#f59e0b' },
    { label: 'สินค้าหมด', value: outOfStockParts.length + ' รายการ', icon: AlertTriangle, color: '#ef4444' },
  ];

  // Filter & search
  const filteredParts = parts.filter(p => {
    const matchCategory = filterCategory === 'ทั้งหมด' || p.category === filterCategory;
    const matchSearch = searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode, part = null) => {
    setModalMode(mode);
    if (part) {
      setSelectedPartId(part.id);
      setFormData({
        name: part.name,
        category: part.category,
        brand: part.brand,
        costPrice: part.costPrice.toString(),
        sellPrice: part.sellPrice.toString(),
        stock: part.stock.toString(),
        minStock: part.minStock.toString(),
        unit: part.unit,
      });
    } else {
      setSelectedPartId(null);
      setFormData(initialFormState);
    }
  };

  const closeModal = () => {
    setModalMode(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newPart = {
        id: 'P-' + String(parts.length + 1).padStart(3, '0'),
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        costPrice: Number(formData.costPrice),
        sellPrice: Number(formData.sellPrice),
        stock: Number(formData.stock),
        minStock: Number(formData.minStock),
        unit: formData.unit,
      };
      setParts([newPart, ...parts]);
    } else if (modalMode === 'edit') {
      setParts(parts.map(p =>
        p.id === selectedPartId
          ? {
              ...p,
              name: formData.name,
              category: formData.category,
              brand: formData.brand,
              costPrice: Number(formData.costPrice),
              sellPrice: Number(formData.sellPrice),
              stock: Number(formData.stock),
              minStock: Number(formData.minStock),
              unit: formData.unit,
            }
          : p
      ));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('คุณต้องการลบรายการอะไหล่นี้ใช่หรือไม่? ข้อมูลจะไม่สามารถกู้คืนได้')) {
      setParts(parts.filter(p => p.id !== id));
    }
  };

  const getStockBadge = (part) => {
    if (part.stock === 0) {
      return <span className="badge badge-out-of-stock">หมดสต็อก</span>;
    }
    if (part.stock <= part.minStock) {
      return <span className="badge badge-pending">สต็อกต่ำ</span>;
    }
    return <span className="badge badge-completed">ปกติ</span>;
  };

  return (
    <div className="animate-fade-in">
      <Header title="คลังอะไหล่" />

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

      {/* Parts Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '600px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="ค้นหาจากชื่อ, รหัส, ยี่ห้อ..."
                style={{ paddingLeft: '2.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '160px' }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => openModal('add')}>
            <Plus size={18} /> เพิ่มอะไหล่ใหม่
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>รหัส</th>
                <th>ชื่ออะไหล่</th>
                <th>หมวดหมู่</th>
                <th>ยี่ห้อ</th>
                <th>ต้นทุน</th>
                <th>ราคาขาย</th>
                <th>สต็อก</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <Package size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>ไม่พบรายการอะไหล่ที่ค้นหา</p>
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr key={part.id} style={part.stock <= part.minStock ? { background: 'rgba(239, 68, 68, 0.03)' } : {}}>
                    <td style={{ fontWeight: '500', color: 'var(--primary)' }}>{part.id}</td>
                    <td>
                      <div style={{ fontWeight: '500' }}>{part.name}</div>
                    </td>
                    <td>
                      <span style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--primary)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {part.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{part.brand}</td>
                    <td>{part.costPrice.toLocaleString()} ฿</td>
                    <td style={{ fontWeight: '600', color: 'var(--accent)' }}>{part.sellPrice.toLocaleString()} ฿</td>
                    <td>
                      <span style={{ fontWeight: '600', color: part.stock <= part.minStock ? 'var(--danger)' : 'var(--text-main)' }}>
                        {part.stock}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}> {part.unit}</span>
                    </td>
                    <td>{getStockBadge(part)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="ดูรายละเอียด" onClick={() => openModal('view', part)}>
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="แก้ไข" onClick={() => openModal('edit', part)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.4rem' }} title="ลบ" onClick={() => handleDelete(part.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>แสดง {filteredParts.length} จาก {parts.length} รายการ</p>
        </div>
      </div>

      {/* Low Stock Alert Panel */}
      {lowStockParts.length > 0 && (
        <div className="glass-panel" style={{ marginTop: '1.5rem', padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} style={{ color: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>แจ้งเตือนสต็อกต่ำ</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {lowStockParts.map(p => (
              <div key={p.id} style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '10px',
                padding: '0.6rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.85rem'
              }}>
                <span style={{ fontWeight: '600', color: 'var(--warning)' }}>{p.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>เหลือ</span>
                <span style={{ fontWeight: '700', color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}>{p.stock} {p.unit}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(ขั้นต่ำ: {p.minStock})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalMode && (
        <div className="modal-backdrop animate-fade-in" onClick={closeModal}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>
              {modalMode === 'add' ? 'เพิ่มอะไหล่ใหม่' : modalMode === 'edit' ? `แก้ไขอะไหล่ ${selectedPartId}` : `รายละเอียดอะไหล่ ${selectedPartId}`}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ชื่ออะไหล่</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" required placeholder="เช่น น้ำมันเครื่อง 10W-40 1 ลิตร" disabled={modalMode === 'view'} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">หมวดหมู่</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="form-control" disabled={modalMode === 'view'}>
                    {categories.filter(c => c !== 'ทั้งหมด').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ยี่ห้อ</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="form-control" required placeholder="เช่น NGK, BANDO" disabled={modalMode === 'view'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">ราคาต้นทุน (บาท)</label>
                  <input type="number" name="costPrice" value={formData.costPrice} onChange={handleInputChange} className="form-control" required placeholder="0" disabled={modalMode === 'view'} />
                </div>
                <div className="form-group">
                  <label className="form-label">ราคาขาย (บาท)</label>
                  <input type="number" name="sellPrice" value={formData.sellPrice} onChange={handleInputChange} className="form-control" required placeholder="0" disabled={modalMode === 'view'} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">จำนวนสต็อก</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="form-control" required placeholder="0" disabled={modalMode === 'view'} />
                </div>
                <div className="form-group">
                  <label className="form-label">สต็อกขั้นต่ำ</label>
                  <input type="number" name="minStock" value={formData.minStock} onChange={handleInputChange} className="form-control" required placeholder="0" disabled={modalMode === 'view'} />
                </div>
                <div className="form-group">
                  <label className="form-label">หน่วย</label>
                  <select name="unit" value={formData.unit} onChange={handleInputChange} className="form-control" disabled={modalMode === 'view'}>
                    <option value="ชิ้น">ชิ้น</option>
                    <option value="ชุด">ชุด</option>
                    <option value="ขวด">ขวด</option>
                    <option value="เส้น">เส้น</option>
                    <option value="หัว">หัว</option>
                    <option value="ลูก">ลูก</option>
                    <option value="กระป๋อง">กระป๋อง</option>
                    <option value="คู่">คู่</option>
                  </select>
                </div>
              </div>

              {/* Profit display in view/edit mode */}
              {(modalMode === 'view' || modalMode === 'edit') && formData.costPrice && formData.sellPrice && (
                <div style={{
                  background: 'rgba(20, 184, 166, 0.08)',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-around',
                  textAlign: 'center'
                }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>กำไรต่อชิ้น</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)', margin: 0 }}>
                      {(Number(formData.sellPrice) - Number(formData.costPrice)).toLocaleString()} ฿
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>อัตรากำไร</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)', margin: 0 }}>
                      {Number(formData.costPrice) > 0 ? ((Number(formData.sellPrice) - Number(formData.costPrice)) / Number(formData.costPrice) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>มูลค่าสต็อก</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent)', margin: 0 }}>
                      {(Number(formData.costPrice) * Number(formData.stock)).toLocaleString()} ฿
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
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
