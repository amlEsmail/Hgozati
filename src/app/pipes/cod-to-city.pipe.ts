import { Pipe, PipeTransform } from '@angular/core';
import { CitiesModule } from '../models/cities/cities.module';

@Pipe({
  name: 'codToCity'
})
export class CodToCityPipe implements PipeTransform {

  transform(value: string, args: CitiesModule[]): string {
    if (!value || !args) {
      return value;
    }
    else {
      
      for (let index = 0; index < args.length; index++) {
        let element: CitiesModule = args[index];
        let a = element.cityCode.toLowerCase();
       
        if (a == value.toLowerCase() ) {
          return element.cityName
        }

      }
      return value;
    }
  }

}
