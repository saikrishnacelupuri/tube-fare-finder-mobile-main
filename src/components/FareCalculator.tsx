import React, { useState, useEffect } from 'react';
import JourneyForm from './JourneyForm';
import FareResults from './FareResults';
import ZoneMap from './ZoneMap';
import { calculateTubeFare, calculateBusFare, saveRecentSearch, getRecentSearches } from '@/utils/fareCalculator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getPrimaryZone, getStationZones } from '@/utils/tubeStations';

const FareCalculator = () => {
  const [result, setResult] = useState(null);
  const [fromStation, setFromStation] = useState('Oxford Circus');
  const [toStation, setToStation] = useState('King\'s Cross St. Pancras');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load recent searches on component mount
    const searches = getRecentSearches();
    setRecentSearches(searches);
  }, []);
  
  const handleCalculate = (data) => {
    const { journeyType, tripType, busJourneys, journeyTime } = data;
    
    let calculationResult;
    
    if (journeyType === 'tube') {
      // Get the primary zones for the stations
      const fromZone = getPrimaryZone(data.fromStation);
      const toZone = getPrimaryZone(data.toStation);
      
      calculationResult = calculateTubeFare(fromZone, toZone, journeyTime);
      
      // Add additional properties to the result
      calculationResult = {
        ...calculationResult,
        journeyType,
        tripType,
        journeyTime,
        fromStation: data.fromStation,
        toStation: data.toStation,
        fromZones: getStationZones(data.fromStation),
        toZones: getStationZones(data.toStation)
      };
      
      // Save to recent searches
      saveRecentSearch({
        type: 'tube',
        fromStation: data.fromStation,
        toStation: data.toStation,
        timestamp: new Date().toISOString()
      });
    } else {
      // For bus fare calculation, we only need the number of journeys
      calculationResult = calculateBusFare(busJourneys);
      
      // Add additional properties to the result
      calculationResult = {
        ...calculationResult,
        journeyType,
        tripType,
        journeyTime
      };
      
      // Save to recent searches
      saveRecentSearch({
        type: 'bus',
        journeyCount: busJourneys,
        timestamp: new Date().toISOString()
      });
    }
    
    // Update result
    setResult(calculationResult);
    
    // Show toast notification
    toast({
      title: "Fare calculated",
      description: "Your journey fare has been calculated successfully.",
    });
  };
  
  const handleResetResult = () => {
    setResult(null);
  };
  
  const handleRecentSearchClick = (search) => {
    if (search.type === 'tube') {
      handleCalculate({
        journeyType: 'tube',
        fromStation: search.fromStation,
        toStation: search.toStation,
        journeyTime: new Date()
      });
    } else {
      handleCalculate({
        journeyType: 'bus',
        fromStation: '', // Doesn't matter for bus
        toStation: '', // Doesn't matter for bus
        busJourneys: search.journeyCount,
        journeyTime: new Date()
      });
    }
    
    setShowRecent(false);
  };
  
  const toggleRecentSearches = () => {
    setShowRecent(!showRecent);
  };
  
  return (
    <div className="max-w-lg mx-auto">
      {!result ? (
        <Card className="glass-card">
          <CardContent className="pt-6">
            {/* Recent searches button */}
            {recentSearches.length > 0 && (
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleRecentSearches}
                  className="text-xs flex items-center"
                >
                  <History className="h-3 w-3 mr-1" />
                  Recent
                </Button>
              </div>
            )}
            
            {/* Recent searches dropdown */}
            {showRecent && recentSearches.length > 0 && (
              <div className="mb-6 p-3 bg-background/80 rounded-md animate-fade-in">
                <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="cursor-pointer p-2 hover:bg-secondary rounded-md flex items-center justify-between text-sm transition-colors"
                    >
                      {search.type === 'tube' ? (
                        <span>{search.fromStation} to {search.toStation}</span>
                      ) : (
                        <span>{search.journeyCount} Bus {search.journeyCount === 1 ? 'Journey' : 'Journeys'}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(search.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Journey form */}
            <JourneyForm onCalculate={handleCalculate} />
          </CardContent>
        </Card>
      ) : (
        <FareResults result={result} onBack={handleResetResult} />
      )}
    </div>
  );
};

export default FareCalculator;
