import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ViewCollectionService {

  constructor(private http: HttpClient) { }

  removeCollection(token, collection_id){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.delete(`/api/collections/${collection_id}`, {headers:headers});
  }

  likeCollection(token, collection_id){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.post(`/api/collections/${collection_id}/upvote`, {}, {headers:headers});
  }

  getCollection(token, id){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.get(`/api/collections/${id}`, {headers:headers});
  }

  getPublicCollection(id){
    let headers = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.get(`/api/collections/public/${id}`, {headers:headers});
  }

  getUserCollections(token, user_id){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.get(`/api/${user_id}/collections`, {headers:headers});
  }

  getTopCollections(){
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");

    return this.http.get('/api/collections/top', {headers:headers});
  }

  getAllPublicCollections(token){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "*/*");

    return this.http.get('/api/collections/', {headers:headers});
  }

  addImageToCollection(token, collection_id, image_id){
    let headers = new HttpHeaders();
    headers = headers.append("Cookie", "token="+token);
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "*/*");

    return this.http.post(`/api/collections/${collection_id}`,{image_id:image_id}, {headers:headers});
  }
}
