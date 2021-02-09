export interface HotelSearchResult{

    hotelCode: string,
    hotelName: string,
    hotelRate:number,
    providerID: string,
    providerHotelCode: string,
    providerHotelID: string,
    hotelThumb: string,
    hotelDescription: string,
    shortcutHotelDescription:string,
    MarkupId: number,
    DiscountId:number,
    MarkupValue: number,
    DiscountValue: number,
    hotelImages: string [],
    LatLong: string,
    Location: string,
    hotelStars: number,
    costCurrency:string,
    costPrice: number,
    TotalSellPrice: number,
    sellCurrency: string,
    Lat:string,
    Lng: string,
    City: string,
    Country: string,
    ZipCode: string,
    Address: string,
    CityTaxValue: 0,
    CityTaxCurrency: string,
    Amenities: {Amenity:string,status:string,HotelCode:string}[]
  
}
