import { Component } from '@angular/core';
import { AuthService, SharedService, EmailService } from './services';
import {Router} from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  user: Observable<firebase.User>;

  constructor(private emailService : EmailService, afAuth: AngularFireAuth, private authService: AuthService, private sharedService: SharedService, private router: Router , public http : Http) {
    this.user = afAuth.authState;
    //this.emailService.welcomeMail('sudhanshu' , 'sudhanshu.sharma@brucode.com');
    // var url = "http://localhost:8000/guilds/send-email";
    // var context = {
    //   name : "robert",
    //   link : "http://www.brewcraft.io/"
    // };
    // 
    // this.http.post(url , {email : "sudhanshu.sharma@brucode.com" , subject : "test" , template : "account_welcome" , context : context})
    // .subscribe(
    //   data => console.log(data)
    // )
    // this.authService.af.auth.subscribe((auth) => {
    //   if (auth) {
    //   } else {
    //     console.log('Log out', auth);
    //     localStorage.removeItem('currentUser');
    //     localStorage.removeItem('retry');
    //   }
    // })
  }
}
