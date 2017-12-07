import { Component, OnInit  } from '@angular/core';
import { Router, NavigationEnd , ActivatedRoute } from '@angular/router';
import { GuildService , SharedService } from '../../../services';
import * as firebase from 'firebase';
declare var $ : any;

@Component({
  selector: 'app-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./../guild.component.css']
})
export class HashtagComponent implements OnInit {
  db : any;
  posts : any = [];
  tag : string;
  type : string;
  guildID : string;
  chats:any = [];
  
  constructor(public router: Router, private guildService : GuildService , 
    private activatedRoute: ActivatedRoute,
    private sharedService : SharedService ) {
     this.db = firebase.database();
  }

  ngOnInit() {
    $('body').addClass('loader');
    this.activatedRoute.params
    .subscribe(
      data => {
        $('body').addClass('loader');
        var userId = this.sharedService.getUserUid();
        this.type = data.type;
        this.tag = "#"+data.tag;
        this.guildID = data.guildID;
        
        // if post type
        if(this.type == 'post'){
          var postRef = this.db.ref('posts/');
          postRef.on('value', (snapshot) => {
              var posts_val = snapshot.val();
              this.posts = [];
              for (var key in posts_val) {
                  if (posts_val.hasOwnProperty(key)) {
                      var element = posts_val[key];
                      if (element.content.indexOf(this.tag) != -1){
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
              $('body').removeClass('loader');
          })
        }else if(this.type == 'chat'){
          console.log(this.guildID);
          var postRef = this.db.ref('chats/guild/'+this.guildID);
          postRef.on('value', (snapshot) => {
              var posts_val = snapshot.val();
              console.log(posts_val);
              this.posts = [];
              for (var key in posts_val) {
                  if (posts_val.hasOwnProperty(key)) {
                      var element = posts_val[key];
                      if (element.message.indexOf(this.tag) != -1){
                          if(element.likedUsers != undefined && element.likedUsers.indexOf(userId) != -1){
                            element.isLike = true;
                          }else{
                            element.isLike = false;
                          }
                          // get user level 
                          this.db.ref('users/'+element.senderID).on('value' , (snapshot) => {
                            var currentUser = snapshot.val();
                            element.profileUrl = "/assets/img/Avatar/Avatar_Level_"+(currentUser.level==undefined?1:currentUser.level) + ".png";
                            this.posts.push(element);
                          })
                      }
                  }
              }
              $('body').removeClass('loader');
          })
        }

      },
      error => { 
        console.log(error);
        $('body').removeClass('loader');
      }
    )
  }
  
  
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
  
  likeMsg(uid){
    $("body").addClass('loader');
    
    var userId = this.sharedService.getUserUid();
    if(this.type == 'chat'){
      var recordRef = this.db.ref('chats/guild/'+this.guildID+'/'+uid);
    }else if(this.type == 'post'){
      var recordRef = this.db.ref('posts/'+uid);
    }else{
      return;
    }
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
    
    if(this.type == 'chat'){
      var recordRef = this.db.ref('chats/guild/'+this.guildID+'/'+uid);
    }else if(this.type == 'post'){
      var recordRef = this.db.ref('posts/'+uid);
    }else{
      return;
    }
    
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