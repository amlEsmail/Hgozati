import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { CurruncyServiceService } from '../Services/curruncy-service.service';


@Pipe({
  name: 'exchange',
  pure:false
})
export class ExchangePipe implements PipeTransform {
  constructor(private curruncy:CurruncyServiceService){

  }

  transform(value: any, args?: any): any {
    if(!value || !args) {
      return value;
    }
    else {
      if(args == "value") {
        let total = value * this.curruncy.currentRate ;
        return parseFloat((Math.round(total*100)/100).toFixed(2));
      }
      if(args == "code") {
        return this.curruncy.currentCurruncy.Currency_Code;
      }
    }

  }
  

}

