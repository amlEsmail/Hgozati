import { Injectable, EventEmitter } from '@angular/core';
import { MyApiService } from './my-api.service';
import { CurrencyModule } from '../models/currency/currency.module';

@Injectable({
  providedIn: 'root'
})
export class CurruncyServiceService {
 curruncyArray:CurrencyModule[] =[];
 currentCurruncy:CurrencyModule = new CurrencyModule(4027,'AED','United Arab Emirates dirham','True','http://46.166.160.65:7095/Content/Currencies/AED.JPG',1);
 currentRate:number = 1;
 baseCurruncy:string = 'AED';
 CurruncyChange:EventEmitter<CurrencyModule> = new EventEmitter();
 CurruncyArrayupdate:EventEmitter<CurrencyModule[]> = new EventEmitter();
//  BaseCurruncyChange:EventEmitter<string> = new EventEmitter();
 constructor(private myApi: MyApiService) { 
   
  }
  // call curruncy api
  GetMyCurruncy(){
    this.myApi.currencyApi(this.baseCurruncy).subscribe(
      (result)=>{this.curruncyArray=result;console.log(this.curruncyArray,"hollay");this.CurruncyArrayupdate.emit(this.curruncyArray)},
      (error)=>{console.log(error)},
    )
  }
  // change currency and emit currency event
  ChangeMyCurruncy(currency:CurrencyModule,rate:number){
   this.currentCurruncy = currency;
   this.currentRate = rate;
   this.CurruncyChange.emit(this.currentCurruncy);
   console.log(this.currentCurruncy,this.currentRate);
  }

   
 
}
