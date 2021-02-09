import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {
  @ViewChild('Cf') cf: ElementRef;
  @ViewChild('Unsubscribing') unsubscribing: ElementRef;
  @ViewChild('FS') fs: ElementRef;
  @ViewChild('IA')ia: ElementRef;
  @ViewChild('Cookies')cookies: ElementRef;
  @ViewChild('WYS')wys: ElementRef;
  constructor() { }
  scroll(elem:ElementRef) {
    elem.nativeElement.scrollIntoView();
  }
  ngOnInit() {
  }

}
