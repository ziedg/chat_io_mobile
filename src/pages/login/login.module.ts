import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignInPage } from "./pages/sign-in/sign-in";
import { SignUpPage } from "./pages/sign-up/sign-up";
import { Http, RequestOptions, XHRBackend } from "@angular/http";
import { LoginService } from "./services/loginService";
import { httpFactory } from "../../utils/factories/http.factory";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    SignInPage,
    SignUpPage
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(SignInPage),
    IonicPageModule.forChild(SignUpPage)
  ],
  providers: [

  ]
})
export class LoginPageModule {}
