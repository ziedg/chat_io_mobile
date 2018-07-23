import { Injectable } from '@angular/core';

class RecentRechBeans{
    public _id : string ;
    public firstName : string;
    public lastName : string;
    public profilePicture : string;
}
@Injectable()
export class RecentRechService {

    public listRecentRech : Array<RecentRechBeans> = [];
    public nbMaxRecentRecElement = 5 ;

    constructor(){
        this.actualize();
    }

    public actualize(){
        if(localStorage.getItem('recentRechList')){
            this.listRecentRech = JSON.parse(localStorage.getItem('recentRechList'));
        }
        else {
            this.listRecentRech = [];
        }
    }

    public getListRecentRech(){
        this.actualize();
        return this.listRecentRech;
    }

    public isEmptyList(){
        this.actualize();
        return this.listRecentRech.length == 0;
    }

    public addToListRecentRech(newRechUser){
        this.actualize();
        if(this.isEmptyList()){
            this.listRecentRech.unshift(newRechUser);
        }
        else {
            for(let i=0; i<this.listRecentRech.length; i++) {
                if(this.listRecentRech[i]._id==newRechUser._id){
                    this.listRecentRech.splice(i,1);
                    break;
                }
            }
            this.listRecentRech.unshift(newRechUser);
            while(this.listRecentRech.length>this.nbMaxRecentRecElement){
                this.listRecentRech.splice(this.nbMaxRecentRecElement-1,1);
            }
        }
        localStorage.setItem('recentRechList', JSON.stringify(this.listRecentRech));
    }
}
