import { Component, OnInit, ViewChild, Input, OnChanges, OnDestroy } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';

import { SearchFlightModule } from 'src/app/models/search-flight/search-flight.module';
import { Options } from 'ng5-slider';
import { DatePipe, Time } from '@angular/common';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FlightSearchResult } from 'src/app/flight-search-result';
import { FilterInputsModule } from 'src/app/models/filter-inputs/filter-inputs.module';
import { CurruncyServiceService } from 'src/app/Services/curruncy-service.service';
import { CurrencyModule } from 'src/app/models/currency/currency.module';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/Services/session.service';

declare var $: any;
interface flightFilter {
  priceMin:number,
  priceMax:number,
  durationMin:number,
  durationMax:number,
  depatingMin:number,
  departingMax:number,
  returnMin:number,
  returnMax:number,
  stops:number[],
  airlines:string[]

}


@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit ,OnChanges,OnDestroy{
  // toggole filtercard
  isShowen:boolean=false;
  rate:number = 2;
  code:string = "AED"
  panelOpenState:boolean[]=[false,false,false,false,false];
  response: FlightSearchResult;
  orgnizedResponce: any[] = [];
  loading: boolean = true;
  resultCard: boolean = false;
  noResultAlert: boolean = false;
  roundT: boolean = false;
  Multi:boolean = false;
  minValue: number = 0
  maxValue: number = 5000
  isCollapsed: boolean = false;
  clicked: number;
  opend: number = -1;
  trueT: boolean[] = [];
  airlinesA:any[]=[];
  filterForm:FormGroup;
  filter:FilterInputsModule;
  activeIds: string[] = ['panel-1','panel-2','panel-3','panel-4','panel-5'];
 myapi:SearchFlightModule;
 incomingdata:any;
 lan:string="";
 private subscription:Subscription=new Subscription();
 filterUpdated:boolean=false;
 normalErrorStatus:boolean =false;
 normalError:string = "Sumthing Happend Please search again"
 

  options3: Options = {
    floor: 0,
    ceil: 2000,
    noSwitching: true,
    translate: (value: number): string => {
      let h = value / 60 | 0;
      let m = value % 60 | 0;
      return h + ":" + m;
    }
  };
  optionsdeparting: Options = {
    floor: 0,
    ceil: 2000,
    noSwitching: true,
    translate: (value: number): string => {
      let h = value / 60 | 0;
      let m = value % 60 | 0;
      return h + ":" + m;
    }
  };

  
  optionsDurathion:Options={
    floor: 0,
    ceil: 2000,
    noSwitching: true,
    translate: (value: number): string => {
      let h = value / 60 | 0;
      let m = value % 60 | 0;
      return h + ":" + m;
    }
  }
  constructor(private search: MyApiService, private datepipe: DatePipe ,private router:Router,private route: ActivatedRoute,private curruncy:CurruncyServiceService ,private session:SessionService) {
 
  }
 get myrate () {return this.rate}

  ngOnInit() {
    debugger
    // console.log(this.curruncy.curruncyArray,"this is from search result component")
    if((+sessionStorage.getItem('Timeleft')) > 0 && sessionStorage.getItem('Timeleft')){
      this.session.startTimer();
      this.session.sessionExpierd.subscribe(
        (result)=>{
          this.normalErrorStatus= true;
          this.normalError = "Sorry your session is expierd please search again ";
          this.loading = false;
          this.resultCard = false;
          this.roundT =false;
          this.Multi = false;
          $('.modal').modal('hide');
          return
        }
     )
      
    }
    else {
      this.normalErrorStatus= true;
      this.normalError = "Sorry Your Session Is Expierd Please Search Again ";
      this.loading = false;
      this.resultCard = false;
      this.roundT =false;
      this.Multi = false;
      $('.modal').modal('hide');
      return
    }
   
    this.curruncy.CurruncyChange.subscribe(
      (result:CurrencyModule)=>{this.rate = result.rate;this.code= result.Currency_Code;}
    )
    this.filterForm = new FormGroup({
      airline: new FormGroup({
        airlines:new FormArray([])
      }),
      stopsForm: new FormGroup({
        noStops: new FormControl(false),
        oneStop: new FormControl(false),
        twoAndm: new FormControl(false)
      }),
      priceSlider: new FormControl([30,1000]),
      durationSlider:new FormControl([30,700]),
      dpartingSlider:new FormControl([30,7000]),
      returnSlider: new FormControl([30,7000])
      })
    //  callling the api from the router
  this.subscription.add(this.route.params.subscribe(
        (params: Params) => {
          
          // debugger
          this.loading = true;
          this.resultCard = false;
          this.noResultAlert = false;
          this.roundT = false;
          // console.log(params['language']);
          // let lan= params['language'];
          // this.lan=params['language'];
          this.lan=localStorage.getItem('lang');
          let Currency =params['currency'];
          // console.log(params['currency']);
          let pointOfReservation =params['SearchPoint'];
          let flightType =params['flightType'];
          let flightsInfo =params['flightInfo'];
          let serachId =params['searchId'];
          let passengers =params['passengers'];
          // console.log(params['passengers']);
          let Cclass =params['Cclass'];
          let showDirect:boolean;
          if(params['directOnly'] =='false'){
            showDirect =false;
          }
          else {
            showDirect =true;
          }
          // if(this.airlineForm){
          //   this.removeArrayControllers();
          // }
          
          // console.log(showDirect);
          // let searchApi: SearchFlightModule =new SearchFlightModule(lan,Currency,pointOfReservation,flightType,flightsInfo,passengers,Cclass,serachId,showDirect,'all');
          let searchApi: SearchFlightModule =new SearchFlightModule(this.lan,Currency,pointOfReservation,flightType,flightsInfo,passengers,Cclass,serachId,showDirect,'all');
          if(SearchFlightModule) {
            this.myapi =searchApi;
            this.subscription.add(this.search.searchFlight(this.myapi).subscribe (
              (result)=>{
               this.response =result;
               this.incomingdata = this.response.searchCriteria
              }
            ))
          }
         
        }
      ));
      // console.log(this.myapi);

     // this is the form that control the fillter
    
  
    this.isCollapsed = true;
    this.subscription.add(this.search.resultUpdate.subscribe(

      (res) => {
        this.response = res; // console.log('myresult', this.response); this.loading = false;
        
        if (this.response.status != 'Valid') {
          this.loading = false;
          this.resultCard = false;
          this.noResultAlert = true;
          this.roundT = false;
          this.Multi = false;
        }
        else {

          this.filterForm.get('durationSlider').setValue(this.findDurationMinMax(this.response.airItineraries));
          this.filterForm.get('durationSlider').updateValueAndValidity();
          this.filterForm.get('dpartingSlider').setValue(this.findDepartingnMinMax(this.response.airItineraries));
          this.filterForm.get('dpartingSlider').updateValueAndValidity();
          this.filterForm.get('priceSlider').setValue(this.minAnMax());
          this.filterForm.get('priceSlider').updateValueAndValidity();
          // console.log(this.filterForm.get('priceSlider'),"check this out")
          this.options3.floor = this.findDurationMinMax(this.response.airItineraries)[0] -100;
          this.options3.ceil = this.findDurationMinMax(this.response.airItineraries)[1]+100;
          this.optionsdeparting.floor = this.findDepartingnMinMax(this.response.airItineraries)[0] -100;
          this.optionsdeparting.ceil = this.findDepartingnMinMax(this.response.airItineraries)[1] +100;
          this.removeArrayControllers();
          this.airlinesA = this.response.airlines;
          this.airlinesA.forEach(element => {
            (<FormArray>this.filterForm.get('airline').get('airlines')).push(new FormControl(false));
          });
         
          // console.log(this.filterForm.get('airline').get('airlines').value);
          if (this.response['searchCriteria']['flightType'] == 'roundtrip') {
            this.resultCard = false;
            this.loading = false;
            this.noResultAlert = false;
            this.roundT = true;
            this.Multi = false;
            this.orgnizedResponce = this.orgnize(this.response.airItineraries);
            // this.minAnMax();
            this.valuesoftrue(this.orgnizedResponce);
            // console.log(this.trueT);
          }
          
          else if (this.response['searchCriteria']['flightType'] == 'multicity'){
            
            this.resultCard = false;
            this.loading = false;
            this.noResultAlert = false;
            this.roundT = false;
            this.Multi = true;
            this.orgnizedResponce = this.orgnize(this.response.airItineraries);
            // this.minAnMax();
            this.valuesoftrue(this.orgnizedResponce);
            // console.log(this.trueT);
          }
          else {
            this.resultCard = true;
            this.loading = false;
            this.noResultAlert = false;
            this.roundT = false;
            this.Multi = false;
            this.orgnizedResponce = this.orgnize(this.response.airItineraries);
            // this.minAnMax();
            this.valuesoftrue(this.orgnizedResponce);
            // console.log(this.trueT);
          }

        };
      }
    ))
    // new filter subscribe
    this.subscription.add(this.filterForm.valueChanges.subscribe(
      (val) => {
         let t1= performance.now();
        if (this.response && !this.loading) {
          // console.log("")

          this.filter = new FilterInputsModule(this.filterForm.get("priceSlider").value[0],
          this.filterForm.get("priceSlider").value[1],
          // new 
          this.filterForm.get('durationSlider').value[0],
          this.filterForm.get('durationSlider').value[1],
          this.filterForm.get('dpartingSlider').value[0],
          this.filterForm.get('dpartingSlider').value[1],
          this.filterForm.get('returnSlider').value[0],
          this.filterForm.get('returnSlider').value[1],
          this.stopsvalues(),
          this.filteringbyairline(this.filterForm.get('airline').get('airlines').value)
          )
          this.oneForAll(this.filter,this.response.airItineraries,this.roundT);
          let t2 = performance.now();
          // console.log(t2-t1 +"ms");
        
        }
      }
    ));

    


  }
 

  ngOnChanges()	{



  }
  stopsvalues(){
    let out:number[] =[] ;
    if(this.filterForm.get('stopsForm').get('noStops').value){
       out.push(0)
    }
    if(this.filterForm.get('stopsForm').get('oneStop').value){
      out.push(1)
    }
    if(this.filterForm.get('stopsForm').get('twoAndm').value){
      out.push(2);
      out.push(3);
      out.push(4);
    }
    if(!this.filterForm.get('stopsForm').get('noStops').value && !this.filterForm.get('stopsForm').get('oneStop').value && !this.filterForm.get('stopsForm').get('twoAndm').value){
          out = [0,1,2,3,4];
    }
    return out
  }
  direct(item: any) {
    if (item == 0) {
      return 'Direct';
    }
    else {
      return item+'Stops';
    }

  }
 // research
 research (newurl:string){
   // console.log("thisis the new url",newurl);
   this.loading =true;
   this.resultCard = false;
   this.noResultAlert = false;
   this.roundT = false;
   this.orgnizedResponce =[];
   this.removeArrayControllers();
   // console.log('hmmm!!',this.loading);

  //  this.filterForm.updateValueAndValidity();
  //  this.filter= new FilterInputsModule(0,2000,0,4800,0,4800,0,4800,[0,1,2,3,4],[])
  //  this.oneForAll(this.filter,this.response.airItineraries,this.roundT);
  //  this.filterForm.get('priceSlider').setValue([0,2000]);
  //  this.filterForm.get("priceSlider").updateValueAndValidity();
   this.router.navigateByUrl('/ResultPage', {skipLocationChange: true}).then(()=>{this.router.navigate([newurl]);
  console.log(newurl)
}
   ); 
  //  this.ngOnDestroy();
  //  this.ngOnInit();
 }
//  
 removeArrayControllers() {
   if(((<FormArray>this.filterForm.get('airline').get("airlines")).length)){
    while (((<FormArray>this.filterForm.get('airline').get("airlines"))).length >= 1) {
      // (<FormArray>this.airlineForm.get("airline").get('airlines')).removeAt(0);
      (<FormArray>this.filterForm.get('airline').get("airlines")).removeAt(0);
    }
   }
 
}


  // Round Trip  //
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
    for(i; i<m-1 ;i++)
    {
      return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["cityName"];
    }
   
  }
  arrivalStopAirPort(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0
    for(i; i<m-1 ;i++)
    {
      return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["airportName"];
    }
   
  }
  arrivalStopAircode(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0;
    for(i; i<m-1 ;i++)
    {
     return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["airportCode"];
    }
  }

  arrivalStopDate(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number =0
    for(i; i<m-1 ;i++)
    {
    return item.allJourney.flights[flightN].flightDTO[i]['arrivalDate'];
    }
  }

  showStopStation(item:any,flightN:number)
  {
    let stopArr:[]=[];
    let ar:[]=item.allJourney.flights[flightN]["flightDTO"];
    let m:number=ar.length;
    let i:number=0;
    for(i; i<m;i++)
    {
      stopArr.push(ar[i]) ;
    }
    return stopArr;

  
  }
  showStop(item:any,flightN:number)
  {
    // let stop:boolean=false;
    let stopSeg:number=0;
     stopSeg=item.allJourney.flights[flightN]["stopsNum"];
    // if(stopSeg >= 1)
    // {
    //  return !stop
    // }
    // // console.log("stopS",stopSeg);
    return stopSeg >=1 ? true : false;
  
   
  }


  //grouping by price and airline
  orgnize(array: any[]) {

    let ar = array
    let out: any[] = []
    ar.forEach(element => {
      let price: number = Math.round(element.itinTotalFare.amount);
      let airLine: string = element.allJourney.flights[0]['flightAirline']['airlineName'];
      // let lairLine: string = airLine.toLocaleLowerCase()
      let lairLine: string;
      if(localStorage.getItem('lang')=='ar'){
        lairLine =airLine;
      }
      else {
        lairLine = airLine.toLocaleLowerCase()
      }
      let item = [];
      if (out.length == 0) {
        item.push(element);
        out.push(item);
      }
      else {
        let found: boolean = false;
        let i = 0
        while (i < out.length || i > 60) {
          let elmentO = out[i];
          let first = elmentO[0];
          let price2: number = Math.round(first.itinTotalFare.amount);
          // let airLine2: string = first.allJourney.flights[0]['flightAirline']['airlineName'];
          // let lairLine2: string = airLine.toLocaleLowerCase()
          let lairLine2: string;
          if (localStorage.getItem('lang')=='ar'){
              lairLine2 = airLine;
          }
          else{
            lairLine2= airLine.toLocaleLowerCase()
          }
          

          if (lairLine == lairLine2 && price == price2) {
            elmentO.push(element);
            found = true;
            break
          }
          else {
            i = i + 1
          }
        }
        if (!found) {
          item.push(element);
          out.push(item);
        }
      }

    });
    return out
  }

  //slider 
  //price

  minAnMax() {
    // debugger;
    let len: number = 20;
    let minValue = this.response.airItineraries[0]['itinTotalFare']['amount'] - 1;
    len = this.response.airItineraries.length;
    len = len - 1;

    let maxValue1 = this.response.airItineraries[len]['itinTotalFare']['amount'] + 1;
    let maxValue = Math.max(...this.response.airItineraries.map(o => o['itinTotalFare']['amount']), 0);
   
    return [0,maxValue+100];
  }
  //getcurr()
   //get curr 
   getcurr(){
    let curr = this.curruncy.currentCurruncy.Currency_Code
    if(curr){
      return curr
    }
    else {
      return "AED"
    }
  }
  options: Options = {
    noSwitching: true,
    translate: (value: number): string => {
      return this.getcurr()  + value;
      
    }
  };
  //flight time
  minDepartingT: number = 30;
  maxDepartingT: number = 3600;
  options1: Options = {
    floor: 30,
    ceil:3600,
    noSwitching: true,
    translate: (value: number): string => {
      return "departing Time" + value;
    }
  };
  minReturnT: number = 50;
  maxReturnT: number = 600;
  options2: Options = {
    floor: 30,
    ceil:3600,
    noSwitching: true,
    translate: (value: number): string => {
      return "departing Time" + value;
    }
  };

  //  flight duration

  minDurationT: number = 50;
  maxDurationT: number = 800;

  // create an array with the same length of the output
  valuesoftrue(array: any[]) {
    let out: any[] = [];
    let arryalengty = array.length;
    for (let index = 0; index < arryalengty; index++) {
      let truth: boolean = true;
      out.push(truth);

    }
    return this.trueT = out;
  }
  // duration filter 
  orgnizeByDuration(min: number, max: number, array: any[]):any[] {
    
    let out: any[] = []
    array.forEach(element => {
      if (element.totalDuration > min && element.totalDuration < max) {
        out.push(element);
      }
    });
    return out;

  }
  //  return min duration
  findDurationMinMax(array: any[]) {
    let min = array[0].totalDuration;
    let max = array[0].totalDuration;
    array.forEach(element => {
      if (element.totalDuration < min) {
        min = element.totalDuration;
      }
      if (element.totalDuration > max) {
        max = element.totalDuration;
      }
    });
    return [min, max+100];
  }
