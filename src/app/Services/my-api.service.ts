import { HotelRoom } from './../models/HotelRooms/HotelRooms';
import { GetHotelModule } from './../models/search-hotel/get-hotels.module';
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
import { SearchHoteltModule } from '../models/search-hotel/search-hotel.module';
import { RequiredHotel } from '../models/HotelBooking/RequiredHotelData';
//Imported Module send //

export interface guest {
  adult: number;
  child: number[];
}

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
// get no of Night stay in hotel 
  private nightSource=new BehaviorSubject<number>(0);
  nightNo=this.nightSource.asObservable();
  constructor(private httpClient: HttpClient) { }

  //*** flight search function *** //
  // example api:
  // http://localhost:8080/flights/flightsSearch{Api}/en{language}/KWD{Currency}/Eg{pointcode}/oneway{type}/KWI-CAI-March%2015,%202019/A-1-C-0-I-0/Economy/False/all/0/0/Direct?searchID=test5
 
  searchResult:any;
  // normal search
  searchflow:string ='https://search.hogozati.com';
  BookingFlow:string = 'https://book.hogozati.com';
  FareRules:string ='https://provider.hogozati.com';
  asm:string = 'https://adminsearch.hogozati.com';
  adminapi:string ='https://adminapi.hogozati.com';
  PaymentResult:string ='https://adminprepayment.hogozati.com';
  users:string = 'https://users.hogozati.com';
  hotels: string = "93.115.27.156:3030";
  Apihotels: string = '93.115.27.156:3030';
  getDPayment:string='http://93.115.27.156:7045'

  // searchflow: string = 'http://192.168.1.30:8055';
  // BookingFlow: string = 'http://192.168.1.30:8066';
  // FareRules: string = 'http://192.168.1.30:8021';
  // asm:string = 'https://adminsearch.hogozati.com';
  // adminapi:string ='https://adminapi.hogozati.com';
  // PaymentResult:string ='https://adminprepayment.hogozati.com';
  // users:string = 'https://users.hogozati.com';
