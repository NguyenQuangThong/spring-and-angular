import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private readonly http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    // Service + HTTP call:
    // HttpClient.get<T>() tra ve Observable<T>, khong phai data ngay lap tuc.
    // HTTP chi that su chay khi co noi subscribe, vi Observable la "lazy".
    return this.http.get<Post[]>(this.apiUrl);
  }
}
