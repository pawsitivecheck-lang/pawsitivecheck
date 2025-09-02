import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🐾 PawsitiveCheck
            </h1>
            <p className="text-blue-200 text-lg">
              Pet Product Safety Analysis Platform
            </p>
          </header>
          
          <main className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Welcome to PawsitiveCheck! 🎉
              </h2>
              <p className="text-blue-100 mb-6">
                Your trusted companion for pet product safety analysis.
                Scan, analyze, and ensure the best for your furry friends.
              </p>
              <div className="space-y-4">
                <a 
                  href="/api/login" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  🔐 Sign In to Get Started
                </a>
                <p className="text-blue-200 text-sm">
                  New here? Signing in will create your account automatically.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}