import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {

  transform(value: any[], args: number):any[] {
    if(!value || !args) {
      return value;
  }else {
    if(value.length > args){
      return value.slice(0,args);
    }
    else{
      return value
    }
  }
    }
    

}
