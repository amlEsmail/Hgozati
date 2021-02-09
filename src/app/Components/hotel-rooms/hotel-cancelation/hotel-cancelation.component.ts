import { Component, OnInit, Input } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hotel-cancelation',
  templateUrl: './hotel-cancelation.component.html',
  styleUrls: ['./hotel-cancelation.component.css']
})
export class HotelCancelationComponent implements OnInit {
  @Input() sid:any;
  @Input() hotelcode:any;
  @Input() roomIndex:any;
  @Input() Pid:any;
  cancel:Observable<Array<any>>;
  constructor(private myapi:MyApiService,public activeModal: NgbActiveModal) {
   
   }
   
  ngOnInit() {
    this.cancel= this.myapi.roomcancelation(this.sid,this.hotelcode,this.roomIndex,this.Pid)
    console.log(this.sid,this.hotelcode,this.roomIndex,this.Pid)
    console.log("cancelObj",this.cancel);
  }

}
