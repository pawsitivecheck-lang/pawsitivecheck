import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import Landing from "@/pages/landing";
import ProductDetail from "@/pages/product-detail";
import AddProduct from "@/pages/add-product";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/add-product" component={AddProduct} />
        <Route component={Landing} /> {/* Default fallback */}
      </Switch>
    </QueryClientProvider>
  );
}

export default App;