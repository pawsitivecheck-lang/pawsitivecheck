import React from "react";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Alert Banner */}
      <div className="bg-red-600 text-white py-3 px-4 text-center text-sm font-medium">
        🚨 ALERT: New product recalls updated • Check your pet's products now →
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                🐾
              </div>
              <h1 className="text-xl font-bold text-gray-900">PawsitiveCheck</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/api/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg text-3xl">
                🐾
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PawsitiveCheck</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-4 max-w-4xl mx-auto">
              Your trusted companion for pet product safety analysis
            </p>
            
            <p className="text-lg text-gray-500 mb-8 max-w-3xl mx-auto">
              From everyday treats to specialized nutrition, we help you make informed decisions about what's best for your beloved pets. 
              Get instant safety scores, detailed ingredient analysis, and stay updated on the latest product recalls.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
                🛡️ Start Checking Products
              </button>
              
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl">
                📱 Learn How It Works
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3 text-xl">
                  🛡️
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Safety Analysis</h3>
                <p className="text-sm text-gray-500">Get comprehensive safety scores in seconds</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-3 text-xl">
                  ⚠️
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Recall Alerts</h3>
                <p className="text-sm text-gray-500">Stay updated on safety issues and recalls</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center mb-3 text-xl">
                  👥
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Powered</h3>
                <p className="text-sm text-gray-500">Learn from fellow pet owners' experiences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 text-center border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🛡️
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Safety Check</h3>
              <p className="text-sm text-gray-500 mb-4">Get immediate safety scores and ingredient analysis for any product</p>
            </div>
            
            <div className="p-6 text-center border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 mx-auto bg-green-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                📊
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h3>
              <p className="text-sm text-gray-500 mb-4">Get comprehensive safety scores and ingredient breakdowns</p>
            </div>
            
            <div className="p-6 text-center border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 mx-auto bg-red-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                🚨
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Alerts</h3>
              <p className="text-sm text-gray-500 mb-4">Get instant notifications about product recalls and safety issues</p>
            </div>
            
            <div className="p-6 text-center border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 mx-auto bg-purple-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
                👥
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Reviews</h3>
              <p className="text-sm text-gray-500 mb-4">Read and share experiences with fellow pet owners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 text-sm">
                🐾
              </div>
              <span className="text-lg font-bold text-gray-900">PawsitiveCheck</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Keeping your pets safe, one product at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <a href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="/vet-finder" className="hover:text-gray-900 transition-colors">Find Veterinarians</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}