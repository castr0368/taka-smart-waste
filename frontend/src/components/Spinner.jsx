function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '5px solid #d8f3dc',
        borderTop: '5px solid #2d6a4f',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ marginTop: '16px', color: '#2d6a4f', fontSize: '14px' }}>Loading...</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Spinner;