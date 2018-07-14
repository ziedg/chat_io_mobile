import {ChangeDetectorRef, Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../beans/user";
import {environment} from "../../environments/environment";
import {AppSettings} from "../../conf/app-settings";
import {Http, Response} from "@angular/http";
import * as _ from "lodash";
import * as pathUtils from "../../utils/path.utils";
import {ProfilePage} from "../profile/pages/profile/profile";


@IonicPage()
@Component({
  selector: 'page-suggestions',
  templateUrl: 'suggestions.html',
})
export class SuggestionsPage {
  profilePage = ProfilePage;
  loadCompleted:boolean=false;
  moreProfile:boolean=true;
  popularProfiles : Array<User> = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private changeDetector: ChangeDetectorRef,
    private http: Http) {
    this.loadPopularProfiles();
  }

  ngOnInit() {
    window.onscroll = this.onScroll.bind(this);
  }

  onScroll(infiniteScroll) {
    setTimeout(() => {
      if (this.popularProfiles.length > 0) { this.loadPopularProfiles(this.popularProfiles[this.popularProfiles.length - 1]._id); }
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);

  }


  loadPopularProfiles(Id_Profile?: string) {
    if(localStorage.getItem('token') == 'offline') {
      //this.popularProfiles = popularProfiles_offline;
      return;
    }
    console.log("load popular profiles");
    if (this.popularProfiles.length === 30)
      return;

    let url: string = environment.SERVER_URL + pathUtils.GET_POPULAR_PROFILES + '/';
    if (Id_Profile) { url = url + Id_Profile }
    this.http.get(url,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.profiles.length > 0) {
            let profiles = this.popularProfiles.slice();
            Array.prototype.push.apply(profiles, response.profiles);
            profiles = _.uniqBy(profiles, function (profile) {
              return profile._id;
            });
            this.popularProfiles = profiles;
            console.log(this.popularProfiles);
            this.loadCompleted=true;
          }else{
            this.moreProfile=false;
          }
        },
        err => {
        },
        () => {
          this.loadCompleted=true;
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
            this.popularProfiles.splice(this.popularProfiles.indexOf(user), 1);
          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  subscribeClick(event, user: User) {

    let obj = event.target;
    let obj_del = obj.parentNode.parentNode.parentNode;

    obj_del.style.opacity = '0';

    setTimeout(function () { obj_del.parentNode.removeChild(obj_del); }, 500);

    if (this.popularProfiles.length < 5) {
      this.loadPopularProfiles(this.popularProfiles[this.popularProfiles.length - 1]._id);
    }

    this.subscribe(user);
  }
}
