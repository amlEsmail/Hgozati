//angular Imports Start//
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

//angular import End //
//Imported Module start//
import { SearchFlightModule } from '../models/search-flight/search-flight.module';
import { FlightsInfoModule } from '../models/flights-info/flights-info.module';
import { CitiesModule } from '../models/cities/cities.module';
import { PointOfsaleModule } from '../models/point-ofsale/point-ofsale.module';
import { CurrencyModule } from '../models/currency/currency.module';
import { EventEmitter } from '@angular/core';
import { PassengersModule } from '../models/passengers/passengers.module';
import { CountriescodeModule } from '../models/countriescode/countriescode.module';
import { FlightSearchResult } from '../flight-search-result';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Bestoffers } from '../interface/bestoffers';
import { FareRules } from '../interface/fare-rules';
//Imported Module send //
@Injectable({
  providedIn: 'root'
})
export class MyApiService {
  myData: BehaviorSubject<Bestoffers> = new BehaviorSubject(null);
  flitvalidaty:any;
  offers:Bestoffers;
  resultUpdate:EventEmitter<any> = new EventEmitter();
  pointofsale:EventEmitter<PointOfsaleModule> = new EventEmitter();
  selectedFlight:EventEmitter<FlightSearchResult> = new EventEmitter();
  countriescode:CountriescodeModule[]=[];
  constructor(private httpClient: HttpClient) { }

  //*** flight search function *** //
  // example api:
  // http://localhost:8080/flights/flightsSearch{Api}/en{language}/KWD{Currency}/Eg{pointcode}/oneway{type}/KWI-CAI-March%2015,%202019/A-1-C-0-I-0/Economy/False/all/0/0/Direct?searchID=test5
 
  searchResult:any;
  // normal search
  // searchflow:string ='https://search.hogozati.com';
 
  // BookingFlow:string = 'https://book.hogozati.com';
  // FareRules:string ='https://provider.hogozati.com';
  // asm:string = 'https://adminsearch.hogozati.com';
  adminapi:string ='https://adminapi.hogozati.com';
  PaymentResult:string ='https://adminprepayment.hogozati.com';

  searchflow:string ='46.166.160.65:7010';
  BookingFlow:string = '46.166.160.65:7030';
  FareRules:string ='46.166.160.65:7020';
  asm:string = '46.166.160.65:7060';

//  meta search ports
  // searchflow:string ='46.166.160.65:8005';
  // BookingFlow:string = '46.166.160.65:8035';
  // FareRules:string ='46.166.160.65:8025';
  // asm:string = '46.166.160.65:7060';
  searchFlight(searchFlight: SearchFlightModule) {
    let language = searchFlight.lan;
    let currency = searchFlight.Currency;
    let SearchPoint = searchFlight.pointOfReservation;
    let flightType = searchFlight.flightType;
    let flightInfo =searchFlight.flightsInfo;
    let searchId = searchFlight.serachId;
    let passengers = searchFlight.passengers;
    let Cclass = searchFlight.Cclass;
    let directOnly = searchFlight.showDirect;
    // !!!dont add spaces between the constracted Api below
    let api: string = `http://${this.searchflow}/flights/flightsSearch/${language}/${currency}/${SearchPoint}/${flightType}/${flightInfo}/${passengers}/${Cclass}/${directOnly}/all/0/0/Direct?searchID=${searchId}`;
    // let api: string = `${this.searchflow}/search/flights/flightsSearch/${language}/${currency}/${SearchPoint}/${flightType}/${flightInfo}/${passengers}/${Cclass}/${directOnly}/all/0/0/Direct?searchID=${searchId}`;
    console.log(api);
     return this.httpClient.get<FlightSearchResult>(api).pipe(
       take(1),
      map(
        (res)=>{this.searchResult =res;console.log("result",this.searchResult,api);this.resultUpdate.emit(this.searchResult);return res;}
      )
    )
  }


