//angular imports Start
import { Component, OnInit, ViewChild, TemplateRef, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
//angular imports end
// custom models imports start
import { SearchFlightModule } from 'src/app/models/search-flight/search-flight.module';
import { FlightsInfoModule } from 'src/app/models/flights-info/flights-info.module';
import { CitiesModule } from 'src/app/models/cities/cities.module';
import { MyApiService } from 'src/app/Services/my-api.service';

//custom models imports end
//other imports start
import { Subscription } from 'rxjs';
import { PointOfsaleModule } from 'src/app/models/point-ofsale/point-ofsale.module';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CurruncyServiceService } from 'src/app/Services/curruncy-service.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/Services/session.service';
import airportar from "src/assets/airports/airportar.json";
import airporten from "src/assets/airports/airporten.json";

//other imports end

//     *** Search component ***
// this component is setting a reactive search form
// searchFlight is the reactive form with 'Flights:Formarray' is handling  oneway, roundTrip,and multi 
//all togther by adding and removing from 'Flights';
// on submit the api should be created in the right form SearchFlightModule


@Component({
  selector: 'app-new-search',
  templateUrl: './new-search.component.html',
  styleUrls: ['./new-search.component.css'],
  providers: [DatePipe]
})
export class NewSearchComponent implements OnInit, OnDestroy {
  @ViewChild("firstD") firstD: ElementRef;
  @ViewChild("firstAr") firstAr: ElementRef;
  @ViewChild("firstARd") firstARd: ElementRef;
  
  //  varuables
  searchFlight: FormGroup;


  maxinfent: number = 1;
  maxnumber: number = 9;
  // adults:number=;
  // child:number=0;
  // infent:number=0;
  flightsnumber: number = 0;
  cities: CitiesModule[];
  citiesar: CitiesModule[];
  citiesen: CitiesModule[];
  returnlink: Subscription;
  citiesNames: string[] = [];
  pointof: PointOfsaleModule = new PointOfsaleModule("", "", "", "", "AE", "AE", "", false, "", 0, 0, "etyety", "erty", "erty", "AED", "ar", "", "")
  departFirst: string;
  landingFirst: string;
  dpartingDateFirtst: any;
  flightClick:boolean=true;
  hotelClick:boolean=false;
  private subscription: Subscription = new Subscription();