//  take date string return number
  convertToMin(time:string) :number {
        let date = time;
          let T = date.indexOf('T');
          let h = date.slice(T+1);
          let hr = +h.slice(0,2) *60 ;
          let m = +h.slice(3,5);
          let tm = hr+m;
          return tm
  }
//filter by departing date
findDepartingnMinMax(array: any[]) {
  let min = this.convertToMin(array[0].deptDate);
  let max = this.convertToMin(array[0].deptDate);
  array.forEach(element => {
    let t = this.convertToMin(element.deptDate)
    if (t < min) {
      min = t;
    }
    if (t > max) {
      max = t;
    }
  });
  return [min, max];
}
  orgnizeByDtime(min: number, max: number, array: any[]):any[] {
    let out: any[] = []
    array.forEach(element => {  
      let tm = this.convertToMin(element.deptDate);
      if (tm > min && tm < max) {
        out.push(element);
      }
    });
    return out;

  }
  // filter by stops number
  stopsFilter(array:any[]) {

    let direct = this.filterForm.get('stopsForm').get('noStops').value;
    let one =this.filterForm.get('stopsForm').get('oneStop').value;
    let twoM = this.filterForm.get('stopsForm').get('twoAndm').value;
    let out: any[]=[];
    if( !direct && !one && !twoM) { 
      out = array;
     return out
    }
    else {
        array.forEach(element => {
        let stops =element.allJourney.flights[0]['stopsNum']
        if(direct && stops == 0) {
          out.push(element);
        }
        if (one && stops==1) {
          out.push(element);
        }
        if (twoM && stops >= 2) {
          out.push(element);
        }
        });
        
        return out
      }

    
  }
  // airline filter 
  filteringbyairline(val:any[]){
    let airL:any[]=[];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        if(element){
          airL.push(this.airlinesA[index]);
        }
        
      };
      if(airL.length == 0){
      let out = airL;
      return  out
      }
      else{
         return airL;
      }
  }

 airLineFilter(airline:any[],array:any[]) {
  let out:any[]=[];
  let all = array;
  all.forEach(element => {
    if(airline.indexOf(element.allJourney.flights[0]['flightAirline']['airlineName']) != -1 ){
     out.push(element);
    }
  });
  return out
 }

