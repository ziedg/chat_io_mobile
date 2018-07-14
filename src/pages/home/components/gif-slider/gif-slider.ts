import { GifService } from '../../../../shared/services/gifService';

import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';
import {HomePage } from '../../home';


@Component({
  selector: 'gif-slider',
  templateUrl: 'gif-slider.html'
})
export class GifSliderComponent {
  public UrlGifList = [];
  ListOfGifs = [];
  NewListOfGifs = [];
  gifLimitIndex: number = 47;
  firstGifRequest = true;
  @Output() myEvent = new EventEmitter();
  @Output() onClose = new EventEmitter();
  showGif:boolean=true;
  text: string;

  constructor(private renderer: Renderer2,
              private gifService: GifService) {
    var self = this;
  }

firstFunction(_callback){
  this.gifService.loadMoreGifs();
  console.log("heeeeeeeeeeere");
  _callback();
}

ngOnInit(){
  var self = this;
  this.firstFunction(function() {
        self.ListOfGifs = self.gifService.getGifList();
        for( var i=0; i<self.ListOfGifs.length; i++){
          self.UrlGifList[i] = self.ListOfGifs[i]["media"][0]["nanogif"]["url"];

        }
        console.log("callbaack");
    });

}

ionViewWillEnter(){


}

loadMoreGifs(){
  //this.gifService.loadMoreGifs();
  //console.log(this.gifService.getGifList());


  // if (this.firstGifRequest){
  //   this.firstGifRequest = false;
  //   this.gifService.loadMoreGifs();
  //   }
  this.NewListOfGifs = this.gifService.getGifList();
  this.gifService.loadMoreGifs();
  //console.log(this.NewListOfGifs);
  var currentLength = this.UrlGifList.length;
  for( var i=0; i<this.NewListOfGifs.length; i++){
    this.UrlGifList[currentLength] = this.NewListOfGifs[i]["media"][0]["nanogif"]["url"];
    currentLength++;
  }
  //console.log(currentLength);
  this.gifLimitIndex +=50;
}






gifPreview(urlGIF){
  //console.log("chiiiild");
  this.myEvent.emit(urlGIF);
}

  onTapClose(){
    this.showGif=!this.showGif;
    console.log("close");
    this.onClose.emit(this.showGif);
  }

}
