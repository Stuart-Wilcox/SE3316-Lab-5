import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ViewCollectionService {

  constructor(private http: HttpClient) { }

  getCollection(token, id){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.get(`/api/collections/${id}`, {headers:headers});
  }

}
