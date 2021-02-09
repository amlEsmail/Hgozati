import { LangChangeEvent } from '@ngx-translate/core';
//angular imports Start
import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CodToCityPipe } from '../../pipes/cod-to-city.pipe';
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
import { EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlightSearchResult } from 'src/app/flight-search-result';
import { TranslateService } from '@ngx-translate/core';
import { CurruncyServiceService } from 'src/app/Services/curruncy-service.service';
import airportar from "src/assets/airports/airportar.json";
import airporten from "src/assets/airports/airporten.json";
import { SessionService } from 'src/app/Services/session.service';
//other imports end

//     *** Search component ***
// this component is setting a reactive search form
// searchFlight is the reactive form with 'Flights:Formarray' is handling  oneway, roundTrip,and Multicity 
//all togther by adding and removing from 'Flights';
// on submit the api should be created in the right form SearchFlightModule

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css'],
  providers: [CodToCityPipe]
})
export class ResearchComponent implements OnInit, OnDestroy {
  //  varuables
  searchFlight: FormGroup;

  @Output() research: EventEmitter<string> = new EventEmitter();
  maxinfent: number = 1;
  maxnumber: number = 9;
  // adults:number=;
  // child:number=0;
  // infent:number=0;
  flightsnumber: number = 0;
  cities: CitiesModule[] = [];
  citiesar: CitiesModule[];
  citiesen: CitiesModule[];
  returnlink: Subscription;
  citiesNames: string[] = [];
  citiesCode: string[] = [];
  pointof: PointOfsaleModule = new PointOfsaleModule("", "", "", "", "AE", "AE", "", false, "", 0, 0, "etyety", "erty", "erty", "AED", "ar", "", "");
  datainput: FlightSearchResult;
  storage: boolean = false;
  localform: object;
  private subscription: Subscription = new Subscription();


