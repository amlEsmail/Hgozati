import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { CurrencyModule } from 'src/app/models/currency/currency.module';
import { MyApiService } from 'src/app/Services/my-api.service';
import {TranslateService} from '@ngx-translate/core';
import { PointOfsaleModule } from 'src/app/models/point-ofsale/point-ofsale.module';
import { CurruncyServiceService } from 'src/app/Services/curruncy-service.service';
declare var $: any;

@Component({
  selector: 'header',
  templateUrl: './headder.component.html',
  styleUrls: ['./headder.component.css']
})
export class HeadderComponent implements OnInit ,OnDestroy {
 @Input() disable:boolean = false;
 pointofSale:PointOfsaleModule;
 flags: CurrencyModule[] = [];
//  defultCuruncy:CurrencyModule = new CurrencyModule(4027,'AED','United Arab Emirates dirham','True','http://46.166.160.65:7095/Content/Currencies/AED.JPG',1);
 defultCuruncy:CurrencyModule = this.curruncy.currentCurruncy;
 currencyValue:any;
 private subscription:Subscription=new Subscription();
  ngOnInit() {
    this.flags = this.curruncy.curruncyArray;
    // this.myapi.currencyApi('AED').subscribe(
    //   (res)=>{ this.flags =res
    //   ,console.log(this.flags)},
    //   (error)=>{console.log(error)}
    // );
    this.curruncy.CurruncyArrayupdate.subscribe(
      (result)=>{this.flags = result}
    )

    this.curruncey.valueChanges.subscribe(
      (value)=>{this.curruncy.ChangeMyCurruncy(value,value.rate)}
    )
   if(localStorage.getItem("country")){
    this.subscription.add(this.myapi.pointofsale.subscribe(
      (result:PointOfsaleModule)=> {this.pointofSale=result;
        // this.flags.forEach(element => {
        //   if (element.Currency_Code == this.pointofSale.currency){
        //     this.defultCuruncy = element;
        //     this.curruncey.setValue(this.defultCuruncy);
        //     this.curruncey.updateValueAndValidity();
        //   }
        // });
        
      }
    ));
   }
    
    console.log(this.translate.currentLang)
   if (this.translate.currentLang == 'ar' || localStorage.getItem('lang')== 'ar'){
     
    this.switchtoAr();
   }
   
  }
  curruncey = new FormControl(this.defultCuruncy);
  
  filterCurrencies: Observable<CurrencyModule[]>;

  


  constructor(private myapi:MyApiService, private translate:TranslateService , private curruncy:CurruncyServiceService) {
    this.defultCuruncy = curruncy.currentCurruncy =  this.curruncy.currentCurruncy;
    this.filterCurrencies = this.curruncey.valueChanges
      .pipe(
        startWith(''),
        map(flags => this.flags ? this._filterCurrencies(flags) : this.flags.slice())
      );
     
  }

  private _filterCurrencies(value: string): CurrencyModule[] {
    
    const filterValue = value.toLowerCase();
    return this.flags.filter(flag => flag.Currency_Name.toLowerCase().indexOf(filterValue) === 0);
  
  }

  switchtoEn() {
    this.translate.use('en');
    localStorage.setItem('lang','en');
    $('link[href="../assets/rtlStyle.css"]').prop('disabled', true);
  }
  
  switchtoAr(){
    debugger;
    this.translate.use('ar');
    localStorage.setItem('lang','ar');
    // append urlstyle  arabic 
    // let arabicstyle='<link href="../assets/rtlStyle.css" rel="stylesheet" type="text/css">';
    if(!$("link[href='../assets/rtlStyle.css']").length)
    {
      $('head').append('<link href="../assets/rtlStyle.css" rel="stylesheet" type="text/css">');
     
    }
    $('link[href="../assets/rtlStyle.css"]').prop('disabled', false);
  
  
   
  }

//  selectLanguage(str){
//     if(str=='ar'){
//      $('head').append('<link rel="stylesheet" href="../assets/CSS_Ar/style_Ar.css" type="text/css" >');
//     }
//     else
//     if(str=='en'){
//      $('link[href="../assets/CSS_Ar/style_Ar.css"]').prop('disabled', true);
//     }
//    return this.translateService.selectLanguage(str);
//  }



engisActive(){
  if(localStorage.getItem('lang')=='en')
  {
    return true;
  }
  else
  {
    return false
  }
  // if(this.translate.currentLang == 'en'){
  
  //   return true
  // }
  // else {
  
  //   return false
  // }
}

  // unsubscribe
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }




  hideOther(){

    if($(".dropdown-menu.Language").hasClass('show')){
      $(".dropdown-menu.Language").removeClass('show');
    } 
   }
 
 
}
