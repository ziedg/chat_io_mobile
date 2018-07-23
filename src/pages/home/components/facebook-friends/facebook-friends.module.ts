import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacebookFriendsPage } from './facebook-friends';

@NgModule({
  declarations: [
    FacebookFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(FacebookFriendsPage),
  ],
})
export class FacebookFriendsPageModule {}
