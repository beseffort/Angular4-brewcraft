import { Component, OnInit, ViewChild } from '@angular/core';
import { Recipe, RecipeService, BrewService } from '../../../services';
import {Router} from '@angular/router';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  stylesOptions: Array<any> = [];

  recipes: Recipe[] = [];
  availableRecipes: Recipe[];

  style: String;
  add : boolean = true;

  constructor(
    private recipeService: RecipeService,
    public router: Router
  ) { }

  ngOnInit() {    
    this.recipeService.getRecipes()
      .then(res => {
        if(typeof res.data != 'undefined')
          this.recipes = res.data;

        var styles = this.recipeService.getStyles(this.recipes);
        this.stylesOptions = new Array(styles.length);
        for (let i = 0; i < styles.length; i++) {
          this.stylesOptions[i] = {
            value: styles[i],
            label: '<span class="strong">Beer Type ' + (i + 1).toString() + ' - </span>' + styles[i]
          };
        }
        this.recipeService.updateRecipesSession(this.recipes);
      });
  }

  onStyleClear(item) {
    this.recipeService.updateRecipesSession(this.recipes);
  }

  onStyleSelected(item) {
    this.availableRecipes = [];
    var style = item.value;
    this.recipes.forEach(recipe => {
      if (recipe.beer_type == style)
        this.availableRecipes.push(recipe);
    });
    this.recipeService.updateRecipesSession(this.availableRecipes);
  }

  AddRecipe(){
    this.router.navigate(['/my-recipes/add'])
  }
  
  AddNewRecipe(){
    this.router.navigate(['/my-recipes/add-recipe']);
    this.add = false;
  }
  
  RemoveRecipe(){
    this.router.navigate(['/my-recipes']);
    this.add = true;
  }


  private scrollToBottom(elem) {
    elem.scrollTop = elem.scrollHeight;
  }
}
