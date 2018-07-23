import {ChangeDetectorRef, Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {User} from "../../beans/user";
import {LoginService} from "../login/services/loginService";
import {TranslateService} from "@ngx-translate/core";
import {AppSettings} from '../../conf/app-settings';
import {environment} from '../../environments/environment';
import {Http, Response} from '@angular/http';
import * as pathUtils from '../../utils/path.utils';
import {DateService} from "../../shared/services/dateService";
import {ProfilePage} from "../profile/pages/profile/profile";
import {PostPage} from "../post/pages/post";
import {NotificationBean} from "../../beans/notification-bean";

import { PublicationBean } from "../../beans/publication-bean";
import { PostService } from "../../shared/services/postService";

//import notifications_offline from "../../offline/notifications-offline";

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  lastNotifId = "";
  showButtonMoreNotif: Boolean = false;
  showNoNotif: Boolean = false;
  listNotif;//: Array<NotificationBean> = [];
  user: User = new User();
  noMoreNotif: Boolean = false;

  public publication: PublicationBean;
  /* pages */
  profilePage: any = ProfilePage;
  postPage: any = PostPage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loginService: LoginService,
              private translate: TranslateService,
              private http: Http,
              private changeDetector: ChangeDetectorRef,
              private dateService: DateService,
              private postService: PostService) {
    this.user = this.loginService.getUser();
    //this.listNotif = notifications_offline;
    this.getNotifications();
  }
  ionViewWillEnter(){


  }

  getNotifications() {
    this.lastNotifId = "";
    this.listNotif = [];
    this.http.get(
      environment.SERVER_URL + pathUtils.GET_NOTIFICATIONS + this.lastNotifId,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          console.log(response);
          if (response.length != 0) {
            this.showNoNotif = false;
            for (let i = 0; i < response.length; i++) {
              this.listNotif.push(response[i]);
              this.lastNotifId = response[i]._id;
            }
            this.showButtonMoreNotif = response.length == 5;
          }
          else {
            this.showNoNotif = true;
            this.showButtonMoreNotif = false;
          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  getNotificationTime(publishDateString: string): string {
    let date = new Date();
    let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    let publishDate = this.dateService.convertIsoToDate(publishDateString);
    let displayedDate = "";

    let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
    if (diffDate.day > 28) {
      displayedDate = this.dateService.convertPublishDate(publishDate);
    }
    else if (diffDate.day && diffDate.day == 1) {
      displayedDate = this.translateCode("prefix_date_yesterday");
    }
    else if (diffDate.day > 0) {
      displayedDate = `${diffDate.day} ${this.translateCode("prefix_date_days")}`;
    }
    else if ((diffDate.hour) && (diffDate.hour == 1)) {
      displayedDate = this.translateCode("prefix_date_one_hour");
    }
    else if ((diffDate.hour) && (diffDate.hour > 0)) {
      displayedDate = `${diffDate.hour} ${this.translateCode("prefix_date_hours")}`;
    }
    else if ((diffDate.min) && (diffDate.min > 1))
      displayedDate = `${diffDate.min} ${this.translateCode("prefix_date_minutes")}`;
    else
      displayedDate = this.translateCode("prefix_date_now");
    return displayedDate;
  }

  goToPost(source, parm, notifId) {
    this.markView(notifId);
    this.navCtrl.push(this.postPage, {})
  }

  openNotifPage(notif: NotificationBean) {
    if(notif.type == 'subscribe') {
      this.markView(notif._id);
      //let param = notif.publId;
      //this.router.navigate(["/main/" + source, parm]);
      this.navCtrl.push(this.profilePage, {userId: notif.profiles[0]._id})
    }
    else {
      this.markView(notif._id);
      //let param = notif.publId;
      //this.router.navigate(["/main/" + source, parm]);
      this.navCtrl.push(this.postPage,{'publId': notif.publId});
    }
  }

  markView(notifId) {
    let body = JSON.stringify({
      notificationId: notifId
    });
    this.http.post(environment.SERVER_URL + pathUtils.MARK_VIEW, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
        },
        err => {
        },
        () => {
        });
  }

  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate: string) => {
      message = resTranslate;
    });
    return message;
  }
  doRefresh(refresher) {
    this.refrech(refresher);
  }
  refrech(refresher) {
    this.lastNotifId = "";
    this.listNotif = [];
    this.http.get(
      environment.SERVER_URL + pathUtils.GET_NOTIFICATIONS + this.lastNotifId,
      AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          console.log(response);
          if (response.length != 0) {
            this.showNoNotif = false;
            for (let i = 0; i < response.length; i++) {
              this.listNotif.push(response[i]);
              this.lastNotifId = response[i]._id;
            }
            this.showButtonMoreNotif = response.length == 5;
          }
          else {
            this.showNoNotif = true;
            this.showButtonMoreNotif = false;
          }
          refresher.complete();
        },
        err => {
          refresher.complete();
        },
        () => {
          this.changeDetector.markForCheck();
          refresher.complete();
        }
      );
  }

}
