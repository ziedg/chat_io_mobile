import { GifService } from './../shared/services/gifService';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injector, ChangeDetectorRef, Provider } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from "@ionic-native/facebook";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContenteditableDirective } from 'ng-contenteditable';
import { MyApp } from './app.component';

//pages
import { SignInPage } from '../pages/login/pages/sign-in/sign-in';
import { SignUpPage } from '../pages/login/pages/sign-up/sign-up';
import { HomePage } from '../pages/home/home';
import { CguPage } from '../pages/info/pages/cgu/cgu';
import { EquipePage } from '../pages/info/pages/equipe/equipe';
import { ChangePasswordPage } from '../pages/profile/pages/change-password/change-password';
import { ChangeProfilePage } from '../pages/profile/pages/change-profile/change-profile';
import { ChangeProfileTabsPage } from '../pages/profile/pages/change-profile-tabs/change-profile-tabs';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/pages/profile/profile';
import { ProposDeNousPage } from '../pages/info/pages/propos-de-nous/propos-de-nous';
import { SupportTabsPage } from '../pages/info/pages/support-tabs/support-tabs';
import { SuggestionsPage } from '../pages/suggestions/suggestions';
import {PostPage} from '../pages/post/pages/post';
import { NavTabs } from '../pages/nav-tabs/nav-tabs';
import  {SearchPage} from '../pages/search/search';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FacebookFriendsPage } from '../pages/facebook-friends/facebook-friends';
import { GifSliderComponent } from '../pages/home/components/gif-slider/gif-slider';


/*Components*/
import { PostComponent } from '../pages/post/components/post/post';
import { Comment } from '../pages/post/components/comment/comment';
import { LikeReaction } from '../pages/post/components/post/reactions/like-reaction/like-reaction';
import { LoveReaction } from '../pages/post/components/post/reactions/love-reaction/love-reaction';
import {reactionModal} from "../pages/post/components/post/reaction-modal/reaction-modal";

//import  { NewPublicationPage } from '../pages/home/components/new-publication/new-publication';
import {HttpModule, ConnectionBackend, Http, RequestOptions, XHRBackend} from '@angular/http';



/* services */
import { LoginService } from '../pages/login/services/loginService';
import { httpFactory} from "../utils/factories/http.factory";
import { HttpClientModule, HttpClient} from "@angular/common/http";
import { EmojiService } from '../pages/post/services/emojiService';

import { DateService } from '../shared/services/dateService';
import { PostService } from '../pages/post/services/postService';
import { RecentRechService } from '../pages/search/services/recentRechService';
import { Ng2ImgMaxModule } from 'ng2-img-max';



import { ContenteditableModel } from '../pages/post/pages/contenteditable-model';
import { LinkView } from '../pages/post/services/linkView';
import {AvailablePicture} from "../pages/profile/pipes/AvailablePicture.pipe";

import { ScrollHideDirective } from '../pages/home/directives/scroll-hide';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
//import {GifSlider} from "../pages/home/components/new-publication/gif-slider/gif-slider";

import { Push } from '@ionic-native/push';


@NgModule({
  declarations: [
    MyApp,
    ContenteditableDirective,
    SignInPage,
    SignUpPage,
    HomePage,
    CguPage,
    EquipePage,
    ChangePasswordPage,
    ChangeProfilePage,
    ChangeProfileTabsPage,
    NotificationsPage,
    ProfilePage,
    ProposDeNousPage,
    SupportTabsPage,
    SuggestionsPage,
    PostComponent,
    PostPage,
    SearchPage,

    Comment,
    ContenteditableModel,
    NavTabs,
    ScrollHideDirective,
    AvailablePicture,
    FacebookFriendsPage,
    GifSliderComponent,
    LikeReaction,
    LoveReaction,
    reactionModal
    //NewPublicationPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {mode: 'md', tabsHideOnSubPages: true}),
    HttpModule,
    HttpClientModule,
    Ng2ImgMaxModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    //TODO : change after test
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAnCqxH5CTNWksJH6j59jIKjxkVJOyEyIk",
      authDomain: "speegar-6deca.firebaseapp.com",
      databaseURL: "https://speegar-6deca.firebaseio.com",
      projectId: "speegar-6deca",
      storageBucket: "speegar-6deca.appspot.com",
      messagingSenderId: "861552240215"
    }),
    AngularFireDatabaseModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    HomePage,
    CguPage,
    EquipePage,
    SignUpPage,
    ChangePasswordPage,
    ChangeProfilePage,
    ChangeProfileTabsPage,
    NotificationsPage,
    ProfilePage,
    ProposDeNousPage,
    SupportTabsPage,
    SuggestionsPage,
    PostPage,
    SearchPage,
    Comment,
    NavTabs,
    FacebookFriendsPage,
    reactionModal,
    //NewPublicationPage,
  ],
  providers: [
    <Provider> ChangeDetectorRef,
    StatusBar,
    SplashScreen,
    EmojiService,
    GifService,
    DateService,
    RecentRechService,
    LinkView,
    PostService,
    LinkView,
    Facebook,

    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    {
      provide: Http, useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, Injector],
      multi: false
    },
    Push
  ]
})
export class AppModule {}


// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
