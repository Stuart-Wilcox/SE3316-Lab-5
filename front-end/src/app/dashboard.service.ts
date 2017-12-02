import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = 'http://127.0.0.1:8080/'

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUserData(token){
    let headers = new HttpHeaders();
    headers = headers.append("Cookies", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.get<{name: string, id:string, email:string}>('/api/profile/', {headers: headers})
  }

}
