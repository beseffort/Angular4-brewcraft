import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService, Recipe, BrewService , SharedService, AuthService } from '../../../services';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { StarRatingModule } from 'angular-star-rating';

declare var $: any;

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  db : any;
  uid: string;
  private sub: any;
  recipe: Recipe;
  review: string = "";
  reviews: Array<any> = [];
  currentUserId : any;
  recipeLikeCount : any;
  privacyOptions : any = ['NONE', 'GUILD', 'PUBLIC'];
  starsCount = 3;
  ratingStars = 0;
  avg_rating  = 0;

  reviewLimit: number = 2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private sharedService : SharedService,
    private authService : AuthService,
    private brewService: BrewService) {
      this.db = firebase.database();
      this.currentUserId = this.sharedService.getUserUid();
    }

  ngOnInit() {
    var userId = this.sharedService.getUserUid();
    var self = this;
    
    let param = this.route.snapshot.params;
    var recipeId = param.uid;
    
    
    $('body').addClass('loader');
    this.sub = this.route.params.subscribe(params => {
      this.uid = params['uid'];
      this.recipeService.getRecipe(this.uid)
        .then(res => {
          $('body').removeClass('loader');
          this.recipeLikeCount = (res.data[0].likedUsers != undefined)?res.data[0].likedUsers.length:0;
          if(res.data[0].likedUsers != undefined && res.data[0].likedUsers.indexOf(this.currentUserId) != -1){
            res.data[0].isLike = true;
          }else{
            res.data[0].isLike = false;
          }
          // check user has rated or not 
          if(res.data[0].ratedUsers != null){
            for(let key in res.data[0].ratedUsers){
              var user = res.data[0].ratedUsers[key];
              if(Object.keys(user) == userId){
                this.ratingStars = user[userId];
              }
            }
          }
          
          // code for give star rating 
          setTimeout(function(){
            $("#input-id").rating();
            $("#input-id").show();
            $('.rating-stars').click(function(){
              var current_user_key;
              var rating = $('#input-id').val();
              var params = self.route.snapshot.params;
              var recipeRef = self.db.ref('recipes/'+params.uid);
              recipeRef.once('value' , (snapshot) => {
                var alreadyRated = false;
                var record = snapshot.val();
                if(record.ratedUsers == null){
                  record.ratedUsers = {}; 
                }else{
                  for(let key in record.ratedUsers){
                    var user = record.ratedUsers[key];
                    if(Object.keys(user) == userId){
                      alreadyRated = true;
                      current_user_key = key;
                    }
                  }
                }
                
                if(alreadyRated == false){
                  var key = recipeRef.child('ratedUsers').push().key;
                  record.ratedUsers[key];
                  recipeRef.update(record);
                  record.ratedUsers[key] = {};
                  record.ratedUsers[key][userId] = rating;
                  recipeRef.update(record);
                }else if(alreadyRated == true){
                  record.ratedUsers[current_user_key][userId] = rating;
                  recipeRef.update(record);
                }
                
              })
            });
          } , 100);
          // end here
          
          this.recipe = res.data[0];
          this.getReviews();
          setTimeout(() => {
            $('.vertical-bar').height($('.detail').height());
          }, 200);
          
          // average rating code 
          var recipeRef = self.db.ref('recipes/'+recipeId);
          recipeRef.on('value' , (snapshot) => {
              var recipe =  snapshot.val();
              if(recipe.ratedUsers != null){
                var sum_rating = 0;
                for(let key1 in recipe.ratedUsers){
                  var rating = recipe.ratedUsers[key1];
                  var rating_arr_val = Object.keys(rating).map(function(key){return rating[key]});
                  //console.log(rating_arr_val.toString());
                  sum_rating += parseFloat(rating_arr_val.toString());
                }
                self.avg_rating = sum_rating / Object.keys(recipe.ratedUsers).length;
                setTimeout(() => {
                  $("#avg_star_rating").rating({displayOnly: true});
                  $("#avg_star_rating").show();
                } , 100);
              }
          })
          // ends here
        })
        .catch(res => $('body').removeClass('loader') );
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  getAvgRating(){
    
  }

  submitReview() {
    this.recipeService.submitReview(this.review, this.recipe)
      .then(res => {
        this.review = '';
        this.getReviews();
      });
  }

  getReviews() {
    this.recipeService.getReviews(this.recipe)
      .then(res => {
        this.reviews = res;
      });
  }

  loadMoreReviews() {
    if(this.reviewLimit >= this.reviews.length )
      return;
    this.reviewLimit += 2;
  }
  
  changeShareStatus(event , recipeId){
    var value = event.target.value;
    var recipeRef = this.db.ref('recipes/'+recipeId);
    recipeRef.once('value', (snapshot) => {
      if(this.currentUserId == snapshot.val().brewerID){
        recipeRef.update({privacy : value}).
        then( res => {
          $.growl.notice({title:"Success", message: "Status changed Successfully.",size:'large',duration:6000});
        })
        .catch( res => {
          $.growl.error({title:"Error", message: "Something went wrong.",size:'large',duration:6000});
        })
      }
    })
  }
  
  likeRecipe(uid){
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
        this.recipeLikeCount +=1;
      }
      this.recipe.isLike = true;
    })
    
  }
  
  UnlikeRecipe(uid){
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
      this.recipe.isLike = false;
      this.recipeLikeCount -=1;
    })
  }
}