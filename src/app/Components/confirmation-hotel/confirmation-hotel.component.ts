import { hotelBookingModel } from './../../models/search-hotel/hotel-booking-model';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { MyApiService } from 'src/app/Services/my-api.service';

@Component({
  selector: 'app-confirmation-hotel',
  templateUrl: './confirmation-hotel.component.html',
  styleUrls: ['./confirmation-hotel.component.css']
})
export class ConfirmationHotelComponent implements OnInit {
  Failed:boolean=false;
  Loading:boolean=true;
  sucsess:boolean=false;
  disabled: boolean = false;
  searchId:string='';
  HGNum:string='';
  tok:string ='';
  sequancenum:number;
  // confermation:FlightSearchResult;
  flight :any;
  normalError:string ='something went wrong please search again';
  isCollapsed = false;
  bookingHotel:hotelBookingModel;
  
  private subscription:Subscription=new Subscription();
  constructor(private myApi: MyApiService,private route:ActivatedRoute) { }

  ngOnInit() {
    
    if(this.route.snapshot.queryParamMap.has('sid') && this.route.snapshot.queryParamMap.has('HG')){
      debugger
        this.searchId = this.route.snapshot.queryParamMap.get('sid');
        this.HGNum =this.route.snapshot.queryParamMap.get('HG');
        this.tok =this.route.snapshot.queryParamMap.get('tok');
        this.subscription.add(this.myApi.getConfirmationH(this.HGNum,this.searchId).subscribe(
          (result)=>{
            console.log(result);
            this.bookingHotel=result;
            // this.confermation = result;
            // this.flight = this.confermation.airItineraries[0];
            this.Failed=false;
            this.Loading=false;
            this.sucsess=true;
          }
        ));
    }
    else{
      this.Failed=true;
      this.Loading=false;
      this.sucsess=false;
    }
    this.subscription.add( this.route.queryParams.subscribe(
      
      (params) => {
        debugger
        this.searchId = params['sid'];
        this.HGNum =  params['HG'];
        this.tok = params['tok']
        this.subscription.add( this.myApi.getConfirmationH(this.HGNum,this.searchId).subscribe(
          (result)=>{
            console.log("confirmationresult",result);
            // this.confermation = result;
            // this.flight = this.confermation.airItineraries[0];
            this.Failed=false;
            this.Loading=false;
            this.sucsess=true;
            // this.sequancenum = this.confermation.airItineraries[0]['sequenceNum'];
          },
          (error)=>{ 
            console.log(error);
                        // normal error
                        this.Failed=true;
                        this.Loading=false;
                        this.sucsess=false;

          }
          
        ))
    
      }));
  

  }



// get ratingstars 
 getRating(stars:number)
 {
   let starsArr=[];
   for (let i=0;i<stars;i++)
   {
     starsArr.push(i);

   }
   
   return starsArr;
 }


 //get CHECKin
 getDate(date:string)
 {
  let datechecked = date.split(" ");
  return datechecked[0];

 }

 getGuestTotal(){
  let adult=0;
  let child=0;
   for(let i=0 ;i<this.bookingHotel.rooms.length;i++)
   {
     adult+=this.bookingHotel.rooms[i].Adult;
     child+=this.bookingHotel.rooms[i].Child;
   }
   return adult+child;

 }

}
