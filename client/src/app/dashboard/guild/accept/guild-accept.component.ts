import { Component} from '@angular/core';
import {GuildService } from '../../../services';
import * as firebase from 'firebase';
import { ActivatedRoute , Router } from '@angular/router';
declare var $ : any;

@Component({
  selector: 'app-accept',
  template: ''
})
export class GuildAcceptComponent {
  constructor(private router : Router , private activatedRoute: ActivatedRoute,
  private guildService : GuildService
  ){
    var params = this.activatedRoute.snapshot.params;
    var guildId = params.guildId;
    var userId = params.userId;
    $("body").addClass("loader");
    this.guildService.acceptRequest(userId , guildId)
    .then( res => {
      $("body").removeClass("loader");
      if(res.success == true){
        $.growl.notice({title:"Success", message: res.message,size:'large',duration:6000});
      }else if(res.success == false){
        $.growl.error({title:"Error", message: "User not found.",size:'large',duration:6000});
      }
      this.router.navigate(['/dashboard/guild/guilds/'+guildId]);
    })
    .catch( res => {
      $("body").removeClass("loader");
      $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
      this.router.navigate(['/dashboard/guild/guilds/'+guildId]);
    });
  }
}