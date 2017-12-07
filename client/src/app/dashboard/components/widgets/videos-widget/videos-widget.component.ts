import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Post, PostService, User, AuthService, SharedService } from '../../../../services';
import * as firebase from 'firebase';
import { Http } from '@angular/http';

@Component({
  selector: 'app-videos-widget',
  templateUrl: './videos-widget.component.html',
  styleUrls: ['./videos-widget.component.css']
})
export class VideosWidgetComponent implements OnInit {

  db: firebase.database.Database;
  postRef: firebase.database.Reference;
  videoUrl: any = null;

  constructor(
    private sanitizer: DomSanitizer , private http: Http) {
    this.db = firebase.database();
  }

  ngOnInit() {
    var url = "https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=UCzrSfJztggg8KhgBgNILORg&maxResults=50&key=AIzaSyDupDIhmOslEkijKY3crKuAts9w0P1zJ2k";
    return this.http.get(url).toPromise().then(res => {
      //console.log(res.json());
      if(res.json().items.length > 0){
        var random_number = this.randomIntFromInterval(0, 49);
        var videoId = res.json().items[random_number].id.videoId;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+videoId+"?controls=1");
      }
    })
    
    //load(); earlier code
  }
  
  randomIntFromInterval(min,max)
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }
  
  load(){
    // this.postRef = this.db.ref('posts');
    // var self = this;
    // 
    // this.postRef.orderByChild('mediaType').equalTo('video').limitToFirst(1).once('value', (snapshot) => {
    //   if (snapshot.val() == null)
    //     return;
    //     console.log(snapshot.val());
    //   let count = 0;
    //   let url;
    //   for (var key in snapshot.val()) {
    //     if (snapshot.val().hasOwnProperty(key)) {
    //       url = snapshot.val()[key].url;
    //       this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '?controls=1');
    //     }
    //   }
    // })
  }
}
