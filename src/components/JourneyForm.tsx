
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Bus, Train, Calendar, ArrowRight, RotateCw } from 'lucide-react';
import { tubeStations } from '@/utils/tubeStations';
import { Input } from '@/components/ui/input';

const JourneyForm = ({ onCalculate }) => {
  const [journeyType, setJourneyType] = useState('tube');
  const [tripType, setTripType] = useState('oneWay');
  const [fromStation, setFromStation] = useState('Oxford Circus');
  const [toStation, setToStation] = useState('King\'s Cross St. Pancras');
  const [busJourneys, setBusJourneys] = useState('1');
  const [timeOption, setTimeOption] = useState('now');
  const [timeSlot, setTimeSlot] = useState('offPeak');
  const [weekdayOption, setWeekdayOption] = useState('weekday');
  const [stationSearchFrom, setStationSearchFrom] = useState('');
  const [stationSearchTo, setStationSearchTo] = useState('');
  
  const handleTimeOptionChange = (value) => {
    setTimeOption(value);
    if (value === 'custom') {
      // Default to off-peak when switching to custom
      setTimeSlot('offPeak');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let journeyTime;
    if (timeOption === 'now') {
      journeyTime = new Date();
    } else {
      // Create a date based on current date but with time slot
      journeyTime = new Date();
      
      // Set time based on selected time slot
      switch(timeSlot) {
        case 'morningPeak':
          journeyTime.setHours(8, 0, 0); // 8:00 AM
          break;
        case 'eveningPeak':
          journeyTime.setHours(17, 30, 0); // 5:30 PM
          break;
        case 'offPeak':
          journeyTime.setHours(11, 0, 0); // 11:00 AM
          break;
        case 'lateEvening':
          journeyTime.setHours(20, 0, 0); // 8:00 PM
          break;
        default:
          journeyTime.setHours(11, 0, 0); // Default to 11:00 AM
      }
      
      // If weekend is selected, set the date to the next Saturday or Sunday
      if (weekdayOption === 'weekend') {
        const currentDay = journeyTime.getDay(); // 0 = Sunday, 6 = Saturday
        if (currentDay > 0 && currentDay < 6) {
          // It's a weekday, move to Saturday (add days needed to reach Saturday)
          const daysUntilWeekend = 6 - currentDay;
          journeyTime.setDate(journeyTime.getDate() + daysUntilWeekend);
        }
      } else {
        // Ensure it's a weekday (Monday-Friday)
        const currentDay = journeyTime.getDay(); // 0 = Sunday, 6 = Saturday
        if (currentDay === 0 || currentDay === 6) {
          // It's a weekend, move to Monday
          const daysUntilWeekday = currentDay === 0 ? 1 : 2;
          journeyTime.setDate(journeyTime.getDate() + daysUntilWeekday);
        }
      }
    }
    
    onCalculate({
      journeyType,
      tripType,
      fromStation,
      toStation,
      busJourneys: parseInt(busJourneys),
      journeyTime
    });
  };
  
  // Generate journey count options 1-10
  const journeyCountOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  
  // Filter stations based on search
  const filteredFromStations = stationSearchFrom 
    ? tubeStations.filter(station => 
        station.name.toLowerCase().includes(stationSearchFrom.toLowerCase())
      ).map(station => station.name)
    : tubeStations.map(station => station.name);
  
  const filteredToStations = stationSearchTo
    ? tubeStations.filter(station => 
        station.name.toLowerCase().includes(stationSearchTo.toLowerCase())
      ).map(station => station.name)
    : tubeStations.map(station => station.name);
  
  // Handle station selection
  const handleStationSearch = (e, type) => {
    const value = e.target.value;
    if (type === 'from') {
      setStationSearchFrom(value);
      // Auto-select if there's an exact match
      const match = tubeStations.find(
        station => station.name.toLowerCase() === value.toLowerCase()
      );
      if (match) {
        setFromStation(match.name);
      }
    } else {
      setStationSearchTo(value);
      // Auto-select if there's an exact match
      const match = tubeStations.find(
        station => station.name.toLowerCase() === value.toLowerCase()
      );
      if (match) {
        setToStation(match.name);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in">
      {/* Trip Type Selection */}
      <Tabs defaultValue="oneWay" onValueChange={setTripType} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="oneWay" className="flex items-center justify-center">
            <ArrowRight className="mr-2 h-4 w-4" />
            <span>One Way</span>
          </TabsTrigger>
          <TabsTrigger value="roundTrip" className="flex items-center justify-center">
            <RotateCw className="mr-2 h-4 w-4" />
            <span>Round Trip</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Journey Type Selection */}
      <Tabs defaultValue="tube" onValueChange={setJourneyType} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="tube" className="flex items-center justify-center">
            <Train className="mr-2 h-4 w-4" />
            <span>Tube</span>
          </TabsTrigger>
          <TabsTrigger value="bus" className="flex items-center justify-center">
            <Bus className="mr-2 h-4 w-4" />
            <span>Bus</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tube" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-station">From Station</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for station..."
                  value={stationSearchFrom}
                  onChange={(e) => handleStationSearch(e, 'from')}
                  className="mb-2"
                />
                {stationSearchFrom && filteredFromStations.length > 0 && (
                  <div className="absolute z-10 w-full mt-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredFromStations.map((station) => (
                      <div
                        key={`from-${station}`}
                        className="px-4 py-2 hover:bg-secondary cursor-pointer"
                        onClick={() => {
                          setFromStation(station);
                          setStationSearchFrom(station);
                        }}
                      >
                        {station}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Selected: {fromStation}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-station">To Station</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for station..."
                  value={stationSearchTo}
                  onChange={(e) => handleStationSearch(e, 'to')}
                  className="mb-2"
                />
                {stationSearchTo && filteredToStations.length > 0 && (
                  <div className="absolute z-10 w-full mt-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredToStations.map((station) => (
                      <div
                        key={`to-${station}`}
                        className="px-4 py-2 hover:bg-secondary cursor-pointer"
                        onClick={() => {
                          setToStation(station);
                          setStationSearchTo(station);
                        }}
                      >
                        {station}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Selected: {toStation}</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bus" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="bus-journeys">Number of Journeys</Label>
            <Select
              value={busJourneys}
              onValueChange={setBusJourneys}
            >
              <SelectTrigger id="bus-journeys">
                <SelectValue placeholder="Select journeys" />
              </SelectTrigger>
              <SelectContent>
                {journeyCountOptions.map((count) => (
                  <SelectItem key={`journey-${count}`} value={count.toString()}>
                    {count} {count === 1 ? 'Journey' : 'Journeys'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Journey Time Selection */}
      <Tabs defaultValue="now" onValueChange={handleTimeOptionChange} className="w-full">
        <div className="flex items-center mb-2">
          <Clock className="mr-2 h-4 w-4" />
          <Label>Journey Time</Label>
        </div>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="now" className="flex items-center justify-center">
            <span>Now</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center justify-center">
            <span>Custom</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="space-y-4 pt-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="time-slot">Time Slot</Label>
            <div className="grid grid-cols-2 gap-2">
              <div
                onClick={() => setTimeSlot('morningPeak')}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  timeSlot === 'morningPeak' 
                    ? 'border-primary ring-2 ring-primary bg-primary/5' 
                    : 'border-input hover:bg-accent'
                }`}
              >
                <div className="font-medium">Morning Peak</div>
                <div className="text-xs text-muted-foreground">6:30 - 9:30 AM</div>
              </div>
              
              <div
                onClick={() => setTimeSlot('eveningPeak')}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  timeSlot === 'eveningPeak' 
                    ? 'border-primary ring-2 ring-primary bg-primary/5' 
                    : 'border-input hover:bg-accent'
                }`}
              >
                <div className="font-medium">Evening Peak</div>
                <div className="text-xs text-muted-foreground">4:00 - 7:00 PM</div>
              </div>
              
              <div
                onClick={() => setTimeSlot('offPeak')}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  timeSlot === 'offPeak' 
                    ? 'border-primary ring-2 ring-primary bg-primary/5' 
                    : 'border-input hover:bg-accent'
                }`}
              >
                <div className="font-medium">Off-Peak Day</div>
                <div className="text-xs text-muted-foreground">9:30 AM - 4:00 PM</div>
              </div>
              
              <div
                onClick={() => setTimeSlot('lateEvening')}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  timeSlot === 'lateEvening' 
                    ? 'border-primary ring-2 ring-primary bg-primary/5' 
                    : 'border-input hover:bg-accent'
                }`}
              >
                <div className="font-medium">Late Evening</div>
                <div className="text-xs text-muted-foreground">7:00 PM - 6:30 AM</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center mb-2">
              <Calendar className="mr-2 h-4 w-4" />
              Day Type
            </Label>
            <RadioGroup 
              value={weekdayOption} 
              onValueChange={setWeekdayOption}
              className="grid grid-cols-2 gap-4"
            >
              <div className={`flex flex-col items-center space-y-2 p-3 border ${weekdayOption === 'weekday' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-input'} rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200`}>
                <RadioGroupItem value="weekday" id="weekday" className="sr-only" />
                <Label htmlFor="weekday" className="cursor-pointer text-center">
                  <div className="font-medium">Weekday</div>
                  <div className="text-xs text-muted-foreground">(Mon-Fri)</div>
                </Label>
              </div>
              
              <div className={`flex flex-col items-center space-y-2 p-3 border ${weekdayOption === 'weekend' ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-input'} rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200`}>
                <RadioGroupItem value="weekend" id="weekend" className="sr-only" />
                <Label htmlFor="weekend" className="cursor-pointer text-center">
                  <div className="font-medium">Weekend</div>
                  <div className="text-xs text-muted-foreground">(Sat-Sun)</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button type="submit" className="w-full">
        Calculate Fare
      </Button>
    </form>
  );
};

export default JourneyForm;
