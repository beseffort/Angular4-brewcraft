import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GuildService , SharedService } from '../../../services';
declare var $ : any;

@Component({
  selector: 'app-guild-search',
  templateUrl: './guild-search.component.html',
  styleUrls: ['./../guild.component.css']
})
export class GuildSearchComponent implements OnInit {
  guilds  = [];
  notFound = false;
  recipeLimit = 16;
  constructor(public router: Router, private guildService : GuildService, private sharedService : SharedService) {

  }

  ngOnInit() {
    var value ="";
    this.searchGuilds(value);
    this.checkUserGuild();
  }
  
  checkUserGuild(){
    var userId = this.sharedService.getUserUid();
    $('body').addClass("loader3");
    this.guildService.checkUserGuild(userId)
    .then(res => {
      $('body').removeClass("loader3");
      if(res.data.guildID != ''){
        this.router.navigate(['/dashboard/guild/guilds/'+res.data.guildID]);
      }
    });
  }
  
  getAllGuilds(){
    $('body').addClass("loader");
    this.guildService.getAllGuilds()
    .then(res => {
      $('body').removeClass("loader");
      this.guilds = res.data;
      if(res.data == undefined){
        this.notFound = true;
      }
    });
  }
  
  guildDetails(id : any){
    console.log(id);
    this.router.navigate(['/dashboard/guild/guilds/'+id]);
  }
  
  searchGuilds(value : string){
    this.notFound = false;
    document.body.classList.add("loader");
    this.guildService.getSearchedGuild(value)
    .then(res =>{
      document.body.classList.remove("loader");
      this.guilds = res.data;
      if(res.data == ""){
        this.notFound = true;
      }
    });
  }
  
  loadMoreRecipe() {
    if(this.recipeLimit >= this.guilds.length )
      return;
    this.recipeLimit += 8;
  }
  
  addNewGuild(){
    this.router.navigate(['/dashboard/guild/new-guild']);
  }
  
}
