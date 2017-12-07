import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoggedIn : any;
  constructor() { 
    var status = localStorage.getItem('currentUser');
    if(status != null && status != 'null'){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
    // console.log("islooged"+this.isLoggedIn);
    // console.log(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
  }

}
