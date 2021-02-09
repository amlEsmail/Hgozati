import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyApiService } from 'src/app/Services/my-api.service';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {
 signupform:FormGroup
  constructor(private myapi:MyApiService) { }
  
  ngOnInit() {
    this.signupform = new FormGroup({
    'Isbase':new FormControl(1),
    'Email': new FormControl('',[Validators.email,Validators.minLength(8),Validators.required]),
    'Password': new FormControl('',[Validators.required,Validators.minLength(8)]),
    'UserName': new FormControl(''),
    'ImageURL': new FormControl(''),
    'PhoneNumber': new FormControl('',[Validators.required,Validators.minLength(5)]),
    'ConfirmPassword': new FormControl('',[Validators.required,Validators.minLength(8)]),
    'User_Name': new FormControl ('')
  })
  }
  onSubmit() {
    console.log(this.signupform)
      this.myapi.signup(this.signupform.value).subscribe(
        (result)=>{console.log(result);}
      );
   
}
}
