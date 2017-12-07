import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatService, Chat, User, AuthService , Post, SharedService , PostService } from '../../../services';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as firebase from "firebase";
import { ActivatedRoute , Router } from '@angular/router';
declare var $ : any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css', '../../home/home.component.css']
})
export class ChatComponent implements OnInit {
  
  db: firebase.database.Database;
  postRef: firebase.database.Reference;
  maxPosts: number = 6;
  posts: Post[];
  @Input() mode : string;
  @Input() isNews : boolean;
  postContent: string = "";
  notFound : Boolean = false;
  userId : any;
  tmpCount = 0;
  user : any;
  
  constructor(private sanitizer: DomSanitizer ,
     private authService : AuthService,
     private activatedRoute: ActivatedRoute,
     private postService: PostService,
     private sharedService : SharedService,
     private chatService : ChatService){
    this.db = firebase.database();
  }
  ngOnInit(){
    this.userId = this.sharedService.getUserUid();
    this.posts = [];
    this.getPosts();
    setTimeout(this.intializeHashtag , 500);
  }
  
  intializeHashtag(){
    $('textarea').autosize();
    $("textarea").hashtags();
  }
  
  loadMorepost() {
    this.maxPosts += 6;
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
    $("body").addClass('loader5');
    
    var uid = this.sharedService.getUserUid();
    firebase.database().ref('users/'+uid).on('value', (snapshot) => {
      this.user = snapshot.val();
      if(this.user.guildID != undefined && this.user.guildID != ''){
        this.postRef = this.db.ref('chats/guild/'+this.user.guildID);
        $("body").removeClass('loader5');
        this.postRef.limitToLast(+this.maxPosts).on('value', (snapshot) => {
          let count = 0;
          this.posts = [];
          if(snapshot.val() == null){
            this.notFound = true;
            return;
          }
          for (let key in snapshot.val()) {
            if (snapshot.val().hasOwnProperty(key)) {
              let element = snapshot.val()[key];
              count++;
              
              if(element.likedUsers != undefined && element.likedUsers.indexOf(this.userId) != -1){
                element.isLike = true;
              }else{
                element.isLike = false;
              }
              element.avatar = "/assets/img/Avatar/Avatar_Level_"+(this.user.level==undefined?1:this.user.level) + ".png";
              this.posts.unshift(element);
            }
          }
    
          if(count >= this.tmpCount){
            this.notFound = false;
            this.tmpCount = count;
          }
          else {
            this.notFound = true;
          }
          
        });
      }else{ // end of top if
        $("body").removeClass('loader5');
      } 
    })
    

  }
  
  sendChat(message) {
    if (message != "")
    this.chatService.sendChat(message, this.mode);
    this.postContent = "";
  }
  
  likeMsg(uid , guildId){
    $("body").addClass('loader');
    
    var userId = this.sharedService.getUserUid();
    var recordRef = this.db.ref('chats/guild/'+guildId+'/'+uid);
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
  
  UnlikeMsg(uid , guildId){
    $("body").addClass('loader');
    
    var userId = this.sharedService.getUserUid();
    var recordRef = this.db.ref('chats/guild/'+guildId+'/'+uid);
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
  // post() {
  //       if (this.postContent == "")
  //           return;
  //       let user = this.sharedService.getUser();
  // 
  //       this.postService.post(user, this.postContent, "none",null)
  //           .then(res => {
  //               this.postContent = "";
  //               this.postRef = this.db.ref('posts');
  //               this.postRef.once('child_added', (snapshot) => {
  //                   let postAdded:Post = snapshot.val();
  //               });
  //           });
  //   }
}
