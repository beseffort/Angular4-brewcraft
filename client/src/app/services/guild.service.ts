import { Injectable } from '@angular/core';
import { Http , Headers } from '@angular/http';
import { CONFIG } from '../common/config';
import 'rxjs/add/operator/toPromise';
import { SharedService } from './shared.services';

@Injectable()
export class GuildService {
  guild: Guild = new Guild();
  constructor(private http: Http, private sharedService: SharedService){
    
  }
  
  getAllGuilds():Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/show-all/';
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }
  
  getSearchedGuild(value):Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/search/';
    return this.http.post(url, { keyword : value })
      .toPromise()
      .then(res => res.json());
  }
  
  checkUserGuild(uid):Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/check-user-guild/';
    return this.http.post(url, { uid : uid })
      .toPromise()
      .then(res => res.json());
  }
  
  getGuildDetails(uid):Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/get-details/';
    return this.http.post(url, uid)
      .toPromise()
      .then(res => res.json());
  }
  
  guildJoinRequest(userID , guildID):Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/request-member/';
    return this.http.post(url, { userID : userID , guildID : guildID })
      .toPromise()
      .then(res => res.json());
  }
  
  guildCancelJoinRequest(uid , guildID):Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/leave-guild/';
    return this.http.post(url, { uid : uid , guildID : guildID})
      .toPromise()
      .then(res => res.json());
  }
  
  acceptRequest(userID , guildID):Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/confirm-member/';
    return this.http.post(url, { userID : userID , guildID : guildID })
      .toPromise()
      .then(res => res.json());
  }
  
  rejectRequest(userID , guildID):Promise<any> {
    let url = CONFIG.SERVER_URL + '/guilds/reject-member/';
    return this.http.post(url, { userID : userID , guildID : guildID })
      .toPromise()
      .then(res => res.json());
  }
  
  saveNewGuild(guildname : string, desc : string, logoUrl : string , logoFullUrl : string):Promise<any>{
    let url = CONFIG.SERVER_URL + '/guilds/add-new/';
    this.guild.name = guildname;
    this.guild.description = desc;
    this.guild.logo = logoUrl;
    this.guild.logo_full = logoFullUrl;
    this.guild.chief = this.sharedService.getUserUid();
    var headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post(url,this.guild)
    .toPromise()
    .then(res => res.json());
  }
  
  sendEmail(to, subject , msg){
    let url = CONFIG.SERVER_URL + '/guilds/send-email/';
    var headers = new Headers();
    headers.append('Content-Type','application/x-www-form-urlencoded');
    var params = 'email=' + to+'&subject='+subject+'&msg='+msg;
    return this.http.post(url,params ,{headers: headers}).map( data => data.json() );
  }
}

export class Guild {
  chief: string;
  id: string;
  logo: string;
  logo_full : string;
  name: string;
  status: string;
  description: string;

  constructor() {
    this.chief = "";
    this.id = "";
    this.logo = "";
    this.name = "";
    this.status = "";
    this.description = "";
  }
}