
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Banknote, Train, Bus, RotateCcw, Calendar } from 'lucide-react';
import { getTimePeriod } from '@/utils/fareCalculator';

const FareResults = ({ result, onBack }) => {
  if (!result) return null;
  
  const { 
    journeyType, fare, isPeak, fromZone, toZone, journeyTime, 
    journeyCount, singleFare, dailyCap, fromStation, toStation,
    fromZones, toZones
  } = result;
  
  // Format the amount as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format the time
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date));
  };
  
  // Check if date is a weekend
  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };
  
  // Format zones as string
  const formatZones = (zones) => {
    if (!zones || zones.length === 0) return "Unknown";
    if (zones.length === 1) return `Zone ${zones[0]}`;
    return `Zones ${zones.join('/')}`;
  };
  
  const timePeriod = getTimePeriod(journeyTime);
  const dayType = isWeekend(journeyTime) ? 'Weekend' : 'Weekday';
  
  return (
    <Card className="w-full animate-slide-in glass-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            {journeyType === 'tube' ? (
              <>
                <Train className="mr-2 h-5 w-5" />
                <span>Tube Fare</span>
              </>
            ) : (
              <>
                <Bus className="mr-2 h-5 w-5" />
                <span>Bus Fare</span>
              </>
            )}
          </CardTitle>
          <Badge variant={timePeriod === 'Peak' ? 'default' : 'outline'} className="text-xs">
            {timePeriod}
          </Badge>
        </div>
        <CardDescription className="flex flex-col space-y-1">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>{formatTime(journeyTime)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{dayType}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {journeyType === 'tube' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-base font-semibold text-center">{fromStation}</span>
                <span className="text-xs text-muted-foreground mt-1">{formatZones(fromZones)}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="text-base font-semibold text-center">{toStation}</span>
                <span className="text-xs text-muted-foreground mt-1">{formatZones(toZones)}</span>
              </div>
            </div>
            
            <div className="bg-background/80 p-2 rounded-md text-center text-sm">
              <p>Journey between {formatZones(fromZones)} and {formatZones(toZones)}</p>
            </div>
          </div>
        ) : (
          <div className="bg-secondary/50 p-4 rounded-lg text-center">
            <span className="text-sm text-muted-foreground">Number of Journeys</span>
            <div className="text-2xl font-semibold mt-1">{journeyCount}</div>
          </div>
        )}
        
        <div className="flex items-center justify-center p-5">
          <Banknote className="h-6 w-6 mr-3 text-primary" />
          <span className="text-3xl font-bold">{formatCurrency(fare)}</span>
        </div>
        
        {journeyType === 'bus' && (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2 bg-background/80 rounded-lg">
              <div className="text-xs text-muted-foreground">Single Fare</div>
              <div className="font-medium">{formatCurrency(singleFare)}</div>
            </div>
            <div className="p-2 bg-background/80 rounded-lg">
              <div className="text-xs text-muted-foreground">Daily Cap</div>
              <div className="font-medium">{formatCurrency(dailyCap)}</div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="w-full flex items-center justify-center"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Calculate Another Fare</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FareResults;
