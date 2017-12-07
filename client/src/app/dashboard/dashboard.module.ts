import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageUploadModule } from 'ng2-imageupload';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { BrowserModule } from '@angular/platform-browser';
import { DatepickerModule } from 'angular2-material-datepicker';
import { SelectModule } from '../components/angular2-select';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthGuard, ChatService, RecipeService, SharedService, BrewService, GuildService } from '../services/index';
import { ChatComponent } from './components/chat/chat.component';
import {PostComponent} from './components/post/post.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { ProfileWidgetComponent } from './components/widgets/profile-widget/profile-widget.component';
import { GuildWidgetComponent } from './components/widgets/guild-widget/guild-widget.component';
import { BrewOfTheDayWidgetComponent } from './components/widgets/brew-of-the-day-widget/brew-of-the-day-widget.component';
import { TipOfTheDayWidgetComponent } from './components/widgets/tip-of-the-day-widget/tip-of-the-day-widget.component';
import { VideosWidgetComponent } from './components/widgets/videos-widget/videos-widget.component';
import { TipsWidgetComponent } from './components/widgets/tips-widget/tips-widget.component';
import { FavoriteBrewWidgetComponent } from './components/widgets/favorite-brew-widget/favorite-brew-widget.component';
import { BlogWidgetComponent } from './components/widgets/blog-widget/blog-widget.component';
import { GuildDetailComponent } from './guild/guild-detail/guild-detail.component';
import { MyGuildComponent } from './guild/my-guild.component';
import { GuildComponent } from './guild/guild/guild.component';
import { TransferComponent } from './guild/transfer/transfer.component';
import { MyNewGuildComponent } from './guild/my-new-guild/my-new-guild.component';
import { NewGuildComponent } from './guild/new-guild/new-guild.component';
import { MyGuildSearchComponent } from './guild/my-guild-search/my-guild-search.component';
import { GuildSearchComponent } from './guild/guild-search/guild-search.component';
import { MyRecipeComponent } from './my-recipe/my-recipe.component';
import { AddRecipeComponent } from './my-recipe/add-recipe/add-recipe.component';
import { TipComponent } from './tip/tip.component';
import { RecipeComponent } from './my-recipe/recipe/recipe.component';
import { BrewDayComponent } from './brew-day/brew-day.component';
import { BrewComponent } from './brew-day/brew/brew.component';
import { RecipeSelectComponent } from './brew-day/recipe-select/recipe-select.component';
import { BrewTimerComponent } from './brew-day/brew-timer/brew-timer.component';
import { RecipesComponent } from './my-recipe/recipes/recipes.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SearchbarComponent } from './my-recipe/searchbar/searchbar.component';
import { GuildAcceptComponent } from './guild/accept/guild-accept.component';
import { HashtagComponent } from './guild/hashtag/hashtag.component';

import { HashTagLink } from './hashtag-link.directive';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: ':type/hashtag/:tag/:guildID',
        component: HashtagComponent
      },
      {
        path: 'guild',
        component: MyGuildComponent,
        children: [
          {
            path: '',
            component: GuildComponent
          },
          {
            path: 'guilds',
            component: MyGuildSearchComponent,
            children: [
              {
                path: '',
                component: GuildSearchComponent
              },
              {
                path: 'transfer-ownership/:uid',
                component: TransferComponent
              },
              {
                path: ':uid',
                component: GuildDetailComponent
              },
              {
                path: ':guildId/:userId',
                component: GuildAcceptComponent
              }
            ],
            canActivate: [AuthGuard]
          },
          {
            path: 'new-guild',
            component: MyNewGuildComponent,
            children: [
              {
                path: '',
                component: NewGuildComponent
              }
            ],
            canActivate: [AuthGuard]
          }
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'tip',
        component: TipComponent
      },
      {
        path: 'brew',
        component: BrewComponent
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'brew-day',
    component: BrewDayComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-recipes',
    component: MyRecipeComponent,
    children: [
      {
        path: '',
        component: RecipesComponent
      },
      {
        path: 'add-recipe',
        component: AddRecipeComponent
      },
      {
        path: ':uid',
        component: RecipeComponent
      }
    ],
    canActivate: [AuthGuard]
  }

]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ImageUploadModule,
    DatepickerModule,
    SelectModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [HashtagComponent , HashTagLink , ImageCropperComponent, GuildAcceptComponent,  ChatComponent, PostComponent, HeaderComponent , DashboardComponent, FooterComponent, HomeComponent, LeftSidebarComponent, RightSidebarComponent, ProfileWidgetComponent, GuildWidgetComponent, BrewOfTheDayWidgetComponent, TipOfTheDayWidgetComponent, VideosWidgetComponent, TipsWidgetComponent, FavoriteBrewWidgetComponent, BlogWidgetComponent, GuildDetailComponent, MyRecipeComponent, AddRecipeComponent, TipComponent, RecipeComponent, BrewDayComponent, BrewComponent, RecipeSelectComponent, BrewTimerComponent, RecipesComponent, NavbarComponent, SearchbarComponent, MyGuildComponent, GuildComponent, GuildSearchComponent, MyGuildSearchComponent, MyNewGuildComponent, NewGuildComponent , TransferComponent],
  providers: [ChatService, RecipeService, SharedService, BrewService, GuildService],
  exports: [FooterComponent]
})
export class DashboardModule { }