  constructor(private Router: Router, private myApi: MyApiService, private datePipe: DatePipe, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private route: ActivatedRoute, private city: CodToCityPipe, private translate: TranslateService, private carruncy: CurruncyServiceService,private session: SessionService ) {
    iconRegistry.addSvgIcon(
      'switch-arrow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/sw'))
  }

  ngOnInit() {

    // from the url
    // get cities data 
    // localStorage.getItem('lang')
    // this.subscription.add(this.myApi.cityData('EN').subscribe(
    //   this.subscription.add(this.myApi.cityData(localStorage.getItem('lang')).subscribe(
    //   (res: CitiesModule[]) => { this.cities = res; this.citiesNameExtract(); this.citiescode(); },
    //   (error) => console.log(error)
    // ))
    // end from the url


    //setting up the Form with  Defult values
    //  let flightType =this.datainput.searchCriteria.flightType;
    //  let Direct = this.datainput.searchCriteria.selectDirectFlightsOnly;
    if (localStorage.getItem('form')) {
      console.log("formlast", localStorage.getItem('form'));
      let formo: object = JSON.parse(localStorage.getItem('form'));
      this.storage = true;
      this.searchFlight = new FormGroup({
        // intial flightType is one way//
        // to set onther flight type as intial stae make sure to 
        //add Fligts in the Flights array

        "flightType": new FormControl(formo['flightType'], [Validators.required]),
        "Direct": new FormControl(formo['Direct'], [Validators.required]),
        "Flights": new FormArray([], [Validators.required]),
        "returnDate": new FormControl(formo['returnDate']),
        "passengers": new FormGroup({
          "adults": new FormControl(formo['passengers']['adults'], [Validators.required, Validators.min(1)]),
          "child": new FormControl(formo['passengers']['child'], [Validators.required, Validators.min(0)]),
          "infent": new FormControl(formo['passengers']['infent'], [Validators.required, Validators.max(this.maxinfent), Validators.min(0)]),
        }, [this.maxValueReached.bind(this)])
        ,
        "class": new FormControl(formo['class'], [Validators.required])
      });
      this.intialLocal(this.searchFlight.get("flightType").value);
      this.searchFlight.get("flightType").valueChanges.subscribe(
        (value) => { this.intial(value) }
      )
      this.subscription.add(this.searchFlight.get('passengers.adults').valueChanges.subscribe(
        (value) => {
          this.setmaxinfentval(value);
          this.searchFlight.get('passengers.infent').updateValueAndValidity();
        }
      ));

      this.flightsnumber = this.searchFlight.get('Flights').value.length;
      this.intial(formo['flightType']);
    }
    else {
      this.searchFlight = new FormGroup({
        // intial flightType is one way//
        // to set onther flight type as intial stae make sure to 
        //add Fligts in the Flights array
        "flightType": new FormControl('oneway', [Validators.required]),
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
      this.onAddFlight();
      this.subscription.add(this.myApi.resultUpdate.subscribe(
        (result) => {
          this.datainput = result; console.log('data input test', this.datainput);
          this.setsearchValues()
        }
      ));
      this.subscription.add(this.searchFlight.get("flightType").valueChanges.subscribe(
        (value) => { this.intial(value) }
      ))
      this.subscription.add(this.searchFlight.get('passengers.adults').valueChanges.subscribe(
        (value) => { this.setmaxinfentval(value) }
      ));

      this.flightsnumber = this.searchFlight.get('Flights').value.length;
    }


    // set Flight array with OneWay as initial state
    //uncument another one for round and another for Multicity

    //   this.onAddFlight();
    //   this.onAddFlight();


    //set inital values of the form 
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

    // this.subscription.add(this.myApi.pointOfSale().subscribe(
    //   (result: PointOfsaleModule) => { this.pointof = result },
    //   (error) => console.log(error)
    // ));
    // get citites data in ar
    // this.subscription.add(this.myApi.cityData('ar').subscribe(
    //   (res: CitiesModule[]) => { this.citiesar = res;this.citiesNameExtract(this.citiesar); },
    //   (error) => {console.log(error)}
    // ));

    // // get cities data in en
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

    // this.subscription.add( this.myApi.pointOfSale().subscribe(
    //   (result:PointOfsaleModule) => {this.pointof=result},
    //   (error)=>{console.log(error)}
    // ));
    // this.subscription.add(this.myApi.currencyApi('AED').subscribe(
    //   (result) => { console.log(result) }
    // ));

    // check on change langs 
   
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

    const flight = new FormGroup({
      "departing": new FormControl(''),
      "landing": new FormControl(''),
      "departingD": new FormControl(this.todayDate())
    }, [this.invalidFlightDis]);

    this.removeArrayControllers();

    // (<FormArray>this.searchFlight.get("Flights")).push(flight);

    const Rflight = new FormGroup({
      "departing": new FormControl(this.searchFlight.get('Flights').get("0").get("landing").setValidators([Validators.required, this.citynotfound.bind(this)])),
      "landing": new FormControl(this.searchFlight.get('Flights').get("0").get("departing").setValidators([Validators.required, this.citynotfound.bind(this)])),
      "departingD": new FormControl(this.searchFlight.get('returnDate').value)
    }, [this.invalidFlightDis]);

    (<FormArray>this.searchFlight.get("Flights")).push(Rflight);
  }

  setreturn() {
    // debugger
    if (this.searchFlight.get('returnDate').value != null) {
      // console.log(this.searchFlight.get("Flights").value);
      return (<FormArray>this.searchFlight.get("Flights"))['value'][1]['departingD']
    }
    else {
      return (<FormArray>this.searchFlight.get("Flights"))['value'][0]['departingD']
    }
  }
  //round trip end//

  // Multicity trip start//
  // Multicity trip end//

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
      if ((<FormArray>this.searchFlight.get("Flights")).length < 1) {
        this.onAddFlight();
      }


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
      this.searchFlight.get('returnDate').setValidators(Validators.required);
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
      this.onAddFlight();
      this.onAddFlight();


      //  this.searchFlight.get('Flights').valueChanges.subscribe(
      //    (value)=> {console.log('change',value)}
      //  )
    }
    // console.log(mvalue);

  }

  //reset the value to thatof local storage
  intialLocal(mvalue: string) {
    this.localform = JSON.parse(localStorage.getItem('form'));
    if (mvalue == 'oneway') {

      if (this.returnlink) {
        this.returnlink.unsubscribe();
      }
      this.removeArrayControllers();
      this.searchFlight.get('returnDate').setValidators(Validators.nullValidator);
      this.searchFlight.get('returnDate').updateValueAndValidity();
      // this.onAddFlight();
      (<FormArray>this.searchFlight.get("Flights")).push(new FormGroup({
        "departing": new FormControl(this.localform['Flights'][0]['departing'], [Validators.required, this.citynotfound.bind(this)]),
        "landing": new FormControl(this.localform['Flights'][0]['landing'], [Validators.required, this.citynotfound.bind(this)]),
        "departingD": new FormControl(this.localform['Flights'][0]['departingD'], [Validators.required])
      }, [this.invalidFlightDis]));


      return
    }
    if (mvalue == 'RoundTrip') {

      if (this.returnlink) {
        this.returnlink.unsubscribe();
      }
      this.removeArrayControllers();
      this.searchFlight.get('returnDate').setValidators(Validators.nullValidator);
      this.searchFlight.get('returnDate').updateValueAndValidity();
      // this.onAddFlight();
      (<FormArray>this.searchFlight.get("Flights")).push(new FormGroup({
        "departing": new FormControl(this.localform['Flights'][0]['departing'], [Validators.required, this.citynotfound.bind(this)]),
        "landing": new FormControl(this.localform['Flights'][0]['landing'], [Validators.required, this.citynotfound.bind(this)]),
        "departingD": new FormControl(this.localform['Flights'][0]['departingD'], [Validators.required])
      }, [this.invalidFlightDis]));
      (<FormArray>this.searchFlight.get("Flights")).push(new FormGroup({
        "departing": new FormControl(this.localform['Flights'][0]['landing'], [Validators.required, this.citynotfound.bind(this)]),
        "landing": new FormControl(this.localform['Flights'][0]['departing'], [Validators.required, this.citynotfound.bind(this)]),
        "departingD": new FormControl(this.localform['returnDate'], [Validators.required])
      }, [this.invalidFlightDis]));

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
      let array: [] = [];
      array = this.localform['Flights']
      array.forEach(element => {
        (<FormArray>this.searchFlight.get("Flights")).push(new FormGroup({
          "departing": new FormControl(element['departing'], [Validators.required, this.citynotfound.bind(this)]),
          "landing": new FormControl(element['landing'], [Validators.required, this.citynotfound.bind(this)]),
          "departingD": new FormControl(element['departingD'], [Validators.required])
        }, [this.invalidFlightDis]));
      });


      //  this.searchFlight.get('Flights').valueChanges.subscribe(
      //    (value)=> {console.log('change',value)}
      //  )
    }
    // console.log(mvalue);

  }
  //  city name to citycode
  cityNametoCitycode(cityname: string): string {
    let code: string = '';
    this.cities.forEach(element => {
      if (element.cityName + '-' + element.airportName + '-' + element.airportCode == cityname) {
        code = element.airportCode;
      }
    });
    return code;

  }
  // to cities
  tocity(code: string): string {
    let city: string = '';
    this.cities.forEach(element => {
      if (code.toLocaleLowerCase() == element.cityCode.toLocaleLowerCase()) {
        city = element.cityName;
      }
    });
    return city;
  }

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

    (<FormArray>this.searchFlight.get("Flights")).push(new FormGroup({
      "departing": new FormControl("", [Validators.required, this.citynotfound.bind(this)]),
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

  citiesNameExtract(cities: CitiesModule[]) {
    cities.forEach(element => {
      let city = element.cityName
      let airportName = element.airportName
      let airportcode = element.airportCode
      this.citiesNames.push(city + '-' + airportName + '-' + airportcode);
    });
  }

  //return cites code
  citiescode() {
    this.cities.forEach(element => {
      let city = element.cityCode.toLowerCase();
      this.citiesCode.push(city);
    });
  }

  //infents number setup
  setmaxinfentval(value) {
    this.maxinfent = value;
    this.searchFlight.get("passengers.infent").setValidators([Validators.max(this.maxinfent)]);
  }
  //get curr 
  getcurr() {
    let curr = this.carruncy.currentCurruncy.Currency_Code
    if (curr) {
      return curr
    }
    else {
      return "AED"
    }
  }
  // to submit the form and call the search api
  onSubmit() {
    // debugger
    localStorage.setItem('form', JSON.stringify(this.searchFlight.value));
    if (this.searchFlight.valid) {
      let searchApi: SearchFlightModule = new SearchFlightModule(localStorage.getItem('lang'), this.getcurr(), this.pointof.country, this.searchFlight.get('flightType').value,
        this.myApi.flightInfoFormatter(this.bendingFlights()),
        this.myApi.passingerFormatter([this.searchFlight.get('passengers.adults').value, this.searchFlight.get('passengers.child').value, this.searchFlight.get('passengers.infent').value]),
        this.searchFlight.get('class').value, this.id(), this.searchFlight.get('Direct').value, 'all');

      console.log(this.searchFlight.valid, this.searchFlight, "api", searchApi);
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
      // this.Router.navigate(['/ResultPage', language, currency, SearchPoint, flightType, flightInfo, searchId, passengers, Cclass, directOnly]);
      this.research.emit('/ResultPage' + '/' + language + '/' + currency + '/' + SearchPoint + "/" + flightType + "/" + flightInfo + "/" + searchId + "/" + passengers + "/" + Cclass + "/" + directOnly);


      // this.myApi.searchFlight(searchApi).subscribe(
      //   (res)=>{debugger;console.log(res);}
      // );


      this.searchFlight.updateValueAndValidity();
      // this.Router.navigateByUrl();
    }

    else {
      console.log(this.searchFlight.valid, this.searchFlight);
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
    if (this.translate.currentLang == 'ar') {
      if (this.citiesNames.indexOf(input.value) === -1 && this.citiesCode.indexOf(input.value) === -1 && false) {
        return { 'notValidcity': true };
      }

    }
    else {
      if (this.citiesNames.indexOf(input.value.toLowerCase()) === -1 && this.citiesCode.indexOf(input.value.toLowerCase()) === -1 && false) {
        return { 'notValidcity': true };
      }
    }

    return null;
  }
  //set values for the form 
  // return date coing value
  returndateInput() {
    if (this.datainput.searchCriteria.flightType == 'roundtrip') {
      return this.datainput.searchCriteria.flights[1].departingOnDate;
    }
    else {
      return null;
    }
  }

  //  // return array of flights
  onAddFlightinput() {
    for (let index = 0; index < this.datainput.searchCriteria.flights.length; index++) {
      const element = this.datainput.searchCriteria.flights[index];
      (<FormArray>this.searchFlight.get("Flights")).push(new FormGroup({
        "departing": new FormControl(element.departingFrom, [Validators.required, this.citynotfound.bind(this)]),
        "landing": new FormControl(this.city.transform(element.arrivingTo, this.cities), [Validators.required, this.citynotfound.bind(this)]),
        "departingD": new FormControl(element.departingOnDate, [Validators.required])
      }, [this.invalidFlightDis]));

    }
    this.flightsnumber = this.searchFlight.get('Flights').value.length;
    // console.log(this.flightsnumber);
  }
  // remove flight from the array
  removeflight() {
    let i = (<FormArray>this.searchFlight.get("Flights")).length - 1;
    (<FormArray>this.searchFlight.get("Flights")).removeAt(i);
  }
  //set values for the form  coming from the search searchCriteria
  setsearchValues() {
    this.removeArrayControllers();
    this.searchFlight.patchValue({
      "flightType": new FormControl(this.datainput.searchCriteria.flightType, [Validators.required]),
      "Direct": new FormControl(this.datainput.searchCriteria.selectDirectFlightsOnly, [Validators.required]),
      "returnDate": new FormControl(this.returndateInput),
      "passengers": new FormGroup({
        "adults": new FormControl(this.datainput.searchCriteria.adultNum, [Validators.required, Validators.min(1)]),
        "child": new FormControl(this.datainput.searchCriteria.childNum, [Validators.required, Validators.min(0)]),
        "infent": new FormControl(this.datainput.searchCriteria.infantNum, [Validators.required, Validators.max(this.maxinfent), Validators.min(0)]),
      }, [this.maxValueReached.bind(this)])
      ,
      "class": new FormControl(this.datainput.searchCriteria.selectedFlightClass, [Validators.required])
    })

    this.searchFlight.get('Direct').setValue(this.datainput.searchCriteria.selectDirectFlightsOnly);
    this.searchFlight.get('Direct').updateValueAndValidity({ onlySelf: true });
    this.searchFlight.get('flightType').setValue(this.datainput.searchCriteria.flightType);
    this.searchFlight.get('flightType').updateValueAndValidity({ onlySelf: true });
    this.removeArrayControllers();
    this.onAddFlightinput();
    this.searchFlight.updateValueAndValidity();
    console.log('this is the final form', this.searchFlight)
  }



  //custom validators end

  // unsubscribe
  ngOnDestroy() {
    this.subscription.unsubscribe();

  }

}
