import { Subscription, fromEvent } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';
import { ActivatedRoute ,Router} from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-pre-confirmation',
  templateUrl: './pre-confirmation.component.html',
  styleUrls: ['./pre-confirmation.component.css']
})
export class PreConfirmationComponent implements OnInit ,OnDestroy {
  url:string ='';
  Loading:boolean = true;
  Failed:boolean=false;
  searchId:string='';
  HGNum:string='';
  tok:string='';
  posturl:string='';
  myresult:any;
  sc:string = '';
  // somthing Went Wrong During Payment Our Customer Service will Help You to Complete Your Booking
  paymentError:string ='Somthing Went Wrong During Payment Our Customer Service will Help You to Complete Your Booking';
  paymentErrorStaus:boolean =false;
  normalError:string ='somthing went wrong please search again';
  normalErrorStatus:boolean = false;
  private subscription:Subscription=new Subscription();
  constructor( private myapi:MyApiService, private route:ActivatedRoute, private router:Router) { 
    fromEvent(window, 'popstate')
      .subscribe((e) => {
        
         return this.router.navigate(['/']);
        console.log(e, 'back button');
      });
  }

  ngOnInit() {
    
    this.searchId = this.route.snapshot.queryParamMap.get('sid');
    this.HGNum =this.route.snapshot.queryParamMap.get('HG');
    this.tok =this.route.snapshot.queryParamMap.get('tok');
    this.sc = this.route.snapshot.queryParamMap.get('sc');
    this.url = this.router.url;
    let i = this.url.indexOf('?')+1
    this.url =this.url.slice(i);
    console.log(this.url);
    this.subscription.add(this.myapi.getPaymentResult(this.url).subscribe(
      (result)=>{
       this.myresult = result;
      debugger
      console.log(this.myresult);
    if (this.myresult.Status == 0){
    
      this.posturl = this.myresult.paymentResult.PostPayment;
      console.log(this.posturl);
     this.subscription.add( this.myapi.PostProcessing(this.HGNum,this.searchId,this.tok,this.posturl).subscribe(
        (result)=>{
          debugger
          if(result.status == 0 && this.sc != 'mob'){
            this.router.navigate(['/confirmation'],{ queryParams: {'sid':this.searchId,'HG':this.HGNum,'tok':this.tok} });
          }
           else if(result.status == 1){
           this.normalErrorStatus = true;
           this.Loading =false ;
          }
          else if(result.status == 2) {
            this.paymentErrorStaus=true;
          }
        },
        (error)=>{this.normalErrorStatus = true;
        console.log(error); }
        
      ));
      
      //  this.router.navigate(['/confirmation'],{ queryParams: {'sid':this.searchId,'HG':this.HGNum,'tok':this.tok} });
    }
    else {
      this.normalErrorStatus = true;
    }
  },
  (error)=>{
    this.normalErrorStatus =true;
    console.log (error);
  }
    ));
  }



  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
