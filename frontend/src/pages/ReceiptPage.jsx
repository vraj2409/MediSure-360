import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiPrinter, FiPlusCircle, FiCheckCircle } from 'react-icons/fi';

export default function ReceiptPage() {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/sales/${id}`).then(res => setSale(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!sale) return <div className="loading-center">Sale not found</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Receipt</div>
          <div className="page-subtitle" style={{ fontFamily: 'var(--mono)' }}>Transaction {sale.transactionId}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiPrinter size={15} /> Print
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/pos')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiPlusCircle size={15} /> New Sale
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="receipt">
          <div className="receipt-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <FiCheckCircle size={32} style={{ opacity: 0.9 }} />
            </div>
            <h2>MediSure360</h2>
            <p>Official Sale Receipt</p>
          </div>

          <div className="receipt-body">
            <div className="receipt-meta">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>{sale.transactionId}</div>
                <div style={{ marginTop: 2 }}>{new Date(sale.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{sale.customerName}</div>
                <div style={{ marginTop: 2 }}>{sale.paymentMethod}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr>
                  {['Medicine', 'Qty', 'Price', 'Total'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Medicine' ? 'left' : 'right', fontSize: 10, color: 'var(--text2)', paddingBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'var(--font)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sale.items?.map((item, i) => (
                  <tr key={i}>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border2)', fontSize: 13 }}>
                      <div style={{ fontWeight: 600 }}>{item.medicineName}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>Batch: {item.batchNumber}</div>
                    </td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border2)', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 13 }}>{item.quantitySold}</td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border2)', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 13 }}>${item.priceAtSale?.toFixed(2)}</td>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid var(--border2)', textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600, fontSize: 13 }}>${(item.quantitySold * item.priceAtSale).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
              {sale.discount > 0 && (
                <>
                  <div className="bill-row"><span className="label">Subtotal</span><span className="amount">${(sale.totalAmount + sale.discount).toFixed(2)}</span></div>
                  <div className="bill-row"><span className="label" style={{ color: 'var(--red)' }}>Discount</span><span className="amount" style={{ color: 'var(--red)' }}>−${sale.discount?.toFixed(2)}</span></div>
                </>
              )}
              <div className="bill-row total">
                <span>Total</span>
                <span className="amount">${sale.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--text2)', fontSize: 12, borderTop: '1px dashed var(--border)', paddingTop: 16 }}>
              Thank you for your purchase!
              <br />
              <span style={{ fontSize: 11, marginTop: 4, display: 'block', fontFamily: 'var(--mono)' }}>MedStore Pro · MERN Stack</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}