import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';

@Component({
  selector: 'app-upcoming-ahistory',
  templateUrl: './upcoming-ahistory.component.html',
  styleUrls: ['./upcoming-ahistory.component.css']
})
export class UpcomingAhistoryComponent implements OnInit {
  panelOpenState = false;
  upcomingl:number = 0;
  user :object;

  constructor(private myapi:MyApiService) { 
   this.user =  JSON.parse(sessionStorage.getItem('user'));
   console.log(this.user);
  }

  ngOnInit() {
      this.myapi.UpcomingAndHistory(this.user['applicationUser']['Email']).subscribe(
        (result)=>{
          console.log(result);
        }
      )
  }

}
