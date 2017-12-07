import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GuildService , SharedService } from '../../../services';
declare var $ : any;

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./../guild.component.css']
})

export class GuildComponent implements OnInit {
  guilds : any;
  constructor(public router: Router, private guildService : GuildService , private sharedService : SharedService) {

  }

  ngOnInit() {
    this.checkUserGuild();
  }
  
  checkUserGuild(){
    var userId = this.sharedService.getUserUid();
    document.body.classList.add("loader");
    this.guildService.checkUserGuild(userId)
    .then(res => {
      document.body.classList.remove("loader");
      if(res.data.guildID != ''){
        this.router.navigate(['/dashboard/guild/guilds/'+res.data.guildID]);
      }
    });
  }
  
  guildDetails(id : any){
    this.router.navigate(['/dashboard/guild/guilds/'+id]);
  }
  
  joinNew(){
    this.router.navigate(['/dashboard/guild/guilds']);
  }
  
  addNewGuild(){
    this.router.navigate(['/dashboard/guild/new-guild']);
  }
}
