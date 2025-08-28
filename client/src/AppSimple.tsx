// Ultra simple test with no imports except React
function AppSimple() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
          🐾 PawsitiveCheck Working!
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          React app is loading successfully!
        </p>
      </div>
    </div>
  );
}

export default AppSimple;