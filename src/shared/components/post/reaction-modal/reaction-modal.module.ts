import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { reactionModal } from './reaction-modal';

@NgModule({
  declarations: [
    reactionModal,
  ],
  imports: [
    IonicPageModule.forChild(reactionModal),
  ],
})
export class reactionModalPageModule {}
