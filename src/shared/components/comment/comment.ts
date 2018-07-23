import 'rxjs/add/operator/map';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import {AlertController, NavController} from 'ionic-angular';
import { ProfilePage } from "../../../pages/nav-tabs/pages/profile/pages/profile/profile"

import { environment } from '../../../environments/environment';
import { CommentBean } from '../../../beans/comment-bean';
import { EmojiListBean } from '../../../beans/emoji-list-bean';
import { PublicationBean } from '../../../beans/publication-bean';
import { User } from '../../../beans/user';
import { LoginService } from '../../../pages/login/services/loginService';
import { AppSettings } from '../../../conf/app-settings';
import * as pathUtils from '../../../utils/path.utils';
import { DateService } from '../../services/dateService';
import { EmojiService } from '../../services/emojiService';


@Component({
  moduleId: 'module.id',
  selector: 'comment',
  inputs: ['commentBean', 'publicationBean'],
  templateUrl: 'comment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Comment {
  @Input() publicationBean :PublicationBean;
  @Output() nbDisplayedCommentsChange : EventEmitter<any> = new EventEmitter();
  commentBean:CommentBean = new CommentBean();
  //publicationBean:PublicationBean = new PublicationBean();
  user:User;
  listEmoji:Array<EmojiListBean> = [];
  private isFixedPublishDate:boolean = false;
  private fixedPublishDate:string;

  imageBaseUrl = environment.IMAGE_BASE_URL;

  constructor(public navCtrl: NavController,
              public translate: TranslateService,
              private http:Http,
              private dateService:DateService,
              private loginService:LoginService,
              public emojiService:EmojiService,
              private changeDetector:ChangeDetectorRef,
              private alertCntrl:AlertController) {
    loginService.actualize();
    this.user = loginService.user;
    this.listEmoji = emojiService.getEmojiList();
  }

  ngOnInit() {
  }

  addOrRemoveLike() {
    if (!this.commentBean.isLiked)
      this.addLike();
    else
      this.removeLike();
  }

  afficheComment(comment):string {
		var white_space_regex:RegExp = /^(\ |\&nbsp;|\<br\>)*$/g;
		if(!white_space_regex.test(comment)){
    	return this.emojiService.AfficheWithEmoji(comment);
		}
		else {
			return '';
		}
  }

  addOrRemoveDislike() {
    if (!this.commentBean.isDisliked)
      this.addDislike();
    else
      this.removeDislike();
  }

  addLike() {
    if (this.commentBean.isDisliked)
      this.removeDislike();

    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.LIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
      },
        err => {
      },
      () => {
      }
    );
    this.commentBean.isLiked = true;
    this.commentBean.nbLikes++;
  }

  getCommentTime(publishDateString:string):string {
    if (this.isFixedPublishDate)
      return this.fixedPublishDate;
    let date = new Date();
    let currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    let publishDate = this.dateService.convertIsoToDate(publishDateString);

    let diffDate = this.dateService.getdiffDate(publishDate, currentDate);
    if (diffDate.day > 28) {
      this.fixedPublishDate = this.dateService.convertPublishDate(publishDate);
      this.isFixedPublishDate = true;
    }
    else if (diffDate.day && diffDate.day == 1) {
      this.fixedPublishDate = this.translateCode("prefix_date_yesterday");
      this.isFixedPublishDate = true;
    }
    else if (diffDate.day > 0) {
      this.fixedPublishDate = diffDate.day + this.translateCode("prefix_date_days");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour == 1)) {
      this.fixedPublishDate = this.translateCode("prefix_date_one_hour");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour > 0)) {
      this.fixedPublishDate = diffDate.hour + this.translateCode("prefix_date_hours");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.min) && (diffDate.min > 1))
      this.fixedPublishDate = diffDate.min + this.translateCode("prefix_date_minutes");
    else
      this.fixedPublishDate = this.translateCode("prefix_date_now");
    return this.fixedPublishDate;
  }

  removeLike() {
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(
      environment.SERVER_URL + pathUtils.REMOVE_LIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

      },
        err => {
      },
      () => {
      }
    );
    this.commentBean.isLiked = false;
    this.commentBean.nbLikes--;
  }

  addDislike() {
    if (this.commentBean.isLiked)
      this.removeLike();

    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(environment.SERVER_URL + pathUtils.DISLIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {

      },
        err => {
      },
      () => {
      }
    );

    this.commentBean.isDisliked = true;
    this.commentBean.nbDislikes++;
  }

  removeComment(comment:CommentBean) {
    if (this.user._id == comment.profileId
      || this.publicationBean.profileId == this.user._id) {

      let alert = this.alertCntrl.create({
        title: this.translateCode("comment_popup_confirmation_delete_title"),
        message: this.translateCode("comment_popup_confirmation_delete_text"),
        buttons: [
          {
            text: this.translateCode("comment_popup_cancel_delete_button"),
            role: 'cancel'
          },
          {
            text: this.translateCode("comment_popup_notification_delete_title"),
            handler: () => {
              this.doDeleteComment();
            }
          }
        ]
      });
      alert.present();
    }
  }

  doDeleteComment() {
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id
    });
    this.http.post(environment.SERVER_URL + pathUtils.REMOVE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
      },
        err => {
      },
      () => {
        this.changeDetector.markForCheck();
      }
    );
    this.commentBean.deleted = true;
    this.publicationBean.nbComments--;
    this.nbDisplayedCommentsChange.emit(this.publicationBean.nbComments);
    this.changeDetector.markForCheck();
  }

  removeDislike() {
    let body = JSON.stringify({
      publId: this.commentBean.publId,
      commentId: this.commentBean._id,
      profileId: this.user._id
    });

    this.http.post(environment.SERVER_URL + pathUtils.REMOVE_DISLIKE_COMMENT,
      body,
      AppSettings.OPTIONS)
      .map((res:Response) => res.json())
      .subscribe(
        response => {
      },
        err => {
      },
      () => {
      }
    );
    this.commentBean.isDisliked = false;
    this.commentBean.nbDislikes--;
  }


  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate:string) => {
      message = resTranslate;
    });
    return message;
  }


  Profil(id: number) {

    if (this.navCtrl.getActive().name != "ProfilePage")
      this.navCtrl.push(ProfilePage, { 'userId': id });

  }
}
