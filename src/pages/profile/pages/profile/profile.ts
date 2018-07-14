import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import { Http, Response } from '@angular/http';

import { ChangeProfilePage } from '../change-profile/change-profile';
import { ChangePasswordPage } from '../change-password/change-password';
import { PublicationBean } from '../../../../beans/publication-bean';

import { AppSettings } from "../../../../conf/app-settings";
import * as pathUtils from "../../../../utils/path.utils";
import { environment } from "../../../../environments/environment";
import {User} from "../../../../beans/user";
import {TranslateService} from "@ngx-translate/core";
import {LoginService} from "../../../login/services/loginService";
import {SignInPage} from "../../../login/pages/sign-in/sign-in";
import publicationBeanList_offline from "../../../../offline/publications-offline";

import * as jQuery from "jquery";

import { App } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public publicationBeanList;//:Array<PublicationBean> = [];
  // user displayed in profile page
  userDisplayed;//: User;
  userDisplayedId: string;
  // current user
  currentUser;//: User;
  isCurrentUser: boolean;
  profileOptions = {

    profile_options : "profile_options",
    update_profile : "main_menu_update_profile",
    update_password : "parameters_update_password",
    logout : "main_menu_log_out",
    cancel : "cancel",
    profile_report:"profile_menu_signaler"
  };

  showLoading = false;
  lastPostId:string = "";

  lastRouterProfileId;
  editModal = false;
  isLock:boolean = false;
  publishBox = false;
  firstListSub:Array<User> = [];
  listAllSub:Array<User> = [];
  showMoreSub = false;
  lastSubscribeId:string = "";
  stopGiveMeMoreSub:boolean = false;
  editDescriptionEnable = false;
  linkLoading = false;
  isEmpty = true;
  profilePictLoad:boolean = false;
  loadMore =true;
  firstSCroll =true;

  uploadedProfilePicture:File;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public loginService: LoginService,
              public actionSheetCtrl: ActionSheetController,
              public http: Http,
              private changeDetector: ChangeDetectorRef,
              public app: App){
    this.userDisplayedId = this.navParams.get('userId');
    this.currentUser = this.loginService.getUser();

    this.getProfile(this.userDisplayedId);
    for(let propt in this.profileOptions) {
      this.translate.get(this.profileOptions[propt])
        .subscribe((res: string) => {this.profileOptions[propt] = res})
    }

  }
  ionViewWillEnter(){
    this.userDisplayedId = this.navParams.get('userId');
    this.currentUser = this.loginService.getUser();

    this.getProfile(this.userDisplayedId);
  }

  getProfile(userId:string){
    if(!this.userDisplayedId) {
      this.userDisplayed = this.currentUser;
      this.isCurrentUser = true;
    }
    else {
      this.isCurrentUser = this.currentUser._id == this.userDisplayedId;
    }

    if(this.isCurrentUser) {
      this.userDisplayed = this.currentUser;
      this.loadFirstPosts();
    }
    else if(userId) {
      this.http.get(
        environment.SERVER_URL + pathUtils.GET_PROFILE + userId,
        AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
          response => {
            if(response.status == "0") {
              this.userDisplayed = response.user;
              console.log(this.userDisplayed);
              this.loadFirstPosts();
            }
          },
          err => {
            console.log("user NOT FOUND!")
            //this.isNotFound = true;
          },
          () => {
          }
        );
    }

  }

  loadFirstPosts() {
    if(localStorage.getItem('token') == 'offline') {
      console.log("load first posts");
      this.publicationBeanList = publicationBeanList_offline;
      return;
    }
    console.log("loading first posts");
    this.isLock = true;
    this.showLoading = true;
    let urlAndPara = environment.SERVER_URL +
      pathUtils.GET_PROFILE_PUBLICATIONS
        .replace("PROFILE_ID", this.userDisplayed._id);
    this.http.get(
      urlAndPara, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          this.publicationBeanList = [];
          this.putIntoList(response);
          if(response.length === 0){this.loadMore=false}
          this.changeDetector.markForCheck();
          if(response.length === 0){this.loadMore=false}
        },
        err => {
          setTimeout(() => {
            this.showLoading = false;
            this.isLock = true;
          }, 3000);
        },
        () => {
        }
      );
  }

  putIntoList(response) {
    if (!response.length || response.length == 0) {
      this.showLoading = false;
      this.isLock = false;
      return;
    }
    let element;
    for (let i = 0; i < response.length; i++) {
      element = response[i];
      element.displayed = true;

      element.isShared = response[i].isShared == "true";

      element.isLiked = response[i].isLiked == "true";

      element.isDisliked = response[i].isDisliked == "true";

      for (let j = 0; j < response[i].comments.length; j++) {
        element.comments[j].isLiked = response[i].comments[j].isLiked == "true";

        element.comments[j].isDisliked = response[i].comments[j].isDisliked == "true";

        if (j == response[i].comments.length) {
          this.publicationBeanList.push(element);

          if (i == response.length - 1) {
            this.showLoading = false;
            this.isLock = false;
            this.lastPostId = response[i]._id;
          }
        }
      }

      this.publicationBeanList.push(element);
      if (i == response.length - 1) {
        this.showLoading = false;
        this.isLock = false;
        this.lastPostId = response[i]._id;
      }

    }
  }


  onLoadMorePosts(infiniteScroll) {
    console.log("load more posts");
    this.isLock = true;
    this.showLoading = true;
    let urlAndPara = environment.SERVER_URL
      + pathUtils.GET_PROFILE_PUBLICATIONS
        .replace("PROFILE_ID", this.userDisplayed._id)
      + this.lastPostId;
    this.http.get(
      urlAndPara, AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          this.putIntoList(response);
          if(response.length === 0){this.loadMore=false}
          this.changeDetector.markForCheck();
          if(response.length === 0){this.loadMore=false}
          infiniteScroll.complete();
        },
        err => {
          this.isLock = false;
          this.showLoading = false;
        },
        () => {
        }
      );
  }



  onShowOptionsCurrentuser(){

    let actionSheet= this.actionSheetCtrl.create({
      title: this.profileOptions.profile_options,
      buttons: [
        {
          text: this.profileOptions.update_profile,
          handler: () => {
            this.navCtrl.push(ChangeProfilePage);
          }
        },
        {
          text: this.profileOptions.update_password,
          handler: () => {
            this.navCtrl.push(ChangePasswordPage);
          }
        },
        {
          text: this.profileOptions.logout,
          handler: () => {
            this.loginService.logout();
            this.app.getRootNav().setRoot(SignInPage);
          }
        },
        {
          text: this.profileOptions.cancel,
          role: 'cancel',

        }
      ]
    });
    actionSheet.present();
  }

  profilepicture(){
    if(this.navCtrl.getActive().name == "ProfilePage"){
      if(this.isCurrentUser){
        let actionSheet= this.actionSheetCtrl.create({
          title: "change picture",
          buttons: [
            {
              text: "import picture",
              handler: () => {
                jQuery(("#file-profile")).click();
              }
            }]});
        actionSheet.present();
      }
      else console.log("no");
    }
  }

  updateProfilePicture($event) {
    var inputValue = $event.target;

    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedProfilePicture = inputValue.files[0];
      this.previewProfilePicture(this.uploadedProfilePicture);
    }
    else {
      this.uploadedProfilePicture = null;
    }
  }

  changePhotoCancel() {
    this.uploadedProfilePicture = null;
    jQuery("#file-profile").val("");
    jQuery(".profile-photo").css('background-image', 'url(' + this.userDisplayed.profilePicture + ')');
  }

  previewProfilePicture(uploadedFile) {
    var preview = jQuery('.profile-photo');
    var file = uploadedFile;
    var reader = new FileReader();

    reader.addEventListener("load", function () {
      jQuery(preview).css('background-image', 'url(' + reader.result + ')');

    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  changePhotoUpload() {
    if (!this.uploadedProfilePicture) {
      return;
    }

    this.changeDetector.markForCheck();
    var data = new FormData();
    data.append('profilePicture', this.uploadedProfilePicture);
    this.profilePictLoad = true;
    this.http.post(
      environment.SERVER_URL + pathUtils.UPDATE_PROFILE_PICTURE,
      data,
      AppSettings.OPTIONS_POST)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

          if (response.status == "0") {




            if (this.loginService.isWasConnectedWithFacebook){
              let fuser = this.loginService.getFacebookUser();
              if( fuser && fuser.profilePicture)
              { fuser.profilePicture=response.profile.profilePicture
                localStorage.setItem('facebookUser',JSON.stringify(fuser));
              }
            }
            let user = this.loginService.getUser();
            user.profilePicture=response.profile.profilePicture
            localStorage.setItem('user', JSON.stringify(response.profile));
            this.loginService.actualize();
            this.changePhotoCancel();

            this.uploadedProfilePicture = null;
            jQuery("#file-profile").val("");
            this.profilePictLoad = false;
            jQuery(".profile-photo").css('background-image', 'url(' +response.profile.profilePicture || ""+')');
            this.profilePictLoad = false;
         /*   swal({
              title: this.translateCode("profile_update_picture_popup_notification_title"),
              text: this.translateCode("profile_update_picture_popup_notification_text"),
              type: "success",
              timer: 2000,
              showConfirmButton: false
            }).then(function () {
            }, function (dismiss) {
            });*/
          }
          else {
            this.profilePictLoad = false;
            this.changePhotoCancel();
          }
        },
        err => {
          this.profilePictLoad = false;
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate:string) => {
      message = resTranslate;
    });
    return message;
  }


  onShowOptionsNotCurrentuser(){
    let actionSheet= this.actionSheetCtrl.create({
      title: this.profileOptions.profile_options,
      buttons: [
        {
          text: this.profileOptions.profile_report,
          handler: () => {
            console.log("implements function..");
          }
        },
        {
          text: this.profileOptions.cancel,
          role: 'cancel',

        }
      ]
    });
    actionSheet.present();
  }
  deletePost(event: PublicationBean) {
    this.publicationBeanList = this.publicationBeanList.filter(el => el._id != event._id);
  }

  onClickUnsubscribe(userDisplayed:User){
    let body = JSON.stringify({
      profileId: userDisplayed._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.UNSUBSCRIBE,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            userDisplayed.isFollowed = false;
            userDisplayed.nbSuivi--;
          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }
  onClickSubscribe(userDisplayed:User) {
    let body = JSON.stringify({
      profileId: userDisplayed._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.SUBSCRIBE,
      body,
      AppSettings.OPTIONS
    )
      .map((res:Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            userDisplayed.isFollowed = true;
            userDisplayed.nbSuivi++;

          }
        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }
}
