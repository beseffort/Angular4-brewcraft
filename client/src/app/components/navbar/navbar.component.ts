import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
declare var $ : any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLogged : any;
  constructor(
    public flashMessage: FlashMessagesService,
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    if(localStorage.getItem('currentUser') != undefined && localStorage.getItem('currentUser') != 'null'){
      this.isLogged = true;
    }else{
      this.isLogged = false;
    }
  }

  login() {
    this.router.navigate(['login']);
  }

  logout() {
    this.authService.logout().then((data) => {
      localStorage.setItem('currentUser' ,  null);
      $.growl.notice({title:"Success", message:"You are logout successfully.",size:'large',duration:6000});
    });
  }
}
