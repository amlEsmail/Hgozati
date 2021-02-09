import { Subscription, Observable } from 'rxjs';
import { HotelSearchResult } from './../../../models/search-hotel/search-hotel-result';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit ,OnDestroy{

  @Input('hotelDetails') hotel:HotelSearchResult;

  @Input('searchId') searchId:string;
  // @Input('hotelCode') hotelCode:any;
  hotelCode:any;
  trueT:boolean=true;
  private subscription:Subscription=new Subscription();

  hotelAmenties:Observable<any[]>;
  // hotelAmenties:any[];

  defaultImage="../../../../assets/img/Blank.svg";
  constructor(private route:ActivatedRoute,private router:Router,private api:MyApiService) { }

  ngOnInit() {




  }

  showAmenties(hotelCode:any){
    this.hotelAmenties=this.api.gethotelAmenities(hotelCode);
    this.trueT=!this.trueT;
  }


    // get ratingstars 
    getRating(stars:number):any[]
    {
      let starsArr=[];
      for (let i=0;i<stars;i++)
      {
        starsArr.push(i);
   
      }
      
      return starsArr;
    }



    // navigate to hotelsRoom 
showRoom(hotelData:HotelSearchResult)
{
  let hotelID=hotelData.hotelCode;
  let searchId= this.searchId;
  let providerId=hotelData.providerID;
 //  this.router.navigate()
 // :hid/:pid/:sid
 // { queryParams: {id: 37, username: 'jimmy'}}
 // navigate to hoteldetails 
  this.router.navigate(['/rooms'],{ queryParams: {hid: hotelID, pid: providerId,sid:searchId}});


}
    

  // unsubscribe 
  ngOnDestroy(){
    this.subscription.unsubscribe();
   
  }

}
