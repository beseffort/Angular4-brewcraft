import { Component, OnInit } from '@angular/core';
import { AuthService, SharedService, User } from '../../../services';
import { Router } from '@angular/router';

import * as firebase from 'firebase';
declare var $ : any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;
  joinDate: String;
  db: firebase.database.Database;
  profileUrl : any;
  background_header : string;

  constructor(
    public authService: AuthService,
    public sharedService: SharedService,
    public router: Router) {
    this.db = firebase.database();
    
    router.events.subscribe((url:any) => {
      this.checkUserLogo();
    });
    
  }

  ngOnInit() {
    this.checkUserLogo();
  }
  
  checkUserLogo(){
    if(localStorage.getItem('currentUser') != undefined && localStorage.getItem('currentUser') != 'null'){
      this.user = this.sharedService.getUser();
      $("body").addClass('loader6');
      let uid = this.sharedService.getUserUid();
      this.db.ref('users/' + uid).on('value', (snapshot) => {
        $("body").removeClass('loader6');
        this.user = snapshot.val();
        var date = new Date(this.user.joinDate);
        this.joinDate = date.getFullYear().toString();
        var guildUrl = "/dashboard/guild/guilds/"+this.user.guildID;
        if(this.user.guildID != '' && this.user.isChief == true && this.router.url == guildUrl){
          this.background_header = "url(/assets/img/guild_dashboard_header.jpg)";
          var guildRef = this.db.ref('guilds/'+this.user.guildID);
          guildRef.on('value' , (snapshot) => {
            this.profileUrl = snapshot.val().logo;
          })
        }else{
          this.background_header = "url(/assets/img/Header.jpg)";
          this.profileUrl = "/assets/img/Avatar/Avatar_Level_"+(this.user.level==undefined?1:this.user.level) + ".png";
        }
      })
    }
    
  }

  logout() {
    this.authService.logout().then(data =>
      setTimeout(() => {
        this.router.navigate(['/'])
      }, 400)
    );
  }

  floor(val) {
    return Math.floor(val);
  }
}
