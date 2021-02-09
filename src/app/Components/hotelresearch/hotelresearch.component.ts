import { SearchHoteltModule } from './../../models/search-hotel/search-hotel.module';

import { CountriescodeModule } from 'src/app/models/countriescode/countriescode.module';
import { HotelSearchResult } from './../../models/search-hotel/search-hotel-result';
import { DatePipe } from '@angular/common';
import { CurruncyServiceService } from './../../Services/curruncy-service.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Route, Params, ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { HotelsCitiesModule } from 'src/app/models/hotels-cities/hotels-cities.module';
import { MyApiService } from 'src/app/Services/my-api.service';

import { PointOfsaleModule } from 'src/app/models/point-ofsale/point-ofsale.module';
import cities from 'src/assets/citiesdata.json';
import countriesen from 'src/assets/countries/countriesen.json';
import countriesar from 'src/assets/countries/countriesar.json';

@Component({
  selector: 'app-hotelresearch',
  templateUrl: './hotelresearch.component.html',
  styleUrls: ['./hotelresearch.component.css'],
  providers: [DatePipe]
})
export class HotelresearchComponent implements OnInit ,OnDestroy {

  storage:boolean=false;
  value: any;
  hotelSearch: FormGroup;
  roomN: number = 1;
  dateT: boolean = false;
  dateChanged: boolean = false;
  dateErr: boolean = false;
  datStep: boolean = false;
  hoveredDate: NgbDate;
  step = 'Step1';
  fromDate: NgbDate;
  toDate: NgbDate;
  formday: Date;
  today: Date;
  currentday: NgbDate;
  RoomsA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  childrenA =[0,1,2];
  private subscription: Subscription = new Subscription();
  arrhotelcities: HotelsCitiesModule[];
  allGuest:number=0;
  nationArr:string[]=[];
  nation:string='';
  // hotelcities:Observable<Array<any>>;

  countries:any[];
  pointof: PointOfsaleModule;
  pointofC ='EG'
  citiesNames: string[] = [];
  // let roomN=this.hotelSearch.get("roomN").value;
  // this.getGuestNum(roomN);
  // // this.getGuestNum(val);
  @Output() research: EventEmitter<string> = new EventEmitter();
  
  constructor(private router: Router, calendar: NgbCalendar,private myapi: MyApiService, private carruncy: CurruncyServiceService, private datePipe: DatePipe,private route:ActivatedRoute,private cdRef:ChangeDetectorRef) {

    this.fromDate = calendar.getToday();
    this.currentday = calendar.getToday();
    console.log('calender day', console.log(this.fromDate))
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 7);

    console.log('next', this.toDate)
    this.formday = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);

    this.today = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
    console.log(this.formday, this.today);

  }


