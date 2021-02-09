import { Pipe, PipeTransform } from '@angular/core';
import { CitiesModule } from '../models/cities/cities.module';
//this pipe take an argument as the input and return a filterd array wich include the search input
@Pipe({
  name: 'filterCity'
})
export class FilterCityPipe implements PipeTransform {

  transform(value: CitiesModule[], args: string): CitiesModule[] {
    if (!value || !args) {
      return [];
    }
    else {
      if(args.length< 3){
        return [];
       }
      let result: CitiesModule[] = []
      for (let index = 0; index < value.length; index++) {
        let element: CitiesModule = value[index];
        let a = element.cityName.toLowerCase();
        let b = element.airportCode.toLowerCase();
        let c = element.airportName.toLowerCase();
        if (a.indexOf(args.toLowerCase()) != -1 || b.indexOf(args.toLowerCase()) != -1 || c.indexOf(args.toLowerCase()) != -1) {
          result.push(element);
        }

      }
      return result;
    }
    //   return value.filter ((city)=>{city.cityName.toLowerCase().indexOf(args.toLowerCase()) != -1||
    //     city.airportName.toLowerCase().indexOf(args.toLowerCase()) != -1||
    //     city.cityName.toLowerCase().indexOf(args.toLowerCase()) != -1})
  }

}
