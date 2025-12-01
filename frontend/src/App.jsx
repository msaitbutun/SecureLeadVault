import { useState, useEffect } from 'react';
import './App.css';

// SVG ICONS
const ShieldIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);
const LockIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>);
const AlertIcon = () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>);
const TrashIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', company: '', amount: '' });
  const [totalValue, setTotalValue] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // YENİ: Seçili satırları tutan state
  const [selectedIds, setSelectedIds] = useState([]);

  // Verileri Çek
  const fetchLeads = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leads');
      const data = await res.json();
      setLeads(data);
      const total = data.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      setTotalValue(total);
      setSelectedIds([]); // Veri yenilenince seçimleri sıfırla
    } catch (err) {
      console.error("Bağlantı hatası:", err);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  // Kayıt Ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.company || !form.amount) return;

    await fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ name: '', company: '', amount: '' });
    fetchLeads();
  };

  // --- YENİ: SİLME FONKSİYONLARI ---

  // 1. Seçili Olanları Sil
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`${selectedIds.length} adet kaydı silmek istediğinize emin misiniz?`)) return;

    await fetch('http://localhost:5000/api/leads/delete-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds })
    });
    fetchLeads();
  };

  // 2. Hepsini Sil
  const handleDeleteAll = async () => {
    if (!window.confirm("DİKKAT! Tüm veritabanı silinecek. Emin misiniz?")) return;

    await fetch('http://localhost:5000/api/leads', { method: 'DELETE' });
    fetchLeads();
  };

  // Checkbox Seçim Mantığı
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map(l => l._id));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
             <div className="stats-grid">
              <div className="card">
                <div className="stat-title">Toplam Potansiyel Ciro</div>
                <div className="stat-value">${totalValue.toLocaleString()}</div>
              </div>
              <div className="card">
                <div className="stat-title">Aktif Müşteri Adayı</div>
                <div className="stat-value">{leads.length}</div>
              </div>
              <div className="card">
                <div className="stat-title">Sistem Durumu</div>
                <div className="stat-value" style={{color: '#10b981', fontSize: '1.2rem'}}>Güvenli & Aktif</div>
              </div>
            </div>

            <div className="content-grid">
              <div className="card">
                <h3 style={{marginTop: 0, marginBottom: '20px'}}>Hızlı Ekle</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Müşteri Adı</label>
                    <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ad Soyad" />
                  </div>
                  <div className="form-group">
                    <label>Şirket</label>
                    <input className="input-field" value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Şirket Adı" />
                  </div>
                  <div className="form-group">
                    <label>Tutar ($)</label>
                    <input type="number" className="input-field" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" />
                  </div>
                  <button type="submit" className="btn-primary">Güvenli Kaydet</button>
                </form>
              </div>

              <div className="card" style={{padding: '0'}}>
                <div style={{padding: '20px', borderBottom: '1px solid #eee', fontWeight: 'bold'}}>Son Eklenenler</div>
                <table className="data-table">
                  <thead><tr><th>MÜŞTERİ</th><th>TUTAR</th></tr></thead>
                  <tbody>
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead._id}>
                        <td>{lead.name}</td>
                        <td className="amount-tag">${Number(lead.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'customers':
        return (
          <div className="card" style={{padding: '0'}}>
            {/* AKSİYON BAR */}
            <div style={{padding: '20px', borderBottom: '1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <h3>Tüm Müşteri Veritabanı</h3>
                <span style={{fontSize:'0.9rem', color:'#666'}}>{selectedIds.length} / {leads.length} seçildi</span>
              </div>
              
              <div style={{display:'flex', gap:'10px'}}>
                {selectedIds.length > 0 && (
                  <button onClick={handleDeleteSelected} className="btn-danger">
                    <TrashIcon /> Seçilenleri Sil ({selectedIds.length})
                  </button>
                )}
                {leads.length > 0 && (
                  <button onClick={handleDeleteAll} className="btn-danger-outline">
                    Veritabanını Temizle
                  </button>
                )}
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th style={{width: '40px'}}>
                    <input 
                      type="checkbox" 
                      onChange={toggleSelectAll} 
                      checked={leads.length > 0 && selectedIds.length === leads.length}
                    />
                  </th>
                  <th>ID</th>
                  <th>MÜŞTERİ</th>
                  <th>ŞİRKET</th>
                  <th>TARİH</th>
                  <th>TUTAR</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id} style={{background: selectedIds.includes(lead._id) ? '#fef2f2' : 'transparent'}}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(lead._id)}
                        onChange={() => toggleSelect(lead._id)}
                      />
                    </td>
                    <td style={{fontFamily:'monospace', color:'#999', fontSize:'0.8rem'}}>...{lead._id.slice(-6)}</td>
                    <td style={{fontWeight: 600}}>{lead.name}</td>
                    <td>{lead.company}</td>
                    <td style={{color: '#64748b'}}>{new Date(lead.date).toLocaleDateString('tr-TR')}</td>
                    <td className="amount-tag">${Number(lead.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'reports':
      case 'settings':
        return (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60vh', textAlign:'center'}}>
            <AlertIcon />
            <h2 style={{color: '#1e293b', marginBottom:'10px'}}>Erişim Kısıtlandı</h2>
            <p style={{color: '#64748b', maxWidth:'450px', lineHeight:'1.6'}}>
              Oturum açtığınız rol: <strong>Sales Representative (Level 1)</strong>.<br/>
              Kurumsal güvenlik politikaları gereği, finansal raporlara ve sistem konfigürasyonlarına erişiminiz bulunmamaktadır.
              <br/><br/>
              Lütfen <strong>IT Manager (Level 3)</strong> ile iletişime geçin.
            </p>
            <div style={{marginTop:'20px', padding:'10px 20px', background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:'6px', fontSize:'0.85rem', color:'#be123c', fontFamily:'monospace'}}>
              [Security Log]: Unauthorized access attempt recorded. ID: #USER_SAIT
            </div>
          </div>
        );
      
      default: return null;
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="brand"><ShieldIcon /> SecureVault</div>
        <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</div>
        <div className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>Müşteriler</div>
        <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Raporlar</div>
        <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} style={{ marginTop: 'auto' }} onClick={() => setActiveTab('settings')}>Ayarlar</div>
        
        <div style={{marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.85rem'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px'}}>
            <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center'}}>S</div>
            <div><div style={{fontWeight:'bold'}}>Sait B.</div><div style={{fontSize:'0.7rem', opacity:0.7, color:'#4ade80'}}>● Online</div></div>
          </div>
          <div style={{marginTop:'10px', fontSize:'0.75rem', color:'#94a3b8', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'5px'}}>Role: <span style={{color:'white', fontWeight:'600'}}>Sales Rep.</span></div>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <div>
            <h2>Lead Yönetimi</h2>
            <p style={{color: '#64748b', marginTop: '5px'}}>
              {activeTab === 'dashboard' && 'Genel Bakış ve İstatistikler'}
              {activeTab === 'customers' && 'Veritabanı Kayıtları'}
              {(activeTab === 'reports' || activeTab === 'settings') && 'Sistem Güvenliği'}
            </p>
          </div>
          <div className="security-badge"><LockIcon /> End-to-End Encrypted</div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;