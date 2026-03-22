import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiPackage, FiDollarSign, FiAlertTriangle, FiClock, FiPlus, FiShoppingCart, FiFileText, FiAlertCircle } from 'react-icons/fi';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/medicines/stats'),
      api.get('/sales?limit=5'),
      api.get('/medicines?lowStock=true&limit=5')
    ]).then(([statsRes, salesRes, lowRes]) => {
      setStats(statsRes.data.data);
      setRecentSales(salesRes.data.data);
      setLowStock(lowRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      Loading dashboard...
    </div>
  );

  const statCards = [
    { label: 'Total Medicines', value: stats?.totalMedicines ?? 0,                        color: 'blue',   icon: <FiPackage size={18} />       },
    { label: 'Stock Value',     value: `$${(stats?.totalStockValue ?? 0).toFixed(0)}`,    color: 'green',  icon: <FiDollarSign size={18} />    },
    { label: 'Low Stock Items', value: stats?.lowStockCount ?? 0,                          color: 'red',    icon: <FiAlertTriangle size={18} />, link: '/inventory?lowStock=true' },
    { label: 'Expiring Soon',   value: stats?.expiringCount ?? 0,                          color: 'yellow', icon: <FiClock size={18} />,         link: '/expiry' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome back — here's your store overview</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => navigate('/inventory/add')}>
            <FiPlus size={15} /> Add Medicine
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/pos')}>
            <FiShoppingCart size={15} /> New Sale
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="stats-grid mb-4">
          {statCards.map(s => (
            <div key={s.label} className={`stat-card ${s.color}`} onClick={() => s.link && navigate(s.link)} style={{ cursor: s.link ? 'pointer' : 'default' }}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className={`stat-value ${s.color}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiFileText size={13} /> Recent Transactions
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sales')}>View All</button>
            </div>
            {recentSales.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FiFileText size={38} /></div>
                <div className="empty-text">No sales yet</div>
              </div>
            ) : recentSales.map(sale => (
              <div key={sale._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--blue)' }}>{sale.transactionId}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                    {sale.items?.length} item(s) · {sale.paymentMethod} · {new Date(sale.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--accent)', fontSize: 14 }}>
                  ${sale.totalAmount?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiAlertCircle size={13} /> Low Stock Alert
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/inventory')}>View All</button>
            </div>
            {lowStock.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FiPackage size={38} /></div>
                <div className="empty-text">All stock levels OK</div>
              </div>
            ) : lowStock.map(med => (
              <div key={med._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border2)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{med.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{med.manufacturer} · {med.location}</div>
                </div>
                <span className={`badge ${med.quantityInStock === 0 ? 'badge-red' : 'badge-yellow'}`}>
                  {med.quantityInStock === 0 ? 'Out of Stock' : `${med.quantityInStock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}