import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationToHourMin'
})
export class DurationToHourMinPipe implements PipeTransform {

  transform(value: string): any {
    const duration = value.split(':');
    const hours = +duration[0] ;
    const minutes =  +duration[1];
    return hours + 'h ' + minutes + 'm';
  }

}
