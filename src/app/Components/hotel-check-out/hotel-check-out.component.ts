import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotelCancelationComponent } from './../hotel-rooms/hotel-cancelation/hotel-cancelation.component';
import { Component, OnInit } from '@angular/core';
import { MyApiService } from ' ../../../src/app/Services/my-api.service';
import { BookingObject, Traveller } from '../../models/HotelBooking/HotelBooking';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RequiredHotel, Room } from '../../models/HotelBooking/RequiredHotelData';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CurruncyServiceService } from 'src/app/Services/curruncy-service.service';
@Component({
  selector: 'app-hotel-check-out',
  templateUrl: './hotel-check-out.component.html',
  styleUrls: ['./hotel-check-out.component.css']
})
export class HotelCheckOutComponent implements OnInit {
  arr: any[] = [];
  disabled = true;
  //roomNum:number=3;
  mailData: string = "";
  PhoneData: any = null;
  HotelData: RequiredHotel;
  bookingData: BookingObject = { cityName: "", currency: "", totalCost: 0, paxQty: 0, roomQty: 0, Travellers: [], mail: "", hotelID: "", providerHotelID: "", pid: "", sellPrice: 0, sid: "", src: "" };
  hotelID: string;//
  hotelPID: string;//
  fname1 = new FormControl('', [Validators.required]);
  link:string ='';
  pid: any;//
  roomNo: number;//
  rooms: string;//
  sid: string;//
  TotalCost: number = 0;
  TotalCostdata: number = 0;
  loading: boolean = true;
  loading1: boolean = false;
  ResultFound: boolean = false;
  ip:any;
  iplocation:string;
  paymentError:string ='Something went wrong during payment our customer service will help you to complete your booking'
  normalError:string ='something went wrong please search again';
  normalErrorStatus:boolean = false;
  paymentErrorStatus:boolean = false;
  hgNumber:string;
  mysafeurl:SafeUrl;
  guestForm: FormGroup;
  phonenumber = 'phonenumber';
  notRcost: number = 0;
  private subscription: Subscription = new Subscription();

  travellersData: Traveller[] = [];
  titels: any[] = [
    { value: 'Mr' },
    { value: 'Ms' },
    { value: 'Miss' },
    { value: 'Mrs' }
  ];
  constructor(private ser: MyApiService, private route: ActivatedRoute,private sanitizer: DomSanitizer,private mycurruncy:CurruncyServiceService,private modalService:NgbModal ) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      debugger;
      this.hotelID = params['hid'];
      this.hotelPID = params['hpid'];
      this.pid = params['pid'];
      this.roomNo = params['roomNo'];
      this.rooms = params['rooms'];
      this.sid = params['sid'];
      this.hotelPID = params['hpid'];//fromhotel details
      console.log(this.hotelPID)
      for (let i = 0; i < this.roomNo; i++) {


        // let data:Traveller={travellerId:1,Main:false,salutation:"",paxType:"adult",phone:"",phoneCode:"", firstName:"",lastName:"",roomNo:0}
        // this.travellersData.push(data);
      }
      debugger
      this.subscription.add(this.ser.GetHotelRoomsNUM(this.sid, this.hotelID, this.pid, this.rooms).subscribe(a => {
        console.log("a hotelcheckOut:" , a);
        this.loading = false;
        this.ResultFound = true;
        this.HotelData = a;
        debugger
        let ind = 0;
        this.HotelData.rooms.forEach(element => {
          ind = ind + 1
          let mainData = false;
          if (ind == 1) {
            mainData = true;
          }
          this.notRcost += element.SellPrice;
          //  converted= parseFloat((Math.round(price*100)/100).toFixed(2));
          this.TotalCost = parseFloat((Math.round(this.notRcost * 100) / 100).toFixed(2));
          this.TotalCostdata += element.costPrice;
          let data: Traveller = {
            dateOfBirth: "2019-08-19 17:25:56",
            travellerId: 1,
            Main: mainData,
            salutation: "",
            paxType: "adult",
            phone: "",
            phoneCode: "",
            firstName: "",
            lastName: "",
            roomNo: Number(element.RoomCode)
          }
          this.travellersData.push(data)
        });
      }, err => {
        alert("No Rooms Available ")
      }));
    });

    //fill guestform
    this.guestForm = new FormGroup({
      guestData: new FormArray([])

    });

    //looping 
    this.fillGuestControl(this.roomNo);
    
    //get ip adress and point of sale;
    this.subscription.add(
      this.ser.pointOfSale().subscribe(
      (result) => { this.ip = result.ip; this.iplocation = result.country; },
      (error)=>{this.normalErrorStatus = true;console.log(error)}
    ))

  }

  fillGuestControl(roomN: number) {

    for (let i = 0; i < roomN; i++) {
      if (i == 0) {
        (<FormArray>this.guestForm.get("guestData")).push(new FormGroup({
          "title": new FormControl('', [Validators.required]),
          "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
          "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
          "email": new FormControl('', [Validators.required, Validators.email, Validators.minLength(9)]),
          "phonenum": new FormControl("", [Validators.required, Validators.maxLength(12)]),

        }));
      }
      else {
        (<FormArray>this.guestForm.get("guestData")).push(new FormGroup({
          "title": new FormControl('', [Validators.required]),
          "firstName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),
          "lastName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.minLength(3)]),


        }));
      }


    }
  }



  //get ratings 
  getRating() {
    let stars = this.HotelData.Hotelstar;
    let starsArr = [];
    for (let i = 0; i < stars; i++) {
      starsArr.push(i);

    }

    return starsArr;
  }

  getGuesPerRoom(adult:number ,child:number)
{

let total=child+adult;
return total;
}

 //get CHECKin
 getDate(date:string)
 {
  let datechecked = date.split(" ");
  return datechecked[0];

 }

   // get no of nights stays in hotels
   getNights(checkIn,checkOut){
    // console.log("first",checkIn ,"second" ,checkOut )
    let day1=new Date(checkIn);
    let day2=new Date(checkOut);
    let diff = Math.abs(day1.getTime() - day2.getTime());
  let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
  // console.log("diffDays",diffDays );
  return diffDays;

  }


