import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage, FiAlertTriangle, FiClock, FiXCircle, FiFilter } from 'react-icons/fi';

const CATEGORIES = ['All', 'Antibiotics', 'Analgesics', 'Antacids', 'Antihistamines', 'Cardiovascular', 'Diabetes', 'Vitamins', 'Respiratory', 'Neurological', 'Other'];

export default function InventoryPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (filter === 'lowStock') params.lowStock = true;
      if (filter === 'expiring') params.expiring = true;
      if (filter === 'expired') params.expired = true;
      params.limit = 200;
      const res = await api.get('/medicines', { params });
      setMedicines(res.data.data);
    } catch { toast.error('Failed to load medicines'); }
    finally { setLoading(false); }
  }, [search, category, filter]);

  useEffect(() => {
    if (searchParams.get('lowStock')) setFilter('lowStock');
    fetchMedicines();
  }, [fetchMedicines]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/medicines/${id}`);
      toast.success('Medicine deleted');
      setDeleteId(null);
      fetchMedicines();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const getExpiryBadge = (med) => {
    const days = med.daysUntilExpiry;
    if (days <= 0)  return <span className="badge badge-red">Expired</span>;
    if (days <= 30) return <span className="badge badge-red">{days}d left</span>;
    if (days <= 90) return <span className="badge badge-yellow">{days}d left</span>;
    return <span className="badge badge-green">Good</span>;
  };

  const getStockBadge = (qty) => {
    if (qty === 0)   return <span className="badge badge-red">Out of Stock</span>;
    if (qty <= 10)   return <span className="badge badge-yellow" style={{ fontFamily: 'var(--mono)' }}>{qty}</span>;
    return <span className="badge badge-green" style={{ fontFamily: 'var(--mono)' }}>{qty}</span>;
  };

  const filterButtons = [
    { val: 'all',      label: 'All',          icon: <FiPackage size={12} />       },
    { val: 'lowStock', label: 'Low Stock',     icon: <FiAlertTriangle size={12} /> },
    { val: 'expiring', label: 'Expiring',      icon: <FiClock size={12} />         },
    { val: 'expired',  label: 'Expired',       icon: <FiXCircle size={12} />       },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Inventory</div>
          <div className="page-subtitle">{medicines.length} medicine{medicines.length !== 1 ? 's' : ''} found</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/inventory/add')}>
          <FiPlus size={15} /> Add Medicine
        </button>
      </div>

      <div className="page-content">
        <div className="card mb-4" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
              <span className="search-icon"><FiSearch size={14} /></span>
              <input className="form-control" placeholder="Search by name, batch, manufacturer..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-control" style={{ width: 160 }} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <FiFilter size={13} style={{ color: 'var(--text2)' }} />
              {filterButtons.map(({ val, label, icon }) => (
                <button key={val} className={`btn btn-sm ${filter === val ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(val)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : medicines.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FiPackage size={42} /></div>
                <div className="empty-text">No medicines found</div>
                <div className="empty-sub">Try adjusting your filters</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Batch</th><th>Category</th><th>Location</th>
                    <th>Stock</th><th>Sell Price</th><th>Expiry</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map(med => (
                    <tr key={med._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{med.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)' }}>{med.manufacturer}</div>
                      </td>
                      <td className="mono-cell">{med.batchNumber}</td>
                      <td><span className="badge badge-blue">{med.category}</span></td>
                      <td><span className="badge badge-gray">{med.location}</span></td>
                      <td>{getStockBadge(med.quantityInStock)}</td>
                      <td className="price-cell">${med.sellingPrice?.toFixed(2)}</td>
                      <td className="mono-cell" style={{ fontSize: 12 }}>{new Date(med.expiryDate).toLocaleDateString()}</td>
                      <td>{getExpiryBadge(med)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/inventory/edit/${med._id}`)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <FiEdit2 size={12} /> Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(med._id)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiTrash2 size={16} style={{ color: 'var(--red)' }} /> Confirm Delete</span>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text2)', fontSize: 14 }}>Are you sure you want to delete this medicine? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiTrash2 size={13} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}