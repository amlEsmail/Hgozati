 

     

 
    export interface Amenity {
        Amenity: string;
        status?: any;
        HotelCode: string;
    }

    export interface RoomResult {
        RoomIndex: number;
        RoomCode: string;
        RoomReference: string;
        Paxs: number;
        Adult: number;
        Child: number;
        RoomType: string;
        RoomMeal: string;
        RatePerNight: number;
        CostPrice: number;
        TotalSellPrice: number;
        MarkupId: number;
        DiscountId: number;
        MarkupValue: number;
        DiscountValue: number;
        IsRefundable: boolean;
        Images: string[];
        cancellationRules: any[];
    }

    export interface Room {
        RoomResults: RoomResult[];
    }

    export interface HotelRoom {
        hotelCode: string;
        hotelName: string;
        hotelRate: number;
        providerID: string;
        providerHotelCode?: any;
        providerHotelID: string;
        hotelThumb?: any;
        hotelDescription: string;
        shortcutHotelDescription: string;
        MarkupId: number;
        DiscountId: number;
        MarkupValue: number;
        DiscountValue: number;
        hotelImages: string[];
        LatLong?: any;
        Location: string;
        hotelStars: number;
        costCurrency?: any;
        costPrice: number;
        TotalSellPrice: number;
        sellCurrency?: any;
        Lat: string;
        Lng: string;
        City: string;
        Country: string;
        ZipCode?: any;
        Address: string;
        CityTaxValue: number;
        CityTaxCurrency?: any;
        Amenities: Amenity[];
        rooms: Room[];
    }
