
import { Component, OnInit } from '@angular/core';
import { MyApiService } from './Services/my-api.service';
import { CurruncyServiceService } from './Services/curruncy-service.service';
import { TranslateService} from '@ngx-translate/core';
import { PlatformLocation } from '@angular/common';
declare var $: any; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private myapi: MyApiService, private translate: TranslateService, private Curruncy:CurruncyServiceService,private location: PlatformLocation, ) {

   this.Curruncy.GetMyCurruncy();
    if(localStorage.getItem('lang')){
      this.translate.setDefaultLang(localStorage.getItem('lang'));
    }
    else {
      this.myapi.pointOfSale().subscribe(
      (result) => {
        if (result.languages.toLowerCase().indexOf('ar') !== -1) {

          this.translate.setDefaultLang('ar');

          localStorage.setItem("lang","ar");
          if(!$("link[href='../assets/rtlStyle.css']").length)
          {
            $('head').append('<link href="../assets/rtlStyle.css" rel="stylesheet" type="text/css">');
           
          }
          $('link[href="../assets/rtlStyle.css"]').prop('disabled', false);
          localStorage.setItem("lang",'ar');
        }
        else {
          this.translate.setDefaultLang('en');
          localStorage.setItem("lang",'en');
        };
        localStorage.setItem("country",result.country); 
      }
    )
    }
    
  }
  ngOnInit(){
   
  }
}
