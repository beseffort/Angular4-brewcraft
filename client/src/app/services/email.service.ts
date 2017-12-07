import { Injectable } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Http } from '@angular/http';
import { SharedService } from './shared.services';
import { CONFIG } from '../common/config';
import { contentHeaders } from '../common/headers';
import * as firebase from "firebase";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EmailService {
  
  constructor(public http: Http) {
  }
  
  welcomeMail(name , email){
    var url = CONFIG.SERVER_URL + "/accounts/send-email";
    var email = email;
    var subject = "Welcome Email";
    var template = "account_welcome";
    var context = {
      name : name,
      link : "http://www.brewcraft.io/"
    };
    
    this.http.post(url , {email : email , subject : subject , template : template , context : context})
    .subscribe(
      data => console.log(name)
    )
  }
  
  inviteGuildMail(email , msg, link){
    var url = CONFIG.SERVER_URL + "/accounts/send-email";
    var email = email;
    var subject = "Guild Invitation";
    var template = "guildinvitation";
    var context = {
      msg : msg,
      link : link
    };
    
    return this.http.post(url , {email : email , subject : subject , template : template , context : context});
  }
  
  removeGuildMail(email , msg){
    var url = CONFIG.SERVER_URL + "/accounts/send-email";
    var email = email;
    var subject = "Guild Invitation";
    var template = "guildinvitation";
    var context = {
      msg : msg
    };
    
    return this.http.post(url , {email : email , subject : subject , template : template , context : context});
  }
  
  mentionMail(email , msg){
    var url = CONFIG.SERVER_URL + "/accounts/send-email";
    var email = email;
    var subject = "Mention Notification";
    var template = "mention_msg";
    var context = {
      msg : msg
    };
    
    return this.http.post(url , {email : email , subject : subject , template : template , context : context});
  }
}