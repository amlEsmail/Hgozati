import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MyApiService } from 'src/app/Services/my-api.service';
import { PassengerinfoModule } from 'src/app/models/passengerinfo/passengerinfo.module';
import { PassengersModule } from 'src/app/models/passengers/passengers.module';
import { TranslateService } from '@ngx-translate/core';
import { CountriescodeModule } from 'src/app/models/countriescode/countriescode.module';
import { DatePipe } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CurruncyServiceService } from 'src/app/Services/curruncy-service.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { SessionService } from 'src/app/Services/session.service';
import { _keyValueDiffersFactory } from '@angular/core/src/application_module';

export interface flight {
  airItineraryDTO: {
    itinTotalFare: {
      amount: number,
      totalTaxes: number
    }
    allJourney: {
      flights: [
        {
          stopsNum: any;
        }
      ]
    }
  }
  status: string;
  searchCriteria: {
    adultNum: number,
    childNum: number,
    currency: string,
    infantNum: number,
    language: string
  }
  passportDetailsRequired:boolean;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export interface title {
  value: string;
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  matcher = new MyErrorStateMatcher();
  insurraceChoosed: boolean = false;
  disabled: boolean = false;
  flight: flight;
  isLinear = false;
  firstFormGroup: FormGroup;
  users: FormGroup;
  searchId: string;
  sequancenum: number;
  adults: number = 1;
  childnumber: number = 0;
  infents: number = 0;
  lang: string = 'ng';
  curruncy: string = 'KWD';
  isValid: boolean = true;
  insuranceStatus: boolean = false;
  insurance: any;
  insuranceid: any;
  countriescode: CountriescodeModule[] = [];
  formsubmit: PassengersModule = new PassengersModule('', '', []);
  hgNumber: string = '';
  closeResult: string;
  link: string = '';
  mysafeurl: SafeUrl;
  fare: number = 0;
  taxes: number = 0;
  childmin = new Date(2008, 0, 1);
  infantmin = new Date(2017, 0, 1);
  passportmin = new Date();
  iframeLoader: boolean = true;s
  flightLoader: boolean = true;
  phonenumber = 'phonenumber';
  passportFlag: boolean= false;
  private subscription: Subscription = new Subscription();

  titels: title[] = [
    { value: 'Mr' },
    { value: 'Ms' },
    { value: 'Miss' },
    { value: 'Mrs' }
  ];
  titelsC: title[] = [
    { value: 'Mr' },
    { value: 'Miss' }
  ];
  titleInf: title[] = [
    { value: 'Mstr' },
    { value: 'Miss' }
  ];
  ip: string = '';
  iplocation: string = '';
  startDate = new Date(1990, 0, 1);
  public isCollapsed = false;
  paymentError: string = 'Something went wrong during payment. Our customer service will Help You to Complete Your Booking'
  normalError: string = 'something went wrong please search again';
  normalErrorStatus: boolean = false;
  paymentErrorStatus: boolean = false;


  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private myApi: MyApiService, private translate: TranslateService, private datePipe: DatePipe, private modalService: NgbModal, private sanitizer: DomSanitizer, private mycurruncy: CurruncyServiceService, private session: SessionService) { }

