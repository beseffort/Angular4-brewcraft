import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONFIG } from '../common/config';

@Injectable()
export class WordpressService {

  constructor(
    private http: Http
  ) { }

  getTips() {
    var url = CONFIG.SERVER_URL + '/wordpress/get-by-slug/tips';
    
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }

  getBlogs() {
    var url = CONFIG.SERVER_URL + '/wordpress/get-by-slug/blogs';
    
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }
}

export class Article {
  date: Date;
  link: string;
  title: string;
  content: string;
  excerpt: string;
  featured_media: string;
}