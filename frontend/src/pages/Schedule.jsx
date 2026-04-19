import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

function Schedule() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    zone: '',
    area_name: '',
    collection_date: '',
    collection_time: '',
    waste_type: '',
    collector_company: ''
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await API.get('/schedules/');
      setSchedules(response.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
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
      await API.post(`/schedules/?zone=${formData.zone}&area_name=${formData.area_name}&collection_date=${formData.collection_date}&collection_time=${formData.collection_time}&waste_type=${formData.waste_type}&collector_company=${formData.collector_company}`);
      setSuccess('Schedule created and residents notified!');
      setShowForm(false);
      setFormData({ zone: '', area_name: '', collection_date: '', collection_time: '', waste_type: '', collector_company: '' });
      fetchSchedules();
    } catch (err) {
      setError('Failed to create schedule.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/schedules/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error('Error deleting schedule:', err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'scheduled') return '#52b788';
    if (status === 'completed') return '#2d6a4f';
    if (status === 'cancelled') return '#e63946';
    return '#ccc';
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#2d6a4f', margin: '0 0 4px' }}>Collection Schedules</h2>
            <p style={{ color: '#666', margin: 0 }}>Upcoming waste collection dates for your area</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} style={{
              background: '#2d6a4f', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '6px', cursor: 'pointer'
            }}>
              {showForm ? 'Cancel' : '+ Add Schedule'}
            </button>
          )}
        </div>

        {success && <p style={{ color: 'green', background: '#d8f3dc', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{success}</p>}
        {error && <p style={{ color: 'red', background: '#ffe0e0', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{error}</p>}

        {showForm && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>New Collection Schedule</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Zone', name: 'zone', placeholder: 'e.g. Zone A' },
                  { label: 'Area Name', name: 'area_name', placeholder: 'e.g. Westlands' },
                  { label: 'Collection Date', name: 'collection_date', placeholder: '', type: 'date' },
                  { label: 'Collection Time', name: 'collection_time', placeholder: 'e.g. 8:00 AM' },
                  { label: 'Waste Type', name: 'waste_type', placeholder: 'e.g. General Waste' },
                  { label: 'Collector Company', name: 'collector_company', placeholder: 'e.g. Nairobi Waste Solutions' }
                ].map((field) => (
                  <div key={field.name}>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px' }}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
              <button type="submit" style={{
                marginTop: '16px', padding: '12px 24px', background: '#2d6a4f',
                color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px'
              }}>Create Schedule & Notify Residents</button>
            </form>
          </div>
        )}

        {schedules.length === 0 && (
          <div style={{ background: 'white', padding: '60px 40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚛</div>
            <h3 style={{ color: '#2d6a4f', marginBottom: '8px' }}>No Schedules Yet</h3>
            <p style={{ color: '#999' }}>Collection schedules for your area will appear here</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {schedules.map((schedule) => (
            <div key={schedule.id} style={{
              background: 'white', padding: '20px', borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${getStatusColor(schedule.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px', color: '#2d6a4f' }}>📍 {schedule.area_name}</h3>
                  <p style={{ margin: '0 0 4px', color: '#555' }}>🏢 Zone: {schedule.zone}</p>
                  <p style={{ margin: '0 0 4px', color: '#555' }}>🚛 {schedule.collector_company}</p>
                  <p style={{ margin: '0 0 4px', color: '#555' }}>♻️ {schedule.waste_type}</p>
                  <p style={{ margin: '0', color: '#999', fontSize: '13px' }}>
                    🕒 {new Date(schedule.collection_date).toLocaleDateString()} at {schedule.collection_time}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{
                    background: getStatusColor(schedule.status), color: 'white',
                    padding: '6px 16px', borderRadius: '20px', fontSize: '13px', textTransform: 'capitalize'
                  }}>{schedule.status}</span>
                  {user?.role === 'admin' && (
                    <button onClick={() => handleDelete(schedule.id)} style={{
                      background: '#e63946', color: 'white', border: 'none',
                      padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                    }}>Delete</button>
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

export default Schedule;