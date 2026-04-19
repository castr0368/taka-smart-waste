import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, login, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/admin/profile');
      setProfile(response.data);
      setFormData({
        full_name: response.data.full_name,
        phone: response.data.phone,
        location: response.data.location
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(
        `/admin/profile/update?full_name=${formData.full_name}&phone=${formData.phone}&location=${formData.location}`
      );
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      login(response.data.user, token);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d6a4f', marginBottom: '24px' }}>My Profile</h2>

        {success && <p style={{ color: 'green', background: '#d8f3dc', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{success}</p>}
        {error && <p style={{ color: 'red', background: '#ffe0e0', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: '#2d6a4f', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '32px', fontWeight: 'bold'
              }}>
                {profile?.full_name?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ margin: '0 0 4px', color: '#2d6a4f' }}>{profile?.full_name}</h3>
              <p style={{ margin: '0 0 4px', color: '#666', fontSize: '14px' }}>{profile?.email}</p>
              <span style={{
                background: profile?.role === 'admin' ? '#2d6a4f' : '#52b788',
                color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px'
              }}>
                {profile?.role}
              </span>
            </div>

            {!editing ? (
              <div>
                <div style={{ marginBottom: '12px', padding: '12px', background: '#f8fffe', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#999' }}>Full Name</p>
                  <p style={{ margin: 0, color: '#333', fontWeight: '500' }}>{profile?.full_name}</p>
                </div>
                <div style={{ marginBottom: '12px', padding: '12px', background: '#f8fffe', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#999' }}>Email</p>
                  <p style={{ margin: 0, color: '#333', fontWeight: '500' }}>{profile?.email}</p>
                </div>
                <div style={{ marginBottom: '12px', padding: '12px', background: '#f8fffe', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#999' }}>Phone</p>
                  <p style={{ margin: 0, color: '#333', fontWeight: '500' }}>{profile?.phone}</p>
                </div>
                <div style={{ marginBottom: '24px', padding: '12px', background: '#f8fffe', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#999' }}>Location</p>
                  <p style={{ margin: 0, color: '#333', fontWeight: '500' }}>{profile?.location}</p>
                </div>
                <button onClick={() => setEditing(true)} style={{
                  width: '100%', padding: '12px', background: '#2d6a4f',
                  color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px'
                }}>Edit Profile</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Full Name', name: 'full_name' },
                  { label: 'Phone', name: 'phone' },
                  { label: 'Location', name: 'location' }
                ].map((field) => (
                  <div key={field.name} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px' }}>{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{
                    flex: 1, padding: '12px', background: '#2d6a4f',
                    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
                  }}>Save Changes</button>
                  <button type="button" onClick={() => setEditing(false)} style={{
                    flex: 1, padding: '12px', background: '#eee',
                    color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          <div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
              <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>My Statistics</h3>
              {[
                { label: 'Total Reports', value: profile?.total_reports, color: '#2d6a4f' },
                { label: 'Resolved Reports', value: profile?.resolved_reports, color: '#52b788' },
                { label: 'Pending Reports', value: profile?.pending_reports, color: '#e9c46a' },
              ].map((stat) => (
                <div key={stat.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px', background: '#f8fffe', borderRadius: '8px', marginBottom: '8px'
                }}>
                  <span style={{ color: '#555', fontSize: '14px' }}>{stat.label}</span>
                  <span style={{ fontWeight: 'bold', color: stat.color, fontSize: '18px' }}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: '#2d6a4f', padding: '24px', borderRadius: '12px',
              textAlign: 'center', color: 'white'
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.8 }}>Total Points Earned</p>
              <p style={{ margin: '0 0 4px', fontSize: '48px', fontWeight: 'bold' }}>⭐ {profile?.points}</p>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>
                Keep reporting to earn more points!
              </p>
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontSize: '13px' }}>
                  Every verified report = 10 points 🎯
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;