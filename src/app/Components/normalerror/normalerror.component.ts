import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-normalerror',
  templateUrl: './normalerror.component.html',
  styleUrls: ['./normalerror.component.css']
})
export class NormalerrorComponent implements OnInit {
 @Input() normalError:string= "Something went wrong please search again"
  constructor() { }

  ngOnInit() {
  }

}
