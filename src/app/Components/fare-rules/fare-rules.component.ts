import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/Services/my-api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { FareRules } from 'src/app/interface/fare-rules';

@Component({
  selector: 'app-fare-rules',
  templateUrl: './fare-rules.component.html',
  styleUrls: ['./fare-rules.component.css']
})
export class FareRulesComponent implements OnInit {
 sid:string;
 sqn:number;
 fare:FareRules[];
  constructor(private Router:Router ,private myApi: MyApiService,private route: ActivatedRoute) { 
    this.sid = this.route.snapshot.params['sid'];
    this.sqn = this.route.snapshot.params['sequenceNum'];
  }

  ngOnInit() {
     this.myApi.fareRules(this.sid,this.sqn).subscribe(
       (result)=>{this.fare = result}
     );
     
     
  }
 
}
