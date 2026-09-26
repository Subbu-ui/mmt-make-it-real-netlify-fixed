/**
 * MMTInventoryProvider Architecture
 *
 * Designed for the MakeMyTrip Young Turks Business Challenge.
 * Defines the contract for fetching real-time inventory from MakeMyTrip's ecosystem.
 * In this prototype, MockMMTInventoryProvider supplies deterministic, calibrated data.
 * In a production deployment, this interface can be substituted with MakeMyTrip's live
 * Apollo/GraphQL or REST microservices for Flights, Hotels, Holidays, Rail, and Bus.
 */

export interface FlightInventoryItem {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  pricePerPerson: number;
  tier: 'economy' | 'premium_economy' | 'business';
  mmtDirectBookingUrl: string;
}

export interface HotelInventoryItem {
  id: string;
  name: string;
  starRating: number;
  location: string;
  roomType: string;
  amenities: string[];
  pricePerNight: number;
  totalForStay: number;
  reviewScore: number;
  reviewCount: number;
  imageUrl: string;
  mmtDirectBookingUrl: string;
}

export interface TrainInventoryItem {
  id: string;
  trainName: string;
  trainNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classesAvailable: string[];
  pricePerPerson: number;
  mmtDirectBookingUrl: string;
}

export interface BusInventoryItem {
  id: string;
  operatorName: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  pricePerPerson: number;
  mmtDirectBookingUrl: string;
}

export interface PackageInventoryItem {
  id: string;
  packageName: string;
  destination: string;
  duration: string;
  inclusions: string[];
  pricePerPerson: number;
  mmtDirectBookingUrl: string;
}

export interface ActivityInventoryItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  rating: number;
  pricePerPerson: number;
  mmtDirectBookingUrl: string;
}

export interface MMTInventoryProvider {
  getFlightOptions(origin: string, destination: string, date: string): Promise<FlightInventoryItem[]>;
  getHotelOptions(destination: string, checkIn: string, nights: number, style?: string): Promise<HotelInventoryItem[]>;
  getTrainOptions(origin: string, destination: string, date: string): Promise<TrainInventoryItem[]>;
  getBusOptions(origin: string, destination: string, date: string): Promise<BusInventoryItem[]>;
  getPackageOptions(destination: string, duration: string): Promise<PackageInventoryItem[]>;
  getActivityOptions(destination: string, vibeCategory?: string): Promise<ActivityInventoryItem[]>;
}

export class MockMMTInventoryProvider implements MMTInventoryProvider {
  async getFlightOptions(origin: string, destination: string): Promise<FlightInventoryItem[]> {
    const isBali = destination.toLowerCase().includes('bali') || destination.toLowerCase().includes('ubud');
    const isPhuket = destination.toLowerCase().includes('phuket');

    if (isBali) {
      return [
        {
          id: 'flt-bali-fast',
          airline: 'Singapore Airlines',
          airlineCode: 'SQ',
          flightNumber: 'SQ-401',
          origin: origin || 'DEL',
          destination: 'DPS',
          departureTime: '08:50',
          arrivalTime: '18:00',
          duration: '9h 10m',
          stops: 1,
          pricePerPerson: 18200,
          tier: 'economy',
          mmtDirectBookingUrl: 'https://www.makemytrip.com/flights/',
        },
        {
          id: 'flt-bali-value',
          airline: 'AirAsia / Batik',
          airlineCode: 'OD',
          flightNumber: 'OD-205',
          origin: origin || 'DEL',
          destination: 'DPS',
          departureTime: '23:30',
          arrivalTime: '10:50 (+1)',
          duration: '11h 20m',
          stops: 1,
          pricePerPerson: 16900,
          tier: 'economy',
          mmtDirectBookingUrl: 'https://www.makemytrip.com/flights/',
        },
        {
          id: 'flt-bali-premium',
          airline: 'Garuda Indonesia',
          airlineCode: 'GA',
          flightNumber: 'GA-891',
          origin: origin || 'DEL',
          destination: 'DPS',
          departureTime: '10:15',
          arrivalTime: '19:45',
          duration: '9h 30m',
          stops: 1,
          pricePerPerson: 27500,
          tier: 'premium_economy',
          mmtDirectBookingUrl: 'https://www.makemytrip.com/flights/',
        },
      ];
    }

    if (isPhuket) {
      return [
        {
          id: 'flt-phuket-direct',
          airline: 'IndiGo Direct',
          airlineCode: '6E',
          flightNumber: '6E-1071',
          origin: origin || 'DEL',
          destination: 'HKT',
          departureTime: '06:15',
          arrivalTime: '11:45',
          duration: '4h 30m',
          stops: 0,
          pricePerPerson: 14800,
          tier: 'economy',
          mmtDirectBookingUrl: 'https://www.makemytrip.com/flights/',
        },
      ];
    }

    // Generic fallback
    return [
      {
        id: 'flt-gen-1',
        airline: 'Air India',
        airlineCode: 'AI',
        flightNumber: 'AI-330',
        origin: origin || 'DEL',
        destination: destination,
        departureTime: '09:00',
        arrivalTime: '12:30',
        duration: '3h 30m',
        stops: 0,
        pricePerPerson: 6500,
        tier: 'economy',
        mmtDirectBookingUrl: 'https://www.makemytrip.com/flights/',
      },
    ];
  }