  ngOnInit() {
    if ((+sessionStorage.getItem('Timeleft')) > 0 && sessionStorage.getItem('Timeleft')) {
      this.session.startTimer();
      this.session.sessionExpierd.subscribe(
        (result) => {
          this.normalErrorStatus = true;
          this.normalError = "Sorry your session is expierd please search again ";
          this.iframeLoader = false;
          return
        }
      )

    }
    else {
      this.normalErrorStatus = true;
      this.normalError = "Sorry Your Session Is Expierd Please Search Again ";
      this.iframeLoader = false;
      return
    }


    // get data from the link
    if (this.route.snapshot.queryParamMap.has('sid') && this.route.snapshot.queryParamMap.has('sequenceNum')) {
      this.searchId = this.route.snapshot.queryParamMap.get('sid');
      this.sequancenum = +this.route.snapshot.queryParamMap.get('sequenceNum');
      if (this.searchId && this.sequancenum) {


        this.subscription.add(this.myApi.getSelectedFlight(this.searchId, this.sequancenum).subscribe(
          (result: any) => {
            // console.log('result is', result);
          },
          (error) => { this.normalErrorStatus = true; console.log('???', error); this.iframeLoader = false; this.flightLoader = false; }
        ));
        this.subscription.add(this.myApi.selectedFlight.subscribe(
          (result) => {
            this.flight = result;
            // console.log("my arr", this.flight);
            //remove loader
            this.flightloaded();
            this.adults = this.flight.searchCriteria.adultNum;
            this.childnumber = this.flight.searchCriteria.childNum;
            this.lang = this.flight.searchCriteria.language;
            this.curruncy = this.flight.searchCriteria.currency;
            this.passportFlag = this.flight.passportDetailsRequired;
            this.session.setSessionTime(30);
            this.session.startTimer();
            // console.log(this.adults);
            this.getfare();
          }
          , (error) => {
          this.normalErrorStatus = true;
            // console.log(error);
            this.iframeLoader = false;
          }
        ))

      }
    }
    else {
      this.searchId = this.route.snapshot.params['sid'];
      this.sequancenum = this.route.snapshot.params['sequenceNum'];
      if (this.searchId && this.sequancenum) {


        this.subscription.add(this.myApi.getSelectedFlight(this.searchId, this.sequancenum).subscribe(
          (result: any) => {
            // console.log('result is', result);
          }
        ));
        this.subscription.add(this.myApi.selectedFlight.subscribe(
          (result) => {

            // console.log('this', result); 
            this.flight = result; this.fare = this.flight['airItineraryDTO']['itinTotalFare']['amount'] - this.flight['airItineraryDTO']['itinTotalFare']['totalTaxes']; console.log("my arr", this.flight); console.log('fare', this.fare);
            this.fare = Math.round(this.fare * 100) / 100;
            this.getfare();
            this.passportFlag = this.flight.passportDetailsRequired;
            this.adults = this.flight.searchCriteria.adultNum;
            this.childnumber = this.flight.searchCriteria.childNum;
            this.lang = this.flight.searchCriteria.language;
            this.curruncy = this.flight.searchCriteria.currency;
            // console.log(this.adults);

          }
          , (error) => {
          this.normalErrorStatus = true;
            // console.log(error);
            this.iframeLoader = false;
          }
        ));

      }
    }
    ;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.users = new FormGroup({
      usersarray: new FormArray([])
    });
    console.log(this.searchId);
    console.log(this.sequancenum);
    this.subscription.add(this.route.queryParams.subscribe(
      (params) => {
        this.searchId = params['sid'];
        this.sequancenum = +params['sequenceNum'];
        console.log('in the subb query', this.searchId, this.sequancenum, this.adults, this.childnumber, this.infents);

        if (this.searchId && this.sequancenum) {


          this.subscription.add(this.myApi.getSelectedFlight(this.searchId, this.sequancenum).subscribe(
            (result: any) => {
              // console.log('result is', result);
            }
          ));
          this.subscription.add(this.myApi.selectedFlight.subscribe(
            (result) => {
              this.flight = result;
              // console.log("my arr", this.flight);
              this.flightloaded();
              this.adults = this.flight.searchCriteria.adultNum;
              this.childnumber = this.flight.searchCriteria.childNum;
              this.infents = this.flight.searchCriteria.infantNum;
              this.lang = this.flight.searchCriteria.language;
              this.curruncy = this.flight.searchCriteria.currency;
              this.passportFlag = this.flight.passportDetailsRequired;
              console.log(this.passportFlag,'passport2');
              this.userarraybuilder(this.adults, this.childnumber, this.infents);
            }, (error) => {
            this.normalErrorStatus = true;
              // console.log(error)
            }
          ))

        }
      }
    ));
    // this.route.params.subscribe(
    //   (params: Params) => {
    //     this.searchId = params['searchid'];
    //     this.sequancenum = params['sequenceNum'];
    //     console.log('in the subb', this.searchId, this.sequancenum, this.adults, this.childnumber, this.infents);
    //     this.userarraybuilder(this.adults, this.childnumber, this.infents);
    //     if (this.searchId && this.sequancenum) {


    //       this.myApi.getSelectedFlight(this.searchId, this.sequancenum).subscribe(
    //         (result: any) => { console.log('result is', result); }
    //       );
    //       this.myApi.selectedFlight.subscribe(
    //         (result) => {
    //           console.log('this', result); this.flight = result; console.log("my arr", this.flight);
    //           this.adults = this.flight.searchCriteria.adultNum;
    //           this.childnumber = this.flight.searchCriteria.childNum;
    //           this.lang = this.flight.searchCriteria.language;
    //           this.curruncy = this.flight.searchCriteria.currency;
    //         }
    //       )

    //     }
    //   }
    // );

    // call get flight api


    // this.userarraybuilder(this.adults, this.childnumber, this.infents);
    // this.subscription.add(
    //   (<FormArray>this.users.get('usersarray')).valueChanges.subscribe(
    //     (change)=>{let form =(<FormGroup>(<FormArray>this.users.get('usersarray'))['controls'][0]);
    //       console.log(form['controls']['phonenum'])
    //       }
    //     // (change)=>{if ((<FormArray>this.users.get('usersarray')).get('0').get('phonenum').dirty && (<FormArray>this.users.get('usersarray')).get('0').get('phonenum').touched &&(<FormArray>this.users.get('usersarray')).get('0').get('phonenum').invalid){
    //     //     this.phonenumber = "alertPhone"
    //     // }else{
    //     //   this.phonenumber = "phonenumber"
    //     // }}

    //   )
    // )
    this.subscription.add(this.users.statusChanges.subscribe(
      (change) => {
        if (change == 'VALID') {
          this.isValid = false;
        }
        else {
          this.isValid = true;
        }
      }
    ));

    // phone validation handeling
    // this.subscription.add(this.users.valueChanges.subscribe(
    //   (change)=>{
    //     this.invalidPhone();
    //   }
    // ))
    //call get country code  api
    this.subscription.add(this.myApi.countrycode('EN').subscribe(
      (result) => {
      this.countriescode = result;
        // console.log('country codes', this.countriescode); 
      },
      (error) => {
      this.normalErrorStatus = true;
        // console.log('countries didnt load',error)
        ; this.iframeLoader = false;
      }
    ));
    //call get ip address api 
    this.subscription.add(this.myApi.pointOfSale().subscribe(
      (result) => { this.ip = result.ip; this.iplocation = result.country; },
      (error) => {
      this.normalErrorStatus = true;
        // console.log(error);
        this.iframeLoader = false;
      }
    ))
  }
  //make the user array
  userarraybuilder(adults: number, child: number, infent: number) {
    this.passportFlag = this.flight.passportDetailsRequired;
    console.log(this.passportFlag,'passport')
    debugger
    this.removeArrayControllers();
    if(this.passportFlag){
      (<FormArray>this.users.get('usersarray')).push(
        new FormGroup({
          "title": new FormControl('', [Validators.required]),
          // "firstName": new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'),Validators.minLength(3)]),
          // "lastName": new FormControl('', [Validators.required ,Validators.pattern('^[a-zA-Z \-\']+'),Validators.minLength(3)]),
          "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+'), Validators.minLength(3)]),
          "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+'), Validators.minLength(3)]),
          "email": new FormControl('', [Validators.required, Validators.email, Validators.minLength(9)]),
          "phonenum": new FormControl("", [Validators.required, Validators.maxLength(5)]),
          "national": new FormControl('', [Validators.required, Validators.minLength(3)]),
          "dateOfBirth": new FormControl("", [Validators.required]),
          "type": new FormControl('ADT'),
          "countryofresident": new FormControl('', [Validators.required]),
          "passportnumber": new FormControl("", [Validators.required]),
          "expdate": new FormControl("", [Validators.required]),
          "issuedcountry": new FormControl("", [Validators.required])
        })
      );
    }
    else {
      (<FormArray>this.users.get('usersarray')).push(
        new FormGroup({
          "title": new FormControl('', [Validators.required]),
          // "firstName": new FormControl('', [Validators.required,Validators.pattern('^[a-zA-Z \-\']+'),Validators.minLength(3)]),
          // "lastName": new FormControl('', [Validators.required ,Validators.pattern('^[a-zA-Z \-\']+'),Validators.minLength(3)]),
          "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+'), Validators.minLength(3)]),
          "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+'), Validators.minLength(3)]),
          "email": new FormControl('', [Validators.required, Validators.email, Validators.minLength(9)]),
          "phonenum": new FormControl("", [Validators.required, Validators.maxLength(5)]),
          "national": new FormControl('', [Validators.required, Validators.minLength(3)]),
          "dateOfBirth": new FormControl("", [Validators.required]),
          "type": new FormControl('ADT'),
          "countryofresident": new FormControl(''),
          "passportnumber": new FormControl(""),
          "expdate": new FormControl(""),
          "issuedcountry": new FormControl("")
        })
      );
    }
   
    let i = 1;
    // add adults to the array 
    while (i < adults) {
      if(this.passportFlag){
        (<FormArray>this.users.get('usersarray')).push(
          new FormGroup({
            "title": new FormControl('', [Validators.required]),
            "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
            "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
            "email": new FormControl('', []),
            "phonenum": new FormControl("", []),
            "national": new FormControl('', []),
            "dateOfBirth": new FormControl("", [Validators.required]),
            "type": new FormControl('ADT'),
            "countryofresident": new FormControl('', [Validators.required]),
            "passportnumber": new FormControl("", [Validators.required]),
            "expdate": new FormControl("", [Validators.required]),
            "issuedcountry": new FormControl("", [Validators.required])
          })
        );
      }else{
        (<FormArray>this.users.get('usersarray')).push(
          new FormGroup({
            "title": new FormControl('', [Validators.required]),
            "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
            "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
            "email": new FormControl('', []),
            "phonenum": new FormControl("", []),
            "national": new FormControl('', []),
            "dateOfBirth": new FormControl("", [Validators.required]),
            "type": new FormControl('ADT'),
            "countryofresident": new FormControl(''),
            "passportnumber": new FormControl(""),
            "expdate": new FormControl(""),
            "issuedcountry": new FormControl("")
          })
        );
      }
     
      i++
    }
    // add the children to the form array  
    let cid = 0
    if (child > 0) {

      while (cid < child) {
        if(this.passportFlag){
          (<FormArray>this.users.get('usersarray')).push(
            new FormGroup({
              "title": new FormControl('', [Validators.required]),
              "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "passportnum": new FormControl('', [Validators.max(16)]),
              "dateOfBirth": new FormControl("", []),
              "national": new FormControl('', []),
              "type": new FormControl('CNN'),
              "phonenum": new FormControl(""),
              "countryofresident": new FormControl('',[Validators.required]),
              "passportnumber": new FormControl("",[Validators.required]),
              "expdate": new FormControl("",[Validators.required]),
              "issuedcountry": new FormControl("",[Validators.required])
  
            })
          )
        }
        else {
          (<FormArray>this.users.get('usersarray')).push(
            new FormGroup({
              "title": new FormControl('', [Validators.required]),
              "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "passportnum": new FormControl('', [Validators.max(16)]),
              "dateOfBirth": new FormControl("", []),
              "national": new FormControl('', []),
              "type": new FormControl('CNN'),
              "phonenum": new FormControl(""),
              "countryofresident": new FormControl('', []),
              "passportnumber": new FormControl("", []),
              "expdate": new FormControl("", []),
              "issuedcountry": new FormControl("", [])
  
            })
          )
        }
        
        cid++;
      }
    }
    // add infant to the array 
    let infe = 0
    if (infent > 0) {

      while (infe < infent) {
        if(this.passportFlag){
          (<FormArray>this.users.get('usersarray')).push(
            new FormGroup({
              "title": new FormControl('', [Validators.required]),
              "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "passportnum": new FormControl("", [Validators.maxLength(12)]),
              "dateOfBirth": new FormControl("", []),
              "national": new FormControl('', []),
              "type": new FormControl("INF"),
              "phonenum": new FormControl('', []),
              "countryofresident": new FormControl('',[Validators.required]),
              "passportnumber": new FormControl("",[Validators.required]),
              "expdate": new FormControl("",[Validators.required]),
              "issuedcountry": new FormControl("",[Validators.required])
  
            })
          )
        }
        else{
          (<FormArray>this.users.get('usersarray')).push(
            new FormGroup({
              "title": new FormControl('', [Validators.required]),
              "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
              "passportnum": new FormControl("", [Validators.maxLength(12)]),
              "dateOfBirth": new FormControl("", []),
              "national": new FormControl('', []),
              "type": new FormControl("INF"),
              "phonenum": new FormControl('', []),
              "countryofresident": new FormControl('', []),
              "passportnumber": new FormControl("", []),
              "expdate": new FormControl("", []),
              "issuedcountry": new FormControl("", [])
            })
          )
        }
       
        infe++;
      }
    }
  }
  //call to rest form array
  removeArrayControllers() {
    while ((<FormArray>this.users.get("usersarray")).length >= 1) {
      (<FormArray>this.users.get("usersarray")).removeAt(0);
    }
  }
  //give the type of the passenger  adult, child or infant
  pasengertype(i: number) {

    let adu = +this.adults;
    let chi = +this.childnumber;
    let add = adu + chi
    if (i + 1 <= this.adults) {
      return 'Adult'
    }
    else if (i + 1 > this.adults && i + 1 <= add) {
      return 'Child'
    }
    else {
      return 'Infant on lap'
    }
  }
  //return arrival city
  arrivalCity(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = m - 1
    return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["cityName"];
  }
  //return airport code
  arrivalAircode(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = m - 1
    return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["airportCode"];
  }
  //return arrival date
  arrivalDate(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = m - 1
    return item.allJourney.flights[flightN].flightDTO[i]['arrivalDate'];
  }

