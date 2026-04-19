import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

function IllegalDumping() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    location_name: '',
    latitude: '',
    longitude: ''
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [dumpingReports, setDumpingReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDumpingReports();
  }, []);

  const fetchDumpingReports = async () => {
    try {
      const response = await API.get('/reports/');
      const dumping = response.data.filter(r => r.is_illegal_dumping === true);
      setDumpingReports(dumping);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('description', formData.description);
      data.append('location_name', formData.location_name);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      data.append('report_type', 'illegal_dumping');
      data.append('is_illegal_dumping', 'true');
      if (photo) data.append('photo', photo);
      await API.post('/reports/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Illegal dumping report submitted! Authorities have been alerted. You will earn 15 points when verified.');
      setFormData({ description: '', location_name: '', latitude: '', longitude: '' });
      setPhoto(null);
      fetchDumpingReports();
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
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
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <p style={{ margin: '0', fontWeight: '500', color: '#856404' }}>Illegal Dumping Report</p>
            <p style={{ margin: '0', fontSize: '13px', color: '#856404' }}>
              Use this form to report illegal waste dumping. Your report will be sent directly to environmental authorities and the county government.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Report Illegal Dumping</h3>
            {success && <p style={{ color: 'green', background: '#d8f3dc', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{success}</p>}
            {error && <p style={{ color: 'red', background: '#ffe0e0', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>Description of Dumping</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe what was dumped, approximate quantity, type of waste..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>Location Name</label>
                <input
                  type="text"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Along Ngong Road near Total Petrol Station"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    placeholder="-1.286389"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    placeholder="36.817223"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <button type="button" onClick={getLocation} style={{
                marginBottom: '16px', padding: '8px 16px', background: '#52b788',
                color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
              }}>
                📍 Use My Current Location
              </button>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>Photo Evidence (recommended)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  style={{ width: '100%' }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px', background: '#e63946',
                color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer'
              }}>
                {loading ? 'Submitting...' : '🚨 Report Illegal Dumping'}
              </button>
            </form>
          </div>

          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Recent Dumping Reports</h3>
            {dumpingReports.length === 0 && (
              <p style={{ color: '#999', textAlign: 'center', marginTop: '40px' }}>No illegal dumping reports yet</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dumpingReports.map((report) => (
                <div key={report.id} style={{
                  padding: '14px', borderRadius: '8px',
                  border: '1px solid #eee', borderLeft: `4px solid ${getStatusColor(report.status)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: '500', color: '#2d6a4f', fontSize: '14px' }}>
                        🚨 {report.location_name}
                      </p>
                      <p style={{ margin: '0 0 4px', color: '#555', fontSize: '13px' }}>{report.description}</p>
                      <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{
                      background: getStatusColor(report.status),
                      color: 'white', padding: '2px 10px',
                      borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize'
                    }}>{report.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IllegalDumping;