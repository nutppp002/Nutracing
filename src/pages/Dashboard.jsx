import { Header } from '../components/Header';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const Dashboard = () => {
  const [jobs] = useLocalStorage('motofix_jobs', []);
  const [parts] = useLocalStorage('motofix_inventory', []);
  const [invoices] = useLocalStorage('motofix_invoices', []);

  // Compute stats
  const activeJobs = jobs.filter(j => j.status === 'กำลังซ่อม').length;
  const pendingJobs = jobs.filter(j => j.status === 'รอดำเนินการ' || j.status === 'รออะไหล่').length;
  const lowStock = parts.filter(p => p.stock <= p.minStock).length;
  
  // Compute today's revenue
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = invoices
    .filter(inv => inv.status === 'ชำระแล้ว' && inv.date === today)
    .reduce((sum, inv) => {
      const invTotal = inv.items.reduce((itemSum, i) => itemSum + (Number(i.qty) * Number(i.unitPrice)), 0);
      return sum + invTotal;
    }, 0);

  const stats = [
    { title: 'งานกำลังซ่อม', value: activeJobs.toString(), color: 'var(--primary)' },
    { title: 'งานรอดำเนินการ', value: pendingJobs.toString(), color: 'var(--warning)' },
    { title: 'อะไหล่ใกล้หมด', value: lowStock.toString(), color: 'var(--danger)' },
    { title: 'รายได้วันนี้', value: `฿ ${todayRevenue.toLocaleString()}`, color: 'var(--success)' },
  ];

  // Get latest completed jobs
  const recentActivities = jobs
    .filter(j => j.status === 'เสร็จสิ้น')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      <Header title="แดชบอร์ด" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ borderTop: `4px solid ${stat.color}` }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{stat.title}</p>
            <h2 style={{ fontSize: '2rem', marginBottom: 0, color: 'var(--text-main)' }}>{stat.value}</h2>
          </div>
        ))}
      </div>
      
      {/* Activity Area */}
      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem' }}>งานซ่อมที่เสร็จสิ้นล่าสุด</h3>
        {recentActivities.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map(job => (
              <div key={job.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div>
                  <p style={{ marginBottom: '0.25rem', color: 'var(--text-main)' }}>งานซ่อม #{job.id} เสร็จสมบูรณ์</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.vehicleModel} - {job.issue}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>ยังไม่มีข้อมูลงานซ่อมที่เสร็จสิ้น</p>
        )}
      </div>
    </div>
  );
};
