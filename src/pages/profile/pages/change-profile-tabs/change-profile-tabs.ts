import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

import { ChangePasswordPage } from '../change-password/change-password';
import { ChangeProfilePage } from '../change-profile/change-profile';


@Component({
  selector: 'page-modifier-profile-tabs',
  templateUrl: 'change-profile-tabs.html',
})
export class ChangeProfileTabsPage {
  rootPage:any;
  constructor(public menuCtrl: MenuController){
    this.rootPage=ChangeProfilePage;
  }
  onClick(type:string){
    switch(type){
      case 'profil': this.rootPage=ChangeProfilePage;
        break;
      case 'password': this.rootPage=ChangePasswordPage;
    }
    this.menuCtrl.close();
  }


}