// open cancelation rules
openrules(roomIndex:any) {
  const modalRef = this.modalService.open(HotelCancelationComponent);
  modalRef.componentInstance.sid = this.sid;
  modalRef.componentInstance.hotelcode =this.hotelID;
  modalRef.componentInstance.roomIndex =roomIndex;
  modalRef.componentInstance.Pid =this.pid;


}





  onSubmit() {


  if (this.guestForm.invalid) {
      // console.log(this.users);
      this.unvalidPhone();
      return
    }
    // const guestData:Traveller[]=[];
    const guests = this.guestForm.value["guestData"];

    for (let i = 0; i < guests.length; i++) {
      this.travellersData[i]["firstName"] = guests[i]["firstName"];
      this.travellersData[i]["lastName"] = guests[i]["lastName"];
      this.travellersData[i]["salutation"] = guests[i]["title"];
      this.travellersData[i]["phone"] = guests[i]["phonenum"];
      this.travellersData[i]["phone"] = guests[i]["phonenum"];//not requerd

    }


    // console.log("guestData",guestData);

    console.log("traveller", this.travellersData);
    this.mailData = guests[0]["email"];
    this.PhoneData = guests[0]["phonenum"];
    console.log(this.mailData);
    console.log(this.PhoneData);
    this.bookingData.cityName = this.HotelData.City;
    // this.bookingData.currency = this.HotelData.Currency;
    this.bookingData.currency = this.mycurruncy.currentCurruncy.Currency_Code;
    this.bookingData.hotelID = this.hotelID;
    this.bookingData.providerHotelID = this.hotelPID;
    this.bookingData.mail = this.mailData;
    this.bookingData.pid = this.pid;
    this.bookingData.roomQty = this.roomNo;
    this.bookingData.sellPrice = this.TotalCost;
    this.bookingData.sid = this.sid;
    this.bookingData.src = "direct";
    this.bookingData.totalCost = this.TotalCostdata;
    this.bookingData.Travellers = this.travellersData;
    console.log("bookingData", this.bookingData);


    this.travellersData[0].phone = this.PhoneData.number;
    var codes = this.PhoneData.internationalNumber.split(" ")
    this.travellersData[0].phoneCode = codes[0];

    this.ser.HotelSaveBookingData(this.bookingData).subscribe(
      res => {
        this.hgNumber = res.bookingNum;
        console.log(res);
        this.loading1=true;
        this.subscription.add(this.ser.GetHPaymentView(this.ip,this.iplocation,res.bookingNum,this.sid,localStorage.getItem('lang')).subscribe(
          (result)=>{ 
            console.log(result);
            this.link = result.Link;
            console.log('the link is',this.link,result.Link)
            ;this.mysafeurl=this.sanitizer.bypassSecurityTrustResourceUrl(this.link);}
          ,(error)=>{
            this.normalErrorStatus = true;
            this.loading1 = false;
            this.loading = false;
          }
        ))
      }
      , err => {
        this.normalErrorStatus= true;
        console.log(err);
        
        
      }
    )



  }
  iframeloaded(){
    this.loading1 =false;
  }


    //  setphone to un valid
    unvalidPhone() {
      let phone: FormGroup = (<FormGroup>((<FormArray>this.guestForm.get("guestData"))["controls"][0]));
      if (phone.get('phonenum').invalid) {
        this.phonenumber = "alertPhone";
      } else {
        this.phonenumber = "phonenumber";
      }
    }

}
