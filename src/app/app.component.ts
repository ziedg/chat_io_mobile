import { Component } from '@angular/core';
import { Platform, AlertController }  from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';

import {SignInPage} from "../pages/login/pages/sign-in/sign-in";
import { timer } from 'rxjs/observable/timer';

import { Push, PushObject, PushOptions} from '@ionic-native/push';
import { environment } from '../environments/environment';
import { AppSettings } from '../conf/app-settings';
import { LoginService } from '../pages/login/services/loginService';
import { User } from '../beans/user';
import * as pathUtils from '../utils/path.utils';
import { ToastController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  http: any;
  rootPage:any = SignInPage;
  showSplash = true;
  private user: User = new User();

  pushsetup() {
    const options: PushOptions = {
     android: {
         senderID: '861552240215'
     },
     ios: {
         alert: 'true',
         badge: true,
         sound: 'false'
     },
     windows: {}
  };
  const pushObject: PushObject = this.push.init(options);

  pushObject.on('notification').subscribe((notification: any) => {
    if (notification.additionalData.foreground) {
      let youralert = this.alertCtrl.create({
        title: 'New Push notification',
        message: notification.message
      });
      youralert.present();
    } else {
      //if user NOT using app and push notification comes
      //TODO: Your logic on click of push notification directly
      //self.nav.push(DetailsPage, {message: data.message});
      console.log("Push notification clicked");
    }
  });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log(registration.registrationId)

        let toast = this.toastCtrl.create({
          message: registration.registrationId,
          duration: 3000,
          position: 'top'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      this.user = this.loginService.getUser();
      let body = {
        userId: this.user._id,
        token: registration.registrationId
      };
      this.http.post(environment.SERVER_URL + pathUtils.IONIC_PUSH_SUBSCRIBE, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
        },
        err => {
        },
        () => {
        });
    });

    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private translate: TranslateService,
              public alertCtrl:AlertController,
              public push: Push,
              private loginService: LoginService,
              private toastCtrl: ToastController) {
    translate.setDefaultLang('fr');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      splashScreen.hide();
      statusBar.styleDefault();
      this.pushsetup();

      timer(0).subscribe(() => this.showSplash = false)
    });
  }


}
