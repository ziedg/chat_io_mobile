import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams} from 'ionic-angular';
import { SignInPage } from "../sign-in/sign-in";
import { HomePage } from "../../../nav-tabs/pages/home/home";
//import { emailValidator } from '../../../utils/validationService';
import * as pathUtils from '../../../../utils/path.utils';
import { LoginService } from '../../services/loginService';
import { environment } from '../../../../environments/environment';
import { Title } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../../../utils/validationService';
import { AppSettings } from "../../../../conf/app-settings";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-inscription',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  form;
  errorMessage:string = null;
  loadingSign=false;

  loginPage:any = SignInPage;
  homePage:any = HomePage;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              private title:Title, private http: Http,
              private loginService: LoginService, private loadingctrl: LoadingController) {

  this.title.setTitle("Inscription - Speegar");
  this.translate.setDefaultLang('en');
  if(this.loginService.isConnected())
  {
    //this.navCtrl.setRoot(this.homePage);
  }

  this.form = new FormGroup({
  firstName: new FormControl('', Validators.required),
  lastName: new FormControl('', Validators.required),
  email: new FormControl('',Validators.compose([Validators.required, emailValidator ]) ),
  password: new FormControl('', Validators.required)
                          });

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  onSubmit(form: any){
    const loading = this.loadingctrl.create({
      content: 'signing you up...'
    });
    loading.present();
  if(form.value.lastName == ""){loading.dismiss();
      this.errorMessage ="SP_FV_ER_LAST_NAME_SBN_EMPTY";
      return ;
  }
  if(form.value.firstName == ""){loading.dismiss();

      this.errorMessage ="SP_FV_ER_FIRST_NAME_SBN_EMPTY";
      return ;
  }
  if(form.value.email == ""){loading.dismiss();
      this.errorMessage ="SP_FV_ER_EMAIL_SBN_EMPTY";
      return ;
  }
  if(emailValidator(form.controls.email)){loading.dismiss();
      this.errorMessage ="SP_FV_ER_EMAIL_NOT_VALID";
      return ;
  }
  if(form.value.password == ""){loading.dismiss();
      this.errorMessage ="SP_FV_ER_PASSWORD_SBN_EMPTY";
      return ;
  }
  if(form.value.password.length<5){loading.dismiss();
      this.errorMessage ="SP_FV_ER_PASSWORD_SIZE";
      return ;
  }
    loading.dismiss();
  form.value.email=form.value.email.trim().toLowerCase();
  this.loadingSign=true;
  let body = JSON.stringify(form.value);
  this.http.post(environment.SERVER_URL + pathUtils.SIGN_UP, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
          response => {
          if (response.status == "0") {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
              if(response.user.isNewInscri == "true"){
                  localStorage.setItem('isNewInscri', "true");
              }
              this.loginService.actualize();
              this.openLoginPage();
          }
          else {
                this.errorMessage= response.error ;
          }
      },
          err => {
            this.errorMessage = "SP_ER_TECHNICAL_ERROR";
      },
      () => {
        this.loadingSign=false;
      }
  );

}


  openLoginPage() {
    this.navCtrl.setRoot(this.loginPage);
  }
  onChooseLan(lan:string){
    localStorage.setItem('userLang',lan);
    this.translate.setDefaultLang(lan);
  }

}
