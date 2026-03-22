import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  FiGrid, FiPackage, FiPlusCircle, FiShoppingCart,
  FiFileText, FiAlertTriangle, FiBarChart2, FiLogOut
} from 'react-icons/fi';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState({ low: 0, expiring: 0 });

  useEffect(() => {
    api.get('/medicines/stats').then(res => {
      setAlerts({ low: res.data.data.lowStockCount, expiring: res.data.data.expiringCount });
    }).catch(() => {});
  }, []);

  const navItems = [
    { to: '/',              label: 'Dashboard',      icon: <FiGrid size={16} />,        exact: true },
    { to: '/inventory',     label: 'Inventory',      icon: <FiPackage size={16} />      },
    { to: '/inventory/add', label: 'Add Medicine',   icon: <FiPlusCircle size={16} />   },
    { to: '/pos',           label: 'Point of Sale',  icon: <FiShoppingCart size={16} /> },
    { to: '/sales',         label: 'Sales History',  icon: <FiFileText size={16} />     },
  ];

  const alertItems = [
    { to: '/expiry',    label: 'Expiry Alerts', icon: <FiAlertTriangle size={16} />, badge: alerts.expiring, badgeClass: 'yellow' },
    { to: '/analytics', label: 'Analytics',     icon: <FiBarChart2 size={16} />     },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">💊</div>
        <div>
          <div className="logo-text">MediSure360</div>
          <div className="logo-sub">Medical Store</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: 8 }}>Alerts & Reports</div>
        {alertItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge > 0 && <span className={`nav-badge ${item.badgeClass || ''}`}>{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <FiLogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}