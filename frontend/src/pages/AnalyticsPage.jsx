import { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../utils/api';
import {
  FiDollarSign, FiTrendingUp, FiShoppingCart, FiBarChart2,
  FiPieChart, FiCalendar, FiPackage, FiCreditCard, FiAlertTriangle
} from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#8b949e', font: { family: "'Plus Jakarta Sans'" }, boxWidth: 12 } },
    tooltip: {
      backgroundColor: '#1c2333', borderColor: '#30363d', borderWidth: 1,
      titleColor: '#e6edf3', bodyColor: '#8b949e',
      titleFont: { family: "'Plus Jakarta Sans'", weight: '600' },
      bodyFont: { family: "'Plus Jakarta Sans'" },
    }
  },
  scales: {
    x: { ticks: { color: '#8b949e', font: { family: "'Plus Jakarta Sans'", size: 11 } }, grid: { color: '#21262d' } },
    y: { ticks: { color: '#8b949e', font: { family: "'Plus Jakarta Sans'", size: 11 } }, grid: { color: '#21262d' } }
  }
};

const PIE_OPTIONS = {
  ...CHART_DEFAULTS, scales: {},
  plugins: {
    ...CHART_DEFAULTS.plugins,
    legend: { position: 'right', labels: { color: '#8b949e', font: { family: "'Plus Jakarta Sans'", size: 11 }, boxWidth: 12, padding: 12 } }
  }
};

