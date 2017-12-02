import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = 'http://127.0.0.1:8080/'

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  login(email, password){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");
    return this.http.post('/api/login', {email:email, password:password}, {headers:headers});
  }
}
