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
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [busJourneys, setBusJourneys] = useState(1);
  const [timeSlot, setTimeSlot] = useState('offPeak');
  const [weekdayOption, setWeekdayOption] = useState('weekday');
  const [stationSearchFrom, setStationSearchFrom] = useState('');
  const [stationSearchTo, setStationSearchTo] = useState('');
  const [filteredFromStations, setFilteredFromStations] = useState([]);
  const [filteredToStations, setFilteredToStations] = useState([]);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation for fromStation and toStation
    if (!fromStation || !toStation) {
      setError('Please select both From Station and To Station.');
      return; // Prevent form submission
    }

    // Clear error if validation passes
    setError('');

    let journeyTime;
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
    
    onCalculate({
      journeyType,
      tripType,
      fromStation,
      toStation,
      busJourneys,
      journeyTime,
      timeSlot,
      weekdayOption
    });
  };
  
  // Generate journey count options 1-10
  const journeyCountOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  
  // Filter stations based on search
  const handleStationSearch = (e, type) => {
    const value = e.target.value;
    if (type === 'from') {
      setStationSearchFrom(value);
      const matches = tubeStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFromStations(matches);
    } else {
      setStationSearchTo(value);
      const matches = tubeStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredToStations(matches);
    }
  };
  
  const selectStation = (stationName, type) => {
    if (type === 'from') {
      setFromStation(stationName);
      setStationSearchFrom('');
      setFilteredFromStations([]);
    } else {
      setToStation(stationName);
      setStationSearchTo('');
      setFilteredToStations([]);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in">

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
                  value={fromStation || stationSearchFrom}
                  onChange={(e) => handleStationSearch(e, 'from')}
                  className="mb-2"
                />
                {stationSearchFrom && filteredFromStations.length > 0 && (
                  <div className="absolute z-10 w-full mt-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredFromStations.map((station) => (
                      <div
                        key={`from-${station.name}`}
                        className="px-4 py-2 hover:bg-secondary cursor-pointer"
                        onClick={() => selectStation(station.name, 'from')}
                      >
                        {station.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
      
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-station">To Station</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for station..."
                  value={toStation || stationSearchTo}
                  onChange={(e) => handleStationSearch(e, 'to')}
                  className="mb-2"
                />
                {stationSearchTo && filteredToStations.length > 0 && (
                  <div className="absolute z-10 w-full mt-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredToStations.map((station) => (
                      <div
                        key={`to-${station.name}`}
                        className="px-4 py-2 hover:bg-secondary cursor-pointer"
                        onClick={() => selectStation(station.name, 'to')}
                      >
                        {station.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
           
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bus" className="space-y-4 pt-4 w-full bg-[#f7f5f2] rounded-md p-4">
          <div className="space-y-2">
            <Label htmlFor="bus-journeys">Number of Journeys</Label>
            <div className="flex items-center">
              <Button
                type="button"
                onClick={() => setBusJourneys(Math.max(1, busJourneys - 1))}
                className="mr-2 w-full"
              >
                -
              </Button>
              <span className='w-full justify-center text-xl'>{busJourneys}</span>
              <Button
                type="button"
                onClick={() => setBusJourneys(busJourneys + 1)}
                className="ml-2 w-full"
              >
                +
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>



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
      
      {/* Weekday/Weekend Selection */}
      <div className="space-y-2">
        <Label className="flex items-center mb-2">Select Day Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <div
            onClick={() => setWeekdayOption('weekday')}
            className={`p-3 border rounded-md cursor-pointer transition-all ${
              weekdayOption === 'weekday'
                ? 'border-primary ring-2 ring-primary bg-primary/5'
                : 'border-input hover:bg-accent'
            }`}
          >
            <div className="font-medium">Weekday</div>
            <div className="text-xs text-muted-foreground">Mon - Fri</div>
          </div>
          <div
            onClick={() => setWeekdayOption('weekend')}
            className={`p-3 border rounded-md cursor-pointer transition-all ${
              weekdayOption === 'weekend'
                ? 'border-primary ring-2 ring-primary bg-primary/5'
                : 'border-input hover:bg-accent'
            }`}
          >
            <div className="font-medium">Weekend</div>
            <div className="text-xs text-muted-foreground">Sat - Sun</div>
          </div>
        </div>
      </div>
      
    
      
      {/* Journey Time Selection */}
      <div className="space-y-2">
        <Label className="flex items-center mb-2">
          <Clock className="mr-2 h-4 w-4" />
          Journey Time
        </Label>
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
            <div className="font-medium">Off-Peak</div>
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
      
      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}
      
      <Button type="submit" className="w-full">
        Calculate Fare
      </Button>
    </form>
  );
};

export default JourneyForm;
