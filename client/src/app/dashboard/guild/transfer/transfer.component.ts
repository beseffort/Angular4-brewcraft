import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router, NavigationEnd } from '@angular/router';
import { GuildService, SharedService } from '../../../services';
import * as firebase from 'firebase';
declare var $ : any;
declare var bootbox : any;

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./../guild.component.css']
})
export class TransferComponent implements OnInit {
  joinedMembers : any;
  db : any;
  
  constructor(public router: Router, 
    private guildService : GuildService,
    private sharedService : SharedService,
    private activatedRoute: ActivatedRoute) {
    this.db = firebase.database();
  }

  ngOnInit() {
    this.getJoinedMembers();
  }
  
  getJoinedMembers(){
    $("body").addClass("loader");
    let guildId: any = this.activatedRoute.snapshot.params;
    guildId = guildId.uid;
    var self = this;
    firebase.database().ref('users').once('value', (snapshot) => {
      // initialize values
      this.joinedMembers = [];
      var users = $.map(snapshot.val(), function(value, index) {
          return [value];
      });
      for(let user of users){
        if(user.guildID == guildId && user.isChief == false){
          this.joinedMembers.push(user);
        }
      }
      $("body").removeClass("loader");
      if(this.joinedMembers.length == 0){
        bootbox.confirm('<b>No Members joined this Guild. <br> Do you want to delete this Guild and leave ?</b>', function(result){
          if(result == true){
            var currentUid = self.sharedService.getUserUid();
            // remove his recipes 
            self.db.ref('recipes/').once('value' , (snapshot) => {
              for(let key in snapshot.val()){
                var recipe = snapshot.val()[key];
                if(recipe.brewerID == currentUid){
                  self.db.ref('recipes/'+recipe.uid).remove();
                }
              }
            });

            self.db.ref('users/'+currentUid).once('value', (snapshot) => {
              var user = snapshot.val();
              user.guildID = '';
              user.isChief = false;
              self.db.ref('users/'+currentUid).update(user)
              .then( res => {
                
                self.db.ref('guilds/'+guildId).remove()
                .then(res => {
                  self.db.ref('chats/guild/'+guildId).remove();
                  $.growl.notice({title:"Success", message: "Guild is removed Successfully.",size:'large',duration:6000});
                  self.router.navigate(['/dashboard/guild/guilds']);
                });
              })
              
            });
          }else{
            self.router.navigate(['/dashboard/guild/guilds/'+guildId]);
          }
        })
      }
    });
  }
  
  assignOwner(uid){
    $("body").addClass("loader");
    let guildId: any = this.activatedRoute.snapshot.params;
    guildId = guildId.uid;
    //console.log(uid);
    this.db.ref('users/'+uid).once('value', (snapshot) => {
      var assignUser = snapshot.val();
      assignUser.isChief = true;
      this.db.ref('users/'+assignUser.uid).update(assignUser);
      this.db.ref('guilds/'+guildId).update({chief: assignUser.uid});
      
      var currentUid = this.sharedService.getUserUid();
      // remove his recipes 
      this.db.ref('recipes/').once('value' , (snapshot) => {
        for(let key in snapshot.val()){
          var recipe = snapshot.val()[key];
          if(recipe.brewerID == currentUid){
            this.db.ref('recipes/'+recipe.uid).remove();
          }
        }
      });
      // remove the current cheif 
      this.db.ref('users/'+currentUid).once('value', (snapshot) => {
        var currentUser = snapshot.val();
        currentUser.isChief = false;
        currentUser.guildID = '';
        this.db.ref('users/'+currentUser.uid).update(currentUser);
        $("body").removeClass("loader");
        $.growl.notice({title:"Success", message: "Ownership is transferred Successfully.",size:'large',duration:6000});
        this.router.navigate(['/dashboard/guild']);
      });
      
    });
  }
  
}
