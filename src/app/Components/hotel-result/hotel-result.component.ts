

import { HotelSearchResult } from './../../models/search-hotel/search-hotel-result';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, ɵConsole, ViewEncapsulation } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
// import {MatSidenavModule, MatSidenav} from '@angular/material/sidenav';
import { MyApiService } from './../../Services/my-api.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { CurruncyServiceService } from './../../Services/curruncy-service.service';
import { SearchHoteltModule } from '../../models/search-hotel/search-hotel.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';



declare var $: any;

@Component({
  selector: 'app-hotel-result',
  templateUrl: './hotel-result.component.html',
  styleUrls: ['./hotel-result.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HotelResultComponent implements OnInit {
  sortvalue:number = 2;
  sortvalue2:number = 2;
  trueT: boolean[] = [];
  lan:string='';
  hotels: HotelSearchResult [] = [];
  filterdhotels : HotelSearchResult [] = [];
  myapi:SearchHoteltModule;
  neighborhoods: string[]=[]
  starsArray:number[]=[1,2,3,4,5]
  location:string='';
  checkIn:string='';
  checkOut:string='';
  citywithcountry:string="";
  searchId:string="";
  filtrationForm: FormGroup;
  filterdnabors:string[]=[];
  Sortvalu:FormControl;
  lat: number = 51.678418;
  lng: number = 7.809007;
  mapOn = true;
  rangemin:number = 33;
  rangemax:number =168;
  minplus:number =49;
  maxminus:number =110;
  zoom:number = 12;
  loading:boolean=true;
  ResultFound:boolean=false;
  defaultImage="../../../../assets/img/Blank.svg";
  // toggole filtercard
  isShowen:boolean=false;
  hotelDetails:HotelSearchResult;
  roomNumber:string='';
  allNights:number=0;
  // hotelCode:any;
  panelOpenState:boolean[]=[false,false,false];
  activeIds: string[] = ['panel-1','panel-2','panel-3'];

  // @Input() showDetails:HotelSearchResult;


  constructor(private route:ActivatedRoute,private search:MyApiService,private router:Router,private mycurruncy:CurruncyServiceService ,private cdRef:ChangeDetectorRef) { 

  }


// detect change after rooms btn changes
  ngAfterViewChecked(){
    this.cdRef.detectChanges();

 }

  ngOnInit() {
    console.log("sortvalue",this.sortvalue);
    // filteration form 
    this.filtrationForm = new FormGroup(
      {
        Hotelname: new FormControl(''),
        mapOn: new FormControl(false),
        rate : new FormGroup ({
          star: new FormControl(true),
          stars2: new FormControl(true),
          stars3: new FormControl(true),
          stars4: new FormControl(true),
          stars5: new FormControl(true)
        }),
        price : new FormGroup({
          under33:new FormControl (true),
          from33To49:new FormControl (true),
          from49To110: new FormControl (true),
          from110to168 : new FormControl (true),
          over168 : new FormControl(true)
        }),
        neighbor : new FormArray([])
      }
    ) ;
   


    // get data from url 
    this.route.params.subscribe(
      (param:Params)=>{

        // hotelResult/:language/:currency/:SearchPoint/:searchId/:location/:nation/:checkIn/:checkOut/:roomNumber/:stringGuest
        this.lan=localStorage.getItem('lang');
        // let Currency =param['currency'];
        let Currency = this.mycurruncy.baseCurruncy;
        let pointOfReservation = param['SearchPoint'];
        this.searchId =param['searchId'];
        this.location=param['location'];
        this.citywithcountry = param ['citywithcountry']
        let nation=param['nation'];
        this.checkIn=param['checkIn'];
        this.checkOut=param['checkOut'];
        this.roomNumber=param['roomNumber'];
        let stringGuest=param['stringGuest'];
        // get no of nights stays in hotels
       this.allNights= this.getNights(this.checkIn,this.checkOut);
       this.search.changeNightNo(this.allNights);
        console.log(this.citywithcountry,"citywithcountry")

        let searchApi:SearchHoteltModule=new SearchHoteltModule(this.lan,Currency,pointOfReservation,this.searchId,this.location,this.citywithcountry,nation,this.checkIn,this.checkOut,this.roomNumber,stringGuest);
        this.valuesoftrue(this.hotels);

        if(SearchHoteltModule) {
        
          this.myapi =searchApi;
          this.search.getHotels(this.myapi).subscribe (
            (result)=>{
              this.loading=false;
              this.ResultFound=true;
              this.hotels=result.HotelResult;
              this.filterdhotels = this.hotels;
              console.log("filterhotels" ,this.filterdhotels);
              this.neighborhoods = result.Locations;
              this.neighborhoods.forEach(element => {
               (<FormArray>this.filtrationForm.get('neighbor')).push(
                new FormControl(false)
               )
              });
              this.filterdnabors =this.neighborhoods.map(val=> val.toLowerCase());
              console.log(this.neighborhoods);
              console.log("getHotels",result);
              this.valuesoftrue(this.hotels);
              this.setPriceRange(this.hotels);
              this.lng = +this.hotels[0]['Lng'];
              this.lat = + this.hotels[0]['Lat'];
          
            }
          )
        }

        

      }
    );


    this.filtrationForm.valueChanges.subscribe(
      (res)=>{this.neighborfilterArray();this.filtermyarray()}
    )
 



    }

  // get no of nights stays in hotels
    getNights(checkIn,checkOut){
      console.log("first",checkIn ,"second" ,checkOut )
      let day1=new Date(checkIn);
      let day2=new Date(checkOut);
      let diff = Math.abs(day1.getTime() - day2.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
    console.log("diffDays",diffDays );
    return diffDays;

    }
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

neighborfilterArray(){
  this.filterdnabors =[];
 let truth = (<boolean[]>(<FormArray>this.filtrationForm.get('neighbor')).value);
 for (let index = 0; index < truth.length; index++) {
   const element = truth[index];
   if(element) {
          this.filterdnabors.push( this.neighborhoods[index].toLowerCase());
   }
 }
 if(this.filterdnabors.length ===0){
   this.filterdnabors = this.neighborhoods.map(value => value.toLowerCase());
 }
}

//  filter my hotels
filtermyarray(){
  //  let filterdResult = this.hotels.filter(hotel => hotel.hotelRate < 2 );
  //  console.log (filterdResult);
  
  // this.filterdhotels =this.hotels.filter(hotel=> (this.starsArray.indexOf(hotel.hotelStars) != -1 ) && (this.priceTest(hotel.TotalSellPrice) )&& (this.filterdnabors.indexOf(hotel.Location.toLowerCase())!= -1));
  
  this.filterdhotels =this.hotels.filter(hotel=> this.starsArray.indexOf(hotel.hotelStars) != -1 && 
  (this.priceTest(hotel.TotalSellPrice) )&&
  (this.filterdnabors.indexOf(hotel.Location.toLowerCase())!= -1) &&
  (hotel.hotelName.toLowerCase().indexOf((<string>this.filtrationForm.get('Hotelname').value).toLowerCase()) != -1 ||((<string>this.filtrationForm.get('Hotelname').value).length<2))) ;
  console.log(this.filterdhotels);
  
  }

  //  price condition function
priceTest(value:number):boolean{
  return ((value<this.rangemin && this.filtrationForm.get('price.under33').value)||
  (value>=this.rangemin && value<this.minplus && this.filtrationForm.get('price.from33To49').value)||
  (value>=this.minplus && value<this.maxminus && this.filtrationForm.get('price.from49To110').value)||
  (value>=this.maxminus && value<this.rangemax && this.filtrationForm.get('price.from110to168').value)||
  (value>=this.rangemax && this.filtrationForm.get('price.over168').value))
 }
setPriceRange( result:HotelSearchResult [] ){
  debugger
  let sortedResult:HotelSearchResult [] =[];
  sortedResult =result.sort((a,b) => {return a.TotalSellPrice - b.TotalSellPrice});
  let minP = sortedResult[0]['TotalSellPrice'];
  let ind = sortedResult.length -1;
  let maxP =sortedResult[ind]['TotalSellPrice'];
  let range = maxP -minP;
  let slice = Math.round(range/5);
  this.rangemin = Math.round(minP + slice);
  this.rangemax = Math.round(maxP - slice);
  this.minplus = Math.round(this.rangemin +slice);
  this.maxminus = Math.round(this.rangemax -slice);
}



// sortingfunctions
sortByPrice(val:number){
  
  console.log(val);
  // if(val==1){
  //  this.filterdhotels = this.filterdhotels.sort((a,b) => {return a.hotelRate - b.hotelRate });
  // }
  if(val ==2){
    this.filterdhotels = this.filterdhotels.sort((a,b) => {return a.TotalSellPrice - b.TotalSellPrice});
  }
  if(val ==3){
    this.filterdhotels = this.filterdhotels.sort((a,b) => {return  b.TotalSellPrice - a.TotalSellPrice});
  }
 }

 sortByStars(val:number){
  
  console.log(val);

  if(val ==2){
    this.filterdhotels = this.filterdhotels.sort((a,b) => {return a.hotelStars - b.hotelStars});
  }
  if(val ==3){
    this.filterdhotels = this.filterdhotels.sort((a,b) => {return b.hotelStars - a.hotelStars});
  }
 }

 // research
 research (newurl:string){
  // console.log("thisis the new url",newurl);
  this.loading =true;
  this.ResultFound = false;
  this.router.navigateByUrl('/ResultPage', {skipLocationChange: true}).then(()=>{this.router.navigate([newurl]);
 console.log(newurl)
}
  ); 
 //  this.ngOnDestroy();
 //  this.ngOnInit();
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
  
 //check click event ()
 clickstars(condition:boolean,value:number){
  if(!condition){
    this.starsArray.push(value);
  }
  else{
    let index = this.starsArray.indexOf(value);
   if (index > -1) {
     this.starsArray.splice(index, 1);
  }
  }
  console.log('is still fast?',this.starsArray)
}

// open hoteldetails modal 
togglemodel(hotelView:HotelSearchResult)
{  

  let id ='#hotelDetails';
  $(id).modal('toggle');
  this.hotelDetails=hotelView;
  // this.hotelCode=this.hotelDetails.hotelCode;
  console.log("hotelModel",this.hotelDetails);
  // console.log("hotelCode",this.hotelCode)

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
    //  if(panel.panelId==="panel-4" )
    // {
    //   this.panelOpenState[3]= !this.panelOpenState[3];
    // }

    // if(panel.panelId==="panel-5" )
    // {
    //   this.panelOpenState[4]= !this.panelOpenState[4];
    // }


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




}

