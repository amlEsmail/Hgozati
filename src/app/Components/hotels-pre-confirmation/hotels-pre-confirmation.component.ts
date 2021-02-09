import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { MyApiService } from 'src/app/Services/my-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hotels-pre-confirmation',
  templateUrl: './hotels-pre-confirmation.component.html',
  styleUrls: ['./hotels-pre-confirmation.component.css']
})
export class HotelsPreConfirmationComponent implements OnInit,OnDestroy  {
    url:string ='';
    disabled: boolean = false;
    Loading:boolean = true;
    Failed:boolean=false;
    searchId:string='';
    HGNum:string='';
    tok:string='';
    posturl:string='';
    myresult:any;
    sc:string = '';
    lang:string ='';
    paymentError:string ='Something went wrong during payment our customer service will help you to complete your booking';
    paymentErrorStaus:boolean =false;
    normalError:string ='somthing went wrong please search again';
    private subscription:Subscription=new Subscription();
    normalErrorStatus:boolean = false;
  constructor( private myapi:MyApiService, private route:ActivatedRoute, private router:Router) {
    this.searchId = this.route.snapshot.queryParamMap.get('sid');
    this.HGNum =this.route.snapshot.queryParamMap.get('HG');
    this.tok =this.route.snapshot.queryParamMap.get('tok');
    this.sc = this.route.snapshot.queryParamMap.get('sc');
    this.lang =this.route.snapshot.queryParamMap.get('LangCode')
    this.url = this.router.url;
    let i = this.url.indexOf('?')+1
    this.url =this.url.slice(i);
    console.log(this.url);
   }

  ngOnInit() {
    this.subscription.add(this.myapi.getHPaymentResult(this.url).subscribe(
      (result)=>{
       this.myresult = result;
      debugger
      console.log(this.myresult);
    if (this.myresult.Status == 0){
    
      this.posturl = this.myresult.paymentResult.PostPayment;
      console.log("postUrl",this.posturl);
     this.subscription.add( this.myapi.PostProcessingH(this.HGNum,this.searchId,this.tok,this.posturl).subscribe(
        (result)=>{
          console.log("result-result",result.Status );
          debugger
          if(result.Status == 0 && this.sc != 'mob'){
            this.router.navigate(['/confirmation-hotel'],{ queryParams: {'sid':this.searchId,'HG':this.HGNum,'tok':this.tok} });
          }
           else if(result.Status == 1){
           this.normalErrorStatus = true;
           this.Loading =false ;
          }
          else if(result.Status == 2) {
            this.paymentErrorStaus=true;
            this.Loading =false ;
          }
        },
        (error)=>{this.normalErrorStatus = true;
          this.Loading =false ;
        console.log(error); }
        
      ));
      
      // this.router.navigate(['/confirmation-hotel'],{ queryParams: {'sid':this.searchId,'HG':this.HGNum,'tok':this.tok} });
    }
    else {
      this.normalErrorStatus = true;
      this.Loading =false ;
    }
  },
  (error)=>{
    this.normalErrorStatus =true;
    this.Loading =false ;
    console.log (error);
  }
    ));
  }

  


  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
