import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourminute'
})
export class HourMinutePipe implements PipeTransform {

  transform(value: number): string {
    const hours = value / 60 | 0 ;
    const minutes =  value % 60 | 0;
    return hours + 'h ' + minutes + 'm';
  }

}
