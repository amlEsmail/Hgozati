import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-payment-erorr',
  templateUrl: './payment-erorr.component.html',
  styleUrls: ['./payment-erorr.component.css']
})
export class PaymentErorrComponent implements OnInit {
  @Input() paymentError:string;
  constructor() { }

  ngOnInit() {
  }

}