const COLORS = ['#2ea043', '#388bfd', '#d29922', '#f85149', '#a5d6ff', '#79c0ff', '#ffa657', '#ff7b72', '#56d364', '#bc8cff'];
const PERIODS = [['7d', '7D'], ['30d', '30D'], ['90d', '90D'], ['1y', '1Y']];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topMeds, setTopMeds] = useState([]);
  const [catSales, setCatSales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [stockHealth, setStockHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/analytics/summary?period=${period}`),
      api.get(`/analytics/revenue?period=${period}`),
      api.get(`/analytics/top-medicines?period=${period}&limit=8`),
      api.get(`/analytics/category-sales?period=${period}`),
      api.get(`/analytics/transactions?period=${period}`),
      api.get(`/analytics/payment-methods?period=${period}`),
      api.get('/analytics/stock-health'),
    ]).then(([s, r, t, c, tx, pm, sh]) => {
      setSummary(s.data.data);
      setRevenue(r.data.data);
      setTopMeds(t.data.data);
      setCatSales(c.data.data);
      setTransactions(tx.data.data);
      setPaymentMethods(pm.data.data);
      setStockHealth(sh.data);
    }).finally(() => setLoading(false));
  }, [period]);

  const fmtChange = (n) => {
    const val = Number(n || 0);
    return { label: `${val >= 0 ? '↑' : '↓'} ${Math.abs(val)}%`, cls: val >= 0 ? 'up' : 'down' };
  };

  const revenueChartData = {
    labels: revenue.map(d => d._id),
    datasets: [
      { label: 'Revenue', data: revenue.map(d => d.revenue), borderColor: '#2ea043', backgroundColor: 'rgba(46,160,67,0.12)', tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: '#2ea043', borderWidth: 2 },
      { label: 'Profit',  data: revenue.map(d => d.profit),  borderColor: '#388bfd', backgroundColor: 'rgba(56,139,253,0.08)', tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: '#388bfd', borderWidth: 2 }
    ]
  };

  const topMedsChartData = {
    labels: topMeds.map(d => d._id.length > 18 ? d._id.slice(0, 16) + '…' : d._id),
    datasets: [{ label: 'Units Sold', data: topMeds.map(d => d.totalQuantity), backgroundColor: COLORS.map(c => c + '88'), borderColor: COLORS, borderWidth: 1.5, borderRadius: 6 }]
  };

  const catChartData = {
    labels: catSales.map(d => d._id),
    datasets: [{ data: catSales.map(d => d.totalRevenue), backgroundColor: COLORS.map(c => c + 'bb'), borderColor: '#161b22', borderWidth: 2, hoverOffset: 8 }]
  };

  const txChartData = {
    labels: transactions.map(d => d._id),
    datasets: [{ label: 'Transactions', data: transactions.map(d => d.count), backgroundColor: 'rgba(56,139,253,0.6)', borderColor: '#388bfd', borderWidth: 1, borderRadius: 5 }]
  };

  const pmChartData = {
    labels: paymentMethods.map(d => d._id),
    datasets: [{ data: paymentMethods.map(d => d.count), backgroundColor: ['#2ea043bb', '#388bfdbb', '#d29922bb', '#f85149bb'], borderColor: '#161b22', borderWidth: 2 }]
  };

  const expiryChartData = stockHealth ? {
    labels: stockHealth.expiryData.map(d => d._id),
    datasets: [{ data: stockHealth.expiryData.map(d => d.count), backgroundColor: ['#f85149bb', '#d29922bb', '#ffa657bb', '#2ea043bb'], borderColor: '#161b22', borderWidth: 2 }]
  } : null;

  if (loading) return <div className="loading-center"><div className="spinner" /><span>Loading analytics...</span></div>;

  const kpiCards = [
    { label: 'Total Revenue',    value: `$${Number(summary?.totalRevenue || 0).toFixed(0)}`,     color: 'green',  icon: <FiDollarSign size={18} />,  change: fmtChange(summary?.revenueChange)     },
    { label: 'Total Profit',     value: `$${Number(summary?.totalProfit || 0).toFixed(0)}`,      color: 'blue',   icon: <FiTrendingUp size={18} />,   change: fmtChange(summary?.profitChange)      },
    { label: 'Transactions',     value: summary?.totalTransactions ?? 0,                          color: 'yellow', icon: <FiShoppingCart size={18} />, change: fmtChange(summary?.transactionChange) },
    { label: 'Avg Order Value',  value: `$${Number(summary?.avgOrderValue || 0).toFixed(0)}`,    color: 'green',  icon: <FiBarChart2 size={18} />,    change: null                                  },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiBarChart2 size={22} style={{ color: 'var(--blue)' }} /> Analytics
          </div>
          <div className="page-subtitle">Sales performance and inventory insights</div>
        </div>
        <div className="period-tabs">
          {PERIODS.map(([val, label]) => (
            <button key={val} className={`period-tab ${period === val ? 'active' : ''}`} onClick={() => setPeriod(val)}>{label}</button>
          ))}
        </div>
      </div>

      <div className="page-content">
        {/* KPI Cards */}
        <div className="stats-grid mb-4">
          {kpiCards.map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
              <div className={`stat-value ${s.color}`}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              {s.change && <div className={`stat-change ${s.change.cls}`}>{s.change.label} vs last period</div>}
            </div>
          ))}
        </div>

        {/* Revenue Line Chart */}
        <div className="chart-card full" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <FiTrendingUp size={15} style={{ color: 'var(--accent)' }} /> Revenue & Profit Over Time
              </div>
              <div className="chart-sub">Daily breakdown for the selected period</div>
            </div>
          </div>
          <div style={{ height: 240 }}>
            {revenue.length > 0
              ? <Line data={revenueChartData} options={CHART_DEFAULTS} />
              : <div className="empty-state" style={{ padding: 40 }}><div className="empty-icon"><FiTrendingUp size={40} /></div><div className="empty-text">No data for this period</div></div>}
          </div>
        </div>

        {/* Top Meds + Category */}
        <div className="charts-grid" style={{ marginBottom: 16 }}>
          <div className="chart-card">
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FiPackage size={14} style={{ color: 'var(--blue)' }} /> Top Selling Medicines
            </div>
            <div className="chart-sub">By units sold in selected period</div>
            <div style={{ height: 220 }}>
              {topMeds.length > 0
                ? <Bar data={topMedsChartData} options={{ ...CHART_DEFAULTS, indexAxis: 'y', plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }} />
                : <div className="empty-state" style={{ padding: 30 }}><div className="empty-icon"><FiPackage size={38} /></div><div className="empty-text">No sales data</div></div>}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FiPieChart size={14} style={{ color: 'var(--yellow)' }} /> Sales by Category
            </div>
            <div className="chart-sub">Revenue distribution by medicine type</div>
            <div style={{ height: 220 }}>
              {catSales.length > 0
                ? <Doughnut data={catChartData} options={PIE_OPTIONS} />
                : <div className="empty-state" style={{ padding: 30 }}><div className="empty-icon"><FiPieChart size={38} /></div><div className="empty-text">No data</div></div>}
            </div>
          </div>
        </div>

        {/* Transactions + Payment */}
        <div className="charts-grid" style={{ marginBottom: 16 }}>
          <div className="chart-card">
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FiCalendar size={14} style={{ color: 'var(--accent)' }} /> Daily Transactions
            </div>
            <div className="chart-sub">Number of bills generated per day</div>
            <div style={{ height: 200 }}>
              {transactions.length > 0
                ? <Bar data={txChartData} options={{ ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }} />
                : <div className="empty-state" style={{ padding: 30 }}><div className="empty-icon"><FiCalendar size={38} /></div><div className="empty-text">No data</div></div>}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FiCreditCard size={14} style={{ color: 'var(--blue)' }} /> Payment Methods
            </div>
            <div className="chart-sub">Breakdown of payment types used</div>
            <div style={{ height: 200 }}>
              {paymentMethods.length > 0
                ? <Doughnut data={pmChartData} options={PIE_OPTIONS} />
                : <div className="empty-state" style={{ padding: 30 }}><div className="empty-icon"><FiCreditCard size={38} /></div><div className="empty-text">No data</div></div>}
            </div>
          </div>
        </div>

        {/* Stock Expiry Health */}
        {expiryChartData && (
          <div className="chart-card" style={{ marginBottom: 16 }}>
            <div className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <FiAlertTriangle size={14} style={{ color: 'var(--yellow)' }} /> Stock Expiry Health
            </div>
            <div className="chart-sub">Medicines grouped by expiry status</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ height: 200 }}><Doughnut data={expiryChartData} options={PIE_OPTIONS} /></div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                {stockHealth.expiryData.map((d, i) => (
                  <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i] }} />
                      <span style={{ fontSize: 13, fontFamily: 'var(--font)' }}>{d._id}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: COLORS[i] }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Medicines Table */}
        {topMeds.length > 0 && (
          <div className="card" style={{ marginTop: 4 }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiBarChart2 size={13} /> Top Medicines — Detailed Breakdown
              </span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Medicine</th><th>Units Sold</th><th>Revenue</th><th>Profit</th><th>Share</th></tr>
                </thead>
                <tbody>
                  {topMeds.map((m, i) => {
                    const totalRev = topMeds.reduce((s, x) => s + x.totalRevenue, 0);
                    const pct = totalRev > 0 ? ((m.totalRevenue / totalRev) * 100).toFixed(1) : 0;
                    return (
                      <tr key={m._id}>
                        <td><span className="badge badge-gray" style={{ fontFamily: 'var(--mono)' }}>#{i + 1}</span></td>
                        <td style={{ fontWeight: 600 }}>{m._id}</td>
                        <td className="mono-cell" style={{ color: 'var(--blue)' }}>{m.totalQuantity}</td>
                        <td className="price-cell">${m.totalRevenue?.toFixed(2)}</td>
                        <td className="mono-cell" style={{ color: 'var(--blue)' }}>${m.totalProfit?.toFixed(2)}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: COLORS[i % COLORS.length], borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', minWidth: 36 }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}