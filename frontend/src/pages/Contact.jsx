import { useState } from 'react';
import Navbar from '../components/Navbar';

function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/contact?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&subject=${encodeURIComponent(formData.subject)}&message=${encodeURIComponent(formData.message)}`,
        { method: 'POST' }
      );
      if (response.ok) {
        setSuccess('Thank you for contacting us! We will get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '48px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ color: '#2d6a4f', fontSize: '32px', margin: '0 0 16px' }}>Contact Us</h2>
          <p style={{ color: '#666', fontSize: '18px' }}>Get in touch with the Taka Smart Waste team</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
              <h3 style={{ color: '#2d6a4f', marginBottom: '24px' }}>Send us a Message</h3>

              {success && <p style={{ color: 'green', background: '#d8f3dc', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{success}</p>}
              {error && <p style={{ color: 'red', background: '#ffe0e0', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{error}</p>}

              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Kamau' },
                  { label: 'Email Address', name: 'email', type: 'email', placeholder: 'john@example.com' },
                  { label: 'Subject', name: 'subject', type: 'text', placeholder: 'Waste collection issue in my area' },
                ].map((field) => (
                  <div key={field.name} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#2d6a4f'}
                      onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#2d6a4f'}
                    onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '14px', background: '#2d6a4f',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '16px', fontWeight: '600', cursor: 'pointer'
                }}>
                  {loading ? '⏳ Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '📍', title: 'Location', details: ['Nairobi, Kenya', 'Dedan Kimathi University'] },
              { icon: '📞', title: 'Phone', details: ['(+254) 700 000 000', 'Mon-Fri 8AM to 5PM EAT'] },
              { icon: '✉️', title: 'Email', details: ['info@takasmарtwaste.co.ke', 'support@takasmарtwaste.co.ke'] },
              { icon: '⏰', title: 'Working Hours', details: ['Monday - Friday: 8AM - 5PM', 'Saturday: 9AM - 1PM'] },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'white', padding: '24px', borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '16px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px',
                  background: '#f0f7f4', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px', flexShrink: 0
                }}>{item.icon}</div>
                <div>
                  <h4 style={{ margin: '0 0 6px', color: '#2d6a4f' }}>{item.title}</h4>
                  {item.details.map(d => <p key={d} style={{ margin: '0 0 2px', color: '#555', fontSize: '14px' }}>{d}</p>)}
                </div>
              </div>
            ))}

            <div style={{ background: '#2d6a4f', padding: '24px', borderRadius: '12px', color: 'white' }}>
              <h4 style={{ margin: '0 0 12px' }}>🚨 Report Emergency Waste Issue</h4>
              <p style={{ margin: '0 0 12px', fontSize: '14px', opacity: 0.9 }}>
                For urgent illegal dumping or hazardous waste, use the app to submit an emergency report directly to county authorities.
              </p>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>Response time: within 2 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;