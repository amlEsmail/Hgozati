export interface Room {
    ID: number;
    sID: string;
    ProviderId: number;
    HotelCode: string;
    RoomCode: string;
    costPrice: number;
    SellPrice: number;
    SellCurrency: string;
    MarkupId: number;
    MarkupVal: number;
    DiscountId: number;
    DiscountVal: number;
    CreatedAt: Date;
    RoomReference: string;
    meal: string;
    PaxSQty: number;
    roomType: string;
    RoomName: string;
    Adults: number;
    Childern: number;

}

export interface RequiredHotel {
    HotelName: string;
    Hotelstar: number;
    HotelDesc?: any;
    Currency: string;
    City: string;
    location:string;
    hotelThumb:string;
    address:string;
    CheckIn: string,
    Checkout: string,
    rooms: Room[];
}