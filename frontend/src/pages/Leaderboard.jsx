import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await API.get('/admin/leaderboard');
        setLeaders(response.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <Spinner />;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: '#2d6a4f', marginBottom: '8px' }}>🏆 Community Leaderboard</h2>
          <p style={{ color: '#666' }}>Top residents keeping Kenya clean — earn points by reporting waste issues!</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {leaders.slice(0, 3).map((leader, index) => (
            <div key={leader.id} style={{
              background: 'white',
              padding: '24px 16px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: index === 0 ? '2px solid #e9c46a' : '1px solid #eee',
              transform: index === 0 ? 'scale(1.05)' : 'scale(1)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{medals[index]}</div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#2d6a4f', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', fontSize: '18px', fontWeight: 'bold'
              }}>
                {leader.full_name.charAt(0).toUpperCase()}
              </div>
              <p style={{ margin: '0 0 4px', fontWeight: '500', color: '#2d6a4f', fontSize: '14px' }}>
                {leader.full_name}
                {leader.id === user?.id && ' (You)'}
              </p>
              <p style={{ margin: '0 0 8px', color: '#999', fontSize: '12px' }}>{leader.location}</p>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#e9c46a' }}>
                ⭐ {leader.points}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>points</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', background: '#f8fffe' }}>
            <h3 style={{ margin: 0, color: '#2d6a4f', fontSize: '16px' }}>Full Rankings</h3>
          </div>
          {leaders.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
              <p style={{ color: '#666' }}>No rankings yet</p>
              <p style={{ color: '#999', fontSize: '13px' }}>Start reporting waste issues to earn points and appear here!</p>
            </div>
          )}
          {leaders.map((leader, index) => (
            <div key={leader.id} style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f5f5f5',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: leader.id === user?.id ? '#f0f7f4' : 'white'
            }}>
              <span style={{ fontSize: '20px', minWidth: '32px', textAlign: 'center' }}>
                {index < 3 ? medals[index] : `#${index + 1}`}
              </span>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: '#2d6a4f', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 'bold', flexShrink: 0
              }}>
                {leader.full_name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 2px', fontWeight: '500', color: '#2d6a4f' }}>
                  {leader.full_name}
                  {leader.id === user?.id && <span style={{ color: '#52b788', fontSize: '12px', marginLeft: '8px' }}>(You)</span>}
                </p>
                <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>📍 {leader.location}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#e9c46a' }}>⭐ {leader.points}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>points</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '24px', background: '#2d6a4f', borderRadius: '12px',
          padding: '20px', color: 'white', textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '500' }}>Your Points: ⭐ {user?.points || 0}</p>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>
            Submit waste reports and earn 10 points each time they are resolved!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;