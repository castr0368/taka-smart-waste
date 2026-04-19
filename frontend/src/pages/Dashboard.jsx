import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await API.get('/reports/');
        setReports(response.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <Spinner />;

  const pending = reports.filter(r => r.status === 'pending').length;
  const confirmed = reports.filter(r => r.status === 'confirmed').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const illegal = reports.filter(r => r.is_illegal_dumping).length;

  const barData = [
    { name: 'Pending', count: pending },
    { name: 'Confirmed', count: confirmed },
    { name: 'Resolved', count: resolved },
  ];

  const pieData = [
    { name: 'Normal', value: reports.length - illegal },
    { name: 'Illegal', value: illegal },
  ];

  const COLORS = ['#2d6a4f', '#e63946'];

  const quickActions = [
    { icon: '📝', label: 'Report Waste Issue', link: '/report', bg: 'linear-gradient(135deg, #1b4332, #2d6a4f)' },
    { icon: '🚨', label: 'Report Illegal Dumping', link: '/illegal-dumping', bg: 'linear-gradient(135deg, #922b21, #e63946)' },
    { icon: '📅', label: 'View Schedules', link: '/schedule', bg: 'linear-gradient(135deg, #0e6655, #1abc9c)' },
    { icon: '🗺️', label: 'View Waste Map', link: '/map', bg: 'linear-gradient(135deg, #1a5276, #2e86c1)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0faf5' }}>
      <Navbar />

      <div style={{ padding: '32px 40px', maxWidth: '1300px', margin: '0 auto' }}>

        <div style={{
          background: 'linear-gradient(135deg, #0a2e1a 0%, #1b4332 50%, #2d6a4f 100%)',
          borderRadius: '20px', padding: '36px 40px', marginBottom: '32px',
          color: 'white', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', boxShadow: '0 8px 32px rgba(27,67,50,0.3)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: '-40px', right: '200px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(82,183,136,0.1)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 4px', fontSize: '14px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Welcome back
            </p>
            <h2 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800' }}>
              {user?.full_name} 👋
            </h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
                📍 {user?.location}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', textTransform: 'capitalize' }}>
                👤 {user?.role}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 4px', fontSize: '13px', opacity: 0.7 }}>Your Points</p>
            <p style={{ margin: '0 0 4px', fontSize: '52px', fontWeight: '900', lineHeight: 1 }}>
              {user?.points || 0}
            </p>
            <p style={{ margin: '0 0 8px', fontSize: '13px', opacity: 0.7 }}>⭐ points earned</p>
            <Link to="/leaderboard" style={{
              color: '#95d5b2', fontSize: '13px', textDecoration: 'none',
              background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px'
            }}>View Leaderboard →</Link>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '32px'
        }}>
          {[
            { label: 'Total Reports', value: reports.length, color: '#1b4332', bg: '#d8f3dc', icon: '📋' },
            { label: 'Pending', value: pending, color: '#7d4e00', bg: '#fff3cd', icon: '⏳' },
            { label: 'Confirmed', value: confirmed, color: '#7d3200', bg: '#ffe5cc', icon: '✅' },
            { label: 'Resolved', value: resolved, color: '#0d5c2e', bg: '#c3f0ca', icon: '🎉' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: stat.bg, padding: '24px 20px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <span style={{ fontSize: '36px' }}>{stat.icon}</span>
              <div>
                <p style={{ color: stat.color, fontSize: '12px', margin: '0 0 4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                <p style={{ fontSize: '30px', fontWeight: '800', color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#1b4332', marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {quickActions.map((action) => (
              <Link key={action.label} to={action.link} style={{
                background: action.bg, color: 'white', padding: '24px 20px',
                borderRadius: '16px', textDecoration: 'none', textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
              >
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>{action.icon}</div>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{action.label}</p>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#1b4332', marginBottom: '20px', fontSize: '17px', fontWeight: '700' }}>Reports Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: '#52796f', fontSize: 13 }} />
                <YAxis tick={{ fill: '#52796f', fontSize: 13 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#2d6a4f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#1b4332', marginBottom: '20px', fontSize: '17px', fontWeight: '700' }}>Report Types</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#1b4332', margin: 0, fontSize: '17px', fontWeight: '700' }}>Recent Reports</h3>
            <Link to="/my-reports" style={{ color: '#2d6a4f', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>View All →</Link>
          </div>
          {reports.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🗑️</div>
              <p style={{ color: '#52796f', fontSize: '16px', margin: '0 0 8px' }}>No reports yet</p>
              <Link to="/report" style={{ color: '#2d6a4f', fontWeight: '600' }}>Submit your first report →</Link>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} style={{
                padding: '16px 20px', borderRadius: '12px',
                background: '#f8fffe', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                borderLeft: `4px solid ${report.status === 'resolved' ? '#2d6a4f' : report.status === 'confirmed' ? '#f4a261' : '#e9c46a'}`
              }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1b4332', fontSize: '14px' }}>
                    {report.is_illegal_dumping ? '🚨 ' : '🗑️ '}{report.location_name}
                  </p>
                  <p style={{ margin: 0, color: '#74c69d', fontSize: '12px' }}>
                    {new Date(report.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span style={{
                  background: report.status === 'resolved' ? '#d8f3dc' : report.status === 'confirmed' ? '#ffe5cc' : '#fff3cd',
                  color: report.status === 'resolved' ? '#1b4332' : report.status === 'confirmed' ? '#7d3200' : '#7d4e00',
                  padding: '4px 14px', borderRadius: '20px', fontSize: '12px',
                  fontWeight: '600', textTransform: 'capitalize'
                }}>{report.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;