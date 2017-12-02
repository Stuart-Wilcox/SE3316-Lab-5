import { Component, OnInit } from '@angular/core';
import { RegisterService } from "../register.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {
  registered: boolean;
  err: boolean;
  errMsg: string;
  activationUrl: string;

  constructor(private registerService: RegisterService) {
    this.registered = false;
    this.err = false;
    this.errMsg = "";
    this.activationUrl = "";
  }

  ngOnInit() {
  }

  validateInput(event, name, email, password, password2){
    event.preventDefault();
    if(!name){
      this.err = true;
      this.errMsg = "Please enter name.";
    }else if(!email){
      this.err = true;
      this.errMsg = "Please enter email.";
    }else if(!password){
      this.err=true;
      this.errMsg = "Please enter password";
    }else if(password.length < 6){
      this.err = true;
      this.errMsg = "Passwords must be at least 6 chacters long";
    }else if(password != password2){
      this.err = true;
      this.errMsg = "Passwords do not match.";
    }else{
      this.err=false;
      this.errMsg = "";
    }

    this.registerService.register(name, email, password).subscribe(
      data=>{
        this.registered = true;
        this.activationUrl = data['url'];
      },
      err=> {
        console.log(err.error.message);
        if(err.error.message.indexOf("duplicate key") != -1){
          this.err = true;
          this.errMsg = "An account already exists with that email.";
        }
      }
    );
  }

}
