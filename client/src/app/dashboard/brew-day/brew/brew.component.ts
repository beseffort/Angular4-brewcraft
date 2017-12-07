import { Component, OnInit } from '@angular/core';
import { Recipe, BrewService, Brew } from '../../../services';

@Component({
  selector: 'app-brew',
  templateUrl: './brew.component.html',
  styleUrls: ['./brew.component.css']
})
export class BrewComponent implements OnInit {

  recipe: Recipe;
  brew: Brew;
  completed: boolean = false;

  brewSubscription: any;

  constructor(
    private brewService: BrewService
  ) { }

  ngOnInit() {
    this.recipe = this.brewService.getRecipe();
    this.brew = this.brewService.getBrew();
    this.brewSubscription = this.brewService.brewListner().subscribe(res => {
      this.brew = res;
      if(this.brewService.isCompleted()) {
        this.completed = true;
        this.brewService.submit();
      }
    })
  }



  // processBrew(step) {
  //   this.brewService.setStep(step);
  //   this.brewService.processBrew();
  // }
  // stopBrew() {
  //   this.brewService.stopBrew();
  // }

  // ngOnDestroy() {
  //   this.brewSubscription.unsubscribe();
  // }
}
