export type TripStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
    id?: number;
    name: string;
    description: string;
    durationDays: number;
    durationNights: number;
    price: number;
    deposit: number;
    date: string[];
    includes: string[];
    location: string;
    imageUrl: string;
    galleryImages: string[];
    active: boolean;
    status: TripStatus;
    availableSlots: number;
    capacity: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export type CreateTripInput = Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>

export interface TripImage {
    path: string;
    fullUrl: string;
}

export interface Booking {
    id?: number;
    tripId: number;
    tripDate: string;
    fullNames: string;
    email: string;
    paymentStatus: 'FAILED' | 'CANCELLED' | 'SUCCESS';
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateBooking = {
    id?: number;
    tripId: number;
    tripDate: string;
    fullNames: string;
    email: string;
    amount: number;
    paymentStatus: 'FAILED' | 'CANCELLED' | 'SUCCESS';
    paymentMethod: string;
    paymentReference: string;
    createdAt?: Date;
    updatedAt?: Date;
};

interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    paymentMethod: string;
    paymentStatus: 'FAILED' | 'CANCELLED' | 'SUCCESS';
    paymentReference: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface File {
    id?: number;
    fileName: string;
    fileId: string;
    fileType: string;
    uploadedBy: string;
    relatedTo: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface BookingWithPayment {
    trip: Trip;
    booking: Booking;
    payment: Payment;
}

export interface BookingsWithPayment {
    trips: Trip;
    bookings: Booking;
    payments: Payment;
}