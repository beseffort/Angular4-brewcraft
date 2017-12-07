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
export class AuthService {
  
  constructor(public af: AngularFireAuth, public http: Http, public sharedService: SharedService) {
  }

  addUserToDatabase(user: User): Promise<any> {
    var url = CONFIG.SERVER_URL + `/accounts/add`;
    return this.http.post(url, user)
      .toPromise()
      .then(res => {
        return res.json();
      });
  }

  signupWithEmailAndPassword(user: User) {
    return firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
  }

  loginWithEmailAndPassword(user: User) {
    return firebase.auth().signInWithEmailAndPassword(user.email, user.password);
  }

  loginWithFacebook() {
    // return this.af.auth.login({
    //   provider: AuthProviders.Facebook,
    //   method: AuthMethods.Popup
    // })
    return this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  loginWithGoogle() {
    // return this.af.auth.login({
    //   provider: AuthProviders.Google,
    //   method: AuthMethods.Popup,
    // })
    return this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    return this.af.auth.signOut();
  }

  getUserByUid(uid: string) {
    var url = CONFIG.SERVER_URL + '/accounts/get/' + uid;
    return this.http.get(url).toPromise().then(res => {
      return res.json();
    })
  }


  getUser(): Promise<any> {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return this.getUserByUid(currentUser.uid);
  }

  sendPasswordResetMail(email):Promise<any> {
    var url = CONFIG.SERVER_URL + '/accounts/send-password-reset-mail/' + email;
    return this.http.get(url).toPromise().then(res => {
      return res.json()
    })
  }

  resetPassword(code: string, password: string):Promise<any> {
    var url = CONFIG.SERVER_URL + '/accounts/reset-password/' + code + '/' + password;
    return this.http.get(url).toPromise().then(res => {
      return res.json();
    })
  }

  lockUser(email) {
    var url = CONFIG.SERVER_URL + '/accounts/lock/' + email;
    return this.http.put(url, {}).toPromise()
      .then(res => {
        return res.json();
      })
  }

  checkLockStatus(uid) {
    var url = CONFIG.SERVER_URL + '/accounts/check-locked/' + uid;
    return this.http.get(url).toPromise()
      .then(res => {
        return res.json();
      })
  }

  updatePhoto(photo) {
    var url = CONFIG.SERVER_URL + '/accounts/update-photo/' + this.sharedService.getUserUid();
    return this.http.put(url, {photo: photo})
      .toPromise()
      .then(res => res.json());
  }

  updateProfile(user: User) {
    var url = CONFIG.SERVER_URL + '/accounts/update-profile/' + this.sharedService.getUserUid();
    return this.http.put(url, {profile: user})
      .toPromise()
      .then(res => res.json());
  }
}

export class User {
  fullname: string;
  email: string;
  password: string;
  uid: string;
  photoUrl: string;
  credential_provider: string;
  joinDate: Date;
  birthday: Date;
  locked: Boolean;
  isAdmin: Boolean;
  following: Array<any>;
  followed: Array<any>;
  guildID: String;
  brewbook: Array<any>;
  isChief: Boolean;
  guildInvites: Array<any>;
  brewdays: number = 0;
  opinions: number = 0;
  recipes: number = 0;
  level: number = 1;
}