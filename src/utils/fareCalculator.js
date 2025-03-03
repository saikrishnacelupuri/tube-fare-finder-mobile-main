// TFL Fare Calculation utilities

// Define zone-based tube fare data
const tubeFares = {
  peak: {
    // Same zone travel
    "1-1": 2.50,
    "2-2": 2.00,
    "3-3": 1.70,
    "4-4": 1.50,
    "5-5": 1.50,
    "6-6": 1.50,
    
    // Zone 1 travel
    "1-2": 3.00,
    "1-3": 3.30,
    "1-4": 3.90,
    "1-5": 4.70,
    "1-6": 5.50,
    
    // Zone 2 travel
    "2-3": 2.00,
    "2-4": 2.50,
    "2-5": 3.00,
    "2-6": 3.50,
    
    // Other combinations
    "3-4": 1.70,
    "3-5": 2.30,
    "3-6": 2.80,
    "4-5": 1.70,
    "4-6": 2.00,
    "5-6": 1.70,
  },
  offPeak: {
    // Same zone travel
    "1-1": 2.50,
    "2-2": 1.70,
    "3-3": 1.60,
    "4-4": 1.40,
    "5-5": 1.40,
    "6-6": 1.40,
    
    // Zone 1 travel
    "1-2": 2.50,
    "1-3": 2.80,
    "1-4": 2.90,
    "1-5": 3.40,
    "1-6": 4.00,
    
    // Zone 2 travel
    "2-3": 1.70,
    "2-4": 1.90,
    "2-5": 2.30,
    "2-6": 2.80,
    
    // Other combinations
    "3-4": 1.60,
    "3-5": 1.80,
    "3-6": 2.20,
    "4-5": 1.60,
    "4-6": 1.80,
    "5-6": 1.60,
  }
};

// Define bus fare data
const busFares = {
  singleJourney: 1.75,
  dailyCap: 5.25,
  hopper: true, // Free transfers within 1 hour
};

// Check if time is during peak hours (6:30-9:30 or 16:00-19:00 weekdays)
export const isPeakTime = (dateTime) => {
  const date = new Date(dateTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDay();
  
  // Weekend is always off-peak
  if (day === 0 || day === 6) return false;
  
  // Morning peak: 6:30-9:30
  const isMorningPeak = (hours === 6 && minutes >= 30) || (hours > 6 && hours < 9) || (hours === 9 && minutes <= 30);
  
  // Evening peak: 16:00-19:00
  const isEveningPeak = hours >= 16 && hours < 19;
  
  return isMorningPeak || isEveningPeak;
};

// Calculate tube fare between two zones
export const calculateTubeFare = (fromZone, toZone, time) => {
  // Ensure zones are in ascending order for key lookup
  const [smallerZone, largerZone] = [fromZone, toZone].sort((a, b) => a - b);
  const zoneKey = `${smallerZone}-${largerZone}`;
  
  // Determine if peak or off-peak
  const fareType = isPeakTime(time) ? 'peak' : 'offPeak';
  
  // Get the fare from our data
  const fare = tubeFares[fareType][zoneKey] || null;
  
  return {
    fare,
    isPeak: fareType === 'peak',
    fromZone,
    toZone
  };
};

// Calculate bus fare
export const calculateBusFare = (journeyCount) => {
  // Simple calculation based on journey count and daily cap
  const totalFare = Math.min(busFares.singleJourney * journeyCount, busFares.dailyCap);
  
  return {
    fare: totalFare,
    journeyCount,
    singleFare: busFares.singleJourney,
    dailyCap: busFares.dailyCap
  };
};

// Determine if the time is peak or off-peak
export const getTimePeriod = (time) => {
  return isPeakTime(time) ? 'Peak' : 'Off-Peak';
};

// Save recent search to local storage
export const saveRecentSearch = (search) => {
  try {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    
    // Check if this search already exists
    const exists = recentSearches.some(item => 
      item.fromZone === search.fromZone && 
      item.toZone === search.toZone
    );
    
    if (!exists) {
      // Add to the beginning of the array and limit to 5 recent searches
      const updatedSearches = [search, ...recentSearches].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  } catch (error) {
    console.error('Failed to save recent search:', error);
  }
};

// Get recent searches from local storage
export const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]');
  } catch (error) {
    console.error('Failed to get recent searches:', error);
    return [];
  }
};
