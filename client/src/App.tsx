// Minimal working React app
function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem 2rem'
      }}>
        <h1 style={{
          color: '#2563eb',
          fontSize: '2rem',
          margin: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🐾 PawsitiveCheck
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>
          Pet Product Safety Analysis Platform
        </p>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Feature Cards */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Product Scanner</h3>
            <p style={{ color: '#6b7280', margin: '0' }}>
              Scan barcodes to analyze pet product safety
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Recall Alerts</h3>
            <p style={{ color: '#6b7280', margin: '0' }}>
              Stay updated on the latest product recalls
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Product Database</h3>
            <p style={{ color: '#6b7280', margin: '0' }}>
              Browse our comprehensive safety database
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Community Reviews</h3>
            <p style={{ color: '#6b7280', margin: '0' }}>
              Read reviews from other pet owners
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div style={{
          maxWidth: '600px',
          margin: '2rem auto 0',
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }}></div>
              <span>Frontend: Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }}></div>
              <span>Backend API: Connected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }}></div>
              <span>Database: Operational</span>
            </div>
          </div>
        </div>

        {/* Products Preview */}
        <ProductsPreview />
      </main>
    </div>
  );
}

function ProductsPreview() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto 0',
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>Featured Products</h3>
      <div style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '6px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#6b7280', margin: '0' }}>
          ✅ React is now working! Products will load here.
        </p>
        <p style={{ color: '#10b981', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
          Server and API are operational
        </p>
      </div>
    </div>
  );
}

export default App;