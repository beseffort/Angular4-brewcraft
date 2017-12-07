import { Component, OnInit } from '@angular/core';
import { AuthService , SharedService} from '../../../services';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
declare var $ : any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  guildMenuTxt : String = "Guild";
  db : any;
  pendingMembersCount = 0;
  
  constructor(
    public authService: AuthService,
    public sharedService: SharedService,
    public router: Router
  ) { 
    this.db = firebase.database();
  }

  ngOnInit() {
    var uid = this.sharedService.getUserUid();
    firebase.database().ref('users/'+uid).on('value', (snapshot) => {
      var res = snapshot.val();
      if(res.guildID == ''){
        this.guildMenuTxt = "Join guild";
      }else{
        this.guildMenuTxt = "Guild";
        this.getPendingCount(res);
      }
    })
  }
  
  getPendingCount(user){
    this.db.ref('guilds/'+user.guildID).on('value', (snapshot) => {
      var guild = snapshot.val();
      if(guild.pendingMembers != null && guild.chief == user.uid){
        this.pendingMembersCount = guild.pendingMembers.length;
      }else{
        this.pendingMembersCount = 0;
      }
    });
  }
  logout() {
    //localStorage.setItem('currentUser' ,  null);
    this.router.navigate(['/logout']);
    // this.authService.logout().then(res => {
    //   
    // });
  }
}
