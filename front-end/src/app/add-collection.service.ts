import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AddCollectionService {

  constructor(private http: HttpClient) { }

  addCollection(token, name, description, visibility){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");
    headers.append("Cookie", "token="+token);

    return this.http.post("/api/collections/", {name:name, description:description, visibility:visibility}, {headers:headers});
  }

}
