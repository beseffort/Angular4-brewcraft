import { Component, OnInit } from '@angular/core';
import { WordpressService, Article, SharedService } from '../../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-widget',
  templateUrl: './blog-widget.component.html',
  styleUrls: ['./blog-widget.component.css']
})
export class BlogWidgetComponent implements OnInit {

  tips: Article[];

  constructor(
    private wordpressService: WordpressService,
    private sharedService: SharedService,
    private router: Router) { }

  ngOnInit() {
    this.getTips();
  }

  getTips() {
    this.wordpressService.getBlogs()
      .then(res => {
        if(res){
          this.tips = res.data;
        }
      });
  }

  showTip(tip: Article) {
    this.sharedService.setArticle(tip);
    this.router.navigate(['dashboard/tip']);
  }
}
