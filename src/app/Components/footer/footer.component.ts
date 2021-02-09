import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  engisActive(){
    if(localStorage.getItem("lang")=="en"){
      return true
    }
    else{
      return false
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
