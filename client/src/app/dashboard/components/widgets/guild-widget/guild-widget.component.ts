import { Component, OnInit , AfterContentInit } from '@angular/core';
import { AuthService , SharedService} from '../../../../services';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
declare var $ : any;

@Component({
  selector: 'app-guild-widget',
  templateUrl: './guild-widget.component.html',
  styleUrls: ['./guild-widget.component.css']
})
export class GuildWidgetComponent implements OnInit {
  db : any;
  isGuild : boolean;
  guild : any;
  isGuildPage : any;
  userImg : string;
  
  constructor(public authService: AuthService,
  public sharedService: SharedService,
  public router: Router) { 
  this.db = firebase.database();
  this.guild = '';
  
}

  ngOnInit() {
    
  }
  
  ngAfterContentInit(){
    this.loadPage();
    this.sharedService.getListernerGuildDetailPage()
    .subscribe(
      data => {
        if(data == 'guild_page'){
          this.changeLeftSideWidget()
        }else{
          this.loadPage();
        }
      }
    )
    
  }
  
  loadPage(){
    setTimeout(() => this.isGuildPage =  false , 100);
    var uid = this.sharedService.getUserUid();
    this.db.ref('users/'+uid).on('value', (snapshot) => {
      var res = snapshot.val();
      if(res.guildID != ''){
        setTimeout(() => this.isGuild =  true , 100);
        this.db.ref('guilds/'+res.guildID).on('value', (snapshot) => {
          this.guild = snapshot.val();
          
        })
        
      }else{
        setTimeout(() => this.isGuild =  false , 100);
      }
    });
  }
  
  changeLeftSideWidget(){
      setTimeout(() => this.isGuild =  false , 100);
      setTimeout(() => this.isGuildPage =  true , 10);
      var uid = this.sharedService.getUserUid();
      this.db.ref('users/'+uid).on('value', (snapshot) => {
        var user = snapshot.val();
        this.userImg = "/assets/img/Avatar/Avatar_Level_"+(user.level==undefined?1:user.level) + ".png";
      })
  }

}
