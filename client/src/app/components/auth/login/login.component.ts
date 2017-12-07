import { Component, OnInit } from '@angular/core';
import { AuthService, User, SharedService } from '../../../services';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import * as firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  isSignup: Boolean = false;

  onPassword: Boolean = true;
  onEmail: Boolean = true;

  constructor(private authService: AuthService,
    private sharedService: SharedService,
    public flashMessage: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
    var chat = firebase.database().ref('chat');
    chat.on('child_added', (snapshot) => {
    })
  }

  login() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.onPassword = true;
    if (this.user.password == "" || this.user.password == null) {
      this.onPassword = false;
    }
    this.onEmail = re.test(this.user.email);
    if (this.onPassword === true && this.onEmail === true) {
      var self = this;
      document.body.classList.add("loader");
      this.authService.loginWithEmailAndPassword(this.user)
        .then((res) => {
          document.querySelector('body').classList.remove('loader');
          var uid = res.uid;
          self.authService.checkLockStatus(res.uid).then(res => {
            if (!res.data.locked || res.data.locked == undefined) {
              this.authService.getUserByUid(uid)
                .then(res => {
                  this.sharedService.setUser(res.data);
                  this.router.navigate(['/dashboard']);
                })
            } else {
              self.flashMessage.show('Your account has been locked due to security reasons',
                { cssClass: 'alert-danger', timeout: 5000 });
              self.authService.logout();
            }
          })
        })
        .catch(function (error: any) {
          document.querySelector('body').classList.remove('loader');
          self.flashMessage.show(error.message,
            { cssClass: 'alert-danger', timeout: 50000 });
          self.user.password = "";
          if (error.code == "auth/wrong-password") {
            self.sharedService.incRetry();
            if (self.sharedService.getRetry() == 5) {
              self.authService.lockUser(self.user.email)
                .then(res => {
                })
            }
          }
        });
    }
  }
  loginWithFacebook() {
    var self = this;
    this.authService.loginWithFacebook()
      .then(res => {
        this.user.credential_provider = "facebook";
        this.user.fullname = res.user.displayName;
        this.user.email = res.user.email;
        this.user.photoUrl = res.user.photoURL;
        this.user.uid = res.user.uid;
        this.user.password = null;
        this.authService.addUserToDatabase(this.user)
          .then(res => {
            this.authService.getUserByUid(this.user.uid)
              .then(res => {
                if (res.success) {
                  this.sharedService.setUser(res.data);
                  this.router.navigate(['/dashboard']);
                }
              })
          });
      })
      .catch(err => {
        self.flashMessage.show(err.message,
          { cssClass: 'alert-danger', timeout: 5000 });
      })
  }
  loginWithGoogle() {
    var self = this;
    this.authService.loginWithGoogle()
      .then(res => {
        this.user.credential_provider = "google";
        this.user.fullname = res.user.displayName;
        this.user.email = res.user.email;
        this.user.photoUrl = res.user.photoURL;
        this.user.uid = res.user.uid;
        this.user.password = null;
        this.authService.addUserToDatabase(this.user)
          .then(res => {
            this.authService.getUserByUid(this.user.uid)
              .then(res => {
                if (res.success) {
                  this.sharedService.setUser(res.data);
                  this.router.navigate(['/dashboard']);
                }
              })
          });
      })
      .catch(err => {
        self.flashMessage.show(err.message,
          { cssClass: 'alert-danger', timeout: 5000 });
      })
  }
}
