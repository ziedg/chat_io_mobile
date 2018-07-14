import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebugOnlyPage } from './debug-only';

@NgModule({
  declarations: [
    DebugOnlyPage,
  ],
  imports: [
    IonicPageModule.forChild(DebugOnlyPage),
  ],
})
export class DebugOnlyPageModule {}
