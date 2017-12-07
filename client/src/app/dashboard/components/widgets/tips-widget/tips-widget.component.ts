import { Component, OnInit } from '@angular/core';
import { WordpressService, Article, SharedService } from '../../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tips-widget',
  templateUrl: './tips-widget.component.html',
  styleUrls: ['./tips-widget.component.css']
})
export class TipsWidgetComponent implements OnInit {

  tips: Article[];

  constructor(
    private wordpressService: WordpressService,
    private sharedService: SharedService,
    private router: Router) { }

  ngOnInit() {
    this.getTips();
  }

  getTips() {
    this.wordpressService.getTips()
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
