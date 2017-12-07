import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GuildService } from '../../../services';

@Component({
  selector: 'app-my-guild-search',
  templateUrl: './my-guild-search-component.html',
  styleUrls: ['./../guild.component.css']
})
export class MyGuildSearchComponent implements OnInit {
  guilds : any;
  constructor(public router: Router, private guildService : GuildService) {

  }

  ngOnInit() {
    
  }
}
