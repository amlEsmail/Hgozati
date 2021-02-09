import { Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-top-destination',
  templateUrl: './top-destination.component.html',
  styleUrls: ['./top-destination.component.css']
})
export class TopDestinationComponent implements OnInit {
 @Output() destSelected:EventEmitter<string> = new EventEmitter();
  innerWidth:any=500;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    // console.log(this.innerWidth);
  }
  constructor() { }
 
  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }
 selectcity(cit:string){
   console.log(cit);
  this.destSelected.emit(cit);
 }
}
