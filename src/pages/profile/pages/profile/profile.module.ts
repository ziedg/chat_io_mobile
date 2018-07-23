import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ProfilePage } from "./profile";
import { ChangeProfilePage } from "../change-profile/change-profile";
import { ChangeProfileTabsPage } from "../change-profile-tabs/change-profile-tabs";
import { ChangePasswordPage } from "../change-password/change-password";
import { CommonModule } from "@angular/common";
import {AvailablePicture} from "../../../../shared/pipes/AvailablePicture.pipe";

@NgModule({
  declarations: [
    ProfilePage,
    ChangeProfilePage,
    ChangeProfileTabsPage,
    ChangePasswordPage,
    AvailablePicture,
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(ProfilePage),
    IonicPageModule.forChild(ChangeProfilePage),
    IonicPageModule.forChild(ChangeProfileTabsPage),
    IonicPageModule.forChild(ChangePasswordPage)
  ],
  providers: [

  ]
})
export class ProfileModule {}
