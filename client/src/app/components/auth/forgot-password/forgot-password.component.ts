import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  onEmail: Boolean = true;

  constructor(
    private authService: AuthService,
    public flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
  }

  sendPasswordResetMail(email) {
    console.log(email);
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.onEmail = re.test(email);
    if (this.onEmail === true) {
        var self = this;
      this.authService.sendPasswordResetMail(email).then(res => {
        if (res.success) {
          self.flashMessage.show(res.message,
            { cssClass: 'alert-success', timeout: 5000 });
        } else {
          self.flashMessage.show(res.message,
            { cssClass: 'alert-danger', timeout: 5000 });
        }
      });
    }
  }
}
