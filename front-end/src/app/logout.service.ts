import { Injectable } from '@angular/core';

@Injectable()
export class LogoutService {

  constructor() { }

  logout(){
    document.cookie = "token=";
  }

}
