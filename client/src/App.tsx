import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ProductDetail from "@/pages/product-detail";
import AddProduct from "@/pages/add-product";
import SubmitProductUpdate from "@/pages/submit-product-update";
import AdminDashboard from "@/pages/admin-dashboard";
import VetAdmin from "@/pages/vet-admin";
import AdminProductSubmissions from "@/pages/admin-product-submissions";
import Profile from "@/pages/profile";
import Recalls from "@/pages/recalls";
import Community from "@/pages/community";
import ProductDatabase from "@/pages/product-database";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/home" component={Home} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/add-product" component={AddProduct} />
        <Route path="/submit-product-update" component={SubmitProductUpdate} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/vet-admin" component={VetAdmin} />
        <Route path="/admin-product-submissions" component={AdminProductSubmissions} />
        <Route path="/profile" component={Profile} />
        <Route path="/recalls" component={Recalls} />
        <Route path="/community" component={Community} />
        <Route path="/products" component={ProductDatabase} />
        <Route path="/404" component={NotFound} />
        <Route component={Landing} /> {/* Default fallback */}
      </Switch>
    </QueryClientProvider>
  );
}

export default App;