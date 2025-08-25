import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import CookieConsent from "@/components/cookie-consent";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/scan" component={ProductScanner} />
          <Route path="/database" component={ProductDatabase} />
          <Route path="/recalls" component={Recalls} />
          <Route path="/community" component={Community} />
          <Route path="/vets" component={VetFinder} />
          <Route path="/pets" component={PetProfiles} />
          <Route path="/profile" component={Profile} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      )}
      {/* Admin routes accessible to all - components handle auth checks */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/vets" component={VetAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
