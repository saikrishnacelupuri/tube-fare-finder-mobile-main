
// London Underground station data with zones

export const tubeStations = [
  { name: "Aldgate", zones: [1] },
  { name: "Aldgate East", zones: [1] },
  { name: "Angel", zones: [1] },
  { name: "Baker Street", zones: [1] },
  { name: "Bank", zones: [1] },
  { name: "Barbican", zones: [1] },
  { name: "Bayswater", zones: [1] },
  { name: "Blackfriars", zones: [1] },
  { name: "Bond Street", zones: [1] },
  { name: "Borough", zones: [1] },
  { name: "Camden Town", zones: [2] },
  { name: "Cannon Street", zones: [1] },
  { name: "Chancery Lane", zones: [1] },
  { name: "Charing Cross", zones: [1] },
  { name: "Covent Garden", zones: [1] },
  { name: "Edgware Road", zones: [1] },
  { name: "Embankment", zones: [1] },
  { name: "Euston", zones: [1] },
  { name: "Euston Square", zones: [1] },
  { name: "Farringdon", zones: [1] },
  { name: "Gloucester Road", zones: [1] },
  { name: "Goodge Street", zones: [1] },
  { name: "Great Portland Street", zones: [1] },
  { name: "Green Park", zones: [1] },
  { name: "High Street Kensington", zones: [1] },
  { name: "Holborn", zones: [1] },
  { name: "Hyde Park Corner", zones: [1] },
  { name: "King's Cross St. Pancras", zones: [1] },
  { name: "Knightsbridge", zones: [1] },
  { name: "Lancaster Gate", zones: [1] },
  { name: "Leicester Square", zones: [1] },
  { name: "Liverpool Street", zones: [1] },
  { name: "London Bridge", zones: [1] },
  { name: "Mansion House", zones: [1] },
  { name: "Marble Arch", zones: [1] },
  { name: "Marylebone", zones: [1] },
  { name: "Monument", zones: [1] },
  { name: "Moorgate", zones: [1] },
  { name: "Notting Hill Gate", zones: [1, 2] },
  { name: "Oxford Circus", zones: [1] },
  { name: "Paddington", zones: [1] },
  { name: "Piccadilly Circus", zones: [1] },
  { name: "Pimlico", zones: [1] },
  { name: "Queensway", zones: [1] },
  { name: "Regent's Park", zones: [1] },
  { name: "Russell Square", zones: [1] },
  { name: "Sloane Square", zones: [1] },
  { name: "South Kensington", zones: [1] },
  { name: "St. James's Park", zones: [1] },
  { name: "St. Paul's", zones: [1] },
  { name: "Temple", zones: [1] },
  { name: "Tottenham Court Road", zones: [1] },
  { name: "Tower Hill", zones: [1] },
  { name: "Victoria", zones: [1] },
  { name: "Warren Street", zones: [1] },
  { name: "Waterloo", zones: [1] },
  { name: "Westminster", zones: [1] },
  { name: "Acton Town", zones: [3] },
  { name: "Archway", zones: [2, 3] },
  { name: "Arsenal", zones: [2] },
  { name: "Balham", zones: [3] },
  { name: "Belsize Park", zones: [2] },
  { name: "Bermondsey", zones: [2] },
  { name: "Bethnal Green", zones: [2] },
  { name: "Brixton", zones: [2] },
  { name: "Caledonian Road", zones: [2] },
  { name: "Chalk Farm", zones: [2] },
  { name: "Clapham Common", zones: [2] },
  { name: "Clapham North", zones: [2] },
  { name: "Clapham South", zones: [2, 3] },
  { name: "Earl's Court", zones: [1, 2] },
  { name: "East Acton", zones: [2] },
  { name: "Elephant & Castle", zones: [1, 2] },
  { name: "Finsbury Park", zones: [2] },
  { name: "Fulham Broadway", zones: [2] },
  { name: "Goldhawk Road", zones: [2] },
  { name: "Hammersmith", zones: [2] },
  { name: "Highbury & Islington", zones: [2] },
  { name: "Holloway Road", zones: [2] },
  { name: "Kensal Green", zones: [2] },
  { name: "Kentish Town", zones: [2] },
  { name: "Kilburn", zones: [2] },
  { name: "Ladbroke Grove", zones: [2] },
  { name: "Latimer Road", zones: [2] },
  { name: "Mile End", zones: [2] },
  { name: "North Acton", zones: [2, 3] },
  { name: "Olympia", zones: [2] },
  { name: "Oval", zones: [2] },
  { name: "Parsons Green", zones: [2] },
  { name: "Queen's Park", zones: [2] },
  { name: "Shepherd's Bush", zones: [2] },
  { name: "Stockwell", zones: [2] },
  { name: "Tufnell Park", zones: [2] },
  { name: "Turnham Green", zones: [2, 3] },
  { name: "Vauxhall", zones: [1, 2] },
  { name: "West Brompton", zones: [2] },
  { name: "West Kensington", zones: [2] },
  { name: "Westbourne Park", zones: [2] },
  { name: "White City", zones: [2] },
  { name: "Whitechapel", zones: [2] },
  { name: "Wimbledon", zones: [3] },
  { name: "Wood Green", zones: [3] },
  { name: "Woodford", zones: [4] },
  { name: "Wembley Park", zones: [4] },
  { name: "Stratford", zones: [2, 3] },
  { name: "Ealing Broadway", zones: [3] },
  { name: "Richmond", zones: [4] },
  { name: "Morden", zones: [4] },
  { name: "Heathrow Terminals", zones: [6] },
  { name: "Uxbridge", zones: [6] },
  { name: "Cockfosters", zones: [5] },
  { name: "High Barnet", zones: [5] },
  { name: "Stanmore", zones: [5] },
  { name: "Edgware", zones: [5] },
];

// Function to get a station by name
export const getStationByName = (name) => {
  return tubeStations.find(station => station.name === name);
};

// Function to get a station's zone(s)
export const getStationZones = (name) => {
  const station = getStationByName(name);
  return station ? station.zones : [];
};

// Function to get the primary zone of a station (first zone listed)
export const getPrimaryZone = (name) => {
  const zones = getStationZones(name);
  return zones.length > 0 ? zones[0] : null;
};

// Group stations by their primary zone
export const stationsByZone = tubeStations.reduce((acc, station) => {
  const primaryZone = station.zones[0];
  if (!acc[primaryZone]) {
    acc[primaryZone] = [];
  }
  acc[primaryZone].push(station.name);
  return acc;
}, {});

