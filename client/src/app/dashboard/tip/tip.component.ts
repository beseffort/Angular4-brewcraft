import { Component, OnInit } from '@angular/core';
import { Article, SharedService } from '../../services';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css']
})
export class TipComponent implements OnInit {

  tip: Article;
  tipObservable: Observable<any>;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.tip = this.sharedService.getArticle();
    this.sharedService.articleChangeListner()
      .subscribe(article => {
        this.tip = article;
      })
  }
}
