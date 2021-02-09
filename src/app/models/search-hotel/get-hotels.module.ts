import { guest } from 'src/app/Services/my-api.service';



export class GetHotelModule { 
    constructor (
     public CityName:string,
     public DateFrom:string,
     public DateTo:string,
     public Currency:string,
     public Nat:string,
     public POS:string,
     public Source:string,
     public sID:string,
     public Lang:string,
     public SearchRooms:guest[],

  
  
     ){} 
   }

