import { Component, OnInit, Input } from '@angular/core';
import { FlightSearchResult } from 'src/app/flight-search-result';

@Component({
  selector: 'app-multi-result-card',
  templateUrl: './multi-result-card.component.html',
  styleUrls: ['./multi-result-card.component.css']
})
export class MultiResultCardComponent implements OnInit {
  @Input() orgnizedResponce:any[];
  @Input() response:FlightSearchResult;
  constructor() { }

  ngOnInit() {
  }

}