// route to check out
  toCheckout(sid:string,sequenceNum:number) {
  this.router.navigate(['/checkout'],{ queryParams: {  'sid':sid,'sequenceNum':sequenceNum } });
  }

  //change icon of filter
  changeIcon(panel:NgbPanelChangeEvent){

    if(panel.panelId==="panel-1" )
    {
      this.panelOpenState[0]= !this.panelOpenState[0];
  
    }

     if(panel.panelId==="panel-2" )
    {
      this.panelOpenState[1]= !this.panelOpenState[1];
    }
     if(panel.panelId==="panel-3" )
    {
      this.panelOpenState[2]= !this.panelOpenState[2];
    }
     if(panel.panelId==="panel-4" )
    {
      this.panelOpenState[3]= !this.panelOpenState[3];
    }

    if(panel.panelId==="panel-5" )
    {
      this.panelOpenState[4]= !this.panelOpenState[4];
    }


  }
  // new filteration method
  oneForAll(filter:flightFilter,fligtsArray:any[],round:boolean) {
   
    let filterdarray:any[]=[];
    fligtsArray.forEach(element => {

      // price test
      if(element.itinTotalFare.amount >= filter.priceMin && element.itinTotalFare.amount<= filter.priceMax){

        //duration test
        if(element.totalDuration >= filter.durationMin && element.totalDuration <= filter.durationMax){

          //departion test
          if(this.convertToMin(element.deptDate) >= filter.depatingMin && this.convertToMin(element.deptDate) <= filter.departingMax){

            //stops filter
            if(this.stopscheck(filter.stops,element.allJourney.flights)){
              // airline test
              if(filter.airlines.indexOf(element.allJourney.flights[0]['flightAirline']['airlineName']) !== -1 ||filter.airlines.length == 0) {
    
                //return test
                if(false){
                  // if(!round){
                  if(this.convertToMin(element.allJourney.flights[1]['flightDTO'][0]['departureDate'])>= filter.returnMin && this.convertToMin(element.allJourney.flights[1]['flightDTO']['departureDate']) <= filter.returnMax){
                    
                    filterdarray.push(element);
                  }
                  else{
                    return
                  }
                }
                else{
                  filterdarray.push(element);
                }
              }
              else {
                return
              }
            }
            else{
              return
            }
          }
          else{
            return
          }
        }
        else {
          return
        }

      }
      else {
      return
      }
      
    });
    let t1 = performance.now();
   this.orgnizedResponce = this.orgnize(filterdarray);
   this.valuesoftrue(this.orgnizedResponce);
   let t2 = performance.now();
   console.log("orgnizing and true value", t2-t1 +"ms");
  //  // console.log('should be filterd',this.orgnizedResponce);
  }

