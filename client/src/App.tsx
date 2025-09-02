import React from "react";

// Minimal test without any hooks
function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">PawsitiveCheck</h1>
        <p className="text-gray-600">React Context Test - No Hooks</p>
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p>If you see this, React is working!</p>
        </div>
      </div>
    </div>
  );
}

export default App;