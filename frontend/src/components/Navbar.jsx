import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import Logo from './Logo';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        API.get('/notifications/'),
        API.get('/notifications/unread-count')
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = { color: 'white', textDecoration: 'none', fontSize: '14px' };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>

      <nav style={{
        background: '#2d6a4f', padding: '12px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'white', position: 'relative', zIndex: 1000
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo size={38} showText={true} textColor="white" />
        </Link>

        <div className="nav-links" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/report" style={linkStyle}>Report Issue</Link>
          <Link to="/my-reports" style={linkStyle}>My Reports</Link>
          <Link to="/schedule" style={linkStyle}>Schedule</Link>
          <Link to="/companies" style={linkStyle}>Companies</Link>
          <Link to="/map" style={linkStyle}>Map</Link>
          <Link to="/leaderboard" style={linkStyle}>🏆 Leaderboard</Link>
          <Link to="/illegal-dumping" style={{ color: '#ffb703', textDecoration: 'none', fontSize: '14px' }}>🚨 Dumping</Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" style={{ color: '#95d5b2', textDecoration: 'none', fontSize: '14px' }}>Admin</Link>
              <Link to="/analytics" style={{ color: '#95d5b2', textDecoration: 'none', fontSize: '14px' }}>Analytics</Link>
              <Link to="/compliance" style={{ color: '#95d5b2', textDecoration: 'none', fontSize: '14px' }}>Compliance</Link>
            </>
          )}
          <Link to="/profile" style={{ color: '#95d5b2', textDecoration: 'none', fontSize: '14px' }}>⭐ {user?.points || 0} pts</Link>

          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowNotifications(!showNotifications)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', padding: '4px'
            }}>
              <span style={{ fontSize: '20px' }}>🔔</span>
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#e63946', color: 'white', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '11px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                }}>{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div style={{
                position: 'absolute', right: 0, top: '40px',
                background: 'white', borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 9999
              }}>
                <div style={{
                  padding: '16px', borderBottom: '1px solid #eee',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <h3 style={{ margin: 0, color: '#2d6a4f', fontSize: '16px' }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{
                      background: 'none', border: 'none', color: '#2d6a4f',
                      cursor: 'pointer', fontSize: '13px', textDecoration: 'underline'
                    }}>Mark all read</button>
                  )}
                </div>
                {notifications.length === 0 && (
                  <p style={{ padding: '24px', textAlign: 'center', color: '#999', margin: 0 }}>No notifications yet</p>
                )}
                {notifications.map((notif) => (
                  <div key={notif.id} style={{
                    padding: '14px 16px', borderBottom: '1px solid #f5f5f5',
                    background: notif.is_read ? 'white' : '#f0f7f4'
                  }}>
                    <p style={{ margin: '0 0 4px', fontWeight: '500', color: '#2d6a4f', fontSize: '14px' }}>{notif.title}</p>
                    <p style={{ margin: '0 0 4px', color: '#555', fontSize: '13px' }}>{notif.message}</p>
                    <p style={{ margin: 0, color: '#999', fontSize: '11px' }}>{new Date(notif.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleLogout} style={{
            background: '#1b4332', color: 'white', border: 'none',
            padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px'
          }}>Logout</button>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'transparent', border: 'none',
            color: 'white', fontSize: '24px', cursor: 'pointer'
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          background: '#2d6a4f', padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 999
        }}>
          <Link to="/dashboard" style={linkStyle} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/report" style={linkStyle} onClick={() => setMenuOpen(false)}>Report Issue</Link>
          <Link to="/my-reports" style={linkStyle} onClick={() => setMenuOpen(false)}>My Reports</Link>
          <Link to="/schedule" style={linkStyle} onClick={() => setMenuOpen(false)}>Schedule</Link>
          <Link to="/companies" style={linkStyle} onClick={() => setMenuOpen(false)}>Companies</Link>
          <Link to="/map" style={linkStyle} onClick={() => setMenuOpen(false)}>Map</Link>
          <Link to="/leaderboard" style={linkStyle} onClick={() => setMenuOpen(false)}>🏆 Leaderboard</Link>
          <Link to="/illegal-dumping" style={{ color: '#ffb703', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>🚨 Illegal Dumping</Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin" style={{ color: '#95d5b2', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Admin</Link>
              <Link to="/analytics" style={{ color: '#95d5b2', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Analytics</Link>
              <Link to="/compliance" style={{ color: '#95d5b2', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Compliance</Link>
            </>
          )}
          <Link to="/profile" style={{ color: '#95d5b2', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>⭐ {user?.points || 0} pts</Link>
          <button onClick={handleLogout} style={{
            background: '#1b4332', color: 'white', border: 'none',
            padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', width: 'fit-content'
          }}>Logout</button>
        </div>
      )}
    </>
  );
}

export default Navbar;