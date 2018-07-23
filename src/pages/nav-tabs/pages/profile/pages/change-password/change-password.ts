//import { NavController, NavParams } from 'ionic-angular';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Http, Response} from '@angular/http';
import {TranslateService} from '@ngx-translate/core';

import {environment} from '../../../../../../environments/environment';
import {User} from '../../../../../../beans/user';
import {LoginService} from '../../../../../login/services/loginService';
import {AppSettings} from '../../../../../../conf/app-settings';
import * as pathUtils from '../../../../../../utils/path.utils';


@Component({
  selector: 'change-password',
  templateUrl: 'change-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class ChangePasswordPage {
  public user: User = new User();
  errNewPass2 = "";
  errNewPass1 = "";
  errOldPass = "";
  form;
  errorMessage = "";
  successfullyMessage = "";
  success: boolean = false;

  constructor(public translate: TranslateService,
              private changeDetector: ChangeDetectorRef,
              private http: Http,
              private loginService: LoginService) {
    this.loginService.redirect();
    this.form = new FormGroup({
      oldPass: new FormControl('', Validators.required),
      newPass1: new FormControl('', Validators.required),
      newPass2: new FormControl('', Validators.required),
    });
  }

  saveData() {
    this.reset();
    let oldPass = this.form.value.oldPass;
    let newPass1 = this.form.value.newPass1;
    let newPass2 = this.form.value.newPass2;

    if (oldPass < 1) {
      this.errOldPass = this.translateCode("SP_FV_ER_PASSWORD_EMPTY");
      return;
    }

    if (newPass1 < 5) {
      this.errNewPass1 = this.translateCode("SP_FV_ER_PASSWORD_SIZE");
      return;
    }

    if (newPass1 != newPass2) {
      this.errNewPass2 = this.translateCode("SP_FV_ER_PASSWORDS_NOT_MATCH");
      return;
    }

    this.changeDetector.markForCheck();
    let body = JSON.stringify({
      oldPassword: oldPass,
      newPassword: newPass1
    });
    this.http.post(environment.SERVER_URL +
      pathUtils.UPDATE_PASSWORD, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.status == 0) {
            this.success = true;
          }
          else {
            this.errorMessage = response.error;
          }
        },
        err => {
          this.errorMessage = "SP_ER_TECHNICAL_ERROR"
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );

  }

  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate: string) => {
      message = resTranslate;
    });
    return message;
  }

  reset() {
    this.errOldPass = "";
    this.errNewPass1 = "";
    this.errNewPass2 = "";
    this.errorMessage = "";
    this.success = false;
  }
}



