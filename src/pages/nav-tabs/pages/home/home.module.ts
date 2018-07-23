import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {ScrollHideDirective} from "./directives/scroll-hide";
import {GifSliderComponent} from "./components/gif-slider/gif-slider";
import {NewPublicationPage} from "./components/new-publication/new-publication";
import {GifSlider} from "./components/new-publication/gif-slider/gif-slider";

@NgModule({
  declarations: [
    HomePage,
    ScrollHideDirective,
    GifSliderComponent,
    NewPublicationPage,
    GifSlider
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
