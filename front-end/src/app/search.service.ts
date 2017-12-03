import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = "https://images-api.nasa.gov/search?q=";

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) {

  }

  search(query){
    let headers = new HttpHeaders();
    headers.append("Accept", "*/*");

    return this.http.get(API_URL+query, {headers:headers});
  }

}
