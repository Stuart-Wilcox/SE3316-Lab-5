import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  loginErr: boolean;
  loginErrMsg: string;
  constructor(private loginService: LoginService, private router: Router) {
    this.loginErr = false;
    this.loginErrMsg = "";
  }

  validateInput(event, email, password){
    event.preventDefault();
    if(!email){
      this.loginErr = true;
      this.loginErrMsg = "Please enter your email.";
    }else if(!password){
      this.loginErr = true;
      this.loginErrMsg = "Please enter your password.";
    }else{
      this.loginService.login(email, password).subscribe(
        data =>{
          this.loginErr=false;this.loginErrMsg="";
          document.cookie = `token=${data['token']};path=/;`;
          let url = `/${data['id']}/dashboard`;
          //this.router.navigate([url]);
          window.location.href = url;
        },
        err =>{
          document.cookie = 'token=';
          if(err.error.message == "account locked"){
            this.loginErr =true;
            this.loginErrMsg = "Account has not yet been activated. Please activate before logging in.";
            return;
          }else if(err.error.message == "User not found"){
            this.loginErr=true;
            this.loginErrMsg = "No user exists with this name.";
            return;
          }else if(err.error.message == "Password is wrong"){
            this.loginErr=true;
            this.loginErrMsg = "Password is wrong";
            return;
          }else{
            console.log(err);
            this.loginErr = true;
            this.loginErrMsg = "Unspecified error occurred. Please see console."
            return;
          }
        }
      );
    }
  }

  ngOnInit() {
    document.cookie = 'token=';
  }

}