//  meta search ports
  // searchflow:string ='46.166.160.65:8005';
  // BookingFlow:string = '46.166.160.65:8035';
  // FareRules:string ='46.166.160.65:8025';
  // asm:string = '46.166.160.65:7060';


  // change nightNo
  changeNightNo(nightnum:number){
    this.nightSource.next(nightnum);

  }
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
    // let api: string = `http://${this.searchflow}/flights/flightsSearch/${language}/${currency}/${SearchPoint}/${flightType}/${flightInfo}/${passengers}/${Cclass}/${directOnly}/all/0/0/Direct?searchID=${searchId}`;
    let api: string = `${this.searchflow}/flights/flightsSearch/${language}/${currency}/${SearchPoint}/${flightType}/${flightInfo}/${passengers}/${Cclass}/${directOnly}/all/0/0/Direct?searchID=${searchId}`;
    console.log(api);
     return this.httpClient.get<FlightSearchResult>(api).pipe(
       take(1),
      map(
        (res)=>{
          this.searchResult =res;
          console.log("resultapi",this.searchResult,api);
        this.resultUpdate.emit(this.searchResult);
        return res;}
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
   
   let api =`${this.asm}/api/GetSearchFlowMapping?LangCode=${lang}`;
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
    let api =`${this.searchflow}/api/GetSelectedFlight?searchid=${searchid}&SequenceNum=${sequenceNum}`;
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
   let api = `${this.BookingFlow}/api/SaveBooking?SearchId=${searchid}&SeqNum=${sequenceNum}`;
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
  let api = `${this.asm}/api/GetAllCountriesByLangName?LangCode=${lang}`;
  return this.httpClient.get<CountriescodeModule[]>(api).pipe(
    take(1),
    map(
      (result)=>{this.countriescode = result; return result;}
    )
  )
  }

  CheckFlightValidation(HGNu:string,lang:string,searchid:string,SeqNum:number){
    // check if the flight is still available
    let api =`${this.BookingFlow}/api/CheckFlightValidation?HGNum=${HGNu}&Language=${lang}&SearchId=${searchid}&SeqNum=${SeqNum}`;
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
    let api = `${this.BookingFlow}/api/GetPaymentView?IP=${ip}&IPLoc=${iplocation}&HG=${HGNu}&SId=${searchid}&NotifyToken=`;
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
    let api = `${this.BookingFlow}/api/Insurance?HG=${HGNu}&SearchId=${searchid}`;
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
  // get direct payment
  getDirectPayment(searchid:string,tok:string,BNu:string){
  let api=`${this.getDPayment}/api/DirectPayment?sid=${searchid}&token=${tok}&bookingNumber=${BNu}`;
  return this.httpClient.get<any>(api).pipe(take(3),
  map(
    (result)=>{
      console.log("apidirect",api);
      return result;}
  )
  )
  }

  getConfirmation(HGNu:string,searchid:string){
    // get return conformtion from the clint
    let api =`${this.BookingFlow}/api/BookingConfirmation?HG=${HGNu}&SId=${searchid}`;
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
   let api = `${this.searchflow}/api/GetOffers?POS=${pointOfsale}`;

   return this.httpClient.get<Bestoffers>(api).pipe(
     take(1),
     map (
       (result)=> { console.log( 'why me',result);if (result){this.myData.next(result)} ; return result;}
     )
   )
 }

 OfferBooking (body:object){
  //take passengers information and return HGNu number
 let api = `${this.searchflow}/api/SelectOffer`;
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
  let api = `${this.FareRules}/api/GetFareRules?SId=${sid}&SeqNum=${seq}`;

  return this.httpClient.get<FareRules[]>(api).pipe(
    take(1),
    map (
      (result)=> { return result;}
    )
  )
}

// start hotel request
// get hotelsresult 
getHotels(searchHotel: SearchHoteltModule) {


  let CityName = searchHotel.CityName;
  let DateFrom = searchHotel.checkIn;
  let DateTo = searchHotel.checkOut;
  let currency = searchHotel.Currency;
  let Nat = searchHotel.nation;
  let POS = searchHotel.POS;
  let Source = "Direct";
  let sID = searchHotel.serachId;
  let Lang = searchHotel.lan;
  let guestInfo = searchHotel.guestInfo;
  let SearchRooms: guest[] = [];

  // R0A3C2G4G3R1A2C0R2A1C1G3
  // str.split('-')[1];
  let arr = guestInfo.split("R");
  arr.splice(0, 1);
  //  getSearchRooms();
  let room: guest = { adult: 1, child: [0] };

  for (let i = 0; i < arr.length; i++) {

    let chNum: number = 0;
    let age: number[] = [];
    chNum = Number(arr[i].slice(4, 5));
    console.log("child", typeof chNum, chNum);
    if (chNum === 0) {
      age = [];
      console.log(chNum, "0child")
    }
    if (chNum === 1) {
      age = [];
      console.log(chNum, "1child")
      age.push(Number(arr[i].slice(6, 7)));
    }
    if (chNum === 2) {
      console.log(chNum, "2child")
      age = [];
      age.push(Number(arr[i].slice(6, 7)));
      age.push(Number(arr[i].slice(8, 9)));
      console.log(age, "age")
    }

    SearchRooms[i] = { adult: Number(arr[i].slice(2, 3)), child: age };


  }

  console.log("allRooms", SearchRooms);


  let getHotels: GetHotelModule = new GetHotelModule(CityName, DateFrom, DateTo, currency, Nat, POS, Source, sID, Lang, SearchRooms);
  let api = `http://${this.Apihotels}/api/HotelSearch`;

  let headers = new HttpHeaders();
  headers = headers.set('Content-Type', 'application/json; charset=utf-8');

  return this.httpClient.post<any>(api, getHotels, {
    headers
  }).pipe(
    take(1),
    map(
      (result) => { 
        console.log(result);
        this.resultUpdate.emit(result)
         return result }
    )
  )
}



GetHotelRooms(Pid, sid, hotelID) {
  // RETURN hOTELS ROOM
  let apiHotel = `http://${this.Apihotels}/`;// salama1472019446 /37094/4
  return this.httpClient.get<HotelRoom>(apiHotel + "api/HotelRooms?sid=" + sid + "&hotel=" + hotelID + "&Pid=" + Pid).pipe(
    take(1),
    map(
      (result) => { console.log(result); return result }
    )
  );
}
GetHotelRoomsNUM(sid, hotelID, Pid, rooms) {
  // RETURN hOTELS ROOM
  let apiHotel = `http://${this.Apihotels}/`;// salama1472019446 /37094/4
  return this.httpClient.get<RequiredHotel>(apiHotel + "api/HotelRooms?sid=" + sid + "&hotel=" + hotelID + "&Pid=" + Pid + "&rooms=" + rooms).pipe(
    take(1),
    map(
      (result) => { console.log(result); return result }
    )
  );
}

// get hotel amenties
// getHotelAmenties(hotelID){
//   let apiHotel= `http://${this.Apihotels}/`;
//   return this.httpClient.get<any[]>(apiHotel+"/api/getAmenities?id="+hotelID).pipe(
//     take(1),
//     map(
//       (result) => { console.log("amenties",result); return result }
//     )
//   )
// }

gethotelAmenities(id:any){
  // return hotel amenities by hotel is
  let api = `http://${this.Apihotels}/api/getAmenities?id=${id}`;
  console.log("amentiesApi",api);
  return this.httpClient.get<any[]>(api).pipe(
    take(1),
    map(
    (result) => { console.log("amenties",result); return result }
    )
  )
}


HotelSaveBookingData(data) {
  // RETURN hOTELS ROOM
  //  let apiHotel=`http://192.168.1.102:3030/`;// salama1472019446 /37094/4
  let apiHotel = `http://${this.Apihotels}/`;

  return this.httpClient.post<any>(apiHotel + "api/HotelBooking", data).pipe(
    take(1),
    map(
      (result) => { console.log(result); return result }
    )
  );

}
GetHPaymentView(ip: string, iplocation: string, HGNu: string, searchid: string, lang: string) {
  //return payment link for hotels payment//
  // let api = `http://${this.BookingFlow}/api/GetPaymentView?IP=${ip}&IPLoc=${iplocation}&HG=${HGNu}&SId=${searchid}&NotifyToken=`;
  let api = `http://93.115.27.156:3030/api/PaymentView?bookingnum=${HGNu}&sid=${searchid}&ip=${ip}&Pos=${iplocation}&lang=${lang}&NotificationTok=""`;
  console.log(api);
  //  let headers = new HttpHeaders();
  //  headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  //  let body= {"UserSeletedInsurance": {"ProductId":productId} };
  return this.httpClient.get<any>(api).pipe(
    take(1),
    map(
      (result) => { console.log(result); return result }
    )
  )
}

getHPaymentResult(url: string) {

  // get the payment result status for hotels
  let api = `http://93.115.27.156:8091/api/paymentresult?${url}`;
  return this.httpClient.get<any>(api).pipe(
    take(1),
    map(
      (result) => {
        console.log("hotelpaymentResult",result);
         return result; }
    )
  )
}

PostProcessingH(HGNu: string, searchid: string, tok: string, url: string) {
  //  get satus after succesful payment
  let api = `http://93.115.27.156:3030/Api/ConfirmHotelStatus?sid=${searchid}&bookingNum=${HGNu}&tok=${tok}`;
  return this.httpClient.get<any>(api).pipe(
    take(1),
    map(
      (result) => { return result; }
    )
  )
}
getConfirmationH(HGNu: string, searchid: string) {
  // get return conformtion from the clint
  let api = `http://93.115.27.156:3030/Api/Confirmation?sid=${searchid}&bookingNum=${HGNu}`;
  return this.httpClient.get<any>(api).pipe(
    take(3),
    map(
      (result) => { return result; }
    )
  )
}

// end hotel request 
// users api 
login(body:object){
  //login api
  let api = `${this.users}/api/Account/Login`
  // let api = `http://46.166.160.65:7099/api/Account/Login`
  console.log(api);
  console.log(body,'this is body');
  let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   return this.httpClient.post<any>(api,body).pipe (
       take(1),
      map (
        (result)=>{console.log(result);return result}
      )
   )
}
signup(body:object){
  // sign up
  let api = `${this.users}/api/Account/Register`
  // let api = `http://46.166.160.65:7099/api/Account/Register`
  console.log(api);
  console.log(body,'this is body');
  let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   return this.httpClient.post<any>(api,body,{
    headers}).pipe (
       take(1),
      map (
        (result)=>{console.log(result);return result}
      )
   )
}
forgetPassword(email){
  // forget password
  let api = `${this.users}/api/Account/ForgotPassword`
  // let api = `http://46.166.160.65:7099/api/Account/Register`
  console.log(api);
  console.log(email,'this is body');
  let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   return this.httpClient.post<any>(api,email,{
    headers}).pipe (
       take(1),
      map (
        (result)=>{console.log(result);return result}
      )
   )
}
UpdatePassword(email){
  //change password
  let api = `${this.users}/api/Account/ChangePassword`
  // let api = `http://46.166.160.65:7099/api/Account/Register`
  console.log(api);
  console.log(email,'this is body');
  let headers = new HttpHeaders();
   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
   return this.httpClient.post<any>(api,email,{
    headers}).pipe (
       take(1),
      map (
        (result)=>{console.log(result);return result}
      )
   )
}
UpcomingAndHistory(email:string){
    //get upcoming and hestory data;
    // let api = `${this.BookingFlow}/api/HistoryAndUpcomingFlights?Email=${email}`;
    let api = `http://46.166.160.65:7030/api/HistoryAndUpcomingFlights?Email=${email}`;
    return this.httpClient.get<any>(api).pipe(
      take(1),
      map (
        (result)=> { return result;}
      )
    )
}

roomcancelation(sid:string,hotelcode:any,roomindex:any,PId:any){
  // return room cancelation roles
  let api = `http://${this.Apihotels}/api/getcancelpolicy?sid=${sid}&hotelcode=${hotelcode}&roomindex=${roomindex}&PId=${PId}`;
  return this.httpClient.get<any[]>(api).pipe(
    take(2),
    map(
      (result) => { return result; }
    )
  )
}

}