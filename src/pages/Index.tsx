
import React from 'react';
import AppLayout from '@/layouts/AppLayout';
import FareCalculator from '@/components/FareCalculator';

const Index = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-muted-foreground mb-6">
            Calculate TFL fares for tube and bus journeys across London.
          </p>
        </div>
        
        <FareCalculator />
      </div>
    </AppLayout>
  );
};

export default Index;
