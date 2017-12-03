import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const API_URL = "https://images-api.nasa.gov";

@Injectable()
export class ViewImageService {

  constructor(private http: HttpClient) { }

  getAsset(image_id:string){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");

    return this.http.get(`${API_URL}/asset/${image_id}`, {headers:headers});
  }

  getMetadataUrl(image_id:string){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");

    return this.http.get(`${API_URL}/metadata/${image_id}`, {headers:headers});
  }

  getMetadata(url:string){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");

    return this.http.get(url, {headers:headers});
  }

}
