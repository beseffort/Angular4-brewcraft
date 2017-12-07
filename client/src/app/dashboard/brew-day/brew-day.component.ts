import { Component, OnInit, ViewChild } from '@angular/core';
import { BrewArchive, BrewService } from '../../services';
import { FormControl, FormGroup } from '@angular/forms';


declare var $;

@Component({
  selector: 'app-brew-day',
  templateUrl: './brew-day.component.html',
  styleUrls: ['./brew-day.component.css']
})
export class BrewDayComponent implements OnInit {

  brews: BrewArchive[];



  constructor(
    private brewService: BrewService
  ) {

  }

  ngOnInit() {
  }


}
