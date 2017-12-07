import { Component, OnInit, Input, Output, EventEmitter , ElementRef , ViewChild , AfterViewChecked} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as firebase from 'firebase';
import { Post , SharedService } from '../../../services';
declare var $ : any;

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css', '../../home/home.component.css']
})

export class PostComponent implements OnInit{
   // @Input() posts: Post[];
    //@Output() loadmore = new EventEmitter();

    db: firebase.database.Database;
    postRef: firebase.database.Reference;
    maxPosts: number = 4;
    posts: Post[];
    @ViewChild('content') content : ElementRef;    
    tmp = 0;
    isPost : any;
    
    constructor(private sanitizer: DomSanitizer , private sharedService : SharedService){
        this.db = firebase.database();
    }
    ngOnInit(){
        this.posts = [];
        this.getPosts();
    }
    
    loadMorepost() {
        this.maxPosts += 4;
        this.getPosts();
    }
    // loadMorepost(){
    //     this.loadmore.emit();
    // }
    getTimeDiff(date: Date) {
       let today = new Date(),
         diffMs = (today.getTime() - new Date(date).getTime()), // milliseconds between now & Christmas

         diffDays = Math.floor(diffMs / 86400000), // days
         diffHrs = Math.floor((diffMs % 86400000) / 3600000), // hours
         diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        if (diffDays != 0)
            return diffDays + ' days ago';
        if (diffHrs != 0)
            return diffHrs + ' hours ago';
        if (diffMins != 0)
            return diffMins + ' mins ago';
        else
            return Math.floor(diffMs / 1000) + ' secs ago';
    }

    getPosts(){
        var userId = this.sharedService.getUserUid();
        this.postRef = this.db.ref('posts');
        this.postRef.limitToFirst(+this.maxPosts).on('value', (snapshot) => {
            if(snapshot.val() == null)
                return;
            let count = 0;
            this.posts = [];
            for (let key in snapshot.val()) {
                if (snapshot.val().hasOwnProperty(key)) {
                    let element = snapshot.val()[key];
                    count++;
                    // if (element.mediaType == 'video') {
                    //     element.url = this.sanitizer.bypassSecurityTrustResourceUrl(element.url + '?controls=0');
                    // }
                    if(count > this.posts.length){
                      element.key = key;
                      if(element.likedUsers != undefined && element.likedUsers.indexOf(userId) != -1){
                        element.isLike = true;
                      }else{
                        element.isLike = false;
                      }
                      // get user level 
                      this.db.ref('users/'+element.writerUid).on('value' , (snapshot) => {
                        var currentUser = snapshot.val();
                        element.profileUrl = "/assets/img/Avatar/Avatar_Level_"+(currentUser.level==undefined?1:currentUser.level) + ".png";
                        this.posts.push(element);
                      })
                    }
                }
            }
            if(this.tmp == this.posts.length){
              this.isPost = false;
            }else{
              this.isPost = true;
            }
            this.tmp = this.posts.length
        });
    }
    
    likeMsg(uid){
      $("body").addClass('loader');
      
      var userId = this.sharedService.getUserUid();
      var recordRef = this.db.ref('posts/'+uid);
      recordRef.once('value' , (snapshot) => {
        $("body").removeClass('loader');
        var alreadyLiked = false;
        var record = snapshot.val();
        
        if(record.likedUsers == null){
          record.likedUsers = []; 
        }else{
          for(let likedUser of record.likedUsers){
            if(likedUser == userId){
              alreadyLiked = true;
            }
          }
        }
        
        if(alreadyLiked == false){
          record.likedUsers.push(userId);
          recordRef.update(record);
        }
        
      })
      
    }
    
    UnlikeMsg(uid){
      $("body").addClass('loader');
      
      var userId = this.sharedService.getUserUid();
      var recordRef = this.db.ref('posts/'+uid);
      recordRef.once('value' , (snapshot) => {
        $("body").removeClass('loader');
        var record = snapshot.val();
        
        var pos;
        while ((pos = record.likedUsers.indexOf(userId)) > -1) {
            record.likedUsers.splice(pos, 1);
        }
  
        recordRef.update(record);
        
      })
    }

}