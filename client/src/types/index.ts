// Shared TypeScript types across the app

export type Role = 'DONOR' | 'NGO' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  orgName: string;
  verified: boolean;
  active: boolean;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
  createdAt: string;
}

export type ListingStatus = 'AVAILABLE' | 'RESERVED' | 'COLLECTED' | 'EXPIRED';

export interface Listing {
  id: string;
  donorId: string;
  title: string;
  description?: string;
  foodType: string;
  category?: string;
  condition?: string;
  quantity: number;
  unit: string;
  suitableFor: string;
  servings?: number;
  deliveryOption?: 'NGO_PICKUP' | 'RESTAURANT_DELIVERY';
  deliveryCharge?: number;
  status: ListingStatus;
  pickupStart: string;
  pickupEnd: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  expiresAt: string;
  createdAt: string;
  donor?: Pick<User, 'id' | 'orgName' | 'city' | 'verified'>;
  requests?: Request[];
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COLLECTED';

export interface Request {
  id: string;
  listingId: string;
  ngoId: string;
  status: RequestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  listing?: Listing & { donor?: Pick<User, 'id' | 'orgName' | 'phone'> };
  ngo?: Pick<User, 'id' | 'orgName' | 'city' | 'phone'>;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface DonorStats {
  totalListings: number;
  activeListings: number;
  totalRequests: number;
  pendingRequests: number;
  completedDonations: number;
}

export interface NGOStats {
  totalRequests: number;
  pendingRequests: number;
  acceptedRequests: number;
  completedPickups: number;
  availableListings: number;
}

export interface AdminStats {
  totalUsers: number;
  totalDonors: number;
  totalNGOs: number;
  totalListings: number;
  totalRequests: number;
  availableListings: number;
  collectedListings: number;
  pendingRequests: number;
  completedRequests: number;
}
