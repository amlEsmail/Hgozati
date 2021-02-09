
// used to constract the api request 
// lan for language , currency for the currency used in the search ,pointOfReservation is the the point of origin
//flight type {one way , round trip , Multiple Destinations}
// flightsInfo contain the deparion time , flight class , passenger number and type { adult , child , infant}
// serch id is the id constracted for the user



export class SearchFlightModule { 
 constructor (
  public lan:string,
  public Currency:string,
  public pointOfReservation:string,
  public flightType:string,
  public flightsInfo:string,
  public passengers:string,
  public Cclass:string,
  public serachId:any,
  public showDirect :boolean,
  public preferredAirLine :string,
  ){} 
}
