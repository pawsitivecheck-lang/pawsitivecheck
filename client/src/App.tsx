import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import "@/utils/browser-compat"; // Initialize browser compatibility fixes
// import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ProductScanner from "@/pages/product-scanner";
import ProductDatabase from "@/pages/product-database";
import Recalls from "@/pages/recalls";
import Community from "@/pages/community";
import VetFinder from "@/pages/vet-finder";
import VetAdmin from "@/pages/vet-admin";
import AdminDashboard from "@/pages/admin-dashboard";
import Profile from "@/pages/profile";
import PetProfiles from "@/pages/pet-profiles";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Terms from "@/pages/terms";
import PetHealthProtection from "@/pages/pet-health-protection";
import CorporateAccountability from "@/pages/corporate-accountability";
import IngredientTransparency from "@/pages/ingredient-transparency";
import ScannerTechnology from "@/pages/scanner-technology";
import SafetyDatabaseInfo from "@/pages/safety-database-info";
import RecallSystemInfo from "@/pages/recall-system-info";
import CommunityReviewsInfo from "@/pages/community-reviews-info";
import ProductDetail from "@/pages/product-detail";
import ProductAnalysis from "@/pages/product-analysis";
import SubmitProductUpdate from "@/pages/submit-product-update";
import AdminProductSubmissions from "@/pages/admin-product-submissions";
import ComprehensiveSafetyAnalysis from "@/pages/comprehensive-safety-analysis";
import LivestockDashboard from "@/pages/livestock-dashboard";
import LivestockCreateOperation from "@/pages/livestock-create-operation";
import FeedTracking from "@/pages/feed-tracking";
import HerdProfile from "@/pages/herd-profile";
import OperationProfile from "@/pages/operation-profile";
// import CookieConsent from "@/components/cookie-consent";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/terms" component={Terms} />
          <Route path="/pet-health-protection" component={PetHealthProtection} />
          <Route path="/corporate-accountability" component={CorporateAccountability} />
          <Route path="/ingredient-transparency" component={IngredientTransparency} />
          <Route path="/scanner-technology" component={ScannerTechnology} />
          <Route path="/safety-database-info" component={SafetyDatabaseInfo} />
          <Route path="/recall-system-info" component={RecallSystemInfo} />
          <Route path="/community-reviews-info" component={CommunityReviewsInfo} />
          <Route path="/comprehensive-safety-analysis" component={ComprehensiveSafetyAnalysis} />
          <Route path="/vet-finder" component={VetFinder} />
          <Route path="/livestock-preview" component={LivestockDashboard} />
          <Route path="/product-scanner" component={ProductScanner} />
          <Route path="/product-database" component={ProductDatabase} />
          <Route path="/recalls" component={Recalls} />
          <Route path="/community" component={Community} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/product/:id/analysis" component={ProductAnalysis} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/product-scanner" component={ProductScanner} />
          <Route path="/product-database" component={ProductDatabase} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/product/:id/analysis" component={ProductAnalysis} />
          <Route path="/recalls" component={Recalls} />
          <Route path="/community" component={Community} />
          <Route path="/vet-finder" component={VetFinder} />
          <Route path="/pets" component={PetProfiles} />
          <Route path="/profile" component={Profile} />
          <Route path="/pet-health-protection" component={PetHealthProtection} />
          <Route path="/corporate-accountability" component={CorporateAccountability} />
          <Route path="/ingredient-transparency" component={IngredientTransparency} />
          <Route path="/scanner-technology" component={ScannerTechnology} />
          <Route path="/safety-database-info" component={SafetyDatabaseInfo} />
          <Route path="/recall-system-info" component={RecallSystemInfo} />
          <Route path="/community-reviews-info" component={CommunityReviewsInfo} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/submit-product-update" component={SubmitProductUpdate} />
          <Route path="/comprehensive-safety-analysis" component={ComprehensiveSafetyAnalysis} />
          <Route path="/livestock" component={LivestockDashboard} />
          <Route path="/livestock/create" component={LivestockCreateOperation} />
          <Route path="/livestock/feed" component={FeedTracking} />
          <Route path="/livestock/operations/:id" component={OperationProfile} />
          <Route path="/livestock/herds/:id" component={HerdProfile} />
        </>
      )}
      {/* Admin routes accessible to all - components handle auth checks */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/vets" component={VetAdmin} />
      <Route path="/admin/product-submissions" component={AdminProductSubmissions} />
      <Route component={NotFound} />
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
