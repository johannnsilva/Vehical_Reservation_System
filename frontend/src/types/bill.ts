export interface Bill {
    billId: number;
    bookingId: number;
    totalAmount: number;
    taxAmount: number;
    discountAmount: number;
    paymentStatus: string;
    paymentMethod: string;
    billDate: string;
}

export interface BillDTO {
    billId?: number;
    bookingId?: number;
    totalAmount?: number;
    taxAmount?: number;
    discountAmount?: number;
    paymentStatus?: string;
    paymentMethod?: string;
    billDate?: string;
}

export interface CreateBillResponse extends Bill {}
export interface GetBillByIdResponse extends Bill {}
export interface GetBillByBookingIdResponse extends Bill {}
export interface UpdateBillResponse extends Bill {}
export interface GetAllBillsResponse extends Array<Bill> {}
