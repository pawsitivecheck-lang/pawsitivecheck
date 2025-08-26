import { useState } from "react";

// Minimal test app to verify React rendering works
function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#2563eb' }}>🐾 PawsitiveCheck</h1>
      <p>Pet Product Safety Analysis Platform</p>
      
      <div style={{ 
        background: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px' 
      }}>
        <h2>System Status Check</h2>
        <p>✅ React is rendering correctly</p>
        <p>✅ Basic JavaScript functionality works</p>
        
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          Test Counter: {count}
        </button>
      </div>

      <div style={{ 
        background: '#dcfce7', 
        padding: '20px', 
        borderRadius: '8px', 
        marginTop: '20px' 
      }}>
        <h2>Next Steps</h2>
        <p>1. Verify this basic app loads properly</p>
        <p>2. Test API connectivity below</p>
        <p>3. Gradually restore full functionality</p>
        
        <TestAPIButton />
      </div>
    </div>
  );
}

function TestAPIButton() {
  const [apiResult, setApiResult] = useState<string>("Click to test");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products?limit=1');
      const data = await response.json();
      setApiResult(`✅ API works: ${data[0]?.name || 'No products found'}`);
    } catch (error) {
      setApiResult(`❌ API error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '15px' }}>
      <button
        onClick={testAPI}
        disabled={loading}
        style={{
          background: '#16a34a',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: loading ? 'wait' : 'pointer',
          fontSize: '16px',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{apiResult}</p>
    </div>
  );
}

export default App;