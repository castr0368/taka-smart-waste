import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import Logo from '../components/Logo';

function Register() {
  const [formData, setFormData] = useState({
    full_name: '', email: '', password: '', phone: '', location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post(`/auth/register?full_name=${formData.full_name}&email=${formData.email}&password=${formData.password}&phone=${formData.phone}&location=${formData.location}`);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', name: 'full_name', type: 'text', placeholder: 'John Kamau' },
    { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com' },
    { label: 'Password', name: 'password', type: 'password', placeholder: 'Create a strong password' },
    { label: 'Phone Number', name: 'phone', type: 'text', placeholder: '0712 345 678' },
    { label: 'Location / Estate', name: 'location', type: 'text', placeholder: 'e.g. Westlands, Nairobi' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #52b788 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', color: 'white'
      }}>
        <Logo size={80} showText={true} textColor="white" />
        <p style={{ margin: '24px 0 0', fontSize: '18px', opacity: 0.9, textAlign: 'center', maxWidth: '320px', lineHeight: 1.6 }}>
          Join thousands of Kenyan residents making their communities cleaner
        </p>
        <div style={{ marginTop: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '300px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Why join Taka?</h3>
          {[
            { icon: '⭐', text: 'Earn points for every report' },
            { icon: '🏆', text: 'Appear on community leaderboard' },
            { icon: '🔔', text: 'Get real-time notifications' },
            { icon: '🗺️', text: 'Track waste in your area' },
            { icon: '🌍', text: 'Make Kenya cleaner' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: '#f8fffe',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px', overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ color: '#1b4332', margin: '0 0 8px', fontSize: '28px', fontWeight: '700' }}>Create your account</h2>
          <p style={{ color: '#666', margin: '0 0 32px', fontSize: '15px' }}>Free forever. No credit card needed.</p>

          {error && (
            <div style={{ background: '#ffe0e0', border: '1px solid #ffb3b3', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', color: '#c0392b', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name} style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '8px',
                    border: '2px solid #e0e0e0', fontSize: '15px', boxSizing: 'border-box',
                    outline: 'none', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#2d6a4f'}
                  onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', background: loading ? '#52b788' : '#2d6a4f',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              {loading ? '⏳ Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2d6a4f', fontWeight: '500' }}>Sign in here</Link>
          </p>

          <p style={{ textAlign: 'center', marginTop: '16px', color: '#999', fontSize: '12px' }}>
            🇰🇪 Keeping Kenya clean, one report at a time
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;