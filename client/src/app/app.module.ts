import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { StarRatingModule } from 'angular-star-rating';

import { DashboardModule } from './dashboard/dashboard.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { FooterComponent } from './dashboard/components/footer/footer.component';
import { LogoutComponent } from './logout.component';

// Service
import { AuthService, AuthGuard, SharedService, PostService, RecipeService, WordpressService , EmailService} from './services';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { BlogComponent } from './components/blog/blog.component';

export const firebaseConfig = {
  apiKey: "AIzaSyD759e-Z7liSYamprfMPQ5rZO_NY-RELjE",
  authDomain: "brewcraft-d2e49.firebaseapp.com",
  databaseURL: "https://brewcraft-d2e49.firebaseio.com",
  projectId: "brewcraft-d2e49",
  storageBucket: "brewcraft-d2e49.appspot.com",
  messagingSenderId: "900215616942"
  // apiKey: "AIzaSyBqHmJVAysoC_tNQa9KsZ0pqJAk6furMmg",
  // authDomain: "angular-chat-fab46.firebaseapp.com",
  // databaseURL: "https://angular-chat-fab46.firebaseio.com",
  // projectId: "angular-chat-fab46",
  // storageBucket: "angular-chat-fab46.appspot.com",
  // messagingSenderId: "998964002953"
};

// const firebaseAuthConfig = {
//   provider: AuthProviders.Google,
//   method: AuthMethods.Popup
// };

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'blogs', component: BlogComponent },
  { path: '**', redirectTo: '' },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    BlogComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlashMessagesModule,
    StarRatingModule,
    DashboardModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthService, AuthGuard, SharedService, PostService, WordpressService, EmailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
