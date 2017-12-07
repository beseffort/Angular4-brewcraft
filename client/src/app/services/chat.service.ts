import { Injectable, OnInit } from '@angular/core';
import { User, AuthService, SharedService } from './index';
import { CONFIG } from '../common/config';
import * as firebase from "firebase";

@Injectable()
export class ChatService {

  me: User = null;
  db: firebase.database.Database;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    this.db = firebase.database();
  }

  ngOnInit() {
  }

  sendChat(message, mode = "COMMUNITY") {

    if (this.me == null)
      this.authService.getUser()
        .then(res => { this.me = res.data; this._sendChat(message, mode) });
    else
      this._sendChat(message, mode);
  }

  _sendChat(message, mode) {
    var newChatRef; 
    if (mode == "COMMUNITY") {
      newChatRef = this.db.ref('chats/community').push();
    } else {
      if (this.me.guildID == "" || this.me.guildID == null)
        return;
      newChatRef = this.db.ref('chats/guild/' + this.me.guildID).push();
    }
    var newChat = new Chat();
    newChat.photoUrl = this.me.photoUrl;
    if (this.me.photoUrl == undefined || this.me.photoUrl == "")
      newChat.photoUrl = CONFIG.SERVER_URL + '/assets/gravatar/default.jpg';
    newChat.message = message;
    newChat.senderID = this.me.uid;
    newChat.senderName = this.me.fullname;
    newChat.uid = newChatRef.key;
    newChatRef.set(newChat);
    // update opinions in users 
    this.db.ref('users/' + this.me.uid).once('value', (snapshot) => {
      this.db.ref('users/' + this.me.uid).update({opinions: snapshot.val().opinions ? snapshot.val().opinions + 1: 1});
    });
  }
}


export class Chat {
  senderID: string;
  senderName: string;
  photoUrl: string;
  message: string;
  guild: string;
  time: string;
  uid: string;
  isLike: boolean;

  constructor() {
    this.senderID = "";
    this.senderName = "";
    this.message = "";
    this.guild = "";
    this.time = this.getFormattedDate(new Date())
  }

  getFormattedDate(date) {
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    return str;
  }
}