import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiPlusCircle, FiTrendingUp } from 'react-icons/fi';
import { MdOutlineMedication, MdOutlineInventory2, MdOutlineAttachMoney } from 'react-icons/md';

const CATEGORIES = ['Antibiotics', 'Analgesics', 'Antacids', 'Antihistamines', 'Cardiovascular', 'Diabetes', 'Vitamins', 'Respiratory', 'Neurological', 'Other'];
const EMPTY = { name: '', manufacturer: '', batchNumber: '', location: 'A1', category: 'Other', purchasePrice: '', sellingPrice: '', expiryDate: '', quantityInStock: '', description: '' };

export default function AddMedicinePage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      api.get(`/medicines/${id}`).then(res => {
        const m = res.data.data;
        setForm({ name: m.name, manufacturer: m.manufacturer, batchNumber: m.batchNumber, location: m.location, category: m.category, purchasePrice: m.purchasePrice, sellingPrice: m.sellingPrice, quantityInStock: m.quantityInStock, expiryDate: m.expiryDate?.split('T')[0] || '', description: m.description || '' });
      }).catch(() => toast.error('Failed to load medicine')).finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = e => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) { await api.put(`/medicines/${id}`, form); toast.success('Medicine updated!'); }
      else { await api.post('/medicines', form); toast.success('Medicine added!'); }
      navigate('/inventory');
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="loading-center"><div className="spinner" /></div>;

  const margin = form.purchasePrice && form.sellingPrice
    ? (((form.sellingPrice - form.purchasePrice) / form.purchasePrice) * 100).toFixed(1) : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Edit Medicine' : 'Add New Medicine'}</div>
          <div className="page-subtitle">{isEdit ? 'Update medicine details' : 'Add a new medicine to your inventory'}</div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/inventory')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FiArrowLeft size={15} /> Back
        </button>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>

            <div className="card mb-4">
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MdOutlineMedication size={14} /> Basic Information
                </span>
              </div>
              <div className="form-grid">
                <div className="form-group full">
                  <label className="form-label">Medicine Name *</label>
                  <input name="name" className="form-control" value={form.name} onChange={handleChange} placeholder="e.g. Paracetamol 500mg" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Manufacturer *</label>
                  <input name="manufacturer" className="form-control" value={form.manufacturer} onChange={handleChange} placeholder="e.g. Apex Pharma" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Number *</label>
                  <input name="batchNumber" className="form-control" value={form.batchNumber} onChange={handleChange} placeholder="e.g. APX1001" required disabled={isEdit} style={{ fontFamily: 'var(--mono)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Storage Location</label>
                  <input name="location" className="form-control" value={form.location} onChange={handleChange} placeholder="e.g. Rack A1" style={{ fontFamily: 'var(--mono)' }} />
                </div>
                <div className="form-group full">
                  <label className="form-label">Description</label>
                  <input name="description" className="form-control" value={form.description} onChange={handleChange} placeholder="Brief description of the medicine" />
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MdOutlineAttachMoney size={14} /> Pricing & Stock
                </span>
                {margin && (
                  <span className={`badge ${Number(margin) >= 0 ? 'badge-green' : 'badge-red'}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiTrendingUp size={11} /> Margin: {margin}%
                  </span>
                )}
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Purchase Price ($) *</label>
                  <input name="purchasePrice" type="number" step="0.01" min="0" className="form-control" value={form.purchasePrice} onChange={handleChange} placeholder="0.00" required style={{ fontFamily: 'var(--mono)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Selling Price ($) *</label>
                  <input name="sellingPrice" type="number" step="0.01" min="0" className="form-control" value={form.sellingPrice} onChange={handleChange} placeholder="0.00" required style={{ fontFamily: 'var(--mono)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity in Stock *</label>
                  <input name="quantityInStock" type="number" min="0" className="form-control" value={form.quantityInStock} onChange={handleChange} placeholder="0" required style={{ fontFamily: 'var(--mono)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date *</label>
                  <input name="expiryDate" type="date" className="form-control" value={form.expiryDate} onChange={handleChange} required style={{ fontFamily: 'var(--mono)' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/inventory')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiArrowLeft size={14} /> Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isEdit ? <><FiSave size={15} /> {loading ? 'Saving...' : 'Update Medicine'}</> : <><FiPlusCircle size={15} /> {loading ? 'Adding...' : 'Add Medicine'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}