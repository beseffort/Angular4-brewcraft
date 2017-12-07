import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONFIG } from '../common/config';
import { User } from './index';

@Injectable()
export class PostService {

  constructor(private http: Http) { }

  post(writer: User, content: string, type: string = "none", url: string = ""):Promise<any> {
    let post = new Post();
    post.writerName = writer.fullname;
    post.writerUid = writer.uid;
    post.date = new Date();
    post.content = content;
    post.mediaType = type;
    post.url = url;

    let request_url = CONFIG.SERVER_URL + '/posts/add';
    return this.http.post(request_url, post)
      .toPromise()
      .then(res => {
        return res.json();
      });
  }

  getPosts(max):Promise<any> {
    let url = CONFIG.SERVER_URL + '/posts/get/' + max;
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }
}

export class Post {
  writerName: string;
  writerUid: string;
  date: Date;
  content: string;
  mediaType: string; // "none", "photo", "video"
  url: any;
}
