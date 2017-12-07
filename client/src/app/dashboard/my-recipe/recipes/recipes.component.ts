import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeService, SharedService } from '../../../services';
import {Router } from '@angular/router';
import * as firebase from 'firebase';
declare var $ : any;

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  recipes: Recipe[];
  currentUserId : any;
  recipeLikeCount : any;
  db : any;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private sharedService : SharedService,
  ) {
    this.db = firebase.database();
    this.currentUserId = this.sharedService.getUserUid();
   }

  ngOnInit() {
    $('body').addClass('loader');
    this.recipeService.getRecipes().then(res => {
      $('body').removeClass('loader');
      this.recipes = res.data;
    })
    .catch(res => $('body').removeClass('loader') );
    this.recipeService.recipesListner().subscribe(res => {
      this.recipes = res;
    })
  }

  gotoRecipe(recipe: Recipe) {
    this.router.navigate(['/my-recipes/' + recipe.uid])
  }

  likeRecipe(uid , i){
    $("body").addClass('loader');

    var recordRef = this.db.ref('recipes/'+uid);
    recordRef.once('value' , (snapshot) => {
      $("body").removeClass('loader');
      var alreadyLiked = false;
      var record = snapshot.val();
      
      if(record.likedUsers == null){
        record.likedUsers = []; 
      }else{
        for(let likedUser of record.likedUsers){
          if(likedUser == this.currentUserId){
            alreadyLiked = true;
          }
        }
      }
      
      if(alreadyLiked == false){
        record.likedUsers.push(this.currentUserId);
        recordRef.update(record);
        this.recipes[i].recipeLikeCount +=1;
      }
      this.recipes[i].isLike = true;
    })
    
  }
  
  UnlikeRecipe(uid , i){
    $("body").addClass('loader');

    var recordRef = this.db.ref('recipes/'+uid);
    recordRef.once('value' , (snapshot) => {
      $("body").removeClass('loader');
      var record = snapshot.val();
      
      var pos;
      while ((pos = record.likedUsers.indexOf(this.currentUserId)) > -1) {
          record.likedUsers.splice(pos, 1);
      }

      recordRef.update(record);
      this.recipes[i].isLike = false;
      this.recipes[i].recipeLikeCount -=1;
    })
  }
}
