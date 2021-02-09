import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackdetectService {
  backOrForword:EventEmitter<any> = new EventEmitter();
  constructor() { }
  interval;
  startTimer() {
      
    this.interval = setInterval(() => {
      this.backOrForword.emit(true);
    },1000)
  }

}