stopscheck(stops:any[],flight:any[]) {
  let status:Boolean = true;
  let t1 = performance.now();
  flight.forEach(element => {
    if(stops.indexOf(element.stopsNum) == -1){
      status = false;
    }
    
  });
  return status
}

  returnid(i:number){
   let id = '#'+i;
   return id;
  }
  togglemodel(i:number) {
    let id ='#'+i;
    $(id).modal('toggle');
  }
  togglemodelt(m:number,i:number) {
    let id ='#'+ m+'l' +m+ 'i'+i;
    $(id).modal('toggle');
  }
  gettermid(m:number,i:number) {
    let id =  m +'l'+m +'i'+i;
   return id;
  }

  // show Modal
  
  
// sorting flights
sortByDuration()
{
  if (this.response && !this.loading) {

    this.filter = new FilterInputsModule(this.filterForm.get("priceSlider").value[0],
    this.filterForm.get("priceSlider").value[1],
    // new 
    this.filterForm.get('durationSlider').value[0],
    this.filterForm.get('durationSlider').value[1],
    this.filterForm.get('dpartingSlider').value[0],
    this.filterForm.get('dpartingSlider').value[1],
    this.filterForm.get('returnSlider').value[0],
    this.filterForm.get('returnSlider').value[1],
    this.stopsvalues(),
    this.filteringbyairline(this.filterForm.get('airline').get('airlines').value)
    )}
 let flightResult = this.response.airItineraries
 // console.log(flightResult);
//  totalDuration=610
 flightResult = flightResult.sort((a,b) => {return a.totalDuration - b.totalDuration });
 this.oneForAll(this.filter,flightResult,this.roundT);
 // console.log(flightResult);
 // this.resultUpdate.emit(flightResult)

}

