import {Component,ChangeDetectorRef} from '@angular/core';

import {IonicPage, NavParams, ViewController} from "ionic-angular";

import { environment } from '../../../../../environments/environment';
import * as pathUtils from '../../../../../utils/path.utils';
import {AppSettings} from '../../../../../conf/app-settings';
import { Http, Response } from "@angular/http";

import { MinifiedUser } from "../../../../../beans/Minified-user";
import {PublicationBean} from "../../../../../beans/publication-bean";
import {User} from "../../../../../beans/user";

import {LoginService} from "../../../../login/services/loginService";


@IonicPage()
@Component({
  selector: 'reaction-modal',
  templateUrl: 'reaction-modal.html'
})
export class reactionModal {

  public InteractionsLikes: Array<MinifiedUser> = [];
  public InteractionsDislikes: Array<MinifiedUser> = [];
  public interactionList: Array<MinifiedUser>= [];

  publicationBean:PublicationBean;
  interactionsLoaded:boolean=false;
  interactionsPage:number=0;
  onLike:boolean=true;
  onLove:boolean =false;

  private user:User;
  profileId;
  constructor(private changeDetector: ChangeDetectorRef,
              private http: Http,
              private viewCtrl: ViewController,
              private navParams: NavParams,
              private loginService: LoginService){
    this.user = loginService.user;
    this.profileId = this.user._id;
  }
  ionViewWillEnter(){
    this.publicationBean= this.navParams.data;
    this.getInteractions();

  }
  onDismissModal(){
    this.viewCtrl.dismiss();
  }
  getInteractions() {
    console.log(this.publicationBean);
    let url: string =
      environment.SERVER_URL + pathUtils.GET_SOCIAL_INTERACTIONS;

    let body = JSON.stringify({
      publId: this.publicationBean._id,
      page: this.interactionsPage
    });

    this.http
      .post(url, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.InteractionsLikes = response.message.likes.slice();
          this.InteractionsDislikes = response.message.dislikes.slice();
          if(this.InteractionsLikes.length>0)
            this.interactionList=this.InteractionsLikes;
          else
            this.interactionList=this.InteractionsDislikes;
          console.log(this.InteractionsLikes);
          console.log(this.InteractionsDislikes);
          console.log(this.interactionList);
          this.interactionsLoaded=true;
        },
        err => {
          this.interactionsLoaded=true;
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }
  onViewListInterractions(type:string){
    if(type=='like'){
      this.onLike=true;
      this.onLove=false;
      this.interactionList=this.InteractionsLikes;
    }
    else if(type=='love') {
      this.onLike=false;
      this.onLove=true;
      this.interactionList=this.InteractionsDislikes;
    }

  }
  subscribeUser(userId) {
    let body = JSON.stringify({
      profileId: userId
    });

    this.http
      .post(
        environment.SERVER_URL + pathUtils.SUBSCRIBE,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
          }
        },
        err => { },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  unsubscribeUser(userId) {
    let body = JSON.stringify({
      profileId: userId
    });

    this.http
      .post(
        environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            console.log("unsubscribed done");
          }
        },
        err => { },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }
  toggleSubscribe(user) {
    if (user.isSubscribed === "true") {
      this.unsubscribeUser(user.userId);
      let like = this.InteractionsLikes.filter(
        x => x.userId === user.userId
      )[0];
      if (like != undefined) {
        like.isSubscribed = "false";
      }
      let dislike = this.InteractionsDislikes.filter(
        x => x.userId === user.userId
      )[0];
      if (dislike != undefined) {
        dislike.isSubscribed = "false";
      }
    } else {
      if (user.isSubscribed === "false") {
        this.subscribeUser(user.userId);
        let like = this.InteractionsLikes.filter(
          x => x.userId === user.userId
        )[0];
        if (like != undefined) {
          like.isSubscribed = "true";
        }
        let dislike = this.InteractionsDislikes.filter(
          x => x.userId === user.userId
        )[0];
        if (dislike != undefined) {
          dislike.isSubscribed = "true";
        }
      }
    }
  }
}
