import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

function Compliance() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const response = await API.get('/admin/compliance');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching compliance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompliance();
  }, []);

 const [aiSummary, setAiSummary] = useState('');
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

 const generateAISummary = async () => {
    setAiSummaryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      setAiSummary(result.summary);
    } catch (err) {
      setAiSummary('Failed to generate summary. Please try again.');
    } finally {
      setAiSummaryLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: '#2d6a4f', margin: '0 0 4px' }}>📋 Regulatory Compliance Report</h2>
            <p style={{ color: '#666', margin: 0 }}>Generated: {data?.generated_date}</p>
          </div>
          <button onClick={handlePrint} style={{
            background: '#2d6a4f', color: 'white', border: 'none',
            padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px'
          }}>
            🖨️ Print Report
          </button>
        </div>

        <div style={{
          background: 'white', padding: '32px', borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '2px solid #f0f7f4' }}>
            <span style={{ fontSize: '48px' }}>🗑️</span>
            <div>
              <h2 style={{ margin: '0 0 4px', color: '#2d6a4f' }}>Taka Smart Waste Kenya</h2>
              <p style={{ margin: '0 0 2px', color: '#666' }}>Environmental Compliance & Waste Management Report</p>
              <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>Report Date: {data?.generated_date}</p>
            </div>
          </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#2d6a4f', margin: 0 }}>Executive Summary</h3>
            <button onClick={generateAISummary} disabled={aiSummaryLoading} style={{
              background: '#2d6a4f', color: 'white', border: 'none',
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
            }}>
              {aiSummaryLoading ? '🤖 Generating...' : '🤖 Generate AI Summary'}
            </button>
          </div>
          <div style={{ background: '#f0f7f4', padding: '16px', borderRadius: '8px', marginBottom: '24px', minHeight: '80px' }}>
            {aiSummary ? (
              <p style={{ margin: 0, color: '#555', lineHeight: 1.8 }}>{aiSummary}</p>
            ) : (
              <p style={{ margin: 0, color: '#999', fontStyle: 'italic' }}>
                Click "Generate AI Summary" to automatically create a professional executive summary based on your compliance data.
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Reports Filed', value: data?.total_reports, color: '#2d6a4f' },
              { label: 'Reports Resolved', value: data?.resolved_reports, color: '#52b788' },
              { label: 'Resolution Rate', value: `${data?.resolution_rate}%`, color: '#1b4332' },
              { label: 'Pending Action', value: data?.pending_reports, color: '#e9c46a' },
              { label: 'Illegal Dumping Cases', value: data?.illegal_dumping_total, color: '#e63946' },
              { label: 'Illegal Cases Resolved', value: data?.illegal_dumping_resolved, color: '#52b788' },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: '16px', background: '#f8fffe', borderRadius: '8px',
                borderLeft: `4px solid ${stat.color}`
              }}>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#666' }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Compliance Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ padding: '20px', background: '#d8f3dc', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 8px', fontWeight: '500', color: '#1b4332' }}>✅ Waste Collection Compliance</p>
              <p style={{ margin: '0 0 4px', color: '#2d6a4f', fontSize: '24px', fontWeight: 'bold' }}>{data?.resolution_rate}%</p>
              <p style={{ margin: 0, color: '#555', fontSize: '13px' }}>of reported waste issues have been resolved</p>
            </div>
            <div style={{ padding: '20px', background: data?.illegal_resolution_rate >= 50 ? '#d8f3dc' : '#ffe0e0', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 8px', fontWeight: '500', color: '#1b4332' }}>🚨 Illegal Dumping Compliance</p>
              <p style={{ margin: '0 0 4px', color: '#e63946', fontSize: '24px', fontWeight: 'bold' }}>{data?.illegal_resolution_rate}%</p>
              <p style={{ margin: 0, color: '#555', fontSize: '13px' }}>of illegal dumping cases have been resolved</p>
            </div>
          </div>

          <h3 style={{ color: '#2d6a4f', marginBottom: '16px' }}>Resolved Cases Log</h3>
          {data?.resolved_list?.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', padding: '24px' }}>No resolved cases yet</p>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#2d6a4f', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date Reported</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.resolved_list?.map((report, index) => (
                <tr key={report.id} style={{ background: index % 2 === 0 ? '#f8fffe' : 'white', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', color: '#666' }}>{index + 1}</td>
                  <td style={{ padding: '12px', fontWeight: '500', color: '#2d6a4f' }}>{report.location}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: report.type === 'Illegal Dumping' ? '#ffe0e0' : '#d8f3dc',
                      color: report.type === 'Illegal Dumping' ? '#e63946' : '#2d6a4f',
                      padding: '2px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>{report.type}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#555', maxWidth: '200px' }}>{report.description}</td>
                  <td style={{ padding: '12px', color: '#666' }}>{report.date_reported}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: '#d8f3dc', color: '#2d6a4f', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>✅ Resolved</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #eee', textAlign: 'center', color: '#999', fontSize: '13px' }}>
            <p style={{ margin: '0 0 4px' }}>This report was automatically generated by Taka Smart Waste Kenya</p>
            <p style={{ margin: 0 }}>© 2026 Taka Smart Waste | Keeping Kenya Clean 🇰🇪</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compliance;