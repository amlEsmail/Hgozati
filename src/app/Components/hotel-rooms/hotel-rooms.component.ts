import { HotelCancelationComponent } from './hotel-cancelation/hotel-cancelation.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoomResult } from './../../models/HotelRooms/HotelRooms';
import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MyApiService  } from ' ../../../src/app/Services/my-api.service';
import { HotelRoom,Room } from '../../models/HotelRooms/HotelRooms';
import { Subscription } from 'rxjs';
import { ActivatedRoute ,Router} from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CurruncyServiceService } from 'src/app/Services/curruncy-service.service';

declare var $:any ;
@Component({
  selector: 'app-hotel-rooms',
  templateUrl: './hotel-rooms.component.html',
  styleUrls: ['./hotel-rooms.component.css']
})
export class HotelRoomsComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[]=[];
  roomOptions: NgxGalleryOptions[];
  roomImages: NgxGalleryImage[]=[];
  selecteTruearray = [];
  isShow:boolean[]=[];
  trueT:boolean[]=[];
  //Rooms:Room[];
  hotelData:HotelRoom; 
  imgs:any[]=[];
  SelectedRoomsArray:any[]=[];
  selectedRooms:any[]=[];
  HotelCode:string="";
  pid:string="";
  Sid:string="";
  base = 'KWD';
  aprove:boolean = true;
  loading:boolean=true;
  ResultFound:boolean=false;
  showCheckoutDetails:boolean=false;
  private subscription:Subscription=new Subscription();
  allNight:number;
  // no of Nights

  constructor(private roomSer:MyApiService,private route: ActivatedRoute,private routeSer:Router ,private mycurruncy:CurruncyServiceService,private modalService:NgbModal) { 
    this.route.queryParams.subscribe(params => {
      this.base = mycurruncy.baseCurruncy;
      this.HotelCode = params['hid'];
      this.pid = params['pid'];
      this.Sid = params['sid'];
      this.subscription.add( this.roomSer.GetHotelRooms(this.pid,this.Sid,this.HotelCode ).subscribe(a=>{
        this.loading=false;
        this.ResultFound=true;
        this.hotelData=a;
        console.log("hoteldata",this.hotelData);
        this.valuesoftrue(this.hotelData.rooms);
        this.hotelData.rooms.forEach(element => {
          let tru = [];
          element.RoomResults.forEach(element => {
            tru.push(false);
          });
          this.selecteTruearray.push(tru);
          console.log(this.selecteTruearray);
        }); 
        
        this.selectedRooms= new Array<any>(this.hotelData.rooms.length);
        this.SelectedRoomsArray = new Array<any>(this.hotelData.rooms.length);
       // this.Rooms=this.hotelData.rooms;
       // console.log(this.Rooms)
        for(let x=0 ;x<this.hotelData.hotelImages.length;x++){
          // debugger
        
          let hotelimage={
            small:this.hotelData.hotelImages[x],
            medium:this.hotelData.hotelImages[x],
            big:this.hotelData.hotelImages[x]
          }
        
          this.galleryImages.push(hotelimage);
          // let roomPhoto={}
     
        }
      
        for(let r=0;r<this.hotelData.rooms.length;r++)
        {
          for(let j=0;j<this.hotelData.rooms[r].RoomResults.length;j++)       
          {
            for(let i=0;i<this.hotelData.rooms[r].RoomResults[j].Images.length;i++)
            {
              let roomPhotos={
                small:this.hotelData.rooms[r].RoomResults[j].Images[i],
                medium:this.hotelData.rooms[r].RoomResults[j].Images[i],
                big:this.hotelData.rooms[r].RoomResults[j].Images[i]
              }
              this.roomImages.push(roomPhotos);
            }

          }
        }

        console.log(this.imgs)
        
        console.log(this.galleryImages)
      },err=>{
        alert("No Rooms Available ")
      }));
  });

    
    
  }
  // navigate button selected 
  // selectRooms(i,roomCode){
  //   // debugger;
  //   this.showCheckoutDetails=true;
  //    let flagSelectedAll=true;
  //  this.selectedRooms[i]=roomCode;
  //  for(let i=0;i<this.selectedRooms.length;i++){
  //   if(  this.selectedRooms[i] == undefined)
  //   {
  //     flagSelectedAll=false ;
  //   }
  //  }
  //   if(flagSelectedAll==true){
  //      let roomsdataCodes:string="";
  //     console.log(this.selectedRooms);
      
  //     for(let i=0;i<this.selectedRooms.length;i++){
  //       if(i==0){
  //         roomsdataCodes=this.selectedRooms[i];
  //       }
  //       else {
  //         roomsdataCodes=roomsdataCodes+"-"+this.selectedRooms[i];
  //       }
  //     }
  //     let urlRoute:any="/hotelcheckout?hid="+this.hotelData.hotelCode+"&pid="+this.pid+"&roomNo="+this.hotelData.rooms.length+"&rooms="+roomsdataCodes+"&sid="+this.Sid+"&hpid="+this.hotelData.providerHotelID;

  //     this.routeSer.navigateByUrl(urlRoute);
  //   }
  // }
  showOneRoom(i,r){
    // debugger
    for(let j=0;j<this.hotelData.rooms[r].RoomResults.length;j++){
      if(j != i){ 
        $("#acc"+r+j).hide();
      }
    }
    if( $("#acc"+r+i).css('display') != 'block' ) {
    $("#acc"+r+i).removeAttr("hidden");

    $("#acc"+r+i).show();
    } 
    else {
      $("#acc"+r+i).hide();
   }  

  }
  showItenaryRooms(r){
    // debugger
    this.trueT[r]=!this.trueT[r];
    for(let j=0;j<this.hotelData.rooms.length;j++){
      if(j != r){ 
        $("#allRoomCrd"+j).hide();
      }
    }
    if( $("#allRoomCrd"+r).css('display') != 'block' ) {
    $("#allRoomCrd"+r).removeAttr("hidden");

    $("#allRoomCrd"+r).show();
    } 
    else {
      $("#allRoomCrd"+r).hide();
   }  

  }
  ngOnInit() {

    // set nightNo
    this.roomSer.nightNo.subscribe(
      (nightNO)=>{this.allNight=nightNO}
    )
     
    this.galleryOptions = [
      {
        width: '100%',
        height: '300px',
        imagePercent: 100,
        thumbnailsColumns: 5,
         
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
    },
    { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
    { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
    ];

    this.roomOptions = [
      {
        width: '100%',
        height: '300px',
        imagePercent: 100,
        thumbnailsColumns: 0,
         
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
    },
    { "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 0 },
    { "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 0 }
    ]
     
     
  }
// get guestNo

getGuesPerRoom(adult:number ,child:number)
{

let total=child+adult;
return total;
}

// open cancelation rules
openrules(roomIndex:any) {
  const modalRef = this.modalService.open(HotelCancelationComponent);
  modalRef.componentInstance.sid = this.Sid;
  modalRef.componentInstance.hotelcode =this.HotelCode;
  modalRef.componentInstance.roomIndex =roomIndex;
  modalRef.componentInstance.Pid =this.pid;


}

//get ratings 
  getRating()
  {
    let stars=this.hotelData.hotelStars;
    let starsArr=[];
    for (let i=0;i<stars;i++)
    {
      starsArr.push(i);
 
    }
    
    return starsArr;
  }


 // create an array with the same length of the output
 valuesoftrue(array: any[]) {
  let out: any[] = [];
  let arryalengty = array.length;
  for (let index = 0; index < arryalengty; index++) {
    let truth: boolean = true;
    out.push(truth);

  }
  return this.isShow = out;
}
// get selected  room update 
 selectedRoom(roomIndix:number,selectRInd:number,selectedRoom:RoomResult){
   if(this.SelectedRoomsArray.indexOf(selectedRoom) === -1){
      this.SelectedRoomsArray[roomIndix] = selectedRoom;
   }else {
     this.SelectedRoomsArray[roomIndix] = 'Not Selected yet'
   }
   console.log(this.SelectedRoomsArray);
   this.isRoomSelected(roomIndix,selectRInd);
  console.log(this.selecteTruearray);
 }
 selectedRoombutton(roomIndix:number,selectRInd:number,selectedRoom:RoomResult){
   this.selecteTruearray[roomIndix][selectRInd] = !this.selecteTruearray[roomIndix][selectRInd];
  if(this.SelectedRoomsArray.indexOf(selectedRoom) === -1){
     this.SelectedRoomsArray[roomIndix] = selectedRoom;
  }else {
    this.SelectedRoomsArray[roomIndix] = 'Not Selected yet'
  }
  console.log(this.SelectedRoomsArray);
  this.isRoomSelected(roomIndix,selectRInd);
 console.log(this.selecteTruearray);
}
 isRoomSelected(r:number,selectedRoom:number){
 let des = this.selecteTruearray;
    for (let index = 0; index < des[r].length; index++) {
      if(index != selectedRoom){
          des[r][index]=false;
      }     
    }
    this.selecteTruearray = des;
 }
// calculate total cost
 calculatetotal():number {
   let price :number = 0;
  let converted:number=0
   this.SelectedRoomsArray.forEach(element => {
     if(element.TotalSellPrice){
       price = price+element.TotalSellPrice;
     converted= parseFloat((Math.round(price*100)/100).toFixed(2));
     }
   });
   return converted;
 }


//  check if the all room selected
 validate() :boolean{
   this.aprove= false;
   let i=0;
   this.SelectedRoomsArray.forEach(element => {
    debugger
    if(element && element != 'No Rooms Available'){
        i++
    }

  });
  if(i === this.hotelData.rooms.length ){
    this.aprove = true;
  }
  console.log(this.aprove,this.SelectedRoomsArray.length,this.SelectedRoomsArray);
  return this.aprove;
 }

 tocheckOut(){
   debugger
   if(this.validate()) {
    let roomsdataCodes:string ='';
    for(let i=0;i<this.SelectedRoomsArray.length;i++){
    
      if(i==0){
        roomsdataCodes=this.SelectedRoomsArray[i]['RoomIndex'];
      }
      else {
        roomsdataCodes=roomsdataCodes+"-"+this.SelectedRoomsArray[i]['RoomIndex'];
      }
    }
    let urlRoute:any="/hotelcheckout?hid="+this.hotelData.hotelCode+"&pid="+this.pid+"&roomNo="+this.hotelData.rooms.length+"&rooms="+roomsdataCodes+"&sid="+this.Sid+"&hpid="+this.hotelData.providerHotelID;
    this.routeSer.navigateByUrl(urlRoute);
   } else {
     console.log("invalid");
   }
  
   
   
  

  
 }

 
 
}
