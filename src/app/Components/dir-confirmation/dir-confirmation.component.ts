import { Subscription, fromEvent } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';
import { ActivatedRoute ,Router} from '@angular/router';

@Component({
  selector: 'app-dir-confirmation',
  templateUrl: './dir-confirmation.component.html',
  styleUrls: ['./dir-confirmation.component.css']
})
export class DirConfirmationComponent implements OnInit ,OnDestroy{

  url:string ='';
  // Loading:boolean = true;
  Failed:boolean=false;
  searchId:string='';
  HGNum:string='';
  tok:string='';
  posturl:string='';
  myresult:any;
  sc:string = '';
  paymentError:string ='Somthing Went Wrong During Payment Our Customer Service will Help You to Complete Your Booking';
  paymentErrorStaus:boolean =false;
  normalError:string ='somthing went wrong please search again';
  normalErrorStatus:boolean = false;
  showConfirm:boolean=false;
  showFailed:boolean=false;
  showsucess:boolean=false;
  showError:boolean=false;

  private subscription:Subscription=new Subscription();
  constructor( private myapi:MyApiService, private route:ActivatedRoute, private router:Router) { 

  }

  ngOnInit() {
    
    this.searchId = this.route.snapshot.queryParamMap.get('SID');
    this.HGNum =this.route.snapshot.queryParamMap.get('HG');
    this.tok =this.route.snapshot.queryParamMap.get('tok');
    this.sc = this.route.snapshot.queryParamMap.get('sc');
    this.url = this.router.url;
    let i = this.url.indexOf('?')+1
    this.url =this.url.slice(i);
      //  call directpayment api
      this.subscription.add(this.myapi.getDirectPayment(this.searchId,this.tok,this.HGNum).subscribe(
      (result)=>{
        console.log("directPay",result)
      }
    ));
    console.log(this.url);
    this.subscription.add(this.myapi.getPaymentResult(this.url).subscribe(
      (result)=>{
       this.myresult = result;

      // debugger
      console.log(this.myresult);
    if (this.myresult.Status == 0){
      debugger
      if(this.myresult.paymentResult.PaymentOutput.toLocaleLowerCase() === "success")
      {

        if(this.myresult.paymentResult.FraudOutput.toLocaleLowerCase() === "approved"){
          // show paymentSuccess 
          this.showsucess=true;
          this.showFailed=false;
          this.showConfirm=false;
          this.showError=false;
        }
        if(this.myresult.paymentResult.FraudOutput.toLocaleLowerCase() === "suspected" || this.myresult.paymentResult.FraudOutput.toLocaleLowerCase() === "refused"  ){
         // show paymentconfirm
         this.showsucess=false;
         this.showFailed=false;
         this.showConfirm=true;
         this.showError=false;

        }
      }
      else
      {

        // show paymentFailed 
        this.showsucess=false;
         this.showConfirm=false;
         this.showFailed=true;
         this.showError=false;

      }


  
   

    }

   else{

    // this.normalErrorStatus = true;
    this.showError=true;
    this.showsucess=false;
    this.showConfirm=false;
    this.showFailed=false;
   }

  },
  (error)=>{

    // this.normalErrorStatus =true;
    this.showError=true;
    this.showsucess=false;
    this.showConfirm=false;
    this.showFailed=false;
    console.log (error);
  }
    ));
  }



  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
