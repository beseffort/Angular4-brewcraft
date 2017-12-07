import { Component, OnInit , ViewChild , ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe, RecipeService, SharedService } from '../../../services';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import {NgForm} from '@angular/forms';
declare var $ : any;

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit {
  testoption = [];
  photo: any;
  recipe: Recipe;
  ingredientError: string = null;
  stepError: string = null;
  bitterness_input_hover: boolean = false;
  bitterness_input_focus: boolean = false;

  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 600,
    resizeMaxWidth: 600
  };
  imageError: any;
  @ViewChild ('imgName')  imgName : ElementRef;
  beerTypes = [{value:'Ale', label:'<img src="/assets/img/BeerTypes/Ale.png" width=15/> <span class="strong">Ale</span>'},
               {value:'Lager', label:'<img src="/assets/img/BeerTypes/Lager.png" width=15/> <span class="strong">Lager</span>'},
               {value:'Stout', label:'<img src="/assets/img/BeerTypes/Stout.png" width=15/> <span class="strong">Stout</span>'},
               {value:'Porter', label:'<img src="/assets/img/BeerTypes/Porter.png" width=15/> <span class="strong">Porter</span>'},
               {value:'Malt', label:'<img src="/assets/img/BeerTypes/Malt.png" width=15/> <span class="strong">Malt</span>'}
              ];
  recipeTypes = [{value:'All-Grain', label:'<span class="strong">All-Grain</span>'},
                 {value:'Malt Extract', label:'<span class="strong">Malt Extract</span>'},
                 {value:'Steeped Grain', label:'<span class="strong">Steeped Grain</span>'}
                ];
  colorDD = [{value:'Pale Straw', label:'<span class="strong">Pale Straw</span>'},
             {value:'Straw', label:'<span class="strong">Straw</span>'},
             {value:'Pale Gold', label:'<span class="strong">Pale Gold</span>'},
             {value:'Deep Gold', label:'<span class="strong">Deep Gold</span>'},
             {value:'Pale Amber', label:'<span class="strong">Pale Amber</span>'},
             {value:'Medium Amber', label:'<span class="strong">Medium Amber</span>'},
             {value:'Deep Amber', label:'<span class="strong">Deep Amber</span>'},
             {value:'Amber-Brown', label:'<span class="strong">Amber-Brown</span>'},
             {value:'Brown', label:'<span class="strong">Brown</span>'},
             {value:'Ruby Brown', label:'<span class="strong">Ruby Brown</span>'},
             {value:'Deep Brown', label:'<span class="strong">Deep Brown</span>'},
             {value:'Black', label:'<span class="strong">Black</span>'}
            ];  
  ingredientTypes = [{value:'Hops', label:'<span class="strong">Hops</span>'},
                     {value:'Grain', label:'<span class="strong">Grain</span>'},
                     {value:'Malt', label:'<span class="strong">Malt</span>'},
                     {value:'Water', label:'<span class="strong">Water</span>'},
                     {value:'Yeast', label:'<span class="strong">Yeast</span>'},
                     {value:'Other', label:'<span class="strong">Other</span>'}
                    ];
  hopsTypes = [];
  yeastTypes = [];
  grainTypes = [];
  unitTypes = [{value:'Empty', label:'<span class="strong">Empty</span>'},
               {value:'Ounces', label:'<span class="strong">Ounces</span>'},
               {value:'Gallons', label:'<span class="strong">Gallons</span>'},
               {value:'Pounds', label:'<span class="strong">Pounds</span>'}
               ];

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private sharedService: SharedService
  ) {
    this.recipe = new Recipe();
    for (let op = 5; op--; ) {
      this.testoption.push({
         value: 'Lorem ipsum',
         label: '<span class="strong">Lorem ipsum</span>'});
    }
    this.recipeService.getHopsTypes()
    .then(res => {
      res.data.map(type => {
        this.hopsTypes.push({'value':type, 'label': "<img src='/assets/img/Icons/hop_icon.png' width=18/> <span class='strong'> " + type + "</span>"});
      });
    });
    this.recipeService.getYeastTypes()
    .then(res => {
      res.data.map(type => {
        this.yeastTypes.push({'value':type, 'label': "<span class='strong'> " + type + "</span>"});
      });
    });
    this.recipeService.getGrainTypes()
    .then(res => {
      res.data.map(type => {
        this.grainTypes.push({'value':type, 'label': "<span class='strong'> " + type + "</span>"});
      });
    });
  }

  ngOnInit() {
    $('.ui.dropdown').dropdown();
  }
  
  submitRecipeForm(f : NgForm){
    if(f.valid){
      $('.submit_btn').hide();
      //var extn = this.imgName.nativeElement.value.split(".").pop();
      
      //this.recipe.beer_type = $('input[name=beer_type]').val();
      //this.recipe.recipe_type = $('input[name=recipe_type]').val();
      //this.recipe.color = $('input[name=color]').val();
      this.recipe.photo = $('.carousel-inner .active .slider_value img').attr('src');
      this.recipe.brewer = this.sharedService.getUser().fullname;
      this.recipe.brewerID = this.sharedService.getUser().uid;
      //this.recipe.extn = extn;
      this.recipe.privacy = "NONE";

      console.log("beer_type: ", this.recipe.beer_type);
      console.log("recipe_type: ", this.recipe.recipe_type);
      console.log("color: ", this.recipe.color);
      this.recipeService.submitRecipe(this.recipe)
        .then(res => {
          $.growl.notice({title:"Success", message: "Recipe added Successfully.",size:'large',duration:6000});
          this.router.navigate(['/my-recipes']);
        });
    }else{
      $('.submit_btn').show();
      $.growl.error({title:"Error", message: "Form has some errors.",size:'large',duration:6000});
    }
    
  }

  addIngredient() {
    this.ingredientError = null;

    let last_ingredient = this.recipe.ingredients[this.recipe.ingredients.length - 1];
    console.log(last_ingredient);

    if (last_ingredient.ingredient_type == "") {
      this.ingredientError = "Please fill out ingredient";
      return;
    } else if(last_ingredient.ingredient_type == "Hops") {
      if(last_ingredient.hops_type == "" || last_ingredient.unit_type == "Empty" || last_ingredient.amount == 0) {
        this.ingredientError = "Please fill out ingredient";
        return;
      }
    } else if(last_ingredient.ingredient_type == "Yeast") {
      if(last_ingredient.yeast_type == "") {
        this.ingredientError = "Please fill out ingredient";
        return;
      }
    } else if(last_ingredient.ingredient_type == "Grain") {
      if(last_ingredient.grain_type == "" || last_ingredient.unit_type == "Empty" || last_ingredient.amount == 0) {
        this.ingredientError = "Please fill out ingredient";
        return;
      }
    } else {
      if(last_ingredient.unit_type == "Empty" || last_ingredient.amount == 0) {
        this.ingredientError = "Please fill out ingredient";
        return;
      }
    }

    this.recipe.ingredients.push({
      ingredient_type: "",
      hops_type: "",
      yeast_type: "",
      grain_type: "",
      amount: 0,
      unit_type: "Empty"
    });

    console.log(this.recipe.ingredients);
  }

  addStep() {
    this.stepError = null;
    let last_step = this.recipe.steps[this.recipe.steps.length - 1];
    if (last_step.name == "" || last_step.step_time == "") {
      this.stepError = "Please fill out step";
      return;
    }
    this.recipe.steps.push({
      name: "",
      step_time: ""
    });
  }
  selected(imageResult: ImageResult) {
    this.photo = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
    this.imageError = null;
    if (imageResult.error) {
      this.imageError = "Only jpg, png, jpeg files are supported";
      return;
    }
  }
  onBlurBatchSize(event) {
    event.target.type = "text";
    event.target.value = event.target.value + ' GAL';
  }
  onFocusBatchSize(event) {
    event.target.value = event.target.value.substring( 0, event.target.value.indexOf( ' GAL' ) );
    event.target.type = "number";
  }
  onBlurAlcohol(event) {
    event.target.type = "text";
    event.target.value = event.target.value + ' %';
  }
  onFocusAlcohol(event) {
    event.target.value = event.target.value.substring( 0, event.target.value.indexOf( ' %' ) );
    event.target.type = "number";
  }
  hover() {
    this.bitterness_input_hover = true;
  }
  leave() {
    this.bitterness_input_hover = false;
  }
  focus() {
    this.bitterness_input_focus = true;
  }
  focusout() {
    this.bitterness_input_focus = false;
  }
}
