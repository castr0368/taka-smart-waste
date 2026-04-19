import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';

function MyReports() {
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
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d6a4f', marginBottom: '24px' }}>My Reports</h2>
        {loading && <p>Loading reports...</p>}
        {!loading && reports.length === 0 && (
          <div style={{ background: 'white', padding: '60px 40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ color: '#2d6a4f', marginBottom: '8px' }}>No Reports Yet</h3>
            <p style={{ color: '#999', marginBottom: '24px' }}>Help keep Kenya clean by reporting waste issues in your area</p>
            <a href="/report" style={{ background: '#2d6a4f', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontSize: '15px' }}>Submit Your First Report</a>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reports.map((report) => (
            <div key={report.id} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${getStatusColor(report.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px', color: '#2d6a4f' }}>{report.location_name}</h3>
                  <p style={{ margin: '0 0 8px', color: '#555' }}>{report.description}</p>
                  <p style={{ margin: '0', color: '#999', fontSize: '13px' }}>
                    📍 {report.latitude}, {report.longitude}
                  </p>
                  <p style={{ margin: '4px 0 0', color: '#999', fontSize: '13px' }}>
                    🕒 {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: getStatusColor(report.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {report.status}
                  </span>
                  {report.photo_url && (
                    <div style={{ marginTop: '8px' }}>
                      <img
                        src={`http://localhost:8000${report.photo_url}`}
                        alt="report"
                        style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyReports;