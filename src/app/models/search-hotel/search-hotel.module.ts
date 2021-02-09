
// used to constract the api request 
// lan for language , currency for the currency used in the search ,POS pointOfReservation is the the point of origin

// guestInfo contain the adultNO , childNO , childAge    [{ adultn , childn , childGroup:[{age:}]}]
//checkin contains checkin date
//checout contains checkout date
// serch id is the id constracted for the user



export class SearchHoteltModule { 
    constructor (
     public lan:string,
     public Currency:string,
     public POS:string,
     public serachId:any,
     public CityName:string,
     public citywithcountry:string,
     public nation:string,
     public checkIn:string,
     public checkOut:string,
     public roomN:string,
     public guestInfo:any,

  
  
     ){} 
   }

 
   



