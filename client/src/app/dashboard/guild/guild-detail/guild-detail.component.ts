import { Component, OnInit , ViewChild , ElementRef} from '@angular/core';
import { PostService, RecipeService , SharedService, Recipe, Post, GuildService , Guild , AuthService, EmailService } from '../../../services';
import * as firebase from 'firebase';
import { ActivatedRoute , Router } from '@angular/router';
import { CONFIG } from '../../../common/config';
import 'rxjs/add/operator/map';
import { Observable }         from 'rxjs/Observable';
declare var $ : any;
declare var bootbox : any;

@Component({
  selector: 'app-guild-detail',
  templateUrl: './guild-detail.component.html',
  styleUrls: ['./../guild.component.css']
})
export class GuildDetailComponent implements OnInit {
  testoption = [];
  members=[]; /*Guild Member*/
  recipes=[]; /*Guild Recipe*/
  statusoption=[ {label: "Joined", value: 1}, {label: "Leave Guild", value: 0}]; /*update it for status like Join, Leave Guild*/
  showrecipesLen=2;
  showmembersLen=8;
  postContent: string = "";
  db: firebase.database.Database;
  postRef: firebase.database.Reference;
  guild : Guild = new Guild();
  notFound = false;
  noPending = true;
  isChief = false;
  joinedMembers = [];
  joinedMembersCount = 0;
  noJoined = true;
  isJoined = false;
  status : any;
  loggedInUid : any;
  isRecipe : boolean = true;
  recipeList = [];
  @ViewChild('inviteMail') inviteMailtxt : ElementRef;
  
  constructor(private sharedService: SharedService,
                private postService: PostService,
                private guildService : GuildService,
                private router : Router,
                private authService : AuthService,
                private recipeService : RecipeService,
                private emailService : EmailService,
                private activatedRoute: ActivatedRoute) {

    this.db = firebase.database();

    for (let op of this.statusoption ) {
      this.testoption.push({
        value: op.value,
        label: '<span class="strong">'+ op.label+'</span>'});
    }
    
    for(let mem of [1,2,3,4,5,6,7,8]){
      //this.members.push({name:"Member "+mem,uid:""});
      this.recipes.push(
        {
          name:"Recipe "+mem,
          image:"/assets/img/recipe/Ale.png",
          content:"This beer is pretty sweet yet hoppy with some hints of fruits, citrus and spices. color: Dark Blonde [..]",
          totalLike:20,
          totalReview:2
        });
    }
  }


  ngOnInit() {
    this.sharedService.setListenerGuildDetailPage('guild_page');
    this.loggedInUid = this.sharedService.getUserUid();
    this.startupFunc();
    
  }
  
  
  startupFunc(){
    this.checkIsJoined();
    this.getGuildDetails();
    // load joined and pending members
    this.getJoinedMembers();
    this.getPendingMembers();
    this.getRecipes();
  }
  
  getRecipes(keyword = ''){
    //$("body").addClass('loader6');
    let guildId: any = this.activatedRoute.snapshot.params;
    guildId = guildId.uid;
    var guildRef = this.db.ref('guilds/'+guildId);
    guildRef.on('value', (snapshot) =>{
      var guild = snapshot.val();
      var joinedMembers = guild.joinedMembers;
      if(joinedMembers != undefined && joinedMembers.length > 0){
          
          var recipeRef = this.db.ref('recipes');
          recipeRef.on('value' , (snapshot)=>{
            this.recipeList = [];
            this.isRecipe = false;
            for(let key in snapshot.val()){
            
              var recipe = snapshot.val()[key];
              if($.inArray(recipe.brewerID, joinedMembers) !== -1 && recipe.privacy == 'GUILD'){
                //$("body").removeClass('loader6');
                this.isRecipe = true;
                if(keyword == ''){
                  this.recipeList.push(recipe);
                }else{
                  var keyword_local = new RegExp(keyword, "i");
                  if (recipe.name.search(keyword_local) != -1 || recipe.brewer.search(keyword_local) != -1)
                    this.recipeList.push(recipe);
                }
              }
            }
          })
        
      }else{
        $("body").removeClass('loader6');
      }
      if(this.recipeList.length > 0){
        this.isRecipe = true;
      }else{
        this.isRecipe = false;
      }
    })
  }
  
  browseRecipes(keyword) {
    $('body').addClass('loader');
    this.recipeService.searchRecipes(keyword)
      .then(res => {
        $('body').removeClass('loader');
        this.recipeList = res.data;
        if(this.recipeList.length == 0){
          this.isRecipe = false;
        }else{
          this.isRecipe = true;
        }
      })
      .catch(res => $('body').removeClass('loader'));
  }
  
