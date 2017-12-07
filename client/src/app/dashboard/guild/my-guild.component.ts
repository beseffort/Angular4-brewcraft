import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-my-guild',
  templateUrl: './my-guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class MyGuildComponent implements OnInit {

  constructor(public router: Router) {

  }

  ngOnInit() {
    //console.log(JSON.parse(localStorage.getItem('currentUser')));
  }
}
