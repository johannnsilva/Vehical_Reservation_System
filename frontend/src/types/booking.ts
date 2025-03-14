export interface Booking {
    bookingId: number;
    bookingNumber: string;
    customerId: number;
    vehicleId: number;
    driverId: number | null;
    pickupAddress: string;
    destinationAddress: string;
    pickupTime: string;
    dropoffTime: string;
    status: string;
    distance: number;
    amount: number;
}

export interface BookingDTO {
    bookingId?: number;
    bookingNumber?: string;
    customerId?: number;
    vehicleId?: number;
    driverId?: number | null;
    pickupAddress?: string;
    destinationAddress?: string;
    pickupTime?: string;
    dropoffTime?: string;
    status?: string;
    distance?: number;
    amount?: number;
}

export type CreateBookingResponse = Booking;
export type GetBookingByIdResponse = Booking;
export type GetBookingByBookingNumberResponse = Booking;
export type GetBookingsByCustomerIdResponse = Array<Booking>;
export type GetBookingsByDriverIdResponse = Array<Booking>;
export type UpdateBookingResponse = Booking;
export type GetAllBookingsResponse = Array<Booking>;
export interface CancelBookingResponse {
    message: string;
}
export type AcceptBookingResponse = Booking;