  passingerFormatter(array: any[]) {
    // convert array of passanger type number to A-1-C-0-I-0
    let passengersString: string;
    passengersString = 'A-' + array[0] + '-C-' + array[1] + '-I-' + array[2];
    return passengersString;
  }


  flightInfoFormatter(array: FlightsInfoModule[]) {
    //return string of flights in KWI-CAI-March%2015%202019_ format
    let FlightsInfoArray: string = '';
    for (let element of array) {
      let fligt: string = element.departingCity + '-' + element.arrivalCity + '-' + element.departionDate + '_';
      FlightsInfoArray = FlightsInfoArray + fligt;
    }
    return FlightsInfoArray.slice(0, -1);
  }

  cityData(lang:string) {
   //return cities data
   let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   
  //  let api =`${this.asm}/api/GetSearchFlowMapping?LangCode=${lang}`;
  let api=`http://${this.asm}/api/GetSearchFlowMapping?LangCode=${lang}`
   let result:any;
   let errorOut: any;
    return this.httpClient.get<CitiesModule[]>(api,{headers:headers}) 
  }

  pointOfSale ()  {
    //return point of sale 
    let api ="https://ipapi.co/json";
    return this.httpClient.get<PointOfsaleModule>(api).pipe(
      take(1),
      map((result)=>{
        this.pointofsale.emit(result);
        return result
      })
    ) ;
  }

  currencyApi (currency:string) {
    //return currency
    let api = `${this.adminapi}/api/CurrencyApi?currency=${currency}`;

    return this.httpClient.get<CurrencyModule[]>(api).pipe(
      take(1),
      map((result)=>{

        return result;
      })
    )
  }

  getSelectedFlight (searchid:string,sequenceNum:number){
    //retern selected flight
    debugger
    // let api =`${this.searchflow}/api/GetSelectedFlight?searchid=${searchid}&SequenceNum=${sequenceNum}`;
    let api =`http://${this.searchflow}/api/GetSelectedFlight?searchid=${searchid}&SequenceNum=${sequenceNum}`;
    console.log(api);
    return this.httpClient.get<any>(api).pipe (
      take(1),
      map(
        (result)=>{this.selectedFlight.emit(result) ,console.log(result);
      })
    )
  }

  saveBooking (searchid:string,sequenceNum:number,body:PassengersModule){
    //take passengers information and return HGNu number
  //  let api = `${this.BookingFlow}/api/SaveBooking?SearchId=${searchid}&SeqNum=${sequenceNum}`;
   let api = `http://${this.BookingFlow}/api/SaveBooking?SearchId=${searchid}&SeqNum=${sequenceNum}`;
   console.log(api);
   let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   return this.httpClient.post<any>(api,body,{
    headers
   }).pipe (
     take(1),
      map (
        (result)=>{console.log(result);return result}
      )
   )
  }

  countrycode (lang:string){
  //  take language and return contries and countries codes
  debugger
  lang=lang.toUpperCase();
  // let api = `${this.asm}/api/GetAllCountriesByLangName?LangCode=${lang}`;
  let api = `http://${this.asm}/api/GetAllCountriesByLangName?LangCode=${lang}`;
  return this.httpClient.get<CountriescodeModule[]>(api).pipe(
    take(1),
    map(
      (result)=>{this.countriescode = result; return result;}
    )
  )
  }

  CheckFlightValidation(HGNu:string,lang:string,searchid:string,SeqNum:number){
    // check if the flight is still available
    // let api =`${this.BookingFlow}/api/CheckFlightValidation?HGNum=${HGNu}&Language=${lang}&SearchId=${searchid}&SeqNum=${SeqNum}`;
    let api =`http://${this.BookingFlow}/api/CheckFlightValidation?HGNum=${HGNu}&Language=${lang}&SearchId=${searchid}&SeqNum=${SeqNum}`;
    console.log("checkapi",api);
    return this.httpClient.get<any>(api).pipe(
      take(1),
      map(
        (result)=>{this.flitvalidaty =result;return result;}
      )
    )
  }

