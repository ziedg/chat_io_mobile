import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SupportTabsPage } from '../info/pages/support-tabs/support-tabs';
import { SuggestionsPage } from '../suggestions/suggestions';
import { ProfilePage } from '../profile/pages/profile/profile';
import { ChangeProfileTabsPage } from '../profile/pages/change-profile-tabs/change-profile-tabs';
import { SignInPage } from '../login/pages/sign-in/sign-in';
import { SignUpPage } from '../login/pages/sign-up/sign-up';
import { HomePage } from '../home/home';
import {TranslateService} from '@ngx-translate/core';
import {LoginService} from "../login/services/loginService";

/**
 * Generated class for the DebugOnlyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-debug-only',
  templateUrl: 'debug-only.html',
})
export class DebugOnlyPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loginService: LoginService,
              public translate: TranslateService) {
  }

  onClick(page:string){
    switch(page){
      case "support": this.navCtrl.push(SupportTabsPage);break;
      case "suggestions": this.navCtrl.push(SuggestionsPage);break;
      case "profile":
        if(this.loginService.isConnected())
          this.navCtrl.push(ProfilePage, {'userId': this.loginService.getUser()._id});
        else
          this.navCtrl.push(SignInPage);
        break;
      case "modifier": this.navCtrl.push(ChangeProfileTabsPage);break;
      case "sign-in": this.navCtrl.push(SignInPage);break;
      case "sign-up": this.navCtrl.push(SignUpPage);break;
      case "home": this.navCtrl.push(HomePage); break;



    }
  }

}
