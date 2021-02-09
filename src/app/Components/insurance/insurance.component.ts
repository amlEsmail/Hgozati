import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
export interface insurance {
  'arrivalAirportCode':string,
  'departureAirportCode':string,
  'journeyIndex':any
  'prods':[
    {
      'benefitLink':any,
      'currency':any,
      'details':[
        {'item1':string},
        {'item2':string},
        {'item3':string},
        {'item4':string}
      ],
      'disclosure':any,
      'flag':boolean,
      'id':number,
      'optin':string,
      'optout':string,
      'productCode':string,
      'productcover':[
        {
          'amount':number,
          'currency':string,
          'header':string,
          'productcovercatergory':{
            'header':string,
            'ordervalue':number
          }
        }
      ]
    }
  ],
  'reqId':any,
  'session':any

}
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})

export class InsuranceComponent implements OnInit {
  @Output() insuranceUpdate:EventEmitter<number> = new EventEmitter();
  insuranceid:number;
  insuranceid1:number;
  @Input() insurance :insurance;
  constructor() { }

  ngOnInit() {
    console.log('insurance from inside',this.insurance)
  }
  updateInsurance(){
    this.insuranceUpdate.emit(this.insuranceid);
    console.log('your idea works',this.insuranceid);
  }

}