  constructor(private Router: Router, private myApi: MyApiService, private datePipe: DatePipe, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private carruncy: CurruncyServiceService, private translate: TranslateService, private session: SessionService) {
    iconRegistry.addSvgIcon(
      'switch-arrow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/sw'))
  }
  // exceptionMessage=1001 - Invalid Flight Type,only valid values(OneWay , RoundTrip, Multicity)
  ngOnInit() {
    //setting up the Form with  Defult values
    this.searchFlight = new FormGroup({
      // intial flightType is one way//
      // to set onther flight type as intial stae make sure to 
      //add Fligts in the Flights array
      "flightType": new FormControl('RoundTrip', [Validators.required]),
      "Direct": new FormControl(false, [Validators.required]),
      "Flights": new FormArray([], [Validators.required]),
      "returnDate": new FormControl(null),
      "passengers": new FormGroup({
        "adults": new FormControl(1, [Validators.required, Validators.min(1)]),
        "child": new FormControl(0, [Validators.required, Validators.min(0)]),
        "infent": new FormControl(0, [Validators.required, Validators.max(this.maxinfent), Validators.min(0)]),
      }, [this.maxValueReached.bind(this)])
      ,
      "class": new FormControl('Economy', [Validators.required])
    });
    // set Flight array with OneWay as initial state
    //uncument another one for round and another for multi
    this.onAddFlight();
    this.intial('RoundTrip');
    //   this.onAddFlight();
    //   this.onAddFlight();
    this.subscription.add(this.searchFlight.get("flightType").valueChanges.subscribe(
      (value) => { this.intial(value) }
    ));

    // this.searchFlight.get('Flights').valueChanges.subscribe(
    //   (change)=>{
    //     this.searchFlight.get('Flights').updateValueAndValidity();
    // }

    // )

    this.subscription.add(this.searchFlight.get('passengers.adults').valueChanges.subscribe(
      (value) => {
        this.setmaxinfentval(value);
        this.searchFlight.get('passengers.infent').updateValueAndValidity();
      }
    ));

    this.flightsnumber = this.searchFlight.get('Flights').value.length;
    // get cities data 
    // this.subscription.add(this.myApi.cityData(localStorage.getItem('lang')).subscribe(
    //   (res: CitiesModule[]) => { this.cities = res, this.citiesNameExtract() },
    //   (error) => {console.log(error)}
    // ));
    // get citites data in ar
    this.citiesar = airportar;
    this.citiesNameExtract(this.citiesar);
    this.citiesen = airporten;
    this.citiesNameExtract(this.citiesen);
    if (localStorage.getItem('lang') == 'en') {
    this.cities = this.citiesen;
    }
    else {
      this.cities = this.citiesar;
    };
    // this.subscription.add(this.myApi.cityData('ar').subscribe(
    //   (res: CitiesModule[]) => { this.citiesar = res;this.citiesNameExtract(this.citiesar); },
    //   (error) => {console.log(error)}
    // ));

    // get cities data in en
    // this.subscription.add(this.myApi.cityData('en').subscribe(
    //   (res: CitiesModule[]) => { this.citiesen = res;this.citiesNameExtract(this.citiesen);
    //     debugger
    //   if(localStorage.getItem('lang') == 'en')

    //   {this.cities = this.citiesen;
    //   }
    //   else{
    //     this.cities = this.citiesar;
    //   }; },
    //   (error) => {console.log(error)}
    // ));

    this.subscription.add(this.myApi.pointOfSale().subscribe(
      (result: PointOfsaleModule) => { this.pointof =  this.checkPointofsale(result); },
      (error) => { console.log(error) }
    ));
    // this.myApi.currencyApi('AED').subscribe(
    //   (result) =>{console.log(result)}
    // )
    // langchange change the cities list

    this.subscription.add(
      this.translate.onLangChange.subscribe(

        (result) => {
          if (result.lang == 'ar') {
            debugger
            this.cities = this.citiesar;
            this.citiesNameExtract(this.citiesar);
            while ((<FormArray>this.searchFlight.get("Flights")).length > 0) {
              (<FormArray>this.searchFlight.get("Flights")).removeAt(0);
            }
            this.onAddFlight();
            this.intial('RoundTrip');
          }
          else {
            this.cities = this.citiesen;
            this.citiesNameExtract(this.citiesen);
            while ((<FormArray>this.searchFlight.get("Flights")).length > 0) {
              (<FormArray>this.searchFlight.get("Flights")).removeAt(0);
            }
            this.onAddFlight();
            this.intial('RoundTrip');
          }
        }
      )
    )
  }

  //one way start//

  //one way end//

  //round trip start//

  roundTripI() {



    this.removeArrayControllers();

    const Rflight = new FormGroup({
      "departing": new FormControl(this.searchFlight.get('Flights').get("0").get("landing").setValidators([Validators.required, this.citynotfound.bind(this)])),
      "landing": new FormControl(this.searchFlight.get('Flights').get("0").get("departing").setValidators([Validators.required, this.citynotfound.bind(this)])),
      "departingD": new FormControl(this.searchFlight.get('returnDate').value)
    }, [this.invalidFlightDis]);

    (<FormArray>this.searchFlight.get("Flights")).push(Rflight);
  }
  //round trip end//

  // multi trip start//
  // multi trip end//

  //other functions statrt//

  // reset the inetial value of the array when flightType is changed

  intial(mvalue: string) {
    if (mvalue == 'oneway') {

      if (this.returnlink) {
        this.returnlink.unsubscribe();
      }
      this.removeArrayControllers();
      this.searchFlight.get('returnDate').setValidators(Validators.nullValidator);
      this.searchFlight.get('returnDate').updateValueAndValidity();
      // this.onAddFlight();

      return
    }
    if (mvalue == 'RoundTrip') {
      this.returnlink = this.searchFlight.get('returnDate').valueChanges.subscribe(
        (myvalue) => {
          this.searchFlight.get('Flights').get('1').get('departingD').setValue(myvalue),
            this.searchFlight.get('Flights').get('1').get('departing').setValue(this.searchFlight.get('Flights').get('0').get('landing').value),
            this.searchFlight.get('Flights').get('1').get('landing').setValue(this.searchFlight.get('Flights').get('0').get('departing').value)
        }

      );
      this.roundTripI();
      this.searchFlight.get('returnDate').updateValueAndValidity();
      // console.log(this.pointof); 

      // console.log('result',this.cities);
      // console.log(this.searchFlight)
      return
    }

    if (mvalue == 'Multicity') {
      if (this.returnlink) {
        this.returnlink.unsubscribe();
      }
      // this.returnlink.unsubscribe();
      this.searchFlight.get('returnDate').setValidators(Validators.nullValidator);
      this.searchFlight.get('returnDate').updateValueAndValidity();
      this.removeArrayControllers();
      if ((<FormArray>this.searchFlight.get("Flights")).length < 2) {
        this.onAddFlight();
      }



      //  this.searchFlight.get('Flights').valueChanges.subscribe(
      //    (value)=> {console.log('change',value)}
      //  )
    }
    // console.log(mvalue);

  }

  cityNametoCitycode(cityname: string): string {
    let code: string = '';
    this.cities.forEach(element => {
      if (element.cityName + '-' + element.airportName + '-' + element.airportCode == cityname) {
        code = element.airportCode;
      }
    });
    return code;

  }
  // travlers and class
  // travlerandclass(){
  //   if(this.)
  // }

  // switch destenation
  switchDes(item: FormGroup) {
    let value1 = item.get('landing').value;
    let value2 = item.get('departing').value;
    item.get('departing').setValue(value1);
    item.get('landing').setValue(value2);
    item.updateValueAndValidity();
  }

  //to match the formGroups name with the Flights array index
  indexadd1(index: number) {
    return index + 1;

  }

  //call to rest form array
  removeArrayControllers() {
    while ((<FormArray>this.searchFlight.get("Flights")).length > 1) {
      (<FormArray>this.searchFlight.get("Flights")).removeAt(1);
    }
  }

  // to add more flights to flights array by add buton
  onAddFlight() {
    let i = (<FormArray>this.searchFlight.get("Flights")).length;
    let reval = '';
    if (i > 0) {
      reval = (<FormArray>this.searchFlight.get("Flights")).value[i - 1]['landing'];
    }
    else {
      reval = '';
    }
    (<FormArray>this.searchFlight.get("Flights")).push(new FormGroup({
      "departing": new FormControl(reval, [Validators.required, this.citynotfound.bind(this)]),
      "landing": new FormControl("", [Validators.required, this.citynotfound.bind(this)]),
      "departingD": new FormControl(this.todayDate(), [Validators.required])
    }, [this.invalidFlightDis]));
    this.flightsnumber = this.searchFlight.get('Flights').value.length;
    // console.log(this.flightsnumber);
  }

  // invalid flight number
  maxFlights() {
    if (this.flightsnumber >= 4) {
      return false
    }
    else {
      return true
    }
  }

  //match Flights form array values with FlightInfoModule
  bendingFlights() {

    let flightout: FlightsInfoModule[] = [];
    for (let index = 0; index < (<FormArray>this.searchFlight.get("Flights")).length; index++) {
      const element = (<FormArray>this.searchFlight.get("Flights")).controls[index];
      let flight = new FlightsInfoModule(this.cityNametoCitycode(element.value['departing']),
        this.cityNametoCitycode(element.value['landing']),
        this.datePipe.transform(element.value['departingD'], 'MMMM dd, y'));
      flightout.push(flight);
    }

    return flightout;
  }

  //returns an array of  cities name in lowercase used for input validations
  citiesNameExtract(cities: CitiesModule[]) {
    cities.forEach(element => {
      let city = element.cityName
      let airportName = element.airportName
      let airportcode = element.airportCode
      this.citiesNames.push(city + '-' + airportName + '-' + airportcode);
    });
  }

  //infents number setup
  setmaxinfentval(value) {
    this.maxinfent = value;
    this.searchFlight.get("passengers.infent").setValidators([Validators.required, Validators.max(this.maxinfent), Validators.min(0)]);
    this.searchFlight.get("passengers.infent").updateValueAndValidity();
  }

  removeflight() {
    let i = (<FormArray>this.searchFlight.get("Flights")).length - 1;
    (<FormArray>this.searchFlight.get("Flights")).removeAt(i);
  }
  getcurr() {
    let curr = this.carruncy.currentCurruncy.Currency_Code
    if (curr) {
      return curr
    }
    else {
      return "AED"
    }
  }
  // check if point of sale is valid 
  checkPointofsale(point:PointOfsaleModule) :PointOfsaleModule {
    let pointOfSaleList =['ae','eg','sa','kw','bh','om','qa',];
    let depoint: PointOfsaleModule = new PointOfsaleModule("", "", "", "", "AE", "AE", "", false, "", 0, 0, "etyety", "erty", "erty", "AED", "ar", "", "")
    if( pointOfSaleList.indexOf(point.country.toLowerCase()) != -1 ){
      return point;
    }
    else{
      return depoint;
    }

  }
  // to submit the form and call the search api
  onSubmit() {
    localStorage.setItem('form', JSON.stringify(this.searchFlight.value));
    if (this.searchFlight.valid) {


      // console.log('localstorage', localStorage.key(1));
      let searchApi: SearchFlightModule = new SearchFlightModule(localStorage.getItem('lang'), this.getcurr(), this.pointof.country, this.searchFlight.get('flightType').value,
        this.myApi.flightInfoFormatter(this.bendingFlights()),
        this.myApi.passingerFormatter([this.searchFlight.get('passengers.adults').value, this.searchFlight.get('passengers.child').value, this.searchFlight.get('passengers.infent').value]),
        this.searchFlight.get('class').value, this.id(), this.searchFlight.get('Direct').value, 'all');

      // console.log(this.searchFlight.valid, this.searchFlight, "api", searchApi);
      let language = searchApi.lan;
      let currency = searchApi.Currency;
      let SearchPoint = searchApi.pointOfReservation;
      let flightType = searchApi.flightType;
      let flightInfo = searchApi.flightsInfo;
      let searchId = searchApi.serachId;
      let passengers = searchApi.passengers;
      let Cclass = searchApi.Cclass;
      let directOnly = searchApi.showDirect;
      this.session.setSessionTime(30);
      this.session.startTimer();
      this.Router.navigate(['/ResultPage', language, currency, SearchPoint, flightType, flightInfo, searchId, passengers, Cclass, directOnly]);

      // this.myApi.searchFlight(searchApi).subscribe(
      //   (res)=>{debugger;console.log(res);}
      // );


      this.searchFlight.updateValueAndValidity();
      // this.Router.navigateByUrl();
    }

    else {
      // console.log(this.searchFlight.valid, this.searchFlight);
    }


  }
  id() {
    let date = new Date();
    let myId = date.getFullYear() + 'B' + date.getUTCMonth() + 'I' + date.getUTCDay() + 'S' + date.getMilliseconds() + 'H' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'B' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'I'
      + Math.floor(Math.random() * (9 - 0 + 1)) + 0
      + 'S' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'H' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'I' + Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    return myId;
  }

  //other functions end
  //custom validators start
  // departing and landing not the same
  invalidFlightDis(flight: FormGroup): { [a: string]: boolean } {
    if (flight.get("departing").value === flight.get("landing").value) {
      return { 'distenationNotValid': true };
    }
    return null;
  }

  // retun today date
  todayDate() {
    let date = new Date();
    return date.toISOString().split('T')[0];
  }

  // passengers number cant be more than 9
  maxValueReached(search: FormGroup): { [b: string]: boolean } {
    if (search.get('adults').value + search.get('child').value + search.get('infent').value > 9) {
      return { 'maxReched': true };
    }
    return null;
  }

  //city input is not in cities names array
  citynotfound(input: FormControl): { [c: string]: boolean } {
    if (this.citiesNames.indexOf(input.value) === -1) {
      return { 'notValidcity': true };
    }
    return null;
  }
  // update value 
  update() {
    this.searchFlight.get('Flights').updateValueAndValidity();
    // console.log('what the hell happening??')
  }

  // unsubscribe 
  ngOnDestroy() {
    this.subscription.unsubscribe();

  }
  //lesiten to topdestEvent
  selectdest(dis: string) {
    // console.log(dis, "wow");
    this.searchFlight.get("Flights").get('0').get('landing').setValue(dis);
    this.searchFlight.get("Flights").get('0').updateValueAndValidity();
  }

  //custom validators end


// switch between flight hotel btns

 switchF(){
    this.flightClick=true;
    this.hotelClick=false;
    return this.flightClick
  }
  switchH(){
this.flightClick=false;
this.hotelClick=true;
return this.hotelClick
  }

}

