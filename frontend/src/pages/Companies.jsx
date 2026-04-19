import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

function Companies() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyReports, setCompanyReports] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', coverage_areas: '', license_number: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await API.get('/companies/');
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyReports = async (companyId, companyName) => {
    setLoadingReports(true);
    setSelectedCompany(companyName);
    try {
      const response = await API.get(`/companies/${companyId}/reports`);
      setCompanyReports(response.data);
    } catch (err) {
      console.error('Error fetching company reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/companies/?name=${formData.name}&email=${formData.email}&phone=${formData.phone}&coverage_areas=${formData.coverage_areas}&license_number=${formData.license_number}`);
      setSuccess('Company added successfully!');
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', coverage_areas: '', license_number: '' });
      fetchCompanies();
    } catch (err) {
      setError('Failed to add company.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/companies/${id}`);
      fetchCompanies();
      if (companyReports) setCompanyReports(null);
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#2d6a4f', margin: '0 0 4px' }}>🏢 Waste Collection Companies</h2>
            <p style={{ color: '#666', margin: 0 }}>Registered waste collection companies and their coverage areas</p>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} style={{
              background: '#2d6a4f', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '6px', cursor: 'pointer'
            }}>
              {showForm ? 'Cancel' : '+ Add Company'}
            </button>
          )}
        </div>

        {success && <p style={{ color: 'green', background: '#d8f3dc', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{success}</p>}
        {error && <p style={{ color: 'red', background: '#ffe0e0', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>{error}</p>}

        {showForm && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
            <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Add New Company</h3>
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Company Name', name: 'name' },
                { label: 'Email', name: 'email' },
                { label: 'Phone', name: 'phone' },
                { label: 'Coverage Areas (comma separated e.g. Westlands, Kilimani)', name: 'coverage_areas' },
                { label: 'License Number', name: 'license_number' }
              ].map((field) => (
                <div key={field.name} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#333' }}>{field.label}</label>
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
              <button type="submit" style={{
                background: '#2d6a4f', color: 'white', border: 'none',
                padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px'
              }}>Add Company</button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: companyReports ? '1fr 1fr' : '1fr', gap: '24px' }}>
          <div>
            {companies.length === 0 && (
              <div style={{ background: 'white', padding: '60px 40px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏢</div>
                <h3 style={{ color: '#2d6a4f', marginBottom: '8px' }}>No Companies Registered</h3>
                <p style={{ color: '#999' }}>Admins can add companies using the button above</p>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {companies.map((company) => (
                <div key={company.id} style={{
                  background: 'white', padding: '20px', borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #2d6a4f',
                  border: selectedCompany === company.name ? '2px solid #2d6a4f' : '1px solid #eee',
                  borderLeft: '4px solid #2d6a4f'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px', color: '#2d6a4f' }}>🏢 {company.name}</h3>
                      <p style={{ margin: '0 0 4px', color: '#555', fontSize: '14px' }}>📧 {company.email}</p>
                      <p style={{ margin: '0 0 4px', color: '#555', fontSize: '14px' }}>📞 {company.phone}</p>
                      <p style={{ margin: '0 0 4px', color: '#555', fontSize: '14px' }}>📍 Coverage: {company.coverage_areas}</p>
                      <p style={{ margin: '0', color: '#999', fontSize: '13px' }}>License: {company.license_number}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <span style={{
                        background: company.is_active ? '#52b788' : '#e63946',
                        color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px'
                      }}>
                        {company.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button onClick={() => fetchCompanyReports(company.id, company.name)} style={{
                        background: '#2d6a4f', color: 'white', border: 'none',
                        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                      }}>View Reports in Area</button>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(company.id)} style={{
                          background: '#e63946', color: 'white', border: 'none',
                          padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                        }}>Remove</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {companyReports && (
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: '#2d6a4f', margin: 0 }}>Reports — {companyReports.company}</h3>
                <button onClick={() => setCompanyReports(null)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#999'
                }}>✕</button>
              </div>

              <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
                Coverage: {companyReports.coverage_areas}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Total in Area', value: companyReports.total_reports_in_area, color: '#2d6a4f' },
                  { label: 'Pending', value: companyReports.pending, color: '#e9c46a' },
                  { label: 'Confirmed', value: companyReports.confirmed, color: '#f4a261' },
                  { label: 'Resolved', value: companyReports.resolved, color: '#52b788' },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    padding: '12px', background: '#f8fffe', borderRadius: '8px',
                    borderLeft: `3px solid ${stat.color}`
                  }}>
                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#666' }}>{stat.label}</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {loadingReports && <Spinner />}

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {companyReports.reports?.length === 0 && (
                  <p style={{ color: '#999', textAlign: 'center', padding: '24px' }}>No reports in this coverage area yet</p>
                )}
                {companyReports.reports?.map((report) => (
                  <div key={report.id} style={{
                    padding: '12px', borderRadius: '8px', marginBottom: '8px',
                    background: '#f8fffe', borderLeft: `3px solid ${report.status === 'resolved' ? '#52b788' : report.status === 'confirmed' ? '#f4a261' : '#e9c46a'}`
                  }}>
                    <p style={{ margin: '0 0 4px', fontWeight: '500', color: '#2d6a4f', fontSize: '14px' }}>
                      {report.is_illegal_dumping ? '🚨 ' : '🗑️ '}{report.location}
                    </p>
                    <p style={{ margin: '0 0 4px', color: '#555', fontSize: '13px' }}>{report.description}</p>
                    <span style={{
                      background: report.status === 'resolved' ? '#52b788' : report.status === 'confirmed' ? '#f4a261' : '#e9c46a',
                      color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', textTransform: 'capitalize'
                    }}>{report.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Companies;