import React, { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";

// Core pages - load immediately
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Terms from "@/pages/terms";

// Lazy load heavy/admin pages to reduce bundle size
const AdminDashboard = React.lazy(() => import("@/pages/admin-dashboard"));
const VetAdmin = React.lazy(() => import("@/pages/vet-admin"));
const AdminProductSubmissions = React.lazy(() => import("@/pages/admin-product-submissions"));
const AddProduct = React.lazy(() => import("@/pages/add-product"));
const SubmitProductUpdate = React.lazy(() => import("@/pages/submit-product-update"));
const Profile = React.lazy(() => import("@/pages/profile"));
const Recalls = React.lazy(() => import("@/pages/recalls"));
const Community = React.lazy(() => import("@/pages/community"));
const ProductDatabase = React.lazy(() => import("@/pages/product-database"));
const LivestockDashboard = React.lazy(() => import("@/pages/livestock-dashboard"));
const OperationProfile = React.lazy(() => import("@/pages/operation-profile"));
const VetFinder = React.lazy(() => import("@/pages/vet-finder"));
const ComprehensiveSafetyAnalysis = React.lazy(() => import("@/pages/comprehensive-safety-analysis"));
const IngredientTransparency = React.lazy(() => import("@/pages/ingredient-transparency"));
const ProductScanner = React.lazy(() => import("@/pages/product-scanner"));

// Loading component for code-split routes
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    <span className="ml-2 text-sm text-gray-600">Loading...</span>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Switch>
        {/* Core pages - loaded immediately */}
        <Route path="/" component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/404" component={NotFound} />
        
        {/* Legal pages - loaded immediately */}
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/terms" component={Terms} />
        
        {/* Code-split pages - lazy loaded */}
        <Route path="/add-product" component={() => (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AddProduct />
            </Suspense>
          </ErrorBoundary>
        )} />
        <Route path="/submit-product-update" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <SubmitProductUpdate />
          </Suspense>
        )} />
        <Route path="/admin" component={() => (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          </ErrorBoundary>
        )} />
        <Route path="/admin-dashboard" component={() => (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          </ErrorBoundary>
        )} />
        <Route path="/vet-admin" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <VetAdmin />
          </Suspense>
        )} />
        <Route path="/admin-product-submissions" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminProductSubmissions />
          </Suspense>
        )} />
        <Route path="/profile" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <Profile />
          </Suspense>
        )} />
        <Route path="/recalls" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <Recalls />
          </Suspense>
        )} />
        <Route path="/community" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <Community />
          </Suspense>
        )} />
        <Route path="/products" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <ProductDatabase />
          </Suspense>
        )} />
        <Route path="/livestock" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <LivestockDashboard />
          </Suspense>
        )} />
        <Route path="/livestock-preview" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <LivestockDashboard />
          </Suspense>
        )} />
        <Route path="/livestock/operations/:id" component={() => (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <OperationProfile />
            </Suspense>
          </ErrorBoundary>
        )} />
        <Route path="/vet-finder" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <VetFinder />
          </Suspense>
        )} />
        <Route path="/comprehensive-safety-analysis" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <ComprehensiveSafetyAnalysis />
          </Suspense>
        )} />
        <Route path="/ingredient-transparency" component={() => (
          <Suspense fallback={<LoadingSpinner />}>
            <IngredientTransparency />
          </Suspense>
        )} />
        <Route path="/product-scanner" component={() => (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ProductScanner />
            </Suspense>
          </ErrorBoundary>
        )} />
        
        {/* Default fallback */}
        <Route component={Landing} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  </ErrorBoundary>
  );
}

export default App;