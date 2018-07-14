import { Component,ViewChild } from '@angular/core';
import { NavController,Tabs } from 'ionic-angular';
import {HomePage} from "../home/home";
import {SearchPage} from "../search/search";
import {SuggestionsPage} from "../suggestions/suggestions";
import {NotificationsPage} from "../notifications/notifications";
import {ProfilePage} from "../profile/pages/profile/profile";

import { Response, Http } from "@angular/http";
import { environment } from '../../environments/environment';
import { AppSettings } from '../../conf/app-settings';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { LoginService } from '../login/services/loginService';
import { User } from '../../beans/user';
import * as pathUtils from '../../utils/path.utils';

@Component({
  selector: 'page-nav-tabs',
  templateUrl: 'nav-tabs.html'
})
export class NavTabs {

  Root = HomePage;
  searchPage = SearchPage;
  suggestionsPage = SuggestionsPage;
  profilePage = ProfilePage;
  notificationsPage = NotificationsPage;

  private activeIndex:number=0;
  private nbNewNotifications : number = 0;
  private s: AngularFireObject<any>;
  private user: User = new User();
  private notifFirstCheck: Boolean = true;
  @ViewChild('myTabs') tabRef: Tabs;
  constructor(public navCtrl: NavController,
              private http: Http,
              private db: AngularFireDatabase,
              private loginService: LoginService
            ) {
    this.user=loginService.getUser();
    console.log('user.profilePicture');
    this.checkNewNotifications();
    this.listenForNotifications(this.user._id);
  }
  tabSelected(){
    this.activeIndex=this.tabRef.getSelected().index
    if(this.activeIndex==3){
      this.nbNewNotifications=0;
    }
  }
  checkNewNotifications() {
    this.http
      .get(
        environment.SERVER_URL + pathUtils.CHECK_NEW_NOTIFICATIONS,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            this.nbNewNotifications += response.nbNewNotifications;
          }
        },
        err => {}
      );
  }

  listenForNotifications(userId: string): void {
    this.s = this.db.object('notifications/'+userId+'/notification');
      var item = this.s.valueChanges()
      this.s.snapshotChanges().subscribe(action => {
        var notif = action.payload.val();
        if (notif !== null && !this.notifFirstCheck){
          this.nbNewNotifications++;
        }else{
          this.notifFirstCheck = false;
        }
      });
  }
}
