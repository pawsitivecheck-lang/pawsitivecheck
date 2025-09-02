import React from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LandingSafe() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">PawsitiveCheck</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">PawsitiveCheck</h1>
          <p className="text-gray-600 mb-8">Pet Product Safety Analysis Platform</p>
          
          {isAuthenticated ? (
            <div className="bg-green-100 p-4 rounded">
              <p>✓ Welcome back, {user?.firstName || 'User'}!</p>
              <p>useAuth hook working perfectly!</p>
            </div>
          ) : (
            <div className="bg-blue-100 p-4 rounded">
              <p>Welcome! Please log in to access full features.</p>
              <button 
                onClick={() => window.location.href = '/api/login'}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}