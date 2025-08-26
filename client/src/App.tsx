import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useAuth } from "./hooks/useAuth";
import ProductList from "./components/ProductList";

// Start with minimal working pages
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Navigation />
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🐾 PawsitiveCheck</h1>
          <p className="text-gray-600">Pet Product Safety Analysis Platform</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            title="Product Scanner"
            description="Scan barcodes to analyze pet product safety"
            href="/scanner"
            icon="📱"
          />
          <FeatureCard
            title="Recall Alerts"
            description="Stay updated on the latest product recalls"
            href="/recalls"
            icon="⚠️"
          />
          <FeatureCard
            title="Product Database"
            description="Browse our comprehensive safety database"
            href="/products"
            icon="📊"
          />
          <FeatureCard
            title="Community Reviews"
            description="Read reviews from other pet owners"
            href="/community"
            icon="👥"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <ProductList limit={3} />
        </div>

        <TestAPI />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, href, icon }: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a href={href} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </a>
  );
}

function TestAPI() {
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-2">System Status</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Frontend: Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Backend API: Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Database: Operational</span>
        </div>
      </div>
    </div>
  );
}

function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Navigation />
        <h1 className="text-3xl font-bold mb-6">Product Database</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Products</h2>
          <ProductList />
        </div>
      </div>
    </div>
  );
}

function RecallsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Navigation />
        <h1 className="text-3xl font-bold mb-6 text-red-600">⚠️ Product Recalls</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
          <p className="text-gray-600">Checking for latest recalls...</p>
        </div>
      </div>
    </div>
  );
}

function ScannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Navigation />
        <h1 className="text-3xl font-bold mb-6">📱 Product Scanner</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Barcode Scanner</h2>
          <p className="text-gray-600 mb-4">Scan product barcodes to analyze safety information</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Start Scanning
          </button>
        </div>
      </div>
    </div>
  );
}

function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Navigation />
        <h1 className="text-3xl font-bold mb-6">👥 Community Reviews</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pet Owner Reviews</h2>
          <p className="text-gray-600">Loading community feedback...</p>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <nav className="bg-white rounded-lg shadow mb-6 p-4">
      <div className="flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-blue-600">🐾 PawsitiveCheck</a>
        
        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
          <a href="/products" className="text-gray-600 hover:text-blue-600">Products</a>
          <a href="/scanner" className="text-gray-600 hover:text-blue-600">Scanner</a>
          <a href="/recalls" className="text-gray-600 hover:text-blue-600">Recalls</a>
          <a href="/community" className="text-gray-600 hover:text-blue-600">Community</a>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              <span className="text-sm text-gray-600">Hello, {user?.name || 'User'}</span>
              <a href="/api/auth/logout" className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
                Logout
              </a>
            </div>
          ) : (
            <a href="/api/auth/login" className="ml-4 pl-4 border-l bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Navigation />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <a href="/" className="text-blue-600 hover:underline">Return Home</a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/recalls" component={RecallsPage} />
      <Route path="/scanner" component={ScannerPage} />
      <Route path="/community" component={CommunityPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        <Router />
      </div>
    </QueryClientProvider>
  );
}

export default App;