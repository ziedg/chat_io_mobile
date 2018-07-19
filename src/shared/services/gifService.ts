
import { Injectable, EventEmitter } from '@angular/core';



export async function httpGetAsync(theUrl)
{
    
    return new Promise(function (resolve, reject) {
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            //callback(xmlHttp.responseText, that);
            resolve(xmlHttp.responseText);
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);
    
    });
}


export async function tenorCallback_trending(responsetext)
{
    
    
    return new Promise(function (resolve) {
        
        var response_objects = JSON.parse(responsetext);
        var top_10_gifs = response_objects["results"];
        next = response_objects["next"];

   
    resolve(top_10_gifs);
        
    
    });
          
    

    

}

// function to call the trending and category endpoints
export async function grab_data(anon_id)
{
    
    // data will be loaded by each call's callback
    
}


// callback for anonymous id -- for first time users
export async function tenorCallback_anonid(responsetext)
{
    
    return new Promise(function (resolve) {
        var response_objects = JSON.parse(responsetext);

        var anon_id = response_objects["anon_id"];
        // set the apikey and limit
        var apikey = "94VF61TXW797";
        var lmt = 50;
        
        var trending_url = "https://api.tenor.com/v1/trending?key=" + apikey + "&limit=" + lmt + "&anon_id" + anon_id + "&pos=" + next;
        resolve(trending_url);
        
        
        });
}


var url = "https://api.tenor.com/v1/anonid?key=" + "94VF61TXW797";
export var next ='';
export var getMoreGifs: boolean = false;




@Injectable()
export class GifService {

removeAnimationEmitter = new EventEmitter<any>();
     
    constructor(){
     }


removeAnimation(a){
this.removeAnimationEmitter.emit(a);
//console.log("emitteeeeeeeeed");
}


async getGifList(){
    var anonRes;
    var trendingRes;
    var jsonRes
    
     await httpGetAsync(url).then(responseText => {anonRes = responseText; });
     await tenorCallback_anonid(anonRes).then(responseText => {trendingRes = responseText; });
     await httpGetAsync(trendingRes).then(responseText => {jsonRes = responseText;});
     const gifs = await tenorCallback_trending(jsonRes);
     return gifs;

}



async loadMoreGifs(){
    //getMoreGifs = true;
    var anonRes;
    var trendingRes;
    var jsonRes
    
     await httpGetAsync(url).then(responseText => {anonRes = responseText; });
     await tenorCallback_anonid(anonRes).then(responseText => {trendingRes = responseText; });
     await httpGetAsync(trendingRes).then(responseText => {jsonRes = responseText; });
     const gifs = await tenorCallback_trending(jsonRes);
     return gifs;
}

 

}