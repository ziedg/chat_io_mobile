import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Http, Response } from '@angular/http';

import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../../environments/environment';
import { User } from '../../../../beans/user';
import { LoginService } from '../../../login/services/loginService';
import { AppSettings } from '../../../../conf/app-settings';
import * as pathUtils from '../../../../utils/path.utils';
import swal from 'sweetalert2';





@Component({
  selector: 'page-change-profile',
  templateUrl: 'change-profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeProfilePage {
  form;
  public user: User = new User();
  public errFistName = "";
  public errLastName = "";
  errorMessage: string = null;

  constructor(public translate: TranslateService,
    
    private http: Http,
    private changeDetector: ChangeDetectorRef,
   
    private loginService: LoginService) {

    this.loginService.redirect();

    this.form = new FormGroup({
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      userDiscrip: new FormControl(),
      genre: new FormControl(),
      linkFB: new FormControl(),
      linkTwitter: new FormControl(),
      linkYoutube: new FormControl()
    });
  }

  ngOnInit() {
    this.loginService.actualize();
    this.user = this.loginService.getUser();
    this.changeDetector.markForCheck();

  }

  getFirstName(): string {
    if (this.form.value.firstName) {
      return this.form.value.firstName;
    }
  
  }

  checkFirstName(): boolean {
    if (this.getFirstName() && this.getFirstName().length > 1) {
      this.errFistName = "";
      return true;
    }
    else {
      this.errFistName = this.translateCode("SP_FV_ER_FIRST_NAME_SBN_EMPTY");
      return false;
    }
  }

  getLastName(): string {
    if (this.form.value.lastName) {
      return this.form.value.lastName;
    }
  
  }

  getDisc(): string {
    return this.form.value.userDiscrip;
  }

  

  checkLastName(): boolean {
    if (this.getLastName() && this.getLastName().length > 1) {
      this.errLastName = "";
      return true;
    }
    else {
      this.errLastName = this.translateCode("SP_FV_ER_LAST_NAME_SBN_EMPTY");
      return false;
    }
  }

 

  saveData() {
    this.errorMessage = null;
    if (this.checkFirstName() && this.checkLastName() /*&& this.checkTwitterLink() && this.checkYoutubeLink() && this.checkFBLink()*/) {

      let body = JSON.stringify({
        profileId: this.user._id,
        firstName: this.getFirstName(),
        lastName: this.getLastName(),
        about: this.getDisc()
      });
      this.http.post(environment.SERVER_URL + pathUtils.UPDATE_PROFILE,
        body,
        AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
          response => {

            if (response.status == 0) {
              this.loginService.updateUser(response.profile);
              this.loginService.actualize();
              this.user = this.loginService.getUser();
              this.changeDetector.markForCheck();
              console.log("updated"+this.user.lastName);

              swal({
                title: this.translateCode("edit_profile_popup_notification_update_title"),
                text: this.translateCode("edit_profile_popup_notification_update_text"),
                type: "success",
                timer: 2000,
                showConfirmButton: false
              }).then(function () {
              }, function (dismiss) {
              });
            } else {
              this.errorMessage = response.error;
            }
          },
          err => {
            this.errorMessage = "SP_ER_TECHNICAL_ERROR";
          },
          () => {
          }
        );
    }
  }


  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate: string) => {
      message = resTranslate;
    });
    return message;
  }

}

