import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiFileText, FiCalendar, FiX, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    api.get('/sales', { params }).then(res => {
      setSales(res.data.data);
      setTotalPages(res.data.pages);
    }).finally(() => setLoading(false));
  }, [page, startDate, endDate]);

  const totalRevenue = sales.reduce((s, sale) => s + sale.totalAmount, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Sales History</div>
          <div className="page-subtitle">All transactions and billing records</div>
        </div>
      </div>

      <div className="page-content">
        <div className="card mb-4" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiCalendar size={14} style={{ color: 'var(--text2)' }} />
              <label className="form-label" style={{ margin: 0 }}>From</label>
              <input type="date" className="form-control" style={{ width: 160 }} value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label className="form-label" style={{ margin: 0 }}>To</label>
              <input type="date" className="form-control" style={{ width: 160 }} value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} />
            </div>
            {(startDate || endDate) && (
              <button className="btn btn-secondary btn-sm" onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <FiX size={12} /> Clear
              </button>
            )}
            {sales.length > 0 && (
              <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 600, fontSize: 15 }}>
                Total: ${totalRevenue.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : sales.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FiFileText size={42} /></div>
                <div className="empty-text">No sales found</div>
                <div className="empty-sub">Try adjusting the date range</div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th><th>Date & Time</th><th>Customer</th>
                    <th>Items</th><th>Payment</th><th>Discount</th><th>Total</th><th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale._id}>
                      <td className="id-cell">{sale.transactionId}</td>
                      <td>
                        <div style={{ fontSize: 13 }}>{new Date(sale.createdAt).toLocaleDateString()}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td style={{ fontSize: 13 }}>{sale.customerName}</td>
                      <td><span className="badge badge-blue" style={{ fontFamily: 'var(--mono)' }}>{sale.items?.length}</span></td>
                      <td><span className="badge badge-gray">{sale.paymentMethod}</span></td>
                      <td style={{ fontFamily: 'var(--mono)', color: sale.discount > 0 ? 'var(--red)' : 'var(--text3)', fontSize: 13 }}>
                        {sale.discount > 0 ? `−$${sale.discount?.toFixed(2)}` : '—'}
                      </td>
                      <td className="price-cell">${sale.totalAmount?.toFixed(2)}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/receipt/${sale._id}`)} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <FiEye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '16px', borderTop: '1px solid var(--border2)' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <FiChevronLeft size={14} /> Prev
              </button>
              <span style={{ padding: '5px 10px', fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                {page} / {totalPages}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Next <FiChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}