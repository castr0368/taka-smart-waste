import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [hotspots, setHotspots] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchTerm, statusFilter, typeFilter, reports]);

  const fetchData = async () => {
    try {
      const [statsRes, reportsRes, hotspotsRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/reports/'),
        API.get('/admin/reports/hotspots')
      ]);
      setStats(statsRes.data);
      setReports(reportsRes.data);
      setFilteredReports(reportsRes.data);
      setHotspots(hotspotsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r =>
        typeFilter === 'illegal' ? r.is_illegal_dumping : !r.is_illegal_dumping
      );
    }
    setFilteredReports(filtered);
  };

  const updateStatus = async (reportId, status) => {
    try {
      await API.put(`/reports/${reportId}/status?status=${status}`);
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'pending') return '#e9c46a';
    if (status === 'confirmed') return '#f4a261';
    if (status === 'resolved') return '#52b788';
    return '#ccc';
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d6a4f', marginBottom: '24px' }}>Admin Dashboard</h2>

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Reports', value: stats.total_reports, color: '#2d6a4f' },
              { label: 'Total Users', value: stats.total_users, color: '#1b4332' },
              { label: 'Pending', value: stats.pending_reports, color: '#e9c46a' },
              { label: 'Confirmed', value: stats.confirmed_reports, color: '#f4a261' },
              { label: 'Resolved', value: stats.resolved_reports, color: '#52b788' },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'white', padding: '20px', borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${stat.color}`
              }}>
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 8px' }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>All Reports</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search by location or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px', gridColumn: '1 / -1' }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }}
              >
                <option value="all">All Types</option>
                <option value="normal">Normal Reports</option>
                <option value="illegal">Illegal Dumping</option>
              </select>
              <p style={{ fontSize: '13px', color: '#666', margin: 'auto 0' }}>
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
              {filteredReports.length === 0 && (
                <p style={{ color: '#999', textAlign: 'center', padding: '24px' }}>No reports match your search</p>
              )}
              {filteredReports.map((report) => (
                <div key={report.id} style={{
                  padding: '16px', borderRadius: '8px',
                  border: '1px solid #e0e0e0', borderLeft: `4px solid ${getStatusColor(report.status)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: '500', color: '#2d6a4f' }}>
                        {report.is_illegal_dumping ? '🚨 ' : '🗑️ '}{report.location_name}
                      </p>
                      <p style={{ margin: '0 0 4px', color: '#555', fontSize: '14px' }}>{report.description}</p>
                      <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <span style={{
                        background: getStatusColor(report.status), color: 'white',
                        padding: '2px 10px', borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize'
                      }}>{report.status}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {report.status === 'pending' && (
                          <button onClick={() => updateStatus(report.id, 'confirmed')} style={{
                            background: '#f4a261', color: 'white', border: 'none',
                            padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                          }}>Confirm</button>
                        )}
                        {report.status === 'confirmed' && (
                          <button onClick={() => updateStatus(report.id, 'resolved')} style={{
                            background: '#52b788', color: 'white', border: 'none',
                            padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
                          }}>Resolve</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Waste Hotspots</h3>
            {Object.keys(hotspots).length === 0 && (
              <p style={{ color: '#999' }}>No hotspot data yet</p>
            )}
            {Object.entries(hotspots).map(([area, count]) => (
              <div key={area} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', color: '#333' }}>{area}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#2d6a4f' }}>{count}</span>
                </div>
                <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '8px' }}>
                  <div style={{
                    background: '#2d6a4f', height: '8px', borderRadius: '4px',
                    width: `${Math.min((count / Math.max(...Object.values(hotspots))) * 100, 100)}%`
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;