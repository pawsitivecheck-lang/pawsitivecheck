import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function AppTest() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Hello PawsitiveCheck! 🐾</h1>
        <p className="text-gray-600 mt-4">App is now working!</p>
      </div>
    </QueryClientProvider>
  );
}

export default AppTest;