  GetPaymentView(ip:string,iplocation:string,HGNu:string,searchid:string,productId:any){
    //return payment link//
    // let api = `${this.BookingFlow}/api/GetPaymentView?IP=${ip}&IPLoc=${iplocation}&HG=${HGNu}&SId=${searchid}&NotifyToken=`;
    let api = `http://${this.BookingFlow}/api/GetPaymentView?IP=${ip}&IPLoc=${iplocation}&HG=${HGNu}&SId=${searchid}&NotifyToken=`;
   console.log(api);
   let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   let body= {"UserSeletedInsurance": {"ProductId":productId} };
   return this.httpClient.post<any>(api,body,{
      headers
     }).pipe (
       take(1),
      map (
        (result)=>{console.log(result);return result}
      )
   )
  }

  findinsurance(HGNu:string,searchid:string){
    // return selected insurance
    // let api = `${this.BookingFlow}/api/Insurance?HG=${HGNu}&SearchId=${searchid}`;
     let api = `http://${this.BookingFlow}/api/Insurance?HG=${HGNu}&SearchId=${searchid}`;
    return this.httpClient.get<any>(api).pipe(
      take(1),
      map(
        (result)=>{return result;}
      )
    )
  }

  PostProcessing(HGNu:string,searchid:string,tok:string,url:string){
   //  get satus after succesful payment
   let api = `${url}&tok=${tok}`;
   return this.httpClient.get<any>(api).pipe(
     take(1),
    map(
      (result)=>{return result;}
    )
  )
  }

  getConfirmation(HGNu:string,searchid:string){
    // get return conformtion from the clint
    // let api =`${this.BookingFlow}/api/BookingConfirmation?HG=${HGNu}&SId=${searchid}`;
    let api =`http://${this.BookingFlow}/api/BookingConfirmation?HG=${HGNu}&SId=${searchid}`;
    return this.httpClient.get<any>(api).pipe(
      take(3),
      map(
        (result)=>{return result;}
      )
    )
  }
  getPaymentResult(url:string){
    // get the payment result status
    let api =`${this.PaymentResult}/api/paymentresult?${url}`;
    return this.httpClient.get<any>(api).pipe(
      take(1),
      map(
        (result)=>{return result;}
      )
    )
  }
 getOffers(pointOfsale:string) {
   //get ofers in the selected point of sale
  //  let api = `${this.searchflow}/api/GetOffers?POS=${pointOfsale}`;
   let api =`http://${this.searchflow}/api/GetOffers?POS=${pointOfsale}`;

   return this.httpClient.get<Bestoffers>(api).pipe(
     take(1),
     map (
       (result)=> { console.log( 'why me',result);if (result){this.myData.next(result)} ; return result;}
     )
   )
 }

 OfferBooking (body:object){
  //take passengers information and return HGNu number
//  let api = `${this.searchflow}/api/SelectOffer`;
 let api = `http://${this.searchflow}/api/SelectOffer`;
 console.log(api);
 let headers = new HttpHeaders();
 headers = headers.set('Content-Type', 'application/json; charset=utf-8');
 return this.httpClient.post<any>(api,body,{
  headers
 }).pipe (
   take(1),
    map (
      (result)=>{console.log(result);return result}
    )
 )
}
fareRules(sid:string,seq:number){
  //get fare rules for each flight
  // let api = `${this.FareRules}/api/GetFareRules?SId=${sid}&SeqNum=${seq}`;
let api = `http://${this.FareRules}/api/GetFareRules?SId=${sid}&SeqNum=${seq}`;
  return this.httpClient.get<FareRules[]>(api).pipe(
    take(1),
    map (
      (result)=> { return result;}
    )
  )
}


getHotels(body:object){
  // return hotels searc data
  let api = `http://192.168.1.106:3030/api/HotelSearch`;
   console.log(api);
   let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   return this.httpClient.post<any>(api,body,{
      headers
     }).pipe (
       take(1),
      map (
        (result)=>{console.log(result);return result}
      )
   )
}

}