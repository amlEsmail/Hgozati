import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/Services/my-api.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
 loginform:FormGroup;

  constructor(private myapi:MyApiService) { }

  ngOnInit() {
    this.loginform = new FormGroup({
      'email': new FormControl('',[Validators.email,Validators.minLength(8),Validators.required]),
      'passWord': new FormControl('',[Validators.required,Validators.minLength(8)])
    })
  }
  onSubmit() {
     console.log(this.loginform)
       this.myapi.login(this.loginform.value).subscribe(
         (result)=>{console.log(result);
        sessionStorage.setItem('user',JSON.stringify(result))}
       );
    
 }
}
