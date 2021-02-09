import { Pipe, PipeTransform } from '@angular/core';
import { CountriescodeModule } from '../models/countriescode/countriescode.module';

@Pipe({
  name: 'councode'
})
export class CouncodePipe implements PipeTransform {
  transform(value: CountriescodeModule[], args: string): CountriescodeModule[] {
    if (!value || !args) {
      return [];
    }
    else {
      if(args.length< 3){
        return [];
       }
      let result: CountriescodeModule[] = []
      for (let index = 0; index < value.length; index++) {
        let element: CountriescodeModule = value[index];
        let a = element.countryName.toLowerCase();
       
        if (a.indexOf(args.toLowerCase()) != -1 ) {
          result.push(element);
        }

      }
      return result;
    }
  }

}
