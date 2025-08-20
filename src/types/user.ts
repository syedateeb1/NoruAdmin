export interface Location {
  type: string;
  coordinates: string[];
}

export interface UserType {
  location: Location;
  wallet?: string | number;
  _id: string;
  email: string;
  name: string;
  profile_image: string;
  address: string;
  rating: string | number;
  orders: string | number;
  deviceToken: string[];
  role: 0 | 1 | 2;
  createdAt: string;
}
