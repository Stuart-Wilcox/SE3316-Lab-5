import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ActivateService {

  constructor(private http: HttpClient) { }

  activate(id:string){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");
    return this.http.get(`/api/accounts/activate/${id}`, {headers:headers});
  }

}
