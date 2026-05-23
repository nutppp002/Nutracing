import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Header } from '../components/Header';
import { Plus, Search, Edit2, Trash2, Eye, X } from 'lucide-react';

export const Jobs = () => {
  const [jobs, setJobs] = useLocalStorage('motofix_jobs', [
    { id: 'JOB-001', customer: 'สมชาย', phone: '081-234-5678', vehicleModel: 'Honda Wave 110i', licensePlate: '1กข 1234', issue: 'ถ่ายน้ำมันเครื่อง, เช็คเบรก', estimatedPrice: '500', status: 'เสร็จสิ้น', date: '2026-05-23' },
    { id: 'JOB-002', customer: 'สมศรี', phone: '089-876-5432', vehicleModel: 'Yamaha Fino', licensePlate: '2ขค 5678', issue: 'สตาร์ทไม่ติด', estimatedPrice: '', status: 'กำลังซ่อม', date: '2026-05-23' },
    { id: 'JOB-003', customer: 'มานะ', phone: '085-555-1234', vehicleModel: 'Honda PCX 150', licensePlate: '3คง 9012', issue: 'เปลี่ยนยางหลัง', estimatedPrice: '1200', status: 'รอดำเนินการ', date: '2026-05-23' },
  ]);

  const [modalMode, setModalMode] = useState(null); // 'add', 'edit', 'view', null
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  const initialFormState = {
    customer: '',
    phone: '',
    licensePlate: '',
    vehicleModel: '',
    issue: '',
    estimatedPrice: '',
    status: 'รอดำเนินการ'
  };
  const [formData, setFormData] = useState(initialFormState);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'เสร็จสิ้น': return <span className="badge badge-completed">{status}</span>;
      case 'กำลังซ่อม': return <span className="badge badge-progress">{status}</span>;
      case 'รอดำเนินการ': return <span className="badge badge-pending">{status}</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (mode, job = null) => {
    setModalMode(mode);
    if (job) {
      setSelectedJobId(job.id);
      setFormData({
        customer: job.customer,
        phone: job.phone || '',
        licensePlate: job.licensePlate,
        vehicleModel: job.vehicleModel,
        issue: job.issue,
        estimatedPrice: job.estimatedPrice || '',
        status: job.status
      });
    } else {
      setSelectedJobId(null);
      setFormData(initialFormState);
    }
  };

  const closeModal = () => {
    setModalMode(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newJob = {
        id: `JOB-00${jobs.length + 1}`,
        customer: formData.customer,
        phone: formData.phone,
        vehicleModel: formData.vehicleModel,
        licensePlate: formData.licensePlate,
        issue: formData.issue,
        estimatedPrice: formData.estimatedPrice,
        status: formData.status,
        date: new Date().toISOString().split('T')[0]
      };
      setJobs([newJob, ...jobs]);
    } else if (modalMode === 'edit') {
      setJobs(jobs.map(job => 
        job.id === selectedJobId 
          ? { ...job, ...formData }
          : job
      ));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if(window.confirm('คุณต้องการลบรายการงานซ่อมนี้ใช่หรือไม่? ข้อมูลจะไม่สามารถกู้คืนได้')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <Header title="จัดการงานซ่อม" />
      
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="form-control" placeholder="ค้นหาจากรหัสงาน, ป้ายทะเบียน..." style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => openModal('add')}>
            <Plus size={18} /> เพิ่มงานซ่อมใหม่
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>รหัสงาน</th>
                <th>วันที่</th>
                <th>ลูกค้า</th>
                <th>รถจักรยานยนต์</th>
                <th>อาการเสีย</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ fontWeight: '500', color: 'var(--primary)' }}>{job.id}</td>
                  <td>{job.date}</td>
                  <td>{job.customer}</td>
                  <td>{job.vehicleModel} <br/><small style={{color:'var(--text-muted)'}}>{job.licensePlate}</small></td>
                  <td>{job.issue}</td>
                  <td>{getStatusBadge(job.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="ดูรายละเอียด" onClick={() => openModal('view', job)}>
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem' }} title="แก้ไข" onClick={() => openModal('edit', job)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.4rem' }} title="ลบ" onClick={() => handleDelete(job.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="modal-backdrop animate-fade-in" onClick={closeModal}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: '1.5rem' }}>
              {modalMode === 'add' ? 'เพิ่มงานซ่อมใหม่ (รับรถ)' : modalMode === 'edit' ? `แก้ไขงานซ่อม ${selectedJobId}` : `รายละเอียดงานซ่อม ${selectedJobId}`}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">ชื่อลูกค้า</label>
                  <input type="text" name="customer" value={formData.customer} onChange={handleInputChange} className="form-control" required placeholder="เช่น สมชาย ใจดี" disabled={modalMode === 'view'} />
                </div>
                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" required placeholder="08x-xxx-xxxx" disabled={modalMode === 'view'} />
                </div>
                <div className="form-group">
                  <label className="form-label">ยี่ห้อ/รุ่นรถ</label>
                  <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} className="form-control" required placeholder="เช่น Honda Wave 110i" disabled={modalMode === 'view'} />
                </div>
                <div className="form-group">
                  <label className="form-label">ป้ายทะเบียน</label>
                  <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} className="form-control" required placeholder="เช่น 1กข 1234 กทม." disabled={modalMode === 'view'} />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">อาการเสียเบื้องต้น / สิ่งที่ต้องทำ</label>
                <textarea name="issue" value={formData.issue} onChange={handleInputChange} className="form-control" rows="3" required placeholder="ระบุอาการเสีย หรือความต้องการของลูกค้า..." disabled={modalMode === 'view'}></textarea>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">สถานะงานซ่อม</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="form-control" disabled={modalMode === 'view'}>
                    <option value="รอดำเนินการ">รอดำเนินการ</option>
                    <option value="กำลังซ่อม">กำลังซ่อม</option>
                    <option value="รออะไหล่">รออะไหล่</option>
                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ประเมินราคาเบื้องต้น (บาท)</label>
                  <input type="number" name="estimatedPrice" value={formData.estimatedPrice} onChange={handleInputChange} className="form-control" placeholder="ปล่อยว่างได้หากยังไม่ทราบ" disabled={modalMode === 'view'} />
                </div>
              </div>

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
