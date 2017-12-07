import { Component, OnInit } from '@angular/core';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { CONFIG } from '../../common/config';
import { PostService, User, AuthService, SharedService, Recipe, RecipeService, Post , EmailService } from '../../services';
import * as firebase from 'firebase';
import { Headers, Http, Response } from '@angular/http';
declare var $: any;
declare var _ : any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, PipeTransform {
  testoption = [];
  postContent: string = "";
  mediaType: string = "none";
  errorMsg: string = "";
  recipe: Recipe;
  recipes: Recipe[];

  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 600,
    resizeMaxWidth: 600
  };
  mediaUrl: string = null;
  videoUrl: SafeResourceUrl = null;
  _videoUrl: string = null;
  imageError: any;

  db: firebase.database.Database;
  postRef: firebase.database.Reference;
  maxPosts: number = 4;
  posts: Post[];
  isRecipe : boolean = true;
  suggestionNames : any = [];
  
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private postService: PostService,
    private recipeService: RecipeService,
    private sanitizer: DomSanitizer,
    private http : Http,
    private router: Router,
    private emailService : EmailService
  ) {
    this.db = firebase.database();
    this.recipe = new Recipe();

    for (let op = 5; op--; ) {
      this.testoption.push({
        value: 'Lorem ipsum',
        label: '<span class="strong">Lorem ipsum</span>'});
    }
  }

  ngOnInit() {
    this.sharedService.setListenerGuildDetailPage('home_page');
    
    if(localStorage.getItem('currentUser') == null){
      return;
    }
    this.recipes = [];
    this.posts = [];
   /* this.getPosts(); //moved to app-chat*/
   this.intializeHashtag();
   setTimeout(this.closeMention() , 1000);
   setTimeout(this.clickNames() , 3000);
  }
  
  intializeHashtag(){
    $('textarea').autosize();
    $("textarea").hashtags();
  }
  
  mention(){
    // clear the popover if textarea is empty
    if(this.postContent.length == 0)
      $('.message_text_box').hide();
      
    // get the textarea content
    var value = this.postContent;
    // check if there is "@" present 
    if(value.lastIndexOf('@') != -1){
      // get the mention text 
      var mention_text = value.substring(value.lastIndexOf('@')+1 , value.length);
      // if mention text length is 0 then return 
      if(mention_text.length == 0)
        return;
      // search the users match with the username
      var keyword = new RegExp(mention_text, "i");
      this.db.ref('users').once('value', (snapshot) => {
          var users = snapshot.val();
          this.suggestionNames = [];
          for (var key in users) {
              if (users.hasOwnProperty(key)) {
                  var user = users[key];
                  if (user.username.search(keyword) != -1 && this.suggestionNames.length <= 5){
                    // if match then show the msg and box and add the user
                    $('.message_text_box').show();
                    this.suggestionNames.push(user);
                  }
              }
          }
          if(this.suggestionNames.length == 0)
            $('.message_text_box').hide();
      });
    }
  }
  
  closeMention(){
    $('.message_text_box .icon-close').click(function(){
      $('.message_text_box').hide();
    });
  }
  
  clickNames(){
    var self = this;
    $(document).on('click', '.message_text_box li', function(){
      var name = "@"+$(this).text().trim();
      var txtarea_data = self.postContent.substring(0, self.postContent.lastIndexOf('@'));
      txtarea_data = txtarea_data + name ;
      self.postContent = txtarea_data;
      $('.post-content').focus();
      var press = $.Event("keypress");
      press.ctrlKey = false;
      press.which = 32;
      $(document).trigger(press);
    });
  }

  /*
  moved to app-chat
  loadMore() {
    this.maxPosts += 4;
    this.getPosts();
  }
  */

  post() {
    this.postContent = this.postContent.trim()
    if (this.postContent == "" || this.postContent == " "){
      $.growl.error({title:"Error", message: "Please write something.",size:'large',duration:6000});
      return;
    }
    // emit event
    this.sharedService.setPostChange();
    
    $('.highlighter').html('');
      
    let user = this.sharedService.getUser();

    let mediaData = this.mediaUrl;
    if (this.mediaType == "video")
      mediaData = this._videoUrl;

    this.postService.post(user, this.postContent, this.mediaType, mediaData)
      .then(res => {
        this.sendMentionEmail(this.postContent);
        this.postContent = "";
        this.mediaType = "none";
        this.mediaUrl = null;
        this.videoUrl = null;

        this.postRef = this.db.ref('posts');
        this.postRef.once('child_added', (snapshot) => {
          let postAdded:Post = snapshot.val();
          this.posts.pop();
          this.posts.unshift(postAdded);
        });
      });
  }
  
  sendMentionEmail(str){
    var str_arr = str.split(/[\s\n]+/);
    for(let s of str_arr){
      if(s[0] == '@'){
        this.db.ref('users').once('value', (snapshot) => {
          var username = s.substring(1, s.length);
          //console.log(username);
          username = username.toLowerCase();
          // search the users match with the username
          var keyword = new RegExp(username, "i");
            var users = snapshot.val();
            for (var key in users) {
              //console.log(users);
                if (users.hasOwnProperty(key)) {
                    var user = users[key];
                    if (user.username.search(keyword) != -1){
                      if(user.email != null){
                        var url = CONFIG.SERVER_URL + "/accounts/send-email";
                        var email = user.email;
                        var subject = "Mention Notification";
                        var template = "mention_msg";
                        var context = {
                          msg : str
                        };
                        
                        this.http.post(url , {email : email , subject : subject , template : template , context : context})
                        .subscribe(
                          data => console.log('s')
                        );
                      }
                    }
                }
            }
        });
      }
    }
    
  }

  mediaUpload() {
    $('#media-upload').modal();
    this.errorMsg = "";
  }

  onUploadPhoto() {

  }

  onLinkVideo(url) {
    let videoID = this.getYoutubeEmbedURL(url);
    if (videoID == "error") {
      this.errorMsg = "The video url is invalid.";
      console.log(videoID);
      return;
    }
    this._videoUrl = 'https://www.youtube.com/embed/' + this.getYoutubeEmbedURL(url);
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this._videoUrl);
    this.mediaUrl = null;
    this.mediaType = "video";
    $('#media-upload').modal('toggle');
  }

  selected(imageResult: ImageResult) {
    console.log(imageResult);
    var src = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
    this.imageError = null;
    if (imageResult.error) {
      this.errorMsg = "Only jpg, png, jpeg files are supported";
      return;
    }

    $('#media-upload').modal('toggle');
    this.mediaUrl = src;
    this.videoUrl = null;
    this.mediaType = "photo";
  }

  getYoutubeEmbedURL(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
      return match[2];
    } else {
      return 'error';
    }
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getTimeDiff(date: Date) {
    var today = new Date();
    var diffMs = (today.getTime() - new Date(date).getTime()); // milliseconds between now & Christmas
  
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if (diffDays != 0)
      return diffDays + ' days ago';
    if (diffHrs != 0)
      return diffHrs + ' hours ago';
    if (diffMins != 0)
      return diffMins + ' mins ago';
    else
      return Math.floor(diffMs / 1000) + ' secs ago';
  }

  browseRecipes(keyword) {
    $('body').addClass('loader');
    this.recipeService.searchRecipes(keyword)
      .then(res => {
        $('body').removeClass('loader');
        this.recipes = res.data;
        if(this.recipes.length == 0){
          this.isRecipe = false;
        }else{
          this.isRecipe = true;
        }
      })
      .catch(res => $('body').removeClass('loader'));
  }

  /*
  Moved to app-post component
  getPosts() {
    this.postRef = this.db.ref('posts');

    this.postRef.limitToFirst(+this.maxPosts).on('value', (snapshot) => {
      if (snapshot.val() == null)
        return;
      let count = 0;
      for (var key in snapshot.val()) {
        if (snapshot.val().hasOwnProperty(key)) {
          var element = snapshot.val()[key];
          count++;
          if (element.mediaType == 'video') {
            element.url = this.sanitizer.bypassSecurityTrustResourceUrl(element.url + '?controls=0');
          }
          if (count > this.posts.length)
            this.posts.push(element);
        }
      }
    })
  }
  */
  showRecipe(uid) {
    this.router.navigate(['/my-recipes/' + uid]);
  }
}
