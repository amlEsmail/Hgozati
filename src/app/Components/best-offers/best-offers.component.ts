import { Subscription } from 'rxjs';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { PointOfsaleModule } from 'src/app/models/point-ofsale/point-ofsale.module';
import { Bestoffers } from 'src/app/interface/bestoffers';
import { MyApiService } from 'src/app/Services/my-api.service';
import { Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-best-offers',
  templateUrl: './best-offers.component.html',
  styleUrls: ['./best-offers.component.css']
})
export class BestOffersComponent implements OnInit,OnDestroy{
 first:boolean =false;
 second:boolean = false;
 third:boolean = false;
 fourth:boolean = false;
 newPointofsale:PointOfsaleModule;
 newOffers:Bestoffers;
 innerWidth:any=800;
 private subscription:Subscription=new Subscription();
 @HostListener('window:resize', ['$event'])
 onResize(event) {
   this.innerWidth = window.innerWidth;
  //  console.log(this.innerWidth);
 }
  constructor(private myApi:MyApiService,private Router:Router ) { }

  ngOnInit() {
   this.subscription.add(this.myApi.pointofsale.subscribe(
      (result:PointOfsaleModule)=> {
        this.newPointofsale = result;
        this.subscription.add(this.myApi.getOffers(this.newPointofsale.country).subscribe(
          (result)=>{
              this.newOffers = result;
              // console.log(this.newOffers);
          }
        ))
      }
     ))

    $(document).ready(function(){
      $('.offerSlider').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        mobileFirst: true,
        responsive: [
        
          {
            breakpoint: 1024,
            settings: "unslick"
         },
         {
          breakpoint: 767,
          settings: {
            slidesToShow:2,
            slidesToScroll: 1
          }
        },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });

    })
  }

  firsti(){
   this.first=true;
  //  console.log(this.first);
  }
  firsto() {
    this.first=false;
    // console.log(this.first);
  }

  secondi() {
    this.second =true;
  }
  secondo() {
    this.second = false;
  }
  thirdi(){
    this.third = true ;
  }
  thirdo(){
    this.third = false ;
  }

  fourthi(){
    this.fourth = true;
  }
  fourtho(){
    this.fourth = false;
  }
  toOffers(i:number){
    this.Router.navigate(['/bestoffers',i,this.newPointofsale.country]);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
