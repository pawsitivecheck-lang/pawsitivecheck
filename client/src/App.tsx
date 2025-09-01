import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import SubmitProductUpdate from "@/pages/submit-product-update";
import ProductDatabase from "@/pages/product-database";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/submit-product-update" component={SubmitProductUpdate} />
          <Route path="/product-database" component={ProductDatabase} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/submit-product-update" component={SubmitProductUpdate} />
          <Route path="/product-database" component={ProductDatabase} />
        </>
      )}
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
