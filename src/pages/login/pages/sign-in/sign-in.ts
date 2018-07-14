import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { Response, Http } from "@angular/http";
import {LoadingController, NavController, NavParams} from 'ionic-angular';
//import { HomePage } from '../../../home/home';

import { environment } from "../../../../environments/environment";

/* conf */
import { AppSettings } from "../../../../conf/app-settings";

/* services */
import { LoginService } from "../../services/loginService";
import {TranslateService} from "@ngx-translate/core";

import { Facebook , FacebookLoginResponse } from "@ionic-native/facebook";

/* Utils */
import * as pathUtils from "../../../../utils/path.utils";
import "rxjs/add/operator/map";
import {SignUpPage} from "../sign-up/sign-up";
import {NavTabs} from "../../../nav-tabs/nav-tabs";
import { User } from '../../../../beans/user';
import { SocialUser } from '../../../../beans/social-user';
//import user_offline from "../../../../offline/user-offline";


@Component({
  selector: 'page-login',
  templateUrl: 'sign-in.html',
})
export class SignInPage {
  loadingSign:boolean = false;
  errorMessage: string = "";
  inscriptionPage:any = SignUpPage;
  isLoggedIn:boolean = false;
  users: any;
  facebookUser: SocialUser;

  constructor(public navCtrl: NavController,
    public http: Http,
    public navParams: NavParams,
    private loginService: LoginService,
    public fb: Facebook,
    public translate: TranslateService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private loadingctrl: LoadingController
  ) {
    this.translate.setDefaultLang('en');
    if (this.loginService.isConnected()) {
      this.navCtrl.push(NavTabs);
    }
  }
  getUserInformations(response, responsePic, responseSmallPic,friends) {
    let body={};
    console.log(response.email);
    console.log(response.id);



    body = JSON.stringify({
        profilePicture : responsePic.picture.data.url,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        facebookId: response.id,
        birthday: response.birthday,
        gender: response.gender,
        friends: friends.friends.data,
        profilePictureMin: responseSmallPic.picture.data.url,
    });
    this.changeDetector.markForCheck();

    this.http.post(environment.SERVER_URL + 'signWithFacebook', body, AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
            response => {
            if (response.status == "0") {
                let user : User = response.user ;

                this.loginService.updateUser(user);
                console.log("first name: "+user.firstName);
                this.loginService.setToken(response.token);
                if (response.user.isNewInscri == "true") {
                  localStorage.setItem("isNewInscri", "true");
                }
                this.facebookUser = new SocialUser();
                this.facebookUser.firstName = user.firstName;
                this.facebookUser.lastName = user.lastName;
                this.facebookUser.profilePicture = user.profilePicture;

                localStorage.setItem(
                  "facebookUser",
                  JSON.stringify(this.facebookUser)
                );
                //this.loginService.actualize();
                this.ngZone.run(()=>{
                  this.navCtrl.push(NavTabs);
                });

            }
            else {
                this.errorMessage = response.message;
            }
        },
            err => {
            console.error(err);
            this.errorMessage = "Erreur technique."
        },
        () => {
            console.log('done');
        }
    );
  }

  login() {
    // console.log('logiiiiin()');
    // console.log(this.fb.getLoginStatus);
    // console.log(localStorage.getItem('token'));
    // console.log(localStorage.getItem('user'));
    this.fb.login(['public_profile','user_friends','email'])
      .then((res: FacebookLoginResponse) => {
       // console.log('THEEEEEEEEEEEEN');
        if(res.status === "connected") {
          console.log(res);
          this.getUserFacbookConnexion(res);
  }else{
    console.log('error occuuuured');
  }
}
, (error) => {
  this.fb.login(['public_profile','user_friends','email'])
      .then((res: FacebookLoginResponse) => {
        //console.log('THEEEEEEEEEEEEN');
        if(res.status === "connected") {
          console.log(res);
          this.getUserFacbookConnexion(res);
  }else{
    console.log('error occuuuured');
  }
}
, (error) => {
  alert(error);
  console.log(error);
})
});
  }
//,name,email,cover,birthday,gender,location
// 'email', ,'user_birthday','user_location'
  getUserFacbookConnexion(result) {

    if (result.authResponse) {

      this.fb.api('/me?fields=picture.witdh(1000).height(1000){url}',  ['public_profile'] )
      .then(responsePic => {
      console.log(responsePic);

          this.fb.api('/me?fields=picture.witdh(70).height(70){url}',  ['public_profile'] )
          .then(responseSmallPic => {
          console.log(responseSmallPic);

              this.fb.api('/me?fields=id,first_name,last_name', ['public_profile'])
              .then(response => {
              console.log(response);

                    this.fb.api('me/?fields=friends',  ['user_friends'] )
                    .then(friends => {
                    console.log(friends);
                    this.getUserInformations(response, responsePic, responseSmallPic, friends);

              })



            .catch(e => {
              console.log(e);
              console.log("err get user info");
            });
        })
        .catch(e => {
          console.log(e);
        });
    })
    .catch(e => {
      console.log(e);
      console.log("err get user info");
    });

  })
  .catch(e => {
    console.log(e);
    console.log("err get user info");
  });

    }

}



  ionViewWillEnter() {
    //console.log(localStorage.getItem('token')); //null
    if (localStorage.getItem('token') == 'offline') {
      this.navCtrl.push(NavTabs);
    }
    console.log(this.loginService.isConnected());
    if (this.loginService.isConnected()) {
      this.navCtrl.push(NavTabs);
      //this.router.navigate(["/main/home"]);
    }
    else {
      console.log("user not connectedd");
    }
    if (this.loginService.isWasConnectedWithFacebook()) {
      //this.router.navigate(["/sign-in/facebook-sign-in"]);
      console.log('ionViewWillEnter: isWasConnectedWithFacebook');
    }
  }


  onLogin(form: any) {
    const loading = this.loadingctrl.create({
      content: 'signing you in...'
    });
    loading.present();
    let email:string = form.value.email.trim().toLowerCase();
    let password:string = form.value.password;
    //loadingSign: boolean = false;
    console.log(email, password);

    if (email == "") {loading.dismiss();
      this.errorMessage = "SP_FV_ER_EMAIL_EMPTY";
      return;
    }

    if (password == "") {loading.dismiss();
      this.errorMessage = "SP_FV_ER_PASSWORD_EMPTY";
      return;
    }

    //email = email.trim().toLowerCase();
    this.loadingSign = true;
    console.log(form.value);
    let body = JSON.stringify({'email':email,'password':password});
    this.http
      .post(
        environment.SERVER_URL + pathUtils.SIGN_IN,
        body,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == "0") {
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            this.loginService.actualize();
            loading.dismiss();
            console.log("sign-in success ! redirect to home page");
            this.navCtrl.push(NavTabs);
          } else {
            this.errorMessage = response.error;
            loading.dismiss();
          }
        },
        err => {
          this.errorMessage = "SP_ER_TECHNICAL_ERROR";
          loading.dismiss();
        },
        () => {
          this.loadingSign = false;
        }
      );
  }
  onChooseLan(lan:string){
    localStorage.setItem('userLang',lan);
    this.translate.setDefaultLang(lan);
  }

}
