export type TravelType = 'flight' | 'train' | 'hotel' | 'package';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Booking {
  id: number;
  user_id: number;
  type: TravelType;
  details: any;
  created_at: string;
}

export interface FlightDetails {
  id: string;
  airline: string;
  logo: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  class: string;
}

export interface FlightBookingDetails extends FlightDetails {
  passengers: Passenger[];
  seatNo: string;
  meal: string;
  paymentMethod: string;
}

export interface TrainDetails {
  id: string;
  trainName: string;
  trainNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  class: string;
}

export interface TrainBookingDetails extends TrainDetails {
  passengers: Passenger[];
  berthPreference: string;
  mealNeeded: boolean;
  mealType?: 'Veg' | 'Non-Veg';
  paymentMethod: string;
}

export interface HotelDetails {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  price: number;
  passId: string;
}
