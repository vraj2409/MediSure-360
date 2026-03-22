import { useState, useEffect } from 'react';
import { FiXCircle, FiAlertOctagon, FiAlertTriangle, FiGrid, FiFilter } from 'react-icons/fi';
import { MdOutlineCalendarToday } from 'react-icons/md';
import api from '../utils/api';

export default function ExpiryAlertPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('expiring');

  useEffect(() => {
    setLoading(true);
    const params = { limit: 200 };
    if (filter === 'expiring') params.expiring = true;
    if (filter === 'expired') params.expired = true;
    api.get('/medicines', { params }).then(res => setMedicines(res.data.data)).finally(() => setLoading(false));
  }, [filter]);

  const getExpiryInfo = (med) => {
    const days = med.daysUntilExpiry;
    if (days <= 0) return { label: `Expired ${Math.abs(days)}d ago`, class: 'badge-red' };
    if (days <= 30) return { label: `${days} days left`, class: 'badge-red' };
    if (days <= 60) return { label: `${days} days left`, class: 'badge-yellow' };
    return { label: `${days} days left`, class: 'badge-yellow' };
  };

  const expired  = medicines.filter(m => m.daysUntilExpiry <= 0).length;
  const critical = medicines.filter(m => m.daysUntilExpiry > 0 && m.daysUntilExpiry <= 30).length;
  const warning  = medicines.filter(m => m.daysUntilExpiry > 30 && m.daysUntilExpiry <= 90).length;

  const statCards = [
    { label: 'Already Expired',    value: expired,           color: 'red',    icon: <FiXCircle size={20} />      },
    { label: 'Critical (≤30 days)', value: critical,          color: 'red',    icon: <FiAlertOctagon size={20} /> },
    { label: 'Warning (31–90 days)', value: warning,          color: 'yellow', icon: <FiAlertTriangle size={20} />},
    { label: 'Total Shown',         value: medicines.length,  color: 'blue',   icon: <FiGrid size={20} />         },
  ];

  const filterButtons = [
    { val: 'expiring', label: 'Expiring Soon (≤90d)', icon: <FiAlertTriangle size={13} /> },
    { val: 'expired',  label: 'Expired',              icon: <FiXCircle size={13} />       },
    { val: 'all',      label: 'All',                  icon: <FiGrid size={13} />          },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Expiry Alerts</div>
          <div className="page-subtitle">Monitor medicines nearing or past expiry date</div>
        </div>
      </div>

      <div className="page-content">
        {/* Stat Cards */}
        <div className="stats-grid mb-4">
          {statCards.map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className={`stat-value ${s.color}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="card mb-4" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <FiFilter size={14} style={{ color: 'var(--text2)', marginRight: 4 }} />
            {filterButtons.map(({ val, label, icon }) => (
              <button
                key={val}
                className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(val)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : medicines.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FiAlertTriangle size={42} style={{ opacity: 0.35 }} />
                </div>
                <div className="empty-text">No expiry alerts</div>
                <div className="empty-sub">All medicines are within safe expiry range</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Batch</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Stock Qty</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines
                    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
                    .map(med => {
                      const info = getExpiryInfo(med);
                      return (
                        <tr key={med._id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{med.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{med.manufacturer}</div>
                          </td>
                          <td>
                            <span className="font-mono" style={{ fontSize: 12 }}>{med.batchNumber}</span>
                          </td>
                          <td>
                            <span className="badge badge-blue">{med.category}</span>
                          </td>
                          <td>
                            <span className="badge badge-gray">{med.location}</span>
                          </td>
                          <td>
                            <span className={`badge ${med.quantityInStock <= 10 ? 'badge-red' : 'badge-gray'}`}>
                              {med.quantityInStock}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'var(--mono)' }}>
                              <MdOutlineCalendarToday size={13} style={{ color: 'var(--text2)' }} />
                              {new Date(med.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${info.class}`}>{info.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}