import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

function ReportIssue() {
  const [formData, setFormData] = useState({
    description: '',
    location_name: '',
    latitude: '',
    longitude: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
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
      data.append('report_type', 'general');
      data.append('is_illegal_dumping', 'false');
      if (photo) data.append('photo', photo);
      await API.post('/reports/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Report submitted successfully! You will earn points when it is verified.');
      setTimeout(() => navigate('/my-reports'), 2000);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d6a4f', marginBottom: '8px' }}>Report Waste Issue</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Submit a waste report with location and photo evidence</p>

        {success && <p style={{ color: 'green', background: '#d8f3dc', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{success}</p>}
        {error && <p style={{ color: 'red', background: '#ffe0e0', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{error}</p>}

        <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>📸 Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ width: '100%', marginBottom: '8px' }}
              />
              {photoPreview && (
                <img src={photoPreview} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the waste issue in detail..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Location Name</label>
              <input
                type="text"
                name="location_name"
                value={formData.location_name}
                onChange={handleChange}
                required
                placeholder="e.g. Westlands, Nairobi"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  placeholder="-1.286389"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  placeholder="36.817223"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button type="button" onClick={getLocation} style={{
              marginBottom: '20px', padding: '10px 20px', background: '#52b788',
              color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
            }}>
              📍 Use My Current Location
            </button>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', background: '#2d6a4f',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px',
              fontWeight: '600', cursor: 'pointer'
            }}>
              {loading ? '⏳ Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportIssue;