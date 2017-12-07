import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services';
import { Observable } from 'rxjs/Observable';
import { FlashMessagesService } from 'angular2-flash-messages';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  sub: any;
  code: string;
  emptyPassword: Boolean = false;
  matchPassword: Boolean = true;
  validPassword: Boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public flashMessage: FlashMessagesService) { }

  ngOnInit() {
    let self = this;
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        self.code = params['oobCode'];
        console.log(self.code);
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  reset_password(password, confirmpassword) {
    this.matchPassword = true;
    this.validPassword = true;
    let re = /^(?=.*[A-Z])(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/;
    this.validPassword = re.test(password);
    if (password != confirmpassword && this.validPassword)
      this.matchPassword = false;

    if (this.matchPassword && this.validPassword && !this.emptyPassword) {
      this.authService.resetPassword(this.code, password).
        then(res => {
          if (res.success) {
            this.flashMessage.show(res.message,
              { cssClass: 'alert-success', timeout: 5000 });
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 5000);
          } else {
            this.flashMessage.show(res.message,
              { cssClass: 'alert-danger', timeout: 5000 });            
          }
        })
    }
  }
}