// detect change after rooms btn changes
  ngAfterViewChecked(){
    this.cdRef.detectChanges();

 } 

  ngOnInit() {

    this.arrhotelcities = cities.cities;
    this.extractcites(this.arrhotelcities);
    this.countries = countriesen;
    console.log("countries for nation" ,this.countries )
    this.extractNationality(this.countries);

    // get nation from url 

    this.route.params.subscribe(
      (param:Params)=>{
        this.nation=param['nation']; 
      }
    );


    if (localStorage.getItem('hotelform')) {

      console.log("hotelformlocalstorage",localStorage.getItem('hotelform'));
      this.storage=true;
      let hotelForm: object = JSON.parse(localStorage.getItem('hotelform'));
      let locationS=hotelForm['location'];
      let nationS=hotelForm['nation'];
      // let checkInS=this.datePipe.transform(hotelForm['checkIn'], 'MMMM dd, y')
      let checkInS=new Date(hotelForm['checkIn']);
    //  console.log("testCheckIN",checkInS.setDate( checkInS.getDate() -1 )); 
      this.formday=checkInS;
      // let checkOutS=this.datePipe.transform(hotelForm['checkOut'], 'MMMM dd, y');
      let checkOutS=new Date(hotelForm['checkOut']);
      let guestInfo=hotelForm['guestInfo'];
      console.log("gusetInfoarray-in research",guestInfo);

      this.today=checkOutS;
     
      let roomNS=hotelForm['roomN'];

    
      this.hotelSearch=new FormGroup(
        {
       
          location: new FormControl(locationS, [Validators.required, Validators.minLength(3), this.citynotfound.bind(this)]),
          nation: new FormControl( nationS, [Validators.required, Validators.minLength(3),this.natinotfound.bind(this)]),
          checkIn: new FormControl(this.formday, Validators.required),
          //custom-validator  min - > checkin
          checkOut: new FormControl(this.today, Validators.required),
          roomN: new FormControl(roomNS, [Validators.required, Validators.min(1)]),
          guestInfo: new FormArray([], [this.maxValueReached.bind(this)]),

    
        });

    }
    else
    {
      this.hotelSearch = new FormGroup({
        // setValidators([Validators.required, this.citynotfound.bind(this)])
        // location:new FormControl(null,[Validators.required,Validators.minLength(3)]),
        location: new FormControl("", [Validators.required, Validators.minLength(3), this.citynotfound.bind(this)]),
        nation: new FormControl("", [Validators.required, Validators.minLength(3),this.natinotfound.bind(this)]),
        checkIn: new FormControl(this.formday, Validators.required),
        //custom-validator  min - > checkin
        checkOut: new FormControl(this.today, Validators.required),
        roomN: new FormControl(1, [Validators.required, Validators.min(1)]),
        guestInfo: new FormArray([], [this.maxValueReached.bind(this)]),
        // guestInfo:new FormArray([], [this.maxValueReached.bind(this)]),
  
      });


    }


    console.log(this.hotelSearch);

    // this.getGuestNum(this.roomN);
    (<FormArray>this.hotelSearch.get("guestInfo")).push(
      new FormGroup({
        adultN: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
        childN: new FormControl(0, [Validators.required, Validators.max(2)]),
        childGroup: new FormArray([])

    }));
    this.subscription.add(this.hotelSearch.get("roomN").valueChanges.subscribe(
      (val) => {

        if (val != null) {
          // this.guestEmpty();
          this.roomN = val;
          // this.getGuestNum(this.roomN);
          console.log(val);

        }
        else {

          // this.guestEmpty();
          this.roomN = 1;
          // this.getGuestNum(this.roomN);
          console.log("else ", val)
        }


      }));

      this.subscription.add(this.hotelSearch.get("checkIn").valueChanges.subscribe(
      (val) => {
        //  this.hotelSearch.get("checkOut").setValidators(Validators.min(+this.minDate()));
        //  this.hotelSearch.get("checkOut").updateValueAndValidity();



      }
    ))





    //get pointOfSale
    this.subscription.add(this.myapi.pointOfSale().subscribe(
      (result: PointOfsaleModule) => { this.pointof = result;
      this.pointofC= this.pointof.country; },
      (error) => { console.log(error) }
    ))

  }



  getGuestNum(rooms: number) {

    if (rooms <= 5) {
      for (let i = 0; i < rooms; i++) {
        (<FormArray>this.hotelSearch.get("guestInfo")).push(
          new FormGroup({
            adultN: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
            childN: new FormControl(0, [Validators.required, Validators.max(2)]),
            childGroup: new FormArray([])

          }));
      }


    }

  }

  //empty guest 
  guestEmpty() {

    console.log((<FormArray>this.hotelSearch.get("guestInfo")).length, "my lenght");

    while ((<FormArray>this.hotelSearch.get("guestInfo")).length > 0) {
      (<FormArray>this.hotelSearch.get("guestInfo")).removeAt(1);

    }

  }





  //get date of day
  todayDate() {
    let date = new Date();
    return date.toISOString().split('T')[0];

  }

  //get minDate of checkout
  minDate() {
    let date = new Date();
    if (this.dateChanged) {

      let tomorrow = this.hotelSearch.get("checkIn").value;
      tomorrow.setDate(tomorrow.getDate() + 1);
      //  console.log("tomorrow plus", tomorrow);

      return tomorrow.toISOString().split('T')[0];

    }
    else {
      return date.toISOString().split('T')[0];
    }


  }


  setMinDate(event: MatDatepickerInputEvent<Date>) {
    this.dateChanged = true;
    this.hotelSearch.get("checkOut").setValue(this.minDate());
    this.hotelSearch.get("checkOut").updateValueAndValidity();

  }




  // addChildAge(guestGroup: FormGroup) {
  //   let childN = guestGroup.get('childN').value;

  //   // console.log("childGroup",guestGroup.get('childN').value);
  //   while (0 < (<FormArray>guestGroup.get("childGroup")).length) {
  //     (<FormArray>guestGroup.get("childGroup")).removeAt(0);

  //   }
  //   if (childN <= 2) {
  //     for (let c = 0; c < childN; c++) {
  //       (<FormArray>guestGroup.get("childGroup")).push(new FormGroup({
  //         age: new FormControl(2, [Validators.required, Validators.min(2), Validators.max(11)]),
  //       }));
  //     }
  //   }


  // }
