
import React from 'react';
import { Toaster } from "@/components/ui/toaster";

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
        <header className="mb-8">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              <span className="inline-block">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary mb-1 tracking-wide">TFL</span>
              </span>
              <span className="ml-2">Fare Estimator</span>
            </h1>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className="mt-10 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} TFL Fare Estimator. All fares are estimates only.</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
