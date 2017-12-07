import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent {
  constructor(public router: Router){
    localStorage.setItem('currentUser' ,  null);
    this.router.navigate(['/']);
  }
}