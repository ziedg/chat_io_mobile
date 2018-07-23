import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild, Output, EventEmitter} from '@angular/core';
import {GifService} from "./services/gifService";


@Component({
  selector: 'gif-slider',
  templateUrl: './gif-slider.html'
})
export class GifSlider implements AfterViewInit {

  public UrlGifList = [];
  ListOfGifs = [];
  NewListOfGifs = [];
  gifLimitIndex: number = 47;
  firstGifRequest = true;
  @Output() myEvent = new EventEmitter();

  offset_x_pos: number = 0;
  sliderWidth: number = 100;
  sliderHeight: number = 60;
  sliderBtnWidth: number = 22;
  sliderMarginRight: number = 4;

  //list: Array<number> = [1, 2, 3, 4, 5];

  @ViewChild('slidesContainer') slidesContainer: ElementRef;
  @ViewChild('container') container: ElementRef;

  constructor(private renderer: Renderer2,
              private gifService: GifService) {
    this.gifService.loadMoreGifs();
    this.ListOfGifs = gifService.getGifList();
    for (let i = 0; i < this.ListOfGifs.length; i++) {
      this.UrlGifList[i] = this.ListOfGifs[i]["media"][0]["nanogif"]["url"];

    }
  }

  loadMoreGifs() {
    this.gifService.loadMoreGifs();
    //console.log(this.gifService.getGifList());


    // if (this.firstGifRequest){
    //   this.firstGifRequest = false;
    //   this.gifService.loadMoreGifs();
    //   }
    this.NewListOfGifs = this.gifService.getGifList();
    this.gifService.loadMoreGifs();
    //console.log(this.NewListOfGifs);
    let currentLength = this.UrlGifList.length;
    for (let i = 0; i < this.NewListOfGifs.length; i++) {
      this.UrlGifList[currentLength] = this.NewListOfGifs[i]["media"][0]["nanogif"]["url"];
      currentLength++;
    }
    //console.log(currentLength);
    this.gifLimitIndex += 50;
  }

  ngAfterViewInit() {
    let containerStyle = this.container.nativeElement.style;
    containerStyle.setProperty('--slider-w', `${this.sliderWidth}px`);
    containerStyle.setProperty('--slider-h', `${this.sliderHeight}px`);
    containerStyle.setProperty('--slider-btn-w', `${this.sliderBtnWidth}px`);
    containerStyle.setProperty('--slider-m-r', `${this.sliderMarginRight}px`);
  }


  translate_it(n: number) {
    //console.log("gif length: "+ (this.ListOfGifs.length-3));
    let offset_x_n: any = this.offset_x_pos + n;
    //console.log("offset_x_n: "+offset_x_n);

    if (offset_x_n == -this.gifLimitIndex) {
      //console.log("max leeength");
      this.loadMoreGifs();
    }

    if (offset_x_n <= 0 && offset_x_n > -this.UrlGifList.length) {

      this.offset_x_pos = offset_x_n;
      //console.log("offset_x_pos: "+this.offset_x_pos);
      let offset_x = 3 * this.offset_x_pos * (this.sliderWidth + this.sliderMarginRight);
      //console.log("offset_x: "+offset_x);
      this.renderer.setStyle(this.slidesContainer.nativeElement,
        'transform',
        `translatex(${offset_x}px)`);
    }

  }

  gifPreview(urlGIF) {
    //console.log("chiiiild");
    this.myEvent.emit(urlGIF);
  }

}
