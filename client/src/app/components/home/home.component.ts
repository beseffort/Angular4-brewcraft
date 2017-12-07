import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import { AuthService, SharedService } from '../../services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public flashMessage:FlashMessagesService,
    private sharedService : SharedService,
    private authService : AuthService
  ) { }

  ngOnInit() {
  }

  login(){
  }

}
