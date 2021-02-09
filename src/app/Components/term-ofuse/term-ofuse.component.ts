import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-term-ofuse',
  templateUrl: './term-ofuse.component.html',
  styleUrls: ['./term-ofuse.component.css']
})
export class TermOfuseComponent implements OnInit {
  @ViewChild('Cf') cf: ElementRef;
  @ViewChild('Age') age: ElementRef;
  @ViewChild('General') general: ElementRef;
  @ViewChild('Sos') sos: ElementRef;
  @ViewChild('PD') pd: ElementRef;
  @ViewChild('Payment') payment: ElementRef;
  @ViewChild('DS') ds: ElementRef;
  @ViewChild('CTB') ctb: ElementRef;
  @ViewChild('RUC') ruc: ElementRef;
  @ViewChild('SI') si: ElementRef;
  @ViewChild('Liability') liability: ElementRef;
  @ViewChild('Insurance') insurance: ElementRef;
  @ViewChild('BF') bf: ElementRef;
  @ViewChild('Tax') tax: ElementRef;
  @ViewChild('Copyright') copyright: ElementRef;
  @ViewChild('Competitions') competitions: ElementRef;
  @ViewChild('General1') general1: ElementRef;
  @ViewChild('Fairness') fairness: ElementRef;
  constructor() { }

  ngOnInit() {
  }
scroll(elem:ElementRef) {
  elem.nativeElement.scrollIntoView();
}
}
