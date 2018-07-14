import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NavTabs } from './nav-tabs';

@NgModule({
  declarations: [
    NavTabs,
  ],
  imports: [
    IonicPageModule.forChild(NavTabs),
  ],
})
export class NavTabsModule {}
