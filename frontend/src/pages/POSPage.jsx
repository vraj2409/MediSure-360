import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiSearch, FiShoppingCart, FiTrash2, FiPlus, FiMinus,
  FiX, FiCheckCircle, FiUser, FiCreditCard, FiTag, FiPackage
} from 'react-icons/fi';
import { MdOutlinePointOfSale } from 'react-icons/md';

export default function POSPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [customerName, setCustomerName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [processing, setProcessing] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim().length < 1) { setResults([]); setShowResults(false); return; }
    const t = setTimeout(async () => {
      try {
        const res = await api.get('/medicines/search', { params: { query: search } });
        setResults(res.data.data);
        setShowResults(true);
      } catch { setResults([]); }
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  const addToCart = (med) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === med._id);
      if (exists) {
        if (exists.qty >= med.quantityInStock) { toast.error(`Only ${med.quantityInStock} in stock`); return prev; }
        return prev.map(i => i._id === med._id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...med, qty: 1 }];
    });
    setSearch(''); setShowResults(false);
    searchRef.current?.focus();
    toast.success(`${med.name} added`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i._id !== id) return i;
      const newQty = i.qty + delta;
      if (newQty <= 0) return null;
      if (newQty > i.quantityInStock) { toast.error(`Max stock: ${i.quantityInStock}`); return i; }
      return { ...i, qty: newQty };
    }).filter(Boolean));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const subtotal = cart.reduce((s, i) => s + i.qty * i.sellingPrice, 0);
  const discountAmt = Math.min(discount, subtotal);
  const total = Math.max(0, subtotal - discountAmt);

  const handleFinalize = async () => {
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    setProcessing(true);
    try {
      const res = await api.post('/sales', {
        items: cart.map(i => ({ medicineId: i._id, quantity: i.qty })),
        discount: discountAmt, paymentMethod,
        customerName: customerName || 'Walk-in Customer'
      });
      toast.success('Sale completed!');
      setCart([]); setDiscount(0); setCustomerName('');
      navigate(`/receipt/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sale failed');
    } finally { setProcessing(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MdOutlinePointOfSale size={24} style={{ color: 'var(--accent)' }} />
            Point of Sale
          </div>
          <div className="page-subtitle">Search medicines and create bills</div>
        </div>
      </div>

      <div className="page-content">
        <div className="pos-grid">
          {/* Left: Search + Cart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>

            {/* Search */}
            <div className="card" style={{ padding: '14px 16px' }}>
              <div style={{ position: 'relative' }}>
                <div className="search-box">
                  <span className="search-icon"><FiSearch size={14} /></span>
                  <input
                    ref={searchRef}
                    className="form-control"
                    placeholder="Search for medicine by name or batch..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    onBlur={() => setTimeout(() => setShowResults(false), 150)}
                    autoFocus
                  />
                </div>
                {showResults && results.length > 0 && (
                  <div className="search-dropdown">
                    {results.map(med => (
                      <div key={med._id} className="search-dropdown-item" onMouseDown={() => addToCart(med)}>
                        <div>
                          <div className="search-item-name">{med.name}</div>
                          <div className="search-item-meta">{med.manufacturer} · Batch: {med.batchNumber} · Stock: {med.quantityInStock}</div>
                        </div>
                        <div className="search-item-price">${med.sellingPrice?.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {showResults && results.length === 0 && search.length > 1 && (
                  <div className="search-dropdown" style={{ padding: '14px', textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
                    No medicines found for "{search}"
                  </div>
                )}
              </div>
            </div>

            {/* Cart */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiShoppingCart size={14} style={{ color: 'var(--text2)' }} />
                <span className="card-title">Current Bill</span>
                {cart.length > 0 && (
                  <span className="badge badge-blue" style={{ fontFamily: 'var(--mono)' }}>{cart.length} item(s)</span>
                )}
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon"><FiShoppingCart size={40} /></div>
                    <div className="empty-text">Bill is empty</div>
                    <div className="empty-sub">Search for a medicine above to add it</div>
                  </div>
                ) : cart.map(item => (
                  <div key={item._id} className="cart-item">
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiPackage size={15} style={{ color: 'var(--text2)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-meta" style={{ fontFamily: 'var(--mono)' }}>${item.sellingPrice?.toFixed(2)} each · Stock: {item.quantityInStock}</div>
                    </div>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item._id, -1)}><FiMinus size={12} /></button>
                      <span className="qty-display">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, 1)}><FiPlus size={12} /></button>
                    </div>
                    <div className="cart-item-price">${(item.qty * item.sellingPrice).toFixed(2)}</div>
                    <button className="remove-btn" onClick={() => removeItem(item._id)}><FiX size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Bill Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ flex: 1 }}>
              <div className="card-header">
                <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiCreditCard size={13} /> Bill Summary
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiUser size={11} /> Customer Name
                </label>
                <input className="form-control" placeholder="Walk-in Customer" value={customerName} onChange={e => setCustomerName(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiCreditCard size={11} /> Payment Method
                </label>
                <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                  {['Cash', 'Card', 'UPI', 'Other'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <FiTag size={11} /> Discount ($)
                </label>
                <input
                  type="number" min="0" step="0.01"
                  className="form-control"
                  value={discount}
                  onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  style={{ fontFamily: 'var(--mono)' }}
                />
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border2)' }}>
                <div className="bill-row">
                  <span className="label">Subtotal</span>
                  <span className="amount">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="bill-row">
                    <span className="label" style={{ color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FiTag size={12} /> Discount
                    </span>
                    <span className="amount" style={{ color: 'var(--red)' }}>−${discountAmt.toFixed(2)}</span>
                  </div>
                )}
                <div className="bill-row total">
                  <span>Total</span>
                  <span className="amount">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg w-full"
              onClick={handleFinalize}
              disabled={cart.length === 0 || processing}
              style={{ fontSize: 15, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <FiCheckCircle size={18} />
              {processing ? 'Processing...' : 'Finalize & Generate Bill'}
            </button>

            <button
              className="btn btn-secondary w-full"
              onClick={() => { setCart([]); setDiscount(0); setCustomerName(''); }}
              disabled={cart.length === 0}
              style={{ color: 'var(--red)', borderColor: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <FiTrash2 size={15} /> Clear Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}