import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import LandingSafe from "@/pages/landing-safe";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LandingSafe />
    </QueryClientProvider>
  );
}

export default App;