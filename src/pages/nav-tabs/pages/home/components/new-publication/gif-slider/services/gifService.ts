import {Injectable} from '@angular/core';
import {GifListBean} from "../../../../../../../../beans/gif-list-bean";
import {GifBean} from "../../../../../../../../beans/gif-bean";

@Injectable()
export class GifService {
  nvList: GifListBean = new GifListBean();
  url = "https://api.tenor.com/v1/anonid?key=" + "94VF61TXW797";
  top_10_gifs;
  next: string = "";
  getMoreGifs: boolean = false;
  public anon_id: string;

  /* constructor  */
  constructor() {

    //var nvgif:GifBean = new GifBean();
    // list people
    //nvList.title="persone";
    //this.nvList.list=[];
    this.httpGetAsync(this.url, this.tenorCallback_anonid, this);

    // for( var i=0; i<10; i++){
    //     this.nvList.list.push(this.addtoListGif(this.top_10_gifs[0]["media"][0]["nanogif"]["url"]));

    // }


  }

  httpGetAsync(theUrl, callback, that) {
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        callback(xmlHttp.responseText, that);
      }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
  }

// callback for trending top 10 GIFs
  public tenorCallback_trending(responsetext, that) {
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    that.top_10_gifs = response_objects["results"];

    that.next = response_objects["next"];

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)

    // document.getElementById("preview_gif").src = top_10_gifs[0]["media"][0]["nanogif"]["url"];

    // document.getElementById("share_gif").src = top_10_gifs[0]["media"][0]["tinygif"]["url"];

    return;

  }

// function to call the trending and category endpoints


// callback for anonymous id -- for first time users
  public tenorCallback_anonid(responsetext, that) {
    // parse the json response
    let response_objects = JSON.parse(responsetext);
    //console.log("responsetext "+response_objects["anon_id"]);
    var anon_id = response_objects["anon_id"];
    //console.log("anoooooooonid"+response_objects["anon_id"]);
    // pass on to grab_data
    that.grab_data(anon_id, that);

  }

  public grab_data(anon_id, that) { //  console.log("graaaaaab");
    let trending_url;
// set the apikey and limit
    let apikey = "94VF61TXW797";
    let lmt = 50;
    if (that.getMoreGifs) {
      //console.log(that.next);
      // get the top 10 trending GIFs (updated through out the day) - using the default locale of en_US
      trending_url = "https://api.tenor.com/v1/trending?key=" + apikey + "&limit=" + lmt + "&anon_id" + anon_id + "&pos=" + that.next;
      this.httpGetAsync(trending_url, this.tenorCallback_trending, that);

    } else {
      // get the top 10 trending GIFs (updated through out the day) - using the default locale of en_US
      trending_url = "https://api.tenor.com/v1/trending?key=" + apikey + "&limit=" + lmt + "&anon_id" + anon_id + "&pos=" + that.next;
      this.httpGetAsync(trending_url, this.tenorCallback_trending, that);

    }

    return;
  }


  addtoListGif(urlGIF): GifBean {
    var nvgif: GifBean = new GifBean();
    nvgif.urlGIF = urlGIF;

    return nvgif;
  }

  getGifList(): any {
    return this.top_10_gifs;
  }

  loadMoreGifs() {
    this.getMoreGifs = true;
    this.httpGetAsync(this.url, this.tenorCallback_anonid, this);
  }

}
