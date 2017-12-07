import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONFIG } from '../common/config';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {SharedService} from './index';

@Injectable()
export class RecipeService {

  private recipesSubject = new Subject<Recipe[]>();

  constructor(
    private http: Http,
    private sharedService: SharedService
  ) { }

  recipesListner(): Observable<Recipe[]> {
    return this.recipesSubject.asObservable();
  }

  submitRecipe(recipe: Recipe):Promise<any> {
    var url = CONFIG.SERVER_URL + '/recipes/submit';
    return this.http.post(url, recipe)
      .toPromise()
      .then(res => res.json());
  }

  submitReview(review: string, recipe: Recipe) {
    var url = CONFIG.SERVER_URL + '/recipes/submit-review';
    var user = this.sharedService.getUser();
    return this.http.post(url, {recipeId: recipe.uid, writerName: user.fullname, writerId: user.uid, review: review})
      .toPromise()
      .then(res => res.json());
  }

  getReviews(recipe: Recipe) {
    var url = CONFIG.SERVER_URL + '/recipes/' + recipe.uid + '/reviews';
    return this.http.get(url)
      .toPromise()
      .then(res => res.json().data);
  }

  getRecipes() {
    var userId = this.sharedService.getUserUid();
    var url = CONFIG.SERVER_URL + '/recipes/get';
    return this.http.post(url , { userId : userId})
      .toPromise()
      .then(res => res.json());
  }

  getRecipe(uid: string) {
    var url = CONFIG.SERVER_URL + '/recipes/get/' + uid;
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());    
  }

  searchRecipes(keyword) {
    var url = CONFIG.SERVER_URL + '/recipes/search';
    return this.http.post(url, {
      keyword: keyword
    }).toPromise().then(res => res.json());
  }

  getStyles(recipes: Recipe[] ) {
    var styles = [];
    if(recipes.length != 0){
      recipes.forEach(recipe => {
        if(styles.indexOf(recipe.beer_type) == -1)
          styles.push(recipe.beer_type);
      });
      return styles.sort();
    }
    return styles;
  }

  updateRecipesSession(recipes: Recipe[]) {
    this.recipesSubject.next(recipes);
  }

  getHopsTypes() {
    var url = CONFIG.SERVER_URL + '/recipes/hopsTypes';
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }

  getYeastTypes() {
    var url = CONFIG.SERVER_URL + '/recipes/yeastTypes';
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }

  getGrainTypes() {
    var url = CONFIG.SERVER_URL + '/recipes/grainTypes';
    return this.http.get(url)
      .toPromise()
      .then(res => res.json());
  }
}


export class Recipe {
  privacy:string;
  recipeLikeCount : any;
  isLike : boolean;
  likedUsers : any;
  photo: string;
  //extn : string;
  name: string = "";
  beer_type: string = "";
  recipe_type: string = "";
  batch_size: string = "";
  color: string = "";
  bitterness: string = "";
  fermentation: string = "";
  created_date: Date = new Date();
  brewer: string = "";
  brewerID: string = "";
  assist_brewer: string = "";
  uid: string="";
  original_gravity: string = "";
  final_gravity: string = "";
  alcohol_by_vol: string = "";
  ingredients: Array<any> = [
    {
      ingredient_type: "",
      hops_type: "",
      yeast_type: "",
      grain_type: "",
      amount: 0,
      unit_type: "Empty"
    }
  ];
  steps: Array<any> = [
    {
      name: "",
      step_time: 0
    }
  ];
  procedure : string = "";
  favorites: number = 0;
  reviews: Array<any>;
  // reviews: Array<any> = [
  //   {
  //     username: "",
  //     userId: "",
  //     note: "",
  //     date: new Date()
  //   }
  // ]
}
