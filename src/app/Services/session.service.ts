import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  sessionExpierd:EventEmitter<any> = new EventEmitter();
  expitationTime = 5;
  constructor() { }

  // timeLeft: number = 60;
  interval;
  
  setSessionTime(Stime:number){
    let time:string = Stime.toString();
    sessionStorage.clear();
    clearInterval(this.interval);
    sessionStorage.setItem('Timeleft',time);
  }
  startTimer() {
      
      this.interval = setInterval(() => {
        let time:number = +sessionStorage.getItem('Timeleft');
        if(time && time > 0) {
         time--;
         sessionStorage.setItem('Timeleft',time.toString())
        } else {
          this.sessionExpierd.emit(true);
          sessionStorage.removeItem('Timeleft');
          sessionStorage.clear();
          clearInterval(this.interval);
          this.interval
          return;
        }
      },60000)
    }

  startsession() {
    sessionStorage.setItem('status','Valid');
    setTimeout(() => {
      console.log('timeOut');
      sessionStorage.setItem('status','Invalid');
      this.sessionExpierd.emit(true);
    }, 60000);
   
  }
}
