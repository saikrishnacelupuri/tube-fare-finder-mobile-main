
import React from 'react';
import { cn } from '@/lib/utils';

const ZoneMap = ({ selectedFromZone, selectedToZone, onZoneClick, className }) => {
  // Array of available zones
  const zones = [1, 2, 3, 4, 5, 6];
  
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">London Travel Zones</h3>
        
        <div className="relative w-full max-w-md aspect-square">
          {/* Create concentric circles for zones */}
          {zones.map((zone, index) => (
            <div
              key={zone}
              className={cn(
                "absolute rounded-full border transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                selectedFromZone === zone || selectedToZone === zone 
                  ? "border-primary border-2" 
                  : "border-border",
                selectedFromZone === zone && "bg-primary/10",
                selectedToZone === zone && "bg-accent/30"
              )}
              style={{
                left: '50%',
                top: '50%',
                width: `${100 - ((zones.length - index) * 14)}%`,
                height: `${100 - ((zones.length - index) * 14)}%`,
                zIndex: zones.length - index,
              }}
              onClick={() => onZoneClick(zone)}
            >
              <div
                className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium transition-colors",
                  selectedFromZone === zone || selectedToZone === zone 
                    ? "bg-primary text-white" 
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {zone}
              </div>
            </div>
          ))}
          
          {/* Central point */}
          <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary/10 border border-primary rounded-full mr-2"></div>
            <span>From Zone {selectedFromZone}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent/30 border border-primary rounded-full mr-2"></div>
            <span>To Zone {selectedToZone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneMap;