  async getHotelOptions(destination: string, _checkIn: string, nights: number = 4): Promise<HotelInventoryItem[]> {
    const isBali = destination.toLowerCase().includes('bali') || destination.toLowerCase().includes('ubud');
    
    if (isBali) {
      return [
        {
          id: 'htl-bali-recreate',
          name: 'The Kayon Jungle Private Pool Resort',
          starRating: 5,
          location: 'Tegallalang, Ubud',
          roomType: 'Royal Valley Private Pool Villa',
          amenities: ['Private Infinity Pool', 'Free Floating Breakfast', 'Jungle View', 'Spa'],
          pricePerNight: 23500,
          totalForStay: 94000,
          reviewScore: 4.8,
          reviewCount: 1420,
          imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
          mmtDirectBookingUrl: 'https://www.makemytrip.com/hotels/',
        },
        {
          id: 'htl-bali-value',
          name: 'Puri Sebali Resort & Nature Villas',
          starRating: 4,
          location: 'Sebali Village, Ubud',
          roomType: 'Deluxe Suite with Shared Infinity Pool Access',
          amenities: ['Pool Access', 'Paddy View', 'Free Shuttle to Central Ubud', 'Breakfast Included'],
          pricePerNight: 8900,
          totalForStay: 35600,
          reviewScore: 4.5,
          reviewCount: 890,
          imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          mmtDirectBookingUrl: 'https://www.makemytrip.com/hotels/',
        },
      ];
    }

    return [
      {
        id: 'htl-phuket-vibe',
        name: 'The Shore at Katathani Private Pool Villa',
        starRating: 5,
        location: 'Kata Beach, Phuket',
        roomType: 'Sea View Pool Villa',
        amenities: ['Private Pool', 'Oceanfront', 'Complimentary Sunset Cocktails'],
        pricePerNight: 12500,
        totalForStay: 50000,
        reviewScore: 4.7,
        reviewCount: 1100,
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        mmtDirectBookingUrl: 'https://www.makemytrip.com/hotels/',
      },
    ];
  }

  async getTrainOptions(origin: string, destination: string): Promise<TrainInventoryItem[]> {
    return [
      {
        id: 'trn-1',
        trainName: 'Vande Bharat Express',
        trainNumber: '22436',
        origin: origin || 'New Delhi',
        destination: destination || 'Chandigarh',
        departureTime: '06:00',
        arrivalTime: '09:05',
        duration: '3h 05m',
        classesAvailable: ['CC', 'EC'],
        pricePerPerson: 1250,
        mmtDirectBookingUrl: 'https://www.makemytrip.com/railways/',
      },
    ];
  }

  async getBusOptions(origin: string, destination: string): Promise<BusInventoryItem[]> {
    return [
      {
        id: 'bus-1',
        operatorName: 'MMT Assured Zingbus Volvo',
        busType: 'AC Multi-Axle Sleeper (2+1)',
        departureTime: '21:30',
        arrivalTime: '08:30 (+1)',
        duration: '11h 00m',
        rating: 4.6,
        pricePerPerson: 2100,
        mmtDirectBookingUrl: 'https://www.makemytrip.com/bus-tickets/',
      },
    ];
  }

  async getPackageOptions(destination: string, duration: string): Promise<PackageInventoryItem[]> {
    return [
      {
        id: 'pkg-1',
        packageName: `MakeMyTrip Curated ${destination} Explorer`,
        destination,
        duration: duration || '5 Days / 4 Nights',
        inclusions: ['Flight', '4-Star Stay', 'All Transfers', '2 Curated Tours', 'Daily Breakfast'],
        pricePerPerson: 34700,
        mmtDirectBookingUrl: 'https://www.makemytrip.com/holidays-international/',
      },
    ];
  }

  async getActivityOptions(destination: string): Promise<ActivityInventoryItem[]> {
    return [
      {
        id: 'act-1',
        title: 'Tegallalang Sunrise Jungle Swing & Rice Terraces Tour',
        category: 'Sightseeing & Instagram Spots',
        duration: '4 hours',
        rating: 4.8,
        pricePerPerson: 1800,
        mmtDirectBookingUrl: 'https://www.makemytrip.com/activities/',
      },
      {
        id: 'act-2',
        title: 'Cretya Ubud Sunset Club & Infinity Pool Day Pass',
        category: 'Leisure & Nightlife',
        duration: '5 hours',
        rating: 4.7,
        pricePerPerson: 1700,
        mmtDirectBookingUrl: 'https://www.makemytrip.com/activities/',
      },
    ];
  }
}

export const mmtInventory = new MockMMTInventoryProvider();
