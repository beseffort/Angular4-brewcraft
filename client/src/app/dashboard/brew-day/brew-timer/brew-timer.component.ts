import { Component, OnInit } from '@angular/core';
import { Recipe, BrewService, Brew } from '../../../services';

@Component({
  selector: 'app-brew-timer',
  templateUrl: './brew-timer.component.html',
  styleUrls: ['./brew-timer.component.css']
})
export class BrewTimerComponent implements OnInit {

  brew: Brew;
  completed: boolean = false;
  started: boolean = false;
  brewSubscription: any;
  step: number;

  transition: string = 'all 1.5s';

  constructor(
    private brewService: BrewService
  ) { }

  ngOnInit() {
    this.brewService.clearBrew();
    // this.brew = this.brewService.getBrew();
    
    this.brewSubscription = this.brewService.brewListner().subscribe(res => {
      this.brew = res;
      console.log(this.brew.step)
      if (this.brewService.isCompleted()) {
        this.brew = this.brewService.getBrew();
        this.completed = true;
        // this.brewService.submit(); - called 3 times - maybe settimeout
      }
    })
  }

  restartBrew() {
    this.transition = 'all 0s';
    this.brew = this.brewService.resetBrew();
    this.completed = false;
    this.started = false;
  }

  startBrew() {
    this.transition = 'all 1.5s';
    this.step = 1;
    this.started = true;
    this.brewService.processBrew();
  }

  pauseBrew() {
    this.started = false;
    this.brewService.pauseBrew();
  }


  processBrew(step) {
    this.brewService.setStep(step);
    this.brewService.processBrew();
  }

  ngOnDestroy() {
    this.brewSubscription.unsubscribe();
  }

  formatTimer(val: number) {
    var clock = '';
    var hour = Math.floor(val / 3600).toString();
    var min = Math.floor((val - +hour * 3600) / 60).toString();
    var sec = Math.floor((val - +hour * 3600 - +min * 60)).toString();
    
    hour = +hour < 10 ? '0' + hour: '' + hour;
    min = +min < 10 ? '0' + min: '' + min;
    sec = +sec < 10 ? '0' + sec: '' + sec;
    
    clock = hour + ':' + min + ':' + sec;
    return clock;
  }
}
