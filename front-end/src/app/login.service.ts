import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  login(email, password){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");
    return this.http.post('/api/login', {email:email, password:password}, {headers:headers});
  }

  resendActivationLink(email){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");
    return this.http.post('/api/resend-validation', {email:email}, {headers:headers});
  }
}
