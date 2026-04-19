import { Link } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../components/Logo';

function Landing() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      icon: '📍',
      title: 'Real-Time Waste Tracking',
      desc: 'Track waste collection in real-time using GPS location data. Residents can pinpoint exact locations of uncollected waste on an interactive map.',
      details: {
        overview: 'Our real-time waste tracking system uses GPS coordinates submitted by residents to plot waste locations on an interactive map. Every report includes latitude and longitude coordinates that appear instantly on the waste hotspot map.',
        howItWorks: [
          'Resident submits a waste report with their GPS location',
          'The location is instantly plotted on the interactive map',
          'Color coding shows report status — yellow for pending, orange for confirmed, green for resolved',
          'Admin and county officials can see all hotspots in real time',
          'Residents can use the Use My Current Location button for automatic GPS detection'
        ],
        benefits: ['Instant visibility of waste locations', 'No more anonymous complaints', 'County officials can prioritize high-density areas', 'Transparent tracking for residents']
      }
    },
    {
      icon: '📊',
      title: 'Intelligent Data Analytics',
      desc: 'Powerful analytics to track waste generation patterns, detect hotspots, and inform county decisions with visual reports and automated insights.',
      details: {
        overview: 'The analytics dashboard gives county officials and environmental agencies a complete view of waste management performance across all areas. Charts and graphs update automatically as new reports come in.',
        howItWorks: [
          'All submitted reports are automatically analyzed',
          'Pie charts show report status distribution',
          'Bar charts reveal top waste hotspot locations',
          'Line charts track weekly reporting trends',
          'Resolution rates are calculated automatically'
        ],
        benefits: ['Data-driven decision making for county officials', 'Identify problem areas before they escalate', 'Track performance improvements over time', 'Generate insights for environmental agencies']
      }
    },
    {
      icon: '📅',
      title: 'Automated Collection Scheduling',
      desc: 'Automate waste pickup schedules that reduce missed collections and ensure timely service across all zones in the county.',
      details: {
        overview: 'County officials and admin can create waste collection schedules for specific zones and areas. When a new schedule is added, all registered residents in the system are automatically notified via the notification bell.',
        howItWorks: [
          'Admin creates a schedule with zone, area, date, time and company details',
          'System automatically sends notifications to all residents',
          'Residents can view upcoming schedules on the Schedule page',
          'Each schedule shows the waste type and collection company',
          'Admin can delete outdated schedules'
        ],
        benefits: ['No more missed collection days', 'Residents always know when to put out waste', 'Automatic notifications remove need for manual communication', 'County can plan and organize collection efficiently']
      }
    },
    {
      icon: '♻️',
      title: 'Recycling & Resource Recovery',
      desc: 'Promote eco-friendly waste disposal by categorizing waste types and encouraging recycling practices across estates and towns.',
      details: {
        overview: 'The system supports categorization of different waste types during reporting and scheduling. Waste companies can be assigned specific waste types, and collection schedules specify whether general waste, recyclables, or hazardous materials are being collected.',
        howItWorks: [
          'Each collection schedule specifies the waste type being collected',
          'Residents can describe waste type when submitting reports',
          'Waste companies are assigned coverage areas and waste categories',
          'Admin can track which types of waste are most reported',
          'Environmental agencies can monitor recycling compliance'
        ],
        benefits: ['Promotes eco-friendly waste disposal', 'Reduces landfill usage', 'Encourages community recycling habits', 'Supports Kenya environmental regulations']
      }
    },
    {
      icon: '📋',
      title: 'Full Regulatory Compliance',
      desc: 'Stay compliant with environmental waste regulations using built-in monitoring, automated documentation, and easy reporting dashboards.',
      details: {
        overview: 'The compliance report page automatically generates a detailed regulatory compliance document that county officials can print and present at county meetings. It shows resolution rates, illegal dumping cases handled, and a full log of resolved cases.',
        howItWorks: [
          'System automatically tracks all waste management activities',
          'Compliance report generates with one click',
          'Shows resolution rates for normal and illegal dumping cases',
          'Full resolved cases log with dates and locations',
          'Printable format for county meetings and audits'
        ],
        benefits: ['Always ready for regulatory audits', 'Automatic documentation saves time', 'Transparent reporting to environmental agencies', 'Printable compliance certificates']
      }
    },
    {
      icon: '🚨',
      title: 'Illegal Dumping Reports',
      desc: 'Residents can report illegal dumping with photo evidence and exact location. Authorities are alerted immediately for swift action.',
      details: {
        overview: 'The illegal dumping reporting system is separate from normal waste reports and is treated with higher urgency. Reports include photo evidence, exact GPS coordinates and detailed descriptions. County officials are alerted immediately.',
        howItWorks: [
          'Resident goes to the Illegal Dumping page',
          'Fills in description, exact location and uploads photo evidence',
          'Report is flagged as high priority in the admin dashboard',
          'Admin sees all illegal dumping cases marked with a red icon',
          'Admin can confirm and resolve the case, rewarding the reporter'
        ],
        benefits: ['Deters illegal dumping through community surveillance', 'Photo evidence helps authorities take action', 'Faster response from county officials', 'Residents earn points for valid reports']
      }
    },
    {
      icon: '🚛',
      title: 'Smart Fleet Management',
      desc: 'Optimize waste collection vehicle routes with real-time data, reducing operational costs and improving collection efficiency.',
      details: {
        overview: 'Waste collection companies registered on the platform can view all reports in their coverage areas, helping them plan routes efficiently. The company portal shows pending, confirmed and resolved reports specifically for their assigned zones.',
        howItWorks: [
          'Admin registers waste companies with their coverage areas',
          'Company can view all waste reports within their coverage zones',
          'Reports are categorized by status to help prioritize pickups',
          'Hotspot map shows concentration of waste in different areas',
          'Companies can plan routes based on report density'
        ],
        benefits: ['Reduced fuel costs through optimized routing', 'Faster response to high-density waste areas', 'Better coordination between companies and county', 'Real-time visibility of collection needs']
      }
    },
    {
      icon: '🏆',
      title: 'Community Rewards System',
      desc: 'Residents earn points for every verified waste report. Top reporters appear on the leaderboard, encouraging community participation.',
      details: {
        overview: 'The points and rewards system encourages community participation. Every time a resident report is verified and resolved by the county, they automatically earn 10 points. A public leaderboard shows the top contributors.',
        howItWorks: [
          'Resident submits a waste or illegal dumping report',
          'Admin confirms the report and resident gets a notification',
          'Admin resolves the report after collection and 10 points are awarded automatically',
          'Resident receives a notification about their points',
          'Leaderboard updates to show top contributors'
        ],
        benefits: ['Encourages community participation', 'Rewards responsible citizenship', 'Creates healthy competition between residents', 'Builds community pride in keeping areas clean']
      }
    },
    {
      icon: '🔔',
      title: 'Alerts & Notifications',
      desc: 'Automatic notifications keep residents informed about collection schedules, report status updates, and resolved issues in their area.',
      details: {
        overview: 'The notification system keeps every stakeholder informed without manual communication. Notifications are delivered through the bell icon in the navbar and include unread count badges.',
        howItWorks: [
          'Report confirmed — resident gets notified automatically',
          'Report resolved — resident gets notified and points are awarded',
          'New collection schedule added — all residents notified',
          'Notifications show in the bell icon with unread count',
          'Residents can mark all notifications as read at once'
        ],
        benefits: ['Real-time updates without manual communication', 'Nothing falls through the cracks', 'Residents feel engaged and informed', 'Reduces calls to county offices about report status']
      }
    },
    {
      icon: '🏢',
      title: 'Waste Company Portal',
      desc: 'Registered waste collection companies receive alerts and can manage their coverage areas, schedules, and collection assignments.',
      details: {
        overview: 'The company portal allows registered waste collection companies to be visible to residents and county officials. Each company has a profile showing their coverage areas, contact details and license number.',
        howItWorks: [
          'Admin registers the company with coverage areas and license details',
          'Company appears in the Companies page visible to all users',
          'Admin can click View Reports in Area to see all reports in the company zone',
          'Reports are categorized by status showing pending, confirmed and resolved counts',
          'Company details include email and phone for direct contact'
        ],
        benefits: ['Transparent company registry for residents', 'Easy contact information access', 'County can monitor company performance by area', 'Better accountability for waste collection companies']
      }
    },
    {
      icon: '👨‍💼',
      title: 'Admin Dashboard',
      desc: 'County officials get a powerful dashboard to manage all reports, users, companies, and schedules from one central location.',
      details: {
        overview: 'The admin dashboard gives county officials complete control over the waste management system. From one screen they can view all reports, search and filter by location or status, confirm and resolve reports, view hotspot data and manage all users and companies.',
        howItWorks: [
          'Admin logs in with admin credentials',
          'Dashboard shows total reports, users, pending, confirmed and resolved counts',
          'Search bar filters reports by location or description instantly',
          'Status filter narrows down to pending, confirmed or resolved reports',
          'Confirm and Resolve buttons update status and notify residents automatically'
        ],
        benefits: ['Single dashboard for all management tasks', 'Search and filter saves time', 'Real-time hotspot visibility', 'Automatic notifications on status changes reduce manual work']
      }
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      desc: 'Fully responsive design works perfectly on any phone or tablet. Kenyan residents can report waste issues from anywhere using their phones.',
      details: {
        overview: 'The entire Taka Smart Waste platform is built to work perfectly on mobile phones. Since most Kenyan residents access the internet through their phones, every page is designed to be easy to use on small screens.',
        howItWorks: [
          'Open the website on any phone browser — no app download needed',
          'Hamburger menu appears on small screens for easy navigation',
          'All forms are touch-friendly with large input fields',
          'GPS location button automatically detects your location on mobile',
          'Photo upload works directly from your phone camera'
        ],
        benefits: ['No app download required — works in any browser', 'Designed for Kenyan mobile users', 'Easy to use on small screens', 'Report waste from anywhere in Kenya']
      }
    },
  ];

  const stats = [
    { value: '47', label: 'Counties Covered' },
    { value: '24/7', label: 'System Availability' },
    { value: '10pts', label: 'Earned Per Report' },
    { value: '100%', label: 'Free to Use' },
  ];

  const howItWorks = [
    { step: '01', title: 'Register & Login', desc: 'Create your free account using your email. Takes less than 2 minutes.' },
    { step: '02', title: 'Report Waste Issue', desc: 'Take a photo, mark the location and submit your report directly from your phone.' },
    { step: '03', title: 'County Takes Action', desc: 'County officials receive the report, confirm it and dispatch a waste collection team.' },
    { step: '04', title: 'Earn Rewards', desc: 'Once waste is collected and report resolved, you earn 10 points automatically.' },
  ];

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', color: '#333' }}>

      {/* Feature Modal */}
      {selectedFeature && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px'
        }} onClick={() => setSelectedFeature(null)}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedFeature(null)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999'
            }}>✕</button>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{selectedFeature.icon}</div>
            <h2 style={{ color: '#2d6a4f', margin: '0 0 16px' }}>{selectedFeature.title}</h2>
            <div style={{ background: '#f0f7f4', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <p style={{ margin: 0, color: '#555', lineHeight: 1.7 }}>{selectedFeature.details.overview}</p>
            </div>
            <h3 style={{ color: '#2d6a4f', margin: '0 0 12px' }}>How It Works</h3>
            <ol style={{ margin: '0 0 24px', paddingLeft: '20px' }}>
              {selectedFeature.details.howItWorks.map((step, index) => (
                <li key={index} style={{ color: '#555', marginBottom: '8px', lineHeight: 1.6 }}>{step}</li>
              ))}
            </ol>
            <h3 style={{ color: '#2d6a4f', margin: '0 0 12px' }}>Key Benefits</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
              {selectedFeature.details.benefits.map((benefit, index) => (
                <div key={index} style={{
                  background: '#d8f3dc', padding: '10px 12px', borderRadius: '6px',
                  fontSize: '13px', color: '#1b4332', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <span>✅</span> {benefit}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/register" style={{
                background: '#2d6a4f', color: 'white', padding: '12px 24px',
                borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '500'
              }}>Get Started Free</Link>
              <button onClick={() => setSelectedFeature(null)} style={{
                background: '#eee', color: '#333', padding: '12px 24px',
                borderRadius: '8px', border: 'none', fontSize: '15px', cursor: 'pointer'
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{
        background: 'white', padding: '16px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 1000
      }}>
        <Logo size={44} showText={true} textColor="#2d6a4f" />
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>Features</a>
          <a href="#how-it-works" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>How It Works</a>
          <a href="#stakeholders" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>Stakeholders</a>
          <a href="#contact" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
          <Link to="/about" style={{ color: '#555', textDecoration: 'none', fontSize: '14px' }}>About Us</Link>
          <Link to="/login" style={{ color: '#2d6a4f', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Login</Link>
          <Link to="/register" style={{
            background: '#2d6a4f', color: 'white', padding: '8px 20px',
            borderRadius: '6px', textDecoration: 'none', fontSize: '14px'
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)',
        padding: '100px 48px', textAlign: 'center', color: 'white'
      }}>
        <p style={{ margin: '0 0 16px', fontSize: '14px', background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '6px 16px', borderRadius: '20px' }}>
          🇰🇪 Built for Kenya
        </p>
        <h1 style={{ margin: '0 0 24px', fontSize: '52px', fontWeight: 'bold', lineHeight: 1.2 }}>
          Smart Waste Collection<br />& Reporting System
        </h1>
        <p style={{ margin: '0 auto 40px', fontSize: '20px', opacity: 0.9, maxWidth: '600px' }}>
          Empowering Kenyan residents to report waste issues, track collection schedules, and keep their communities clean — all from their phones.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/register" style={{
            background: 'white', color: '#2d6a4f', padding: '14px 32px',
            borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'
          }}>Start Reporting Free</Link>
          <a href="#how-it-works" style={{
            background: 'transparent', color: 'white', padding: '14px 32px',
            borderRadius: '8px', textDecoration: 'none', fontSize: '16px', border: '2px solid white'
          }}>See How It Works</a>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: '#2d6a4f', padding: '40px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', color: 'white' }}>
              <p style={{ margin: '0 0 4px', fontSize: '36px', fontWeight: 'bold' }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ padding: '80px 48px', background: '#f8fffe' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: '#2d6a4f', fontSize: '36px', margin: '0 0 16px' }}>
            Key Features of Our Smart Waste Solution
          </h2>
          <div style={{ width: '60px', height: '4px', background: '#52b788', margin: '0 auto 16px' }} />
          <p style={{ color: '#666', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Click on any feature to learn more about how it works
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => setSelectedFeature(feature)}
              style={{
                background: 'white', padding: '32px 24px', borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)', cursor: 'pointer',
                transition: 'all 0.2s', border: '2px solid transparent'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.border = '2px solid #52b788';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.border = '2px solid transparent';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ color: '#2d6a4f', margin: '0 0 12px', fontSize: '18px' }}>{feature.title}</h3>
              <p style={{ color: '#666', margin: '0 0 16px', lineHeight: 1.6, fontSize: '14px' }}>{feature.desc}</p>
              <p style={{ margin: 0, color: '#52b788', fontSize: '13px', fontWeight: '500' }}>Click to learn more →</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" style={{ padding: '80px 48px', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: '#2d6a4f', fontSize: '36px', margin: '0 0 16px' }}>How It Works</h2>
          <div style={{ width: '60px', height: '4px', background: '#52b788', margin: '0 auto 16px' }} />
          <p style={{ color: '#666', fontSize: '18px' }}>Simple steps to keep Kenya clean</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          {howItWorks.map((item) => (
            <div key={item.step} style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: '#2d6a4f', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '20px', fontWeight: 'bold'
              }}>{item.step}</div>
              <h3 style={{ color: '#2d6a4f', margin: '0 0 12px' }}>{item.title}</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholders */}
      <div id="stakeholders" style={{ padding: '80px 48px', background: '#f0f7f4' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: '#2d6a4f', fontSize: '36px', margin: '0 0 16px' }}>Who Is This For?</h2>
          <div style={{ width: '60px', height: '4px', background: '#52b788', margin: '0 auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', maxWidth: '1100px', margin: '0 auto' }}>
          {[
            { icon: '👥', title: 'Residents', desc: 'Report waste issues, track collection schedules and earn rewards for keeping your estate clean.' },
            { icon: '🏛️', title: 'Municipal Authorities', desc: 'Monitor all reports, manage waste companies, view hotspot analytics and take action on issues.' },
            { icon: '🚛', title: 'Waste Companies', desc: 'Receive collection alerts, manage coverage areas and coordinate waste pickup efficiently.' },
            { icon: '🌿', title: 'Environmental Agencies', desc: 'Access waste data analytics, monitor illegal dumping reports and track environmental compliance.' },
          ].map((item) => (
            <div key={item.title} style={{
              background: 'white', padding: '32px 24px', borderRadius: '12px',
              textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
              <h3 style={{ color: '#2d6a4f', margin: '0 0 12px' }}>{item.title}</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
        padding: '80px 48px', textAlign: 'center', color: 'white'
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '36px' }}>Ready to Keep Kenya Clean?</h2>
        <p style={{ margin: '0 0 40px', fontSize: '18px', opacity: 0.9 }}>
          Join thousands of Kenyan residents making a difference in their communities
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/register" style={{
            background: 'white', color: '#2d6a4f', padding: '14px 32px',
            borderRadius: '8px', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold'
          }}>Create Free Account</Link>
          <Link to="/login" style={{
            background: 'transparent', color: 'white', padding: '14px 32px',
            borderRadius: '8px', textDecoration: 'none', fontSize: '16px', border: '2px solid white'
          }}>Sign In</Link>
        </div>
      </div>

      {/* Footer */}
      <div id="contact" style={{ background: '#1b4332', padding: '60px 48px', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Logo size={36} showText={true} textColor="white" />
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.8 }}>📍 Nairobi, Kenya</p>
            <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.8 }}>📞 (+254) 700 000 000</p>
            <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.8 }}>✉️ info@takasmartwaste.co.ke</p>
          </div>
          <div>
            <h4 style={{ margin: '0 0 16px', color: '#52b788' }}>Quick Links</h4>
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Report Issue', path: '/report' },
              { label: 'Collection Schedule', path: '/schedule' },
              { label: 'About Us', path: '/about' },
              { label: 'Contact', path: '/contact' },
            ].map(link => (
              <Link key={link.label} to={link.path} style={{ display: 'block', margin: '0 0 8px', fontSize: '14px', opacity: 0.8, color: 'white', textDecoration: 'none' }}>› {link.label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 16px', color: '#52b788' }}>Stakeholders</h4>
            {['Residents', 'County Officials', 'Waste Companies', 'Environmental Agencies', 'Municipal Authorities'].map(s => (
              <p key={s} style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.8 }}>› {s}</p>
            ))}
          </div>
          <div>
            <h4 style={{ margin: '0 0 16px', color: '#52b788' }}>Features</h4>
            {['Real-Time Tracking', 'Illegal Dumping Reports', 'Points & Rewards', 'Admin Dashboard', 'Analytics & Hotspots'].map(f => (
              <p key={f} style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.8 }}>› {f}</p>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.6 }}>
            © 2026 Taka Smart Waste Kenya. Built to keep Kenya clean. 🇰🇪
          </p>
        </div>
      </div>

    </div>
  );
}

export default Landing;