import { Component, OnInit, ViewChild } from '@angular/core';
import { Recipe, RecipeService, BrewService } from '../../../services';

@Component({
  selector: 'app-recipe-select',
  templateUrl: './recipe-select.component.html',
  styleUrls: ['./recipe-select.component.css']
})
export class RecipeSelectComponent implements OnInit {

  availableRecipesOptions: Array<any> = [];
  stylesOptions: Array<any> = [];

  recipes: Recipe[];
  availableRecipes: Recipe[];

  style: String;
  recipe: Recipe;

  // beerTypes = [{value:'Ale', label:'<img src="/assets/img/BeerTypes/Ale.png" width=15/> <span class="strong">Ale</span>'},
  //              {value:'Lager', label:'<img src="/assets/img/BeerTypes/Lager.png" width=15/> <span class="strong">Lager</span>'},
  //              {value:'Stout', label:'<img src="/assets/img/BeerTypes/Stout.png" width=15/> <span class="strong">Stout</span>'},
  //              {value:'Porter', label:'<img src="/assets/img/BeerTypes/Porter.png" width=15/> <span class="strong">Porter</span>'},
  //              {value:'Malt', label:'<img src="/assets/img/BeerTypes/Malt.png" width=15/> <span class="strong">Malt</span>'}
  //             ];

  isNextStep: Boolean = false;

  @ViewChild('recipeSelect') recipeSelect:any;

  constructor(
    private recipeService: RecipeService,
    private brewService: BrewService
  ) {
  }

  ngOnInit() {
    this.recipeService.getRecipes()
      .then(res => {
        this.recipes = res.data;

        var styles = this.recipeService.getStyles(this.recipes);
        this.stylesOptions = new Array(styles.length);
        for (let i = 0; i < styles.length; i++) {
          this.stylesOptions[i] = {
            value: styles[i],
            label: '<span class="strong">Beer Type ' + (i + 1).toString() + ' - </span>' + styles[i]
          };
        }
        var self = this;
        setTimeout(function () {
          self.style = self.stylesOptions[0].value;
        }, 100);
        
      });
  }
  onStyleSelected(item) {
    this.availableRecipes = [];
    this.availableRecipesOptions = [];
    var style = item.value;
    this.recipes.forEach(recipe => {
      if (recipe.beer_type == style)
        this.availableRecipes.push(recipe);
    });
    this.availableRecipes.forEach(recipe => {
      this.availableRecipesOptions.push({
        value: recipe,
        label: recipe.name
      });
    });
  }

  onRecipeSelected(item) {
    this.brewService.setRecipe(this.recipe);
  }

  enableNextStep() {
    this.isNextStep = true;
    this.updateAvailableRecipes();
  }

  updateAvailableRecipes() {
    this.availableRecipes = [];
    this.availableRecipesOptions = [];
    this.recipes.forEach(recipe => {
      if (recipe.beer_type == this.style)
        this.availableRecipes.push(recipe);
    });
    this.availableRecipes.forEach(recipe => {
      this.availableRecipesOptions.push({
        value: recipe,
        label: recipe.name
      });
    });
    var self = this;
    setTimeout(function () {
      self.recipeSelect.select(self.availableRecipesOptions[0].value);
    }, 100);
  }

  private scrollToBottom(elem) {
    elem.scrollTop = elem.scrollHeight;
  }
}
