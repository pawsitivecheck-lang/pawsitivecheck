// Simple test to isolate React mounting issues
function TestApp() {
  console.log("TestApp component is rendering!");
  
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1e40af', fontSize: '3rem', textAlign: 'center' }}>
        🐾 PawsitiveCheck Test
      </h1>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '20px auto',
        textAlign: 'center'
      }}>
        <h2>✅ React is Working!</h2>
        <p>This confirms React is mounting and rendering properly.</p>
        <button 
          onClick={() => alert('Button works!')}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

export default TestApp;