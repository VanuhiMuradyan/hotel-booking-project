export interface User {
    _id: string
    name: string
    surname: string
    email: string
    phone: string
    country: string
    city: string
    role: "user" | "admin"
}

export interface Hotel {
    _id: string
    owner: User
    name: string
    description: string
    address: string
    city: string
    country: string
    price: number
    availableRooms: number
    images: string[]
    facilities: string[]
}

export interface Booking {
    _id: string
    hotelId: Hotel
    userId: User
    checkInDate: string
    checkOutDate: string
    numberOfGuests: number
    roomsCount: number
    totalPrice: number
    status: "pending" | "confirmed" | "cancelled" | "completed"
}