  gotoRecipe(recipe: Recipe) {
    console.log(recipe)
    this.router.navigate(['/my-recipes/' + recipe.uid])
  }
  
  checkIsJoined(){
    let guildId: any = this.activatedRoute.snapshot.params;
    var uid = this.sharedService.getUserUid();
    $("body").addClass("loader");
    firebase.database().ref('users/'+uid).on('value' , (snapshot) => {
      $("body").removeClass("loader");
      var user =  snapshot.val();
      if(user.guildID == guildId.uid){
        this.isJoined = true;
      }else{
        this.isJoined = false;
      }
    })
  }
  
  getGuildDetails(){
    this.notFound = false;
    let uid: any = this.activatedRoute.snapshot.params;
    $("body").addClass("loader2");;
    var self = this;
    this.guildService.getGuildDetails(uid)
    .then(res => {
      $("body").removeClass("loader2");
      this.guild = res.data;
      if(res.data == null){
        this.notFound = true;
      }else{
        var userID = this.sharedService.getUserUid();
        if(userID == res.data.chief){
          this.isChief = true;
        }else{
          this.isChief = false;
        }
      }
    }).catch( res => {
      $("body").removeClass("loader2");
      this.notFound = true;
      $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
    });
  }
  
  getJoinedMembers(){
    $("body").addClass("loader3");;
    this.noJoined = true;
    let guildId: any = this.activatedRoute.snapshot.params;
    firebase.database().ref('users').on('value', (snapshot) => {
      // initialize values
      this.joinedMembers = [];
      this.joinedMembersCount = 0;
      var users = $.map(snapshot.val(), function(value, index) {
          return [value];
      });
      for(let user of users){
        if(user.guildID == guildId.uid){
          this.noJoined = false;
          user.avatar = "/assets/img/Avatar/Avatar_Level_"+(user.level==undefined?1:user.level) + ".png";
          this.joinedMembers.push(user);
          this.joinedMembersCount++;
        }
      }
      $("body").removeClass("loader3");
    });
  }
  
  getPendingMembers(){
    let guildId: any = this.activatedRoute.snapshot.params;
    $("body").addClass("loader4");;
    this.db.ref('guilds/'+guildId.uid).on('value', (snapshot) => {
      this.members = [];
      $("body").removeClass("loader4");
      var guild = snapshot.val();
      if(guild.pendingMembers == undefined && guild.pendingMembers == null){
        this.noPending = true;
      }else{
        this.noPending = false;
        var ids = guild.pendingMembers;
        var self = this;
        var users_array = [];
        ids.forEach(function(id){
          firebase.database().ref('users/' + id).once('value', (snapshot) => {
            var user = snapshot.val();
            user.avatar = "/assets/img/Avatar/Avatar_Level_"+(user.level==undefined?1:user.level) + ".png";
            self.members.push(user);
          });
        });
      }
    });
  }
  
  acceptRequest(uid){
    $("body").addClass("loader");;
    let guildId: any = this.activatedRoute.snapshot.params;
    this.guildService.acceptRequest(uid , guildId.uid)
    .then( res => {
      $("body").removeClass("loader");
      if(res.success == true){
        $.growl.notice({title:"Success", message: res.message,size:'large',duration:6000});
        this.startupFunc();
      }
    })
    .catch( res => {
      $("body").removeClass("loader");
      $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
    });
  }
  
  rejectRequest(uid){
    $("body").addClass("loader");;
    let guildId: any = this.activatedRoute.snapshot.params;
    this.guildService.rejectRequest(uid , guildId.uid)
    .then( res => {
      $("body").removeClass("loader");
      if(res.success == true){
        $.growl.notice({title:"Success", message: res.message,size:'large',duration:6000});
        this.startupFunc();
      }
    })
    .catch( res => {
      $("body").removeClass("loader");
      $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
    });
  }
  
  onGroupJoinDD(option){
    let guildId: any = this.activatedRoute.snapshot.params;
    guildId = guildId.uid;
    var userId = this.sharedService.getUserUid();
    
    if(option == 1){
      $("body").addClass("loader");
      this.guildService.guildJoinRequest(userId , guildId)
      .then( res => {
        $("body").removeClass("loader");
        if(res.success == true){
          $.growl.notice({title:"Success", message: res.message,size:'large',duration:6000});
          this.startupFunc();
        }
      })
      .catch( res => {
        $("body").removeClass("loader");
        $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
      });
    }else if (option == 0){
      $("body").addClass("loader");
      // check user is chief or not
      this.db.ref('guilds/'+guildId).once('value' , (snapshot) => {
        var guild = snapshot.val();
        if(guild.chief == userId){
          $("body").removeClass("loader");
            var self = this;
            bootbox.confirm("<b>You have to transfer the ownership to other members before leaving the guild.</b>", function(result){
              self.rejectCallback(result, userId , guildId);
            });
        }else{
          this.guildService.guildCancelJoinRequest(userId , guildId)
          .then( res => {
            $("body").removeClass("loader");
            if(res.success == true){
              $.growl.notice({title:"Success", message: res.message,size:'large',duration:6000});
              this.router.navigate(['/dashboard/guild']);
            }
          }).catch( res => {
              $("body").removeClass("loader");
              $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
          });
        }
      })

    }
  }
  
