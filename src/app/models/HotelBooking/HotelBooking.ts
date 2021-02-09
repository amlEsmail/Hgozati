 

    export interface Traveller {
        roomNo: number; //hiden
        paxType: string;//ad
        Main: boolean;// hiden 
        firstName: string;
        lastName: string;
        salutation: string;
     //   nationality: string;
        dateOfBirth: string;
       // birthOfDate_string: string;
        travellerId: number;//hidd
        phone: string;
        phoneCode: string;
    }

    export interface BookingObject {
        sid: string;
        cityName: string; //g
        hotelID: string;
        providerHotelID: string;
        pid: string;
        roomQty: number; //g
        paxQty: number; //g
        src: string;
        mail: string;
        currency: string;//g
        sellPrice: number;//g
        totalCost: number;//g
        Travellers: Traveller[];
        
    }

 

