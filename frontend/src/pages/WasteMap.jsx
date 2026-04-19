import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';
import Spinner from '../components/Spinner';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createColoredIcon = (color) => {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

function SearchControl({ onSearch }) {
  const map = useMap();
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Kenya')}&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([parseFloat(lat), parseFloat(lon)], 14);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, display: 'flex', gap: '8px', background: 'white',
      padding: '8px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search any area in Kenya..."
        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', width: '250px', fontSize: '14px' }}
      />
      <button onClick={handleSearch} style={{
        background: '#2d6a4f', color: 'white', border: 'none',
        padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
      }}>Search</button>
    </div>
  );
}

function WasteMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [mapStyle, setMapStyle] = useState('streets');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await API.get('/reports/');
        setReports(response.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getColor = (status) => {
    if (status === 'pending') return '#e9c46a';
    if (status === 'confirmed') return '#f4a261';
    if (status === 'resolved') return '#52b788';
    return '#ccc';
  };

  const mapStyles = {
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
  };

  const filteredReports = reports.filter(r => {
    if (filter === 'all') return true;
    if (filter === 'illegal') return r.is_illegal_dumping;
    return r.status === filter;
  }).filter(r => r.latitude && r.longitude);

  const hotspots = {};
  reports.forEach(r => {
    const area = r.location_name;
    if (!hotspots[area]) hotspots[area] = 0;
    hotspots[area]++;
  });
  const topHotspots = Object.entries(hotspots).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: '100vh', background: '#f0f7f4' }}>
      <Navbar />
      <div style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
        <h2 style={{ color: '#2d6a4f', marginBottom: '8px' }}>🗺️ Waste Hotspot Map</h2>
        <p style={{ color: '#666', marginBottom: '16px' }}>Live map showing all reported waste locations across Kenya</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>Filter:</span>
            {[
              { value: 'all', label: 'All Reports' },
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'illegal', label: '🚨 Illegal' }
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} style={{
                padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px',
                background: filter === f.value ? '#2d6a4f' : 'white',
                color: filter === f.value ? 'white' : '#555',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>{f.label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>Map Style:</span>
            {[
              { value: 'streets', label: '🗺️ Streets' },
              { value: 'satellite', label: '🛰️ Satellite' },
              { value: 'terrain', label: '⛰️ Terrain' },
              { value: 'dark', label: '🌙 Dark' }
            ].map(s => (
              <button key={s.value} onClick={() => setMapStyle(s.value)} style={{
                padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px',
                background: mapStyle === s.value ? '#1b4332' : 'white',
                color: mapStyle === s.value ? 'white' : '#555',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
              }}>{s.label}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {[
            { color: '#e9c46a', label: 'Pending' },
            { color: '#f4a261', label: 'Confirmed' },
            { color: '#52b788', label: 'Resolved' },
            { color: '#e63946', label: 'Illegal Dumping' }
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: item.color, border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              <span style={{ fontSize: '13px', color: '#555' }}>{item.label}</span>
            </div>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#666' }}>
            Showing {filteredReports.length} reports
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', position: 'relative' }}>
            <MapContainer
              center={[-1.286389, 36.817223]}
              zoom={12}
              style={{ height: '600px', width: '100%' }}
            >
              <SearchControl />
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url={mapStyles[mapStyle]}
              />
              {filteredReports.map((report) => (
                <div key={report.id}>
                  <Circle
                    center={[report.latitude, report.longitude]}
                    radius={150}
                    pathOptions={{
                      color: report.is_illegal_dumping ? '#e63946' : getColor(report.status),
                      fillColor: report.is_illegal_dumping ? '#e63946' : getColor(report.status),
                      fillOpacity: 0.3,
                      weight: 1
                    }}
                  />
                  <Marker
                    position={[report.latitude, report.longitude]}
                    icon={createColoredIcon(report.is_illegal_dumping ? '#e63946' : getColor(report.status))}
                  >
                    <Popup>
                      <div style={{ minWidth: '220px', fontFamily: 'Segoe UI, sans-serif' }}>
                        <h4 style={{ margin: '0 0 8px', color: '#2d6a4f', fontSize: '15px' }}>
                          {report.is_illegal_dumping ? '🚨 ' : '🗑️ '}{report.location_name}
                        </h4>
                        <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#555' }}>{report.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            background: report.is_illegal_dumping ? '#e63946' : getColor(report.status),
                            color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', textTransform: 'capitalize'
                          }}>{report.status}</span>
                          <span style={{ fontSize: '12px', color: '#999' }}>{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                        {report.photo_url && (
                          <img src={`http://localhost:8000${report.photo_url}`} alt="report" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' }} />
                        )}
                      </div>
                    </Popup>
                  </Marker>
                </div>
              ))}
            </MapContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#2d6a4f', margin: '0 0 16px', fontSize: '15px' }}>📊 Map Summary</h3>
              {[
                { label: 'Total Reports', value: reports.length, color: '#2d6a4f' },
                { label: 'Pending', value: reports.filter(r => r.status === 'pending').length, color: '#e9c46a' },
                { label: 'Confirmed', value: reports.filter(r => r.status === 'confirmed').length, color: '#f4a261' },
                { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, color: '#52b788' },
                { label: 'Illegal Dumping', value: reports.filter(r => r.is_illegal_dumping).length, color: '#e63946' },
              ].map((stat) => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>{stat.label}</span>
                  <span style={{ fontWeight: 'bold', color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#2d6a4f', margin: '0 0 16px', fontSize: '15px' }}>🔥 Top Hotspots</h3>
              {topHotspots.length === 0 && <p style={{ color: '#999', fontSize: '13px' }}>No hotspot data yet</p>}
              {topHotspots.map(([area, count], index) => (
                <div key={area} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#333' }}>#{index + 1} {area}</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d6a4f' }}>{count}</span>
                  </div>
                  <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '6px' }}>
                    <div style={{
                      background: index === 0 ? '#e63946' : index === 1 ? '#f4a261' : '#2d6a4f',
                      height: '6px', borderRadius: '4px',
                      width: `${Math.min((count / topHotspots[0][1]) * 100, 100)}%`
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#2d6a4f', padding: '20px', borderRadius: '12px', color: 'white' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '15px' }}>💡 Map Tips</h3>
              <p style={{ margin: '0 0 6px', fontSize: '13px', opacity: 0.9 }}>• Use the search bar to find any area in Kenya</p>
              <p style={{ margin: '0 0 6px', fontSize: '13px', opacity: 0.9 }}>• Switch map styles using the buttons above</p>
              <p style={{ margin: '0 0 6px', fontSize: '13px', opacity: 0.9 }}>• Click any marker to see report details</p>
              <p style={{ margin: '0', fontSize: '13px', opacity: 0.9 }}>• Filter by status to focus on specific reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WasteMap;