sortByDeprting()
{
  if (this.response && !this.loading) {

    this.filter = new FilterInputsModule(this.filterForm.get("priceSlider").value[0],
    this.filterForm.get("priceSlider").value[1],
    // new 
    this.filterForm.get('durationSlider').value[0],
    this.filterForm.get('durationSlider').value[1],
    this.filterForm.get('dpartingSlider').value[0],
    this.filterForm.get('dpartingSlider').value[1],
    this.filterForm.get('returnSlider').value[0],
    this.filterForm.get('returnSlider').value[1],
    this.stopsvalues(),
    this.filteringbyairline(this.filterForm.get('airline').get('airlines').value)
    )}
 let flightResult = this.response.airItineraries
 // console.log(flightResult);
//  deptDate=2019-06-27T17:10:00
 flightResult = flightResult.sort((a,b) => {return this.convertToMin(a.deptDate) - this.convertToMin(b.deptDate) });
 this.oneForAll(this.filter,flightResult,this.roundT);
 // console.log(flightResult);
 // this.resultUpdate.emit(flightResult)

}

sortByArrival()
{
  if (this.response && !this.loading) {

    this.filter = new FilterInputsModule(this.filterForm.get("priceSlider").value[0],
    this.filterForm.get("priceSlider").value[1],
    // new 
    this.filterForm.get('durationSlider').value[0],
    this.filterForm.get('durationSlider').value[1],
    this.filterForm.get('dpartingSlider').value[0],
    this.filterForm.get('dpartingSlider').value[1],
    this.filterForm.get('returnSlider').value[0],
    this.filterForm.get('returnSlider').value[1],
    this.stopsvalues(),
    this.filteringbyairline(this.filterForm.get('airline').get('airlines').value)
    )}
 let flightResult = this.response.airItineraries
 // console.log(flightResult);
//  arrivalDate=2019-06-28T01:20:00
 flightResult = flightResult.sort((a,b) => {return this.convertToMin(a.arrivalDate) - this.convertToMin(b.arrivalDate) });
 this.oneForAll(this.filter,flightResult,this.roundT);
 // console.log(flightResult);
 // this.resultUpdate.emit(flightResult)

}
sortByPrice()
{
  if (this.response && !this.loading) {

    this.filter = new FilterInputsModule(this.filterForm.get("priceSlider").value[0],
    this.filterForm.get("priceSlider").value[1],
    // new 
    this.filterForm.get('durationSlider').value[0],
    this.filterForm.get('durationSlider').value[1],
    this.filterForm.get('dpartingSlider').value[0],
    this.filterForm.get('dpartingSlider').value[1],
    this.filterForm.get('returnSlider').value[0],
    this.filterForm.get('returnSlider').value[1],
    this.stopsvalues(),
    this.filteringbyairline(this.filterForm.get('airline').get('airlines').value)
    )}
 let flightResult = this.response.airItineraries
 // console.log(flightResult);
 flightResult = flightResult.sort((a,b) => {return a.itinTotalFare.amount - b.itinTotalFare.amount});
 this.oneForAll(this.filter,flightResult,this.roundT);
 // console.log(flightResult);
 // this.resultUpdate.emit(flightResult)

}

farerules(sid:string,sequenceNum:number){
return "/terms/"+sid+"/"+sequenceNum;
}

ngOnDestroy(){
  $('.modal').modal('hide');
  this.subscription.unsubscribe();
}

}