  rejectCallback(result, userId , guildId){
    if(result == true){
      this.router.navigate(['/dashboard/guild/guilds/transfer-ownership/'+guildId]);
    }
    
  }
  
  removeFromGuild(uid , guild_name , guildId){
    var self = this;
    bootbox.prompt({
        title: "Please provide reason to remove member!",
        inputType: 'textarea',
        callback: function (result) {
            if(result != null){
                $("body").addClass('loader');
                self.db.ref('users/'+uid).once('value' , (snapshot) => {
                  var user = snapshot.val();
                  user.guildID = '';
                  self.db.ref('users/'+uid).update(user)
                  .then(res => {
                      $("body").removeClass('loader');
                      $.growl.notice({title:"Success", message: "User removed Successfully. ",size:'large',duration:6000});
                      // remove from joined members array 
                      var recordRef= self.db.ref('guilds/'+guildId);
                      recordRef.once('value' , (snapshot) => {
                        var guildDetails = snapshot.val();
                        
                        var pos;
                        while ((pos = guildDetails.joinedMembers.indexOf(uid)) > -1) {
                            guildDetails.joinedMembers.splice(pos, 1);
                        }
                        
                        recordRef.update(guildDetails);
                      })
                      // send mail to removed user
                      
                      //var to = user.email;
                      var msg = "You are removed from <b>"+guild_name+"</b> Guild.<br><b>Removal reason provided by guild master :- </b> "+result;
                      self.emailService.removeGuildMail(user.email , msg)
                      //self.guildService.sendEmail(to , "Guild removal notification" , msg)
                      .subscribe(
                        data => { 
                          console.log("mail sent.");
                        }
                      );
                   })
                });
            }
        }
    });
  }

  Loadmore(what){
        if(what==='Members')
            this.showmembersLen+=4;
        else if(what==='Recipes')
            this.showrecipesLen+=2;
  }

  post() {
        if (this.postContent == "")
            return;
        let user = this.sharedService.getUser();

        this.postService.post(user, this.postContent, "none",null)
            .then(res => {
                this.postContent = "";
                this.postRef = this.db.ref('posts');
                this.postRef.once('child_added', (snapshot) => {
                    let postAdded:Post = snapshot.val();
                });
            });
    }
    
    inviteMember(inviteMail , guildID){
      var inviteMail = inviteMail.trim();
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(inviteMail)){
        $.growl.error({title:"Error", message: "Email is invalid.",size:'large',duration:6000});
        return false;
      }
      this.inviteMailtxt.nativeElement.value = '';
      var userExist = false;
      var curUser = '';
      var userRef = this.db.ref('users');
      userRef.once('value' , (snapshot) =>{
        var users = snapshot.val();
        for(let key in users){
          var user = snapshot.val()[key];
          if(user.email == inviteMail){
            userExist = true;
            curUser = user;
            if(user.guildID != ''){
              $.growl.error({title:"Error", message: "User already associated with guild.",size:'large',duration:6000});
              return false;
            }
          }
        }
        // after loop
        // send mail to removed user
        var guildUrl = CONFIG.SERVER_URL+"/dashboard/guild/guilds/"+guildID+"/"+user.uid;
        var guildUrlOnly = CONFIG.SERVER_URL+"/dashboard/guild/guilds/"+guildID;
        var signupUrl = CONFIG.SERVER_URL+"/signup#"+guildUrlOnly;
        var link;
        if(userExist == true){
            var msg = `
              You have got a guild invitation.`;
            link = guildUrl;
        }else{
          var msg = `
            You have got a guild invitation. But , you are not member of brewcraft.
            Please sign up by clicking below link then you will be redirected to guild.</a>
          `;
          link = signupUrl;
        }
        //var to = inviteMail;
        this.emailService.inviteGuildMail(inviteMail , msg, link)
        //this.guildService.sendEmail(to , "Guild invitation" , msg)
        .subscribe(
          data => {
            $.growl.notice({title:"Success", message: "Mail sent Successfully.",size:'large',duration:6000});
          },
          error => {
            $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
          }
        );
      })
      
    }
}
