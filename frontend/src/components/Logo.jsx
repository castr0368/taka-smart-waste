function Logo({ size = 40, showText = true, textColor = '#2d6a4f' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#2d6a4f"/>
        <circle cx="50" cy="50" r="42" fill="#1b4332"/>
        <rect x="35" y="28" width="30" height="6" rx="3" fill="#52b788"/>
        <rect x="38" y="28" width="4" height="6" rx="2" fill="#95d5b2"/>
        <rect x="58" y="28" width="4" height="6" rx="2" fill="#95d5b2"/>
        <rect x="32" y="34" width="36" height="4" rx="2" fill="#52b788"/>
        <path d="M36 38 L38 68 Q38 72 42 72 L58 72 Q62 72 62 68 L64 38 Z" fill="#52b788"/>
        <line x1="45" y1="42" x2="45" y2="68" stroke="#1b4332" strokeWidth="2" strokeLinecap="round"/>
        <line x1="50" y1="42" x2="50" y2="68" stroke="#1b4332" strokeWidth="2" strokeLinecap="round"/>
        <line x1="55" y1="42" x2="55" y2="68" stroke="#1b4332" strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 80 Q50 75 58 80" stroke="#95d5b2" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="72" cy="30" r="8" fill="#52b788"/>
        <path d="M69 30 L71 32 L75 28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {showText && (
        <div>
          <p style={{ margin: 0, fontWeight: '800', fontSize: size * 0.45, color: textColor, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            TAKA
          </p>
          <p style={{ margin: 0, fontWeight: '400', fontSize: size * 0.25, color: textColor, opacity: 0.7, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Smart Waste
          </p>
        </div>
      )}
    </div>
  );
}

export default Logo;