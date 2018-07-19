import { GifService } from '../../../../shared/services/gifService';

import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';



@Component({
  selector: 'gif-slider',
  templateUrl: 'gif-slider.html'
})
export class GifSliderComponent {

  public UrlGifList = [];
  gifLimitIndex: number = 8;
  previousActiveGifIndex = -1;
  isLoadingMoreGifs: boolean = false;
  isLoadingInitialGifs: boolean = false;
  showGif:boolean=true;
  text: string;
  rightSwipeCounter: any = 0;

  @Output() onPreview = new EventEmitter();
  @Output() onClose = new EventEmitter();

  


  constructor(private renderer: Renderer2,
              private gifService: GifService) {
    
  
this.isLoadingInitialGifs = true; 
this.gifService.getGifList().then((gifs: any[]) => {

for (let i = 0; i < gifs.length; i++) {
var GifObject = {Post: gifs[i]["media"][0]["gif"]["url"], Preview: gifs[i]["media"][0]["nanogif"]["url"], Show: true};

this.UrlGifList.push(GifObject); //UrlGifList is undefined

}
this.isLoadingInitialGifs = false;
});
  }

  

  swipe(event){
    if(event.direction === 2) {
      console.log('right');
      this.rightSwipeCounter ++;
      if(this.rightSwipeCounter >= this.gifLimitIndex){
        this.loadMoreGifs();
        this.rightSwipeCounter = 0;
      }
    }
    if(event.direction === 4) {
      console.log('left');
      this.rightSwipeCounter --;
    }

  }

  

  loadMoreGifs() {
    this.isLoadingMoreGifs = true;
    this.gifService.loadMoreGifs().then((gifs: any[]) => {
    
      for (let i = 0; i < gifs.length; i++) {
        var GifObject = {Post: gifs[i]["media"][0]["gif"]["url"], Preview: gifs[i]["media"][0]["nanogif"]["url"], Show: true};
        
        this.UrlGifList.push(GifObject); //UrlGifList is undefined
  
      }
      this.isLoadingMoreGifs = false;
    });
    
    this.gifLimitIndex += 8;
  }

  


gifPreview(Url){
  //console.log("chiiiild");
  var urlGIF = Url.Post;
    var j = this.previousActiveGifIndex ;
    
    var i = this.UrlGifList.indexOf(Url);
    if(j != -1){
      this.UrlGifList[j].Show = true;
    }
    this.UrlGifList[i].Show = false;
    
    this.previousActiveGifIndex = i;
    this.gifService.removeAnimationEmitter.subscribe(a =>{
      //console.log(this.UrlGifList[i].Show);
      this.UrlGifList[i].Show = true;
    });
    this.onPreview.emit(urlGIF);
  
}

  onTapClose(){
    this.showGif=!this.showGif;
    console.log("close");
    this.onClose.emit(this.showGif);
  }

}
