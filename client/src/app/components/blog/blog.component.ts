import { Component, OnInit } from '@angular/core';
import {WordpressService, Article} from '../../services';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  tips: Article[];

  constructor(
    private wordpressService: WordpressService
  ) { }

  ngOnInit() {
    this.getBlogs();
  }

  getBlogs() {
    this.wordpressService.getBlogs()
      .then(res => {
        this.tips = res.data;
      });
  }
}