  //return stop airports 
  stopsairport(flights: number) {
    let stops = this.flight.airItineraryDTO.allJourney.flights[flights]['stopsNum']
    let i = 0;
    let airports: string = ''
    while (i < stops) {
      if (i == 0) {
        airports = airports + this.flight.airItineraryDTO.allJourney.flights[flights]["flightDTO"][i]['arrivalTerminalAirport']['airportCode'];
        i++
      }
      else {
        airports = airports + ', ' + this.flight.airItineraryDTO.allJourney.flights[flights]["flightDTO"][i]['arrivalTerminalAirport']['airportCode'];
        i++
      }

    }
    return airports;
  }
  //submit the form
  onSubmit() {
    if (this.users.invalid) {
      // console.log(this.users);
      this.unvalidPhone();
      return
    }
    // console.log(this.users);
    this.disabled = true;
    this.formsubmit.UserCurrency = this.mycurruncy.currentCurruncy.Currency_Code;
    this.formsubmit.bookingEmail = (<FormArray>this.users.get("usersarray")).controls[0].value['email'];
    this.formsubmit.passengersDetails = this.intoFormat();
    // console.log(this.formsubmit);
    // console.log(this.searchId,this.sequancenum);
    this.subscription.add(this.myApi.saveBooking(this.searchId, this.sequancenum, this.formsubmit).subscribe(
      (result) => {
        // console.log(result);
        if (result.hgNumber) {
          this.hgNumber = result.hgNumber;
          this.subscription.add(this.myApi.CheckFlightValidation(result.hgNumber, 'en', this.searchId, this.sequancenum).subscribe
            (
              (result) => {
                // console.log(result);
                if (result.status = "Valid") {
                  // commwnt this and un comment the folwing function to activate insurance;
                  this.subscription.add(this.myApi.GetPaymentView(this.ip, this.iplocation, this.hgNumber, this.searchId, '').subscribe(
                    (result) => {
                      // console.log("thielink", result); 
                      this.link = result.link; this.mysafeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
                      if (this.link.length < 5) {
                        this.normalErrorStatus = true;

                      }
                    },
                    (error) => {
                      // console.log(error);
                      this.normalErrorStatus = true;

                    }
                  ));
                  // this.subscription.add( this.myApi.findinsurance(this.hgNumber,this.searchId).subscribe(
                  //   (result)=>{if(result.status.toLowerCase() == 'valid'){
                  //     this.insuranceStatus = true;
                  //     this.insurance = result.flightInsurance[0];
                  //     console.log('this is insurance',this.insurance)
                  //     return
                  //   }
                  //   else{
                  //     this.subscription.add( this.myApi.GetPaymentView(this.ip, this.iplocation, this.hgNumber, this.searchId,'').subscribe(
                  //       (result) => {
                  //         console.log("thielink", result); this.link = result.link;this.mysafeurl=this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
                  //         if(this.link.length<5){
                  //           this.normalErrorStatus = true;

                  //         }
                  //       },
                  //       (error)=>{ console.log(error);this.normalErrorStatus = true;

                  //       }
                  //     ));
                  //   }; console.log(result)},
                  //   (Error)=>{console.log(Error)}
                  // ))

                }
                else {
                  this.modalService.open(this.modalContent).result.then((result) => {
                    this.closeResult = `Closed with: ${result}`;
                  }, (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                  });;
                }
              }, (error) => {
              this.normalErrorStatus = true;
                // console.log(error);
                this.iframeLoader = false;
              }
            ))
        }
        else {
          this.normalError = 'This flight no longer exists. Please search again';
          this.normalErrorStatus = true;
          this.iframeLoader = false;

        }
      },
      (error) => {
      this.normalErrorStatus = true;
        // console.log(error);
        this.iframeLoader = false;
      }
    ));

  }
  //countryvalidation Formatt
  contryformatter(country: string) {
    let result: string = '';
    this.countriescode.forEach(element => {
      if (country.toLowerCase() == element.countryName.toLowerCase()) {
        result = element.pseudoCountryCode;
      }
    });
    return result
  }
  // assign the form to modal
  intoFormat() {
    debugger
    let formattedarray: PassengerinfoModule[] = [];
    let ind: number = 0;
    for (let index = 0; index < (<FormArray>this.users.get("usersarray")).length; index++) {

      const element = (<FormArray>this.users.get("usersarray")).controls[index];
      const formatt: PassengerinfoModule = new PassengerinfoModule('', '', '', '', '', '', '', '', '', '', '', '');
      formatt.title = element.value['title'];
      formatt.firstName = element.value['firstName'];
      formatt.lastName = element.value['lastName'];
      formatt.passengerType = element.value['type'];
      formatt.nationality = this.contryformatter(element.value['national']);
      formatt.dateOfBirth = this.datePipe.transform(element.value['dateOfBirth'], 'yyyy-MM-dd');
      formatt.countryOfResidence =this.contryformatter(element.value['countryofresident']);
      formatt.PassportNumber = element.value['passportnumber'];
      formatt.IssuedCountry = this.contryformatter(element.value['issuedcountry']);
      if(element.value['expdate'] != ''){
        formatt.PassportExpiry = this.datePipe.transform(element.value['expdate'], 'yyyy-MM-dd');
      }
      
      if (element.value.type === 'ADT' && index == 0) {

        ind = element.value['phonenum']['internationalNumber'].indexOf(' ', 2);
        formatt.phoneNumber = this.replaceplus(element.value['phonenum']['number']);
        console.log(formatt.phoneNumber);
        formatt.countryCode = element.value['phonenum']['internationalNumber'].slice(0, ind);
        console.log("formated",formatt);
        // element.value['phonenum']['internationalNumber'].slice(element.value['phonenum']['internationalNumber'].indexOf('')+1);
      }
      formattedarray.push(formatt);

    }
    return formattedarray
  }
  //modal functions
  @ViewChild("content") modalContent: TemplateRef<any>;
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  safeurl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
  }

  arrivalStopCity(item: any, flightN: number) {
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0
    for (i; i < m - 1; i++) {
      return item.allJourney.flights[flightN].flightDTO[i]["arrivalTerminalAirport"]["cityName"];
    }

  }
  replaceplus(number: string) {
    if (number[0] == '+') {
      return '00' + number.slice(1);
    }
    else return number
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
    let ar: [] = item.allJourney.flights[flightN]["flightDTO"];
    let m: number = ar.length;
    let i: number = 0;
    for (i; i < m; i++) {
      stopArr.push(ar[i]);
    }
    return stopArr;


  }
  showStop(item: any, flightN: number) {
    // let stop:boolean=false;
    let stopSeg: number = 0;
    stopSeg = item.allJourney.flights[flightN]["stopsNum"];
    // if(stopSeg >= 1)
    // {
    //  return !stop
    // }
    // console.log("stopS",stopSeg);
    return stopSeg >= 1 ? true : false;


  }
  iframeloaded() {
    this.iframeLoader = false;
  }
  flightloaded() {
    this.flightLoader = false;
  }
  insuranceUpdate(insurance: any) {
    this.insurraceChoosed = true;
    if (insurance == -1) {
      this.insuranceid = '';
    }
    else {
      this.insuranceid = insurance;
    }
  }

  getPayment() {
    this.subscription.add(this.myApi.GetPaymentView(this.ip, this.iplocation, this.hgNumber, this.searchId, this.insuranceid).subscribe(
      (result) => {
        // console.log("thielink", result);
        this.link = result.link; this.mysafeurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
        if (this.link.length < 5) {
          this.normalErrorStatus = true;

        }
      },
      (error) => {
        // console.log(error);
        this.normalErrorStatus = true;
        this.iframeLoader = false;
      }
    ));
  }
  getfare() {
    let a: number = this.flight['airItineraryDTO']['itinTotalFare']['amount'];
    let b: number = this.flight['airItineraryDTO']['itinTotalFare']['totalTaxes'];
    let myfare = a - b;
    this.fare = parseFloat((Math.round(myfare * 100) / 100).toFixed(2));
    this.taxes = parseFloat((Math.round(b * 100) / 100).toFixed(2));
    //  console.log(this.fare,"nice tray");

  }
  //  valdidate phone component by chaning css 
  invalidPhone() {
    let phone: FormGroup = (<FormGroup>((<FormArray>this.users.get("usersarray"))["controls"][0]));
    if (phone.get('phonenum').invalid && (phone.get('phonenum').touched || phone.get('phonenum').dirty || phone.get('phonenum').hasError)) {
      this.phonenumber = "alertPhone";
    } else {
      this.phonenumber = "phonenumber";
    }
  }
  //  setphone to un valid
  unvalidPhone() {
    let phone: FormGroup = (<FormGroup>((<FormArray>this.users.get("usersarray"))["controls"][0]));
    if (phone.get('phonenum').invalid) {
      this.phonenumber = "alertPhone";
    } else {
      this.phonenumber = "phonenumber";
    }
  }
  farerules() {
    return "/terms/" + this.searchId + "/" + this.sequancenum;
  }
  // unsubscribe
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
