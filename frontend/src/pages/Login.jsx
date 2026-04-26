import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Logo from '../components/Logo';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await API.post(`/auth/login?email=${email}&password=${password}`);
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{
        background: 'linear-gradient(160deg, #0a2e1a 0%, #1b4332 40%, #2d6a4f 70%, #40916c 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px', color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'rgba(82, 183, 136, 0.15)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'rgba(64, 145, 108, 0.2)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Logo size={90} showText={true} textColor="white" />
          <p style={{ margin: '24px 0 0', fontSize: '17px', opacity: 0.85, maxWidth: '300px', lineHeight: 1.7 }}>
            Empowering Kenyan communities to report and resolve waste issues
          </p>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            {[
              { icon: '📍', text: 'Report waste with GPS location' },
              { icon: '🏆', text: 'Earn points for verified reports' },
              { icon: '🔔', text: 'Get notified when waste is collected' },
              { icon: '🗺️', text: 'View waste hotspots on live map' },
            ].map((item) => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'rgba(255,255,255,0.08)', padding: '10px 16px', borderRadius: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        background: '#f0faf5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: '#2d6a4f', textDecoration: 'none', fontSize: '14px',
            marginBottom: '24px', fontWeight: '500'
          }}>
            ← Back to Home
          </Link>

          <h2 style={{ color: '#0a2e1a', margin: '0 0 6px', fontSize: '30px', fontWeight: '800' }}>Welcome back</h2>
          <p style={{ color: '#52796f', margin: '0 0 36px', fontSize: '15px' }}>Sign in to your Taka account</p>

          {error && (
            <div style={{
              background: '#fff0f0', border: '1px solid #ffcccc',
              padding: '14px 16px', borderRadius: '10px', marginBottom: '20px',
              color: '#c0392b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1b4332', fontSize: '14px', fontWeight: '600' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: '10px',
                  border: '2px solid #b7e4c7', fontSize: '15px', boxSizing: 'border-box',
                  outline: 'none', background: 'white', color: '#1b4332',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#2d6a4f'; e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#b7e4c7'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#1b4332', fontSize: '14px', fontWeight: '600' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: '10px',
                  border: '2px solid #b7e4c7', fontSize: '15px', boxSizing: 'border-box',
                  outline: 'none', background: 'white', color: '#1b4332',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={e => { e.target.style.borderColor = '#2d6a4f'; e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = '#b7e4c7'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px',
              background: loading ? '#52b788' : 'linear-gradient(135deg, #1b4332, #2d6a4f)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(45,106,79,0.4)',
              transition: 'all 0.2s'
            }}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#b7e4c7' }} />
            <span style={{ color: '#74c69d', fontSize: '13px' }}>New to Taka?</span>
            <div style={{ flex: 1, height: '1px', background: '#b7e4c7' }} />
          </div>

          <Link to="/register" style={{
            display: 'block', textAlign: 'center', padding: '13px',
            border: '2px solid #2d6a4f', borderRadius: '10px', color: '#2d6a4f',
            textDecoration: 'none', fontSize: '15px', fontWeight: '600',
            background: 'white'
          }}>
            Create Free Account
          </Link>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#74c69d', fontSize: '13px' }}>
            🇰🇪 Keeping Kenya clean, one report at a time
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;