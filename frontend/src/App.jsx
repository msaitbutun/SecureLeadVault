import { useState, useEffect } from 'react';
import './App.css';

// SVG Icons
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const AlertIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: '', company: '', amount: '' });
  const [totalValue, setTotalValue] = useState(0);
  
  // Hangi sekmenin açık olduğunu tutan state
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchLeads = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leads');
      const data = await res.json();
      setLeads(data);
      const total = data.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      setTotalValue(total);
    } catch (err) {
      console.error("Bağlantı hatası:", err);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

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

  // İçerik Değiştirici Fonksiyon
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
             {/* İSTATİSTİKLER */}
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

            {/* FORM VE KISA TABLO */}
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
            <div style={{padding: '20px', borderBottom: '1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3>Tüm Müşteri Veritabanı</h3>
              <span style={{fontSize:'0.9rem', color:'#666'}}>{leads.length} Kayıt Listeleniyor</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>MÜŞTERİ</th>
                  <th>ŞİRKET</th>
                  <th>TARİH</th>
                  <th>TUTAR</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead._id}>
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
            <h2 style={{color: '#1e293b', marginBottom:'10px'}}>Erişim Engellendi</h2>
            <p style={{color: '#64748b', maxWidth:'400px'}}>
              Bu alan <strong>Yüksek Güvenlikli (Level 3)</strong> yetki gerektirir. 
              Mevcut kullanıcı rolünüz (Viewer) hassas raporlara ve sistem ayarlarına erişemez.
            </p>
            <div style={{marginTop:'20px', padding:'10px 20px', background:'#f1f5f9', borderRadius:'6px', fontSize:'0.9rem', color:'#334155'}}>
              Error Code: 403_FORBIDDEN_ACCESS
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* SOL SIDEBAR */}
      <div className="sidebar">
        <div className="brand">
          <ShieldIcon /> SecureVault
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          Müşteriler
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Raporlar
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          style={{ marginTop: 'auto' }}
          onClick={() => setActiveTab('settings')}
        >
          Ayarlar
        </div>
      </div>

      {/* ANA İÇERİK */}
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
          <div className="security-badge">
            <LockIcon /> End-to-End Encrypted
          </div>
          {/* ... Ayarlar butonu yukarda ... */}

<div style={{marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.85rem'}}>
  <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'5px'}}>
    <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center'}}>S</div>
    <div>
      <div style={{fontWeight:'bold'}}>Sait B.</div>
      <div style={{fontSize:'0.7rem', opacity:0.7, color:'#4ade80'}}>● Online</div>
    </div>
  </div>
  <div style={{marginTop:'10px', fontSize:'0.75rem', color:'#000bdfff', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'5px'}}>
    Role: <span style={{color:'red', fontWeight:'600'}}>Sales Rep.</span>
  </div>
</div>

{/* </div> sidebar kapanış etiketi burada */}
        </div>

        {renderContent()}
        
      </div>
    </div>
  );
}

export default App;