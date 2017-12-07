import { Injectable } from '@angular/core';
import { User, Article } from './index';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import * as firebase from "firebase";

@Injectable()
export class SharedService {

    private articleSubject = new Subject<Article>();
    private isNewPost = new Subject<any>();
    private isGuildDetailPage = new Subject<any>();

    constructor() {
    }

    setUser(user: User) {
        delete user.password;
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getUser(): User {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    getUserUid() {
        return JSON.parse(localStorage.getItem('currentUser')).uid;
    }

    incRetry() {
        var retry = localStorage.getItem('retry');
        if (retry == null) {
            localStorage.setItem('retry', '1');
        } else {
            localStorage.setItem('retry', (Number.parseInt(retry) + 1).toString());
        }
    }
    getRetry() {
        return Number.parseInt(localStorage.getItem('retry'));
    }

    setArticle(article: Article) {
        localStorage.setItem('article', JSON.stringify(article));
        this.articleSubject.next(article);
    }

    getArticle(): Article {
        return JSON.parse(localStorage.getItem('article'));
    }
    articleChangeListner(): Observable<Article> {
        return this.articleSubject.asObservable();
    }
    setPostChange(){
      this.isNewPost.next("added");
    }
    postChangeListener() : Observable<any>{
      return this.isNewPost.asObservable();
    }
    
    setListenerGuildDetailPage(data){
      this.isGuildDetailPage.next(data);
    }
    
    getListernerGuildDetailPage() : Observable<any>{
      return this.isGuildDetailPage.asObservable();
    }
}
