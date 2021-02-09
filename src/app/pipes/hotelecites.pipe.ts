import { Pipe, PipeTransform } from '@angular/core';
import { HotelsCitiesModule } from '../models/hotels-cities/hotels-cities.module';

@Pipe({
  name: 'hotelecites'
})
export class HotelecitesPipe implements PipeTransform {

  transform(value: HotelsCitiesModule[], args: string): HotelsCitiesModule[] {
    if (!value || !args) {
      return [];
    }
    else {
      if(args.length< 3){
       return [];
      }
      let result: HotelsCitiesModule[] = []
      for (let index = 0; index < value.length; index++) {
        let element: HotelsCitiesModule = value[index];
        let a = element.City.toLowerCase();
        let b = element.Country.toLowerCase();
        if (a.indexOf(args.toLowerCase()) != -1 || b.indexOf(args.toLowerCase()) != -1  ) {
          result.push(element);
        }

      }
      return result;
    }
  }

}
