import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/admin/analytics');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Spinner />;

  const COLORS = ['#2d6a4f', '#52b788', '#e9c46a', '#f4a261', '#e63946'];

  const statusData = data ? [
    { name: 'Pending', value: data.status_counts.pending, color: '#e9c46a' },
    { name: 'Confirmed', value: data.status_counts.confirmed, color: '#f4a261' },
    { name: 'Resolved', value: data.status_counts.resolved, color: '#52b788' },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d6a4f', marginBottom: '8px' }}>📊 Analytics & Insights</h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>Detailed waste management data and trends for Kenya</p>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Reports', value: data?.total_reports || 0, color: '#2d6a4f', icon: '📋' },
            { label: 'Resolution Rate', value: `${data?.resolution_rate || 0}%`, color: '#52b788', icon: '✅' },
            { label: 'Illegal Dumping', value: data?.illegal_count || 0, color: '#e63946', icon: '🚨' },
            { label: 'Normal Reports', value: data?.normal_count || 0, color: '#1b4332', icon: '🗑️' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'white', padding: '24px', borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${stat.color}`,
              display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <span style={{ fontSize: '32px' }}>{stat.icon}</span>
              <div>
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Reports by Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Report Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data?.report_types || []} cx="50%" cy="50%" outerRadius={90} dataKey="count" nameKey="name" label={({ name, count }) => `${name}: ${count}`}>
                  {(data?.report_types || []).map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Top Waste Hotspot Locations</h3>
          {data?.top_locations?.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', padding: '24px' }}>No location data yet</p>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.top_locations || []} layout="vertical" margin={{ left: 120 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="location" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2d6a4f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
          <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Weekly Report Trends</h3>
          {data?.weekly_data?.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', padding: '24px' }}>No weekly data yet</p>
          )}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data?.weekly_data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2d6a4f" strokeWidth={2} dot={{ fill: '#2d6a4f' }} name="Reports" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* System Health */}
        <div style={{ background: '#2d6a4f', padding: '24px', borderRadius: '12px', color: 'white', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px' }}>System Health Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'Reports Resolved', value: `${data?.resolution_rate || 0}%`, desc: 'of all submitted reports' },
              { label: 'Illegal Dumping', value: `${data?.illegal_count || 0}`, desc: 'cases reported to authorities' },
              { label: 'Active Reports', value: `${(data?.status_counts?.pending || 0) + (data?.status_counts?.confirmed || 0)}`, desc: 'currently being handled' },
            ].map((item) => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 4px', fontSize: '32px', fontWeight: 'bold' }}>{item.value}</p>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '500' }}>{item.label}</p>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Executive Summary</h3>
          <div style={{ background: '#f0f7f4', padding: '16px', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#555', lineHeight: 1.8 }}>
              This report provides a comprehensive overview of waste management activities conducted through the Taka Smart Waste platform in Kenya. The system has processed a total of <strong>{data?.total_reports}</strong> waste reports, achieving a resolution rate of <strong>{data?.resolution_rate}%</strong>. Of these, <strong>{data?.illegal_dumping_total}</strong> cases involved illegal dumping, with <strong>{data?.illegal_dumping_resolved}</strong> cases successfully resolved by county authorities.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Analytics;