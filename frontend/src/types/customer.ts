export interface Customer {
    customerId: number;
    name: string;
    address: string;
    nic: string;
    phoneNumber: string;
    userId: number;
    profilePicturePath: string;
}

export interface CustomerDTO {
    customerId?: number;
    name?: string;
    address?: string;
    nic?: string;
    phoneNumber?: string;
    userId?: number;
    profilePicturePath?: string;  // Add this line
}

// Update response interfaces to extend Customer instead of CustomerDTO
export interface CreateCustomerResponse extends Customer {}
export interface GetCustomerByIdResponse extends Customer {}
export interface GetCustomerByNicResponse extends Customer {}
export interface UpdateCustomerResponse extends Customer {}
export interface GetAllCustomersResponse extends Array<Customer> {}
