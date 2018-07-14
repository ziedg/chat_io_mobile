
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../beans/user';
import { LoginService } from '../login/services/loginService';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
//import 'rxjs/add/operator/map';
import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import {AppSettings} from "../../conf/app-settings";
import * as pathUtils from "../../utils/path.utils";
import { ProfilePage } from '../profile/pages/profile/profile';


@IonicPage()
@Component({
  selector: 'page-facebook-friends',
  templateUrl: 'facebook-friends.html',
})
export class FacebookFriendsPage {
    public facebookProfiles: Array<User> = [];
    public popularProfiles: Array<User> = [];
    displayedNumberfacebookProfiles = 10;
    public user: User = new User();
    lastPopularProfileID;
    public isValid :boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public translate: TranslateService,
              private http: Http,
              private loginService: LoginService,
              private changeDetector: ChangeDetectorRef) {
                
                
              loginService.redirect();
              this.user = loginService.user;
              this.isValid = true;
              this.loadfacebookProfiles();  
  }


  onClickProfile(profile) {
    if (this.navCtrl.getActive().name != "ProfilePage")
      this.navCtrl.push(ProfilePage, {'userId': profile._id});
  }

  loadfacebookProfiles() {

    var url: string = environment.SERVER_URL + pathUtils.GET_FACEBOOK_FRIENDS;

    this.http.get(url,
        AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
          response => {
            console.log(response);
            Array.prototype.push.apply(this.facebookProfiles, response.message);
            this.isValid = this.facebookProfiles.length != 0;
            console.log("leength"+this.facebookProfiles.length);

        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
      
} 

loadPopularProfiles(Id_Profile?: string) {
  var url: string = environment.SERVER_URL + pathUtils.GET_POPULAR_PROFILES + '/';
  if (Id_Profile) { url += Id_Profile }
  this.http.get(url,
    AppSettings.OPTIONS)
    .map((res: Response) => res.json())
    .subscribe(
      response => {
      
        Array.prototype.push.apply(this.popularProfiles, response.profiles);

        response.profiles = response.profiles.filter(el => this.facebookProfiles.find(x => x._id === el._id) == undefined)
                                             .map(el => {  el.ispop = true ; return el;} );
        Array.prototype.push.apply(this.facebookProfiles, response.profiles);
        this.isValid = this.facebookProfiles.length != 0;

        //changes
        if (response.profiles && response.profiles.length) {
          this.lastPopularProfileID = response.profiles[response.profiles.length - 1]._id;
        }
        //
      },
      err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
}

subscribe(user: User) {
    let body = JSON.stringify({
      profileId: user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.SUBSCRIBE,
      body,
      AppSettings.OPTIONS
    )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            this.facebookProfiles.splice(this.facebookProfiles.indexOf(user), 1);
            this.isValid = this.facebookProfiles.length != 0;
          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );

}

unsubscribe(user: User) {
    let body = JSON.stringify({
      profileId: user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
      body,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            user.isFollowed = false;
            user.nbSuivi--;
            this.isValid = this.facebookProfiles.length != 0;
          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
}

ignore(user: User) {
    let body = JSON.stringify({
      profileId: user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.IGNORE,
      body,
      AppSettings.OPTIONS
    )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            this.facebookProfiles.splice(this.facebookProfiles.indexOf(user), 1);
            this.isValid = this.facebookProfiles.length != 0;
          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );


}
  
}
