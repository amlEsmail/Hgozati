import { Subscription, fromEvent } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';
import { ActivatedRoute } from '@angular/router';
import { FlightSearchResult } from 'src/app/flight-search-result';
import { PlatformLocation } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/Services/session.service';
declare var $: any;


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})

export class ConfirmationComponent implements OnInit, OnDestroy {
  Failed: boolean = false;
  Loading: boolean = true;
  sucsess: boolean = false;
  searchId: string = '';
  HGNum: string = '';
  tok: string = '';
  normalError:string ='Something went wrong. Please search again';
  normalErrorStatus:boolean = false;
  sequancenum: number;
  confermation: FlightSearchResult;
  flight: any;
  isCollapsed = false;
  noTicket:boolean=false;
  lan:string="";

  private subscription: Subscription = new Subscription();
  constructor(private myApi: MyApiService, private route: ActivatedRoute, location: PlatformLocation, private Router: Router,private session:SessionService) {
    // history.pushState(null, null,"https://hogozati.com/confirmation");
    // window.addEventListener('popstate', function(event) {
    //     window.location.assign("https://hogozati.com/");
    // })
    // location.onPopState(() => {
    //   debugger
    //   // console.log('pressed back!');
    //   localStorage.setItem('back', 'no');
    //   return this.Router.navigate(['/']);
      
    // });
  }



  ngOnInit() {

    this.lan=localStorage.getItem('lang');
    console.log("langua", this.lan);

    if(this.lan === 'ar'){
      if(!$("link[href='../assets/rtlStyle.css']").length)
      {
        $('head').append('<link href="../assets/rtlStyle.css" rel="stylesheet" type="text/css">');
       
      }
      
    
    
    }
    else
    {
      if(this.lan === 'en')
      {

        if($("link[href='../assets/rtlStyle.css']").length){
          console.log("hereeee")
          $('link[href="../assets/rtlStyle.css"]').prop('disabled', true);
        }
      }
    
  
    }



    if((+sessionStorage.getItem('Timeleft')) > 0 && sessionStorage.getItem('Timeleft')){
      this.session.startTimer();
      this.session.sessionExpierd.subscribe(
        (result)=>{
          this.normalErrorStatus= true;
          this.normalError = "Sorry your session is expierd. please search again ";
          this.Failed= false;
          this.Loading = false;
          this.sucsess = false;
          return
        }
     )
      
    }
    else {
      this.normalErrorStatus= true;
      this.normalError = "Sorry your session is expierd. please search again";
      this.Failed= false;
      this.Loading = false;
      this.sucsess = false;
      return
    }
   
    if(this.route.snapshot.queryParamMap.has('sid') && this.route.snapshot.queryParamMap.has('HG')){
      debugger
        this.searchId = this.route.snapshot.queryParamMap.get('sid');
        this.HGNum =this.route.snapshot.queryParamMap.get('HG');
        this.tok =this.route.snapshot.queryParamMap.get('tok');
        this.subscription.add(this.myApi.getConfirmation(this.HGNum,this.searchId).subscribe(
          (result)=>{
            // console.log(result);
            this.confermation = result;
            this.flight = this.confermation.airItineraries[0];
            this.removePass(  this.confermation.passengersDetails);
            this.Failed=false;
            this.Loading=false;
            this.sucsess=true;
          }
        ));
    }
    else {
      this.Failed = true;
      this.Loading = false;
      this.sucsess = false;
    }
    this.subscription.add(this.route.queryParams.subscribe(

      (params) => {
        // debugger
        this.searchId = params['sid'];
        this.HGNum = params['HG'];
        this.tok = params['tok']
        this.subscription.add( this.myApi.getConfirmation(this.HGNum,this.searchId).subscribe(
          (result)=>{
            // console.log(result);
            this.confermation = result;
            this.removePass( this.confermation.passengersDetails);
            this.flight = this.confermation.airItineraries[0];
            this.Failed = false;
            this.Loading = false;
            this.sucsess = true;
            this.sequancenum = this.confermation.airItineraries[0]['sequenceNum'];
            // console.log("sequancenum",this.sequancenum);
          },
          // (error) => { console.log(error) }

        ))

      }));


  }
  arrivalCity(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = m - 1
    return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["cityName"];
  }

  arrivalAircode(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = m - 1
    return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["airportCode"];
  }
  arrivalDate(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = m - 1
    return item.allJourney.flights[flightN].flightDTO[i]['arrivalDate'];
  }

  arrivalStopCity(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0
    for (i; i < m - 1; i++) {
      return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["cityName"];
    }

  }
  arrivalStopAirPort(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0
    for (i; i < m - 1; i++) {
      return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["airportName"];
    }

  }
  arrivalStopAircode(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0;
    for (i; i < m - 1; i++) {
      return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["airportCode"];
    }
  }

  arrivalStopDate(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0
    for (i; i < m - 1; i++) {
      return item.allJourney.flights[flightN].flightDTO[i]['arrivalDate'];
    }
  }

  showStopStation(item: any, flightN: number) {
    let stopArr: [] = [];
    let ar: [] = item.allJourney.flights[flightN]['flightDTO'];
    let m: number = ar.length;
    let i: number = 0;
    for (i; i < m; i++) {
      stopArr.push(ar[i]);
    }
    return stopArr;


  }
  showStop(item: any, flightN: number) {
    // debugger
    // let stop:boolean=false;
    let stopSeg: number = 0;
    // console.log(flightN);
    if (item.allJourney.flights[flightN]["stopsNum"]) {
      return false
    }
    stopSeg = item.allJourney.flights[flightN]["stopsNum"];

    // if(stopSeg >= 1)
    // {
    //  return !stop
    // }
    // console.log("stopS",stopSeg);
    return stopSeg >= 1 ? true : false;


  }
  stopsairport(flights: number) {
    let stops = this.flight.allJourney.flights[flights]['stopsNum']
    let i = 0;
    let airports: string = ''
    while (i < stops) {
      if (i == 0) {
        airports = airports + this.flight.allJourney.flights[flights]["flightDTO"][i]['arrivalTerminalAirport']['airportCode'];
        i++
      }
      else {
        airports = airports + ', ' + this.flight.allJourney.flights[flights]["flightDTO"][i]['arrivalTerminalAirport']['airportCode'];
        i++
      }

    }
    return airports;
  }

  farerules() {
    // console.log("test-sequenceNum",this.sequancenum);
    return "/terms/"+this.searchId+"/"+this.sequancenum ;
   }
  ngOnDestroy(){
    this.subscription.unsubscribe();

  }

  // remove passenger info if tickectNo is zero 
  removePass(passengersDetails:any[]){
    // for (let i=0 ;i<passengersDetails.length;i++)
    // {
    //   if(i)
    // }
    if(passengersDetails[0].ticketNumber == 0 || passengersDetails[0].ticketNumber==null || passengersDetails[0].ticketNumber == "" )
    {
      // console.log("no ticeketnumber  is avalible", passengersDetails[0].ticketNumber )
      this.noTicket=false;

    }
    else
    {
      this.noTicket=true;
    }




  }
}
