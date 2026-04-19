import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

function About() {
  const team = [
    { name: 'Member 1', role: 'Project Lead & Backend Developer', initial: 'M1' },
    { name: 'Member 2', role: 'Frontend Developer', initial: 'M2' },
    { name: 'Member 3', role: 'Database & API Developer', initial: 'M3' },
    { name: 'Member 4', role: 'UI/UX Designer', initial: 'M4' },
    { name: 'Member 5', role: 'Testing & Documentation', initial: 'M5' },
  ];

  const timeline = [
    { phase: 'Phase 1', title: 'Research & Planning', desc: 'Identified waste management problems in Kenya and designed system architecture.' },
    { phase: 'Phase 2', title: 'Backend Development', desc: 'Built FastAPI backend with authentication, reports, schedules and notifications.' },
    { phase: 'Phase 3', title: 'Frontend Development', desc: 'Built React frontend with dashboard, maps, analytics and admin panel.' },
    { phase: 'Phase 4', title: 'Testing & Refinement', desc: 'Tested all features, fixed bugs and improved user experience.' },
    { phase: 'Phase 5', title: 'Deployment', desc: 'Deployed system to cloud for public access across Kenya.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />

      <div style={{
        background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
        padding: '60px 48px', textAlign: 'center', color: 'white'
      }}>
        <Logo size={70} showText={true} textColor="white" />
        <h1 style={{ margin: '24px 0 16px', fontSize: '36px' }}>About Taka Smart Waste</h1>
        <p style={{ margin: '0 auto', fontSize: '18px', opacity: 0.9, maxWidth: '600px', lineHeight: 1.7 }}>
          A smart waste collection and reporting system built by Kenyan students to solve real waste management problems in Kenya's estates and towns.
        </p>
      </div>

      <div style={{ padding: '60px 48px', maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: '#2d6a4f', marginBottom: '16px', fontSize: '28px' }}>The Problem We Are Solving</h2>
            <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '16px' }}>
              Kenya faces serious waste management challenges. Poor garbage collection in estates, illegal dumping along roadsides, county delays in waste pickup, and no proper reporting channel for residents have all contributed to an environmental crisis.
            </p>
            <p style={{ color: '#555', lineHeight: 1.8 }}>
              Residents had no way to report waste issues, track whether their reports were acted on, or know when collection was scheduled for their area. County officials had no central system to manage reports efficiently.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { icon: '🗑️', label: 'Poor garbage collection in estates' },
              { icon: '🚫', label: 'Illegal dumping along roadsides' },
              { icon: '⏰', label: 'County delays in waste pickup' },
              { icon: '📵', label: 'No proper reporting channel' },
            ].map((item) => (
              <div key={item.label} style={{
                background: 'white', padding: '20px', borderRadius: '12px',
                textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                <p style={{ margin: 0, color: '#555', fontSize: '13px', lineHeight: 1.5 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '60px' }}>
          <h2 style={{ color: '#2d6a4f', marginBottom: '32px', fontSize: '28px', textAlign: 'center' }}>Our Solution</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: '📱', title: 'Web & Mobile Platform', desc: 'A fully responsive web platform accessible on any phone or computer without downloading an app.' },
              { icon: '📍', title: 'GPS Report Tracking', desc: 'Residents submit waste reports with exact GPS coordinates and photo evidence for accountability.' },
              { icon: '🔔', title: 'Automatic Notifications', desc: 'Real-time notifications keep residents informed when their reports are confirmed and resolved.' },
              { icon: '🏆', title: 'Points & Rewards', desc: 'Residents earn 10 points for every verified report, creating community incentives to report waste.' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'County officials get powerful analytics to identify hotspots and track waste management performance.' },
              { icon: '🗺️', title: 'Interactive Waste Map', desc: 'A live map shows all waste hotspots across Kenya with color-coded status indicators.' },
            ].map((item) => (
              <div key={item.title} style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ color: '#2d6a4f', margin: '0 0 8px', fontSize: '16px' }}>{item.title}</h3>
                <p style={{ color: '#666', margin: 0, fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#2d6a4f', marginBottom: '32px', fontSize: '28px', textAlign: 'center' }}>Our Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
            {team.map((member) => (
              <div key={member.name} style={{
                background: 'white', padding: '24px 16px', borderRadius: '12px',
                textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: '#2d6a4f', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', fontSize: '20px', fontWeight: 'bold'
                }}>
                  {member.initial}
                </div>
                <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#2d6a4f', fontSize: '14px' }}>{member.name}</p>
                <p style={{ margin: 0, color: '#666', fontSize: '12px', lineHeight: 1.4 }}>{member.role}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', marginTop: '16px' }}>
            Update the team member names above with your actual group member names
          </p>
        </div>

        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#2d6a4f', marginBottom: '32px', fontSize: '28px', textAlign: 'center' }}>Development Timeline</h2>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: '#d8f3dc', transform: 'translateX(-50%)' }} />
            {timeline.map((item, index) => (
              <div key={item.phase} style={{
                display: 'flex', justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                marginBottom: '24px', position: 'relative'
              }}>
                <div style={{
                  width: '45%', background: 'white', padding: '20px', borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  marginLeft: index % 2 === 0 ? '0' : 'auto',
                  marginRight: index % 2 === 0 ? 'auto' : '0'
                }}>
                  <span style={{
                    background: '#2d6a4f', color: 'white', padding: '2px 10px',
                    borderRadius: '20px', fontSize: '12px', fontWeight: '500'
                  }}>{item.phase}</span>
                  <h3 style={{ color: '#2d6a4f', margin: '8px 0 6px', fontSize: '16px' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '40px' }}>
          <h2 style={{ color: '#2d6a4f', marginBottom: '16px', fontSize: '24px' }}>Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { category: 'Frontend', tech: 'React.js, React Router, Recharts, Leaflet Maps', color: '#e6f1fb' },
              { category: 'Backend', tech: 'Python, FastAPI, SQLAlchemy, JWT Authentication', color: '#d8f3dc' },
              { category: 'Database', tech: 'SQLite (Development), PostgreSQL (Production)', color: '#faeeda' },
              { category: 'Deployment', tech: 'Railway (Backend), Vercel (Frontend), Cloudinary (Images)', color: '#faece7' },
            ].map((item) => (
              <div key={item.category} style={{ background: item.color, padding: '20px', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 8px', color: '#1b4332', fontSize: '14px' }}>{item.category}</h4>
                <p style={{ margin: 0, color: '#555', fontSize: '13px', lineHeight: 1.6 }}>{item.tech}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
          padding: '40px', borderRadius: '16px', textAlign: 'center', color: 'white'
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '24px' }}>Ready to Make a Difference?</h2>
          <p style={{ margin: '0 0 24px', opacity: 0.9 }}>Join us in keeping Kenya clean one report at a time</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" style={{
              background: 'white', color: '#2d6a4f', padding: '12px 28px',
              borderRadius: '8px', textDecoration: 'none', fontWeight: '600'
            }}>Get Started Free</Link>
            <Link to="/" style={{
              background: 'transparent', color: 'white', padding: '12px 28px',
              borderRadius: '8px', textDecoration: 'none', border: '2px solid white'
            }}>Learn More</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;