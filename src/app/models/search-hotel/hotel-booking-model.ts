export interface hotelBookingModel{
    status:string,
    bookingNum: string,
    mail: string,
    pdf: any,
    hotel: {
        hotelCode: string,
        hotelName: string,
        hotelThumb: string,
        Location: string,
        hotelStars: number,
        TotalSellPrice: number,
        sellCurrency: string,
        City: string,
        Country: string,
        Paxes: number,
        Rooms: number,
        CheckIn:string,
        CheckOut: string
    },
    travellers:{
        Title: string,
        FirstName: string,
        LastName: string
    } [] ,
    rooms: {
        RoomCode: string,
        Paxs: number,
        Adult: number,
        Child: number,
        RoomType:string,
        RoomMeal:string,
        IsRefundable: boolean,
        Image: string
    }[]

}