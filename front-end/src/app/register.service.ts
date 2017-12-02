import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RegisterService {

  constructor(private http: HttpClient) {}

  register(name, email, password){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");
    return this.http.post("/api/register", {name:name, email:email, password:password}, {headers:headers});
  }

}