// add childAge
    addChildAge(guestGroup: FormGroup) {
    let childN = guestGroup.get('childN').value;
    if((<FormArray>guestGroup.get("childGroup")).length ==1)
    {
      if(childN == 0)
      {
      (<FormArray>guestGroup.get("childGroup")).removeAt(0);
 
      }
      if(childN == 2)
      {
        (<FormArray>guestGroup.get("childGroup")).push(new FormGroup({
          age: new FormControl(2, [Validators.required, Validators.min(2), Validators.max(11)]),
        }));

      }

    }
    else if((<FormArray>guestGroup.get("childGroup")).length ==2)
    {
      if(childN == 0)
      {

          while (0 < (<FormArray>guestGroup.get("childGroup")).length) {
          (<FormArray>guestGroup.get("childGroup")).removeAt(0);

        }
 
      }
      if(childN == 1)
      {
        (<FormArray>guestGroup.get("childGroup")).removeAt(0);
      }
    }
    else
    {
      if (childN <= 2) {
          for (let c = 0; c < childN; c++) {
            (<FormArray>guestGroup.get("childGroup")).push(new FormGroup({
              age: new FormControl(2, [Validators.required, Validators.min(2), Validators.max(11)]),
            }));
          }
        }
    }

  }

  // guest  number cant be more than 9
  maxValueReached(search: FormArray): { [b: string]: boolean } {
    let adults = 0;
    let childs = 0;
    console.log("searchguest", search)
    for (let i = 0; i < search.length; i++) {

      adults += Number((<FormArray>this.hotelSearch.get("guestInfo")).controls[i].get('adultN').value)
      childs += Number((<FormArray>this.hotelSearch.get("guestInfo")).controls[i].get('childN').value)
    }
    this.allGuest=adults+childs;
    console.log("adults", adults, "childs", childs);
    if (adults + childs > 9) {
      return { 'maxReched': true };
    }
    return null;
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

  id() {
    let date = new Date();
    let myId = date.getFullYear() + 'B' + date.getUTCMonth() + 'I' + date.getUTCDay() + 'S' + date.getMilliseconds() + 'H' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'B' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'I'
      + Math.floor(Math.random() * (9 - 0 + 1)) + 0
      + 'S' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'H' + Math.floor(Math.random() * (9 - 0 + 1)) + 0 + 'I' + Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    return myId;
  }

  formatGuestInfo(guestInfo: FormArray) {

    let guesttxt = '';

    for (let i = 0; i < guestInfo.length; i++) {
      debugger;


      guesttxt += "R" + i + "A" + guestInfo[i]['adultN'] + "C" + guestInfo[i]['childN']

      for (let j = 0; j < guestInfo[i]["childGroup"].length; j++) {
        debugger;
        guesttxt += "G" + guestInfo[i].childGroup[j]["age"];

      }


    }

    console.log("guesttxt", guesttxt)

    return guesttxt;
  }
  // getCityCountry(cityArr:Observable<Array<any>>,index:number){

  //    cityArr.forEach((city)=>{
  //     if(city['CityId'] === index) 
  //     {    
  //       return city['CityWithCountry'];
  //     }

  //    });
  //     return 0;   
  // };



  extractcites(hotelcities) {


    hotelcities.forEach((city) => {
      let cityt = city.City.toLowerCase();
      this.citiesNames.push(cityt);

    });

  }
  //returns an array of  cities name in lowercase used for input validations
  // citiesNameExtract(cities: HotelsCitiesModule[]) {
  //   cities.forEach(element => {
  //     let city = element.City.toLowerCase();
  //     this.citiesNames.push(city);
  //   });
  // }



  //city input is not in cities names array
  citynotfound(input: FormControl): { [c: string]: boolean } {
    console.log(input.value);
    if (input.value['City']) {
      let city: string = input.value['City'].toLowerCase();
      if (this.citiesNames.indexOf(city) === -1) {
        return { 'notValidcity': true };
      }

    }
    else {
      if (this.citiesNames.indexOf((<string>input.value).toLowerCase()) === -1) {
        return { 'notValidcity': true };
      }
    }

    return null;
  }
// extract nationality
extractNationality(countries:any[]){

  for(let i=0;i<countries.length;i++)
  {
      this.nationArr.push(countries[i].countryName.toLowerCase());
  }


}

  // nationalit is not in nation array
  natinotfound(input: FormControl): { [n: string]: boolean } {

    
    // console.log("nationArr",this.nationArr);
        
          if (this.nationArr.indexOf((<string>input.value).toLowerCase()) === -1) {
            return { 'notValidNation': true };
        }
      
    
        
    
        return null;
      }


  onSubmit() {
    console.log("called");
    localStorage.setItem('hotelform', JSON.stringify(this.hotelSearch.value));

    if (this.hotelSearch.valid) {

      let location = this.hotelSearch.get("location").value;
      let locationId = location.CityId;
      let citywithcountry = location.CityWithCountry;
      // console.log("loc", location);
      // get cityname cityCountry 

      // let citywithcountry=this.getCityCountry(this.hotelcities,location);
      console.log("citywithcountry", citywithcountry);
      let nation = this.hotelSearch.get("nation").value;
      let checkIn = this.datePipe.transform(this.hotelSearch.get("checkIn").value, 'MMMM dd, y');
      console.log("submited checkin", checkIn)
      let checkOut = this.datePipe.transform(this.hotelSearch.get("checkOut").value, 'MMMM dd, y');
      let roomNumber = this.hotelSearch.get("roomN").value;
      let guestInfo = this.hotelSearch.get("guestInfo").value;
      let stringGuest = this.formatGuestInfo(guestInfo);
      let searchApi: SearchHoteltModule = new SearchHoteltModule(localStorage.getItem('lang'), this.getcurr(), this.pointofC, this.id(), locationId, citywithcountry, nation, checkIn, checkOut, roomNumber, guestInfo);
      let language = searchApi.lan;
      let currency = searchApi.Currency;
      let SearchPoint = searchApi.POS;
      let searchId = searchApi.serachId;


      // this.router.navigate(['/hotelResult',language,currency,location,citywithcountry,nation,checkIn,checkOut,roomNumber]);

      // this.router.navigate(['/hotelResult', language, currency, SearchPoint, searchId, locationId, citywithcountry, nation, checkIn, checkOut, roomNumber, stringGuest]);
      this.research.emit('/hotelResult' + '/' + language + '/' + currency + '/' + SearchPoint + "/" + searchId + "/" + locationId + "/" + citywithcountry + "/" + nation + "/" + checkIn + "/" + checkOut + "/"+roomNumber + "/" +stringGuest);
      this.hotelSearch.updateValueAndValidity();

    }
    else {
      console.log(this.hotelSearch.valid, this.hotelSearch);
    }



    // console.log("guestInfo",guestInfo);



    console.log("hotel-search", this.hotelSearch);


  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;

    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    this.formday = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
    if (this.toDate != null) {
      this.today = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      this.hotelSearch.get('checkOut').setValue(this.today);
      this.hotelSearch.get('checkOut').updateValueAndValidity();
      this.datStep = true;
      
    }

    this.hotelSearch.get('checkIn').setValue(this.formday);
    this.hotelSearch.get('checkIn').updateValueAndValidity();


  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);

  }
  dateTC() {
    this.dateT = !this.dateT;
  }
  // add rome to rome array
  addRome() {
    let num = this.hotelSearch.get('roomN').value;
    this.hotelSearch.get('roomN').setValue(num + 1);
    this.hotelSearch.get('roomN').updateValueAndValidity();
    (<FormArray>this.hotelSearch.get("guestInfo")).push(
      new FormGroup({
        adultN: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
        childN: new FormControl(0, [Validators.required, Validators.max(2)]),
        childGroup: new FormArray([])

      }));
      (<FormArray>this.hotelSearch.get("guestInfo")).updateValueAndValidity();
      this.roomN = this.roomN+1;
      console.log('??',this.roomN);
  }
  //remove room
  removeRome() {
    let num = this.hotelSearch.get('roomN').value;
    this.hotelSearch.get('roomN').setValue(num - 1);
    this.hotelSearch.get('roomN').updateValueAndValidity();
    (<FormArray>this.hotelSearch.get("guestInfo")).removeAt(num-1);
    this.roomN = this.roomN-1;
    console.log('??',this.roomN);
  }

  //show cityname and country
  displayFn(city?: HotelsCitiesModule): string | undefined {
    return city ? city.City : undefined;
  }

  // displayFnNation(country?: CountriescodeModule): string | undefined{
  //   return country ? country.countryName : undefined;
  // }

  // unsubscribe
  ngOnDestroy() {
    this.subscription.unsubscribe();

  }
}
