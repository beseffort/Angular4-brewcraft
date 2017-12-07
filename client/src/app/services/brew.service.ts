import { Injectable } from '@angular/core';
import { Recipe } from './index';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { SharedService } from './shared.services';
import { CONFIG } from '../common/config';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

const NOT_STARTED = 0;
const IN_PROGRESS = 1;
const COMPLETED = 2;
const PAUSE = 3;

@Injectable()
export class BrewService {

  private brewSubject = new Subject<Brew>();
  private timer;

  constructor(
    private http: Http,
    private sharedService: SharedService
  ) {

  }

  setRecipe(recipe: Recipe) {
    var brew = new Brew();
    brew.recipe = recipe;
    var total_timer = 0;
    brew.recipe.steps.forEach(step => {
      total_timer += +step.step_time;
    });
    total_timer *= 60;
    brew.total_time_counter = total_timer;
    brew.step = 1;
    brew.step_time_counter = brew.recipe.steps[1 - 1].step_time * 60;
    this.setBrew(brew);
  }

  getRecipe() {
    return this.getBrew().recipe;
  }

  brewListner(): Observable<Brew> {
    return this.brewSubject.asObservable();
  }

  unsubscribe() {
    this.brewSubject.unsubscribe();
  }

  setStep(step) {
    var brew = this.getBrew();
    brew.step = step;
    brew.status = IN_PROGRESS;
    brew.step_time_counter = brew.recipe.steps[step - 1].step_time * 60;
    this.setBrew(brew);
  }

  processBrew() {
    var brew = this.getBrew();
    brew.status = IN_PROGRESS;

    var self = this;
    this.timer = setInterval(() => {
      brew.total_time_counter--;
      brew.step_time_counter--;

      this.setBrew(brew);
      if (self.isCompleted()) {
        brew.status = COMPLETED;
        clearInterval(self.timer);
        this.setBrew(brew);
      }

      if (brew.step_time_counter == 0) {
        brew.step++;
        if (!self.isCompleted())
          brew.step_time_counter = brew.recipe.steps[brew.step - 1].step_time * 60;
        this.setBrew(brew);
      }

    }, 1000);
  }

  clearBrew() {
    localStorage.removeItem('brew');
  }

  pauseBrew() {
    var brew = this.getBrew();
    brew.status = PAUSE;
    this.setBrew(brew);
    clearInterval(this.timer);
  }

  resetBrew() {
    var brew = this.getBrew();
    brew.status = NOT_STARTED;
    this.setBrew(brew);
    clearInterval(this.timer);
    var brew = this.getBrew();
    var total_timer = 0;
    brew.recipe.steps.forEach(step => {
      total_timer += +step.step_time;
    });
    total_timer *= 60;
    brew.total_time_counter = total_timer;
    brew.step = 1;
    brew.step_time_counter = brew.recipe.steps[1 - 1].step_time * 60;
    this.setBrew(brew);
    return brew;
  }

  isCompleted() {
    var brew = this.getBrew();
    if (brew.total_time_counter == 0) {
      return true;
    }
    else false;
  }

  getBrew(): Brew {
    return JSON.parse(localStorage.getItem('brew'));
  }

  setBrew(brew) {
    localStorage.setItem('brew', JSON.stringify(brew));
    this.brewSubject.next(brew);
  }

  submit() {
    var url = CONFIG.SERVER_URL + '/brewday/add';
    var user = this.sharedService.getUser();
    var brewArchive = new BrewArchive();
    brewArchive.recipe_name = this.getBrew().recipe.name;
    brewArchive.brewer_uid = user.uid;
    brewArchive.brewer_name = user.fullname;

    return this.http.post(url, { brew: brewArchive })
      .toPromise()
      .then(res => res.json());
  }

  getBrewArchive() {
    var url = CONFIG.SERVER_URL + '/brewday/get-archive/' + this.sharedService.getUserUid();
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }

  completeBrew(brew: BrewArchive) {
    var url = CONFIG.SERVER_URL + '/brewday/complete-brew';
    return this.http.put(url, brew)
      .toPromise()
      .then(res => res.json());
  }
}

export class Brew {
  recipe: Recipe;
  step: number;
  status: number;
  step_time_counter: number;
  total_time_counter: number;
  constructor() {
    this.step = 1;
    this.status = NOT_STARTED;
    this.step_time_counter = 0;
    this.total_time_counter = 0;
  }
}

export class BrewArchive {
  uid: String;
  recipe_name: string;
  brewer_name: string;
  brewer_uid: string;
  brew_date: Date;
  fermentation_date: Date;
  carbonation_date: Date;
  status: Boolean;

  constructor() {
    this.recipe_name = "";
    this.brewer_name = "";
    this.brewer_uid = "";
    this.brew_date = new Date();
    this.fermentation_date = new Date();
    this.carbonation_date = new Date();
    this.status = false;
  }
}