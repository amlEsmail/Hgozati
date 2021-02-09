import { Component, OnInit} from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';
import { Bestoffers } from 'src/app/interface/bestoffers';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountriescodeModule } from 'src/app/models/countriescode/countriescode.module';

declare var $: any;

@Component({
  selector: 'app-best-offers-details',
  templateUrl: './best-offers-details.component.html',
  styleUrls: ['./best-offers-details.component.css']
})
export class BestOffersDetailsComponent implements OnInit {
  newOffers:Bestoffers;
  offerIndex:number;
  offer:any=[];
  trueT:boolean[]=[];
  supoffers:Subscription;
  offerbooking:Subscription;
  user: FormGroup;
  booking:object;
  normalErrorStatus:boolean =false;
  normalError:string = 'somthing went wrong please try again'
  countriescode: CountriescodeModule[] = [];
  private subscription:Subscription=new Subscription();
  constructor(private myApi:MyApiService,private route: ActivatedRoute) { }

  ngOnInit() {
    $(document).ready(function(){
      $('.dayslider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
      });

    })
    // call get offers api
    this.supoffers=this.myApi.getOffers(this.route.snapshot.params['pos']).subscribe(
      (result)=>{this.newOffers =result;this.offerIndex=this.route.snapshot.params['id'];
      this.offer=this.newOffers.offers[this.offerIndex];
      this.valuesoftrue(this.offer['offerDays']);
      
    }
    )
  // get countrier api
  this.subscription.add(this.myApi.countrycode('EN').subscribe(
      (result) => { this.countriescode = result; console.log('country codes', this.countriescode); },
      (error)=>{this.normalErrorStatus = true;console.log('countries didnt load',error)}
    ));
    //  booking form
    this.user=new FormGroup({
      'name':new FormControl(null,[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
      'email':new FormControl(null,[Validators.required,Validators.maxLength(32),Validators.email]),
      'phone':new FormControl(null,[Validators.minLength(16),Validators.required]),
      'nationality':new FormControl('',[Validators.required,Validators.pattern('^[a-zA-Z \-\']+')])
    })
   


  }
  dynamicStyles(){
    if(this.offer != []) {
      let url:string =this.offer.offerImage.url;
     return 'url('+url+') no-repeat center center fixed;'   
    }
  }
  // create an array with the same length of the output
  valuesoftrue(array: any[]) {
    let out: any[] = [];
    let arryalengty = array.length;
    for (let index = 0; index < arryalengty; index++) {
      let truth: boolean = false;
      out.push(truth);

    }
    return this.trueT = out;
  }
  toggle(i:number){
    this.trueT[i] = !this.trueT[i];
  }

  onSubmit() {
    let nationality:string ='';
    this.countriescode.forEach(element => {
      if (element.countryName.toLocaleLowerCase() === this.user.get('nationality').value.toLocaleLowerCase()){
        return nationality = element.pseudoCountryCode;
      }
    });
    let ind = this.user.get('phone')['value']['internationalNumber'].indexOf(' ', 2);
    this.booking = {
      "selectedOffer":{
        "PhoneNumber":this.user.get('phone')['value']['number']
        ,"PhoneCountryCode":this.user.get('phone')['value']['internationalNumber'].slice(0, ind)
        ,"Email":this.user.get('email').value
        , "FullName":this.user.get('name').value
        ,"Nationality":nationality
        , "SelectedOfferCode":this.offerIndex
      }
    }
    console.log(this.booking);
    this.offerbooking = this.myApi.OfferBooking(this.booking).subscribe(
      (result)=>{ console.log('booking confirmation status',result)},
      (error)=>{this.normalErrorStatus=true}
    )
  }
  OnDestroy(){
    this.supoffers.unsubscribe();
    this.subscription.unsubscribe();
    this.offerbooking.unsubscribe();
  }
 
}
