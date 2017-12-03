import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUserData(token){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.get<{name: string, id:string, email:string}>('/api/profile/', {headers: headers})
  }

  getUserCollection(token, id){
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");
    headers = headers.append("Cookie", "token="+token);

    return this.http.get(`/api/${id}/collections/`, {headers:headers});
  }

}
