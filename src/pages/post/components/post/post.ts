import {Component, EventEmitter, NgZone} from '@angular/core';
import {OnInit} from '@angular/core';
import {Input, ChangeDetectionStrategy, ChangeDetectorRef, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, ActionSheetController, NavController, NavParams,ModalController} from 'ionic-angular';

import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

import {AppSettings} from '../../../../conf/app-settings';
import {Http, Response} from '@angular/http';

import {User} from '../../../../beans/user';
import * as pathUtils from '../../../../utils/path.utils';
import {environment} from '../../../../environments/environment'

import {PostService} from '../../services/postService';
import {DateService} from '../../../../shared/services/dateService';
import {LoginService} from '../../../login/services/loginService';
import {EmojiService} from '../../services/emojiService';

import {PostPage} from '../../pages/post';
import {EmojiListBean} from '../../../../beans/emoji-list-bean';
import {LinkBean} from '../../../../beans/linkBean';
import {ProfilePage} from '../../../profile/pages/profile/profile';
import {Ng2ImgMaxService} from 'ng2-img-max';

import {PublicationBean} from "../../../../beans/publication-bean";
import {CommentBean} from '../../../../beans/comment-bean';

import * as jQuery from "jquery";
import {HomePage} from "../../../home/home";
import {reactionModal} from "./reaction-modal/reaction-modal";

@Component({
  selector: 'post',
  templateUrl: 'post.html',
})
export class PostComponent implements OnInit {
  @Output() notifyDeletePost: EventEmitter<any> = new EventEmitter();

  @Input() publication: PublicationBean;

  private textPub: string;
  private imgUrl: string;
  private publicationUrl: string;

  private user: User = new User();

  private hasTitle: boolean = false;
  private isImg: boolean = false;
  private isText: boolean = false;
  private isYoutube: boolean = false;
  private isFb: boolean = false;
  private emoji: boolean = false;

  private youtubeLink: string;
  private facebookLink: string;

  private url: SafeResourceUrl;
  private interractions: string;
  commentInputHtml = "";
  public PostPage: PostPage;
  postOptions = {
    delete_post: "publication_delete",
    report_post: "publication_report",
    cancel: "publication_cancel"
  };

  //comment
  changeDetection: ChangeDetectionStrategy.OnPush
  commentContent = "";
  private isFixedPublishDate: boolean = false;
  private fixedPublishDate: string;
  // TODO: check publication access
  private afficheCommentsLoading = false;
  private afficheMoreComments = false;
  public signalButton = false;
  private listComments: Array<CommentBean> = [];
  private nbMaxAddComments = 3;
  private nbComments = 0;
  private nbDisplayedComments = 0;
  public dateDisplay = "";
  public listLink: Array<string> = [];
  formComment;
  selectedEmojiTab = 0;
  emojiOpacity = 0;
  emojiToggleActive = false;
  public modalPub = false;
  public pubLink = "";
  public shareLink = "";
  signalSubMenu = false;
  linkYtb = "";
  linkFb = "";
  listEmoji: Array<EmojiListBean> = [];
  newCommentText: string = "";
  uploadedPictureComment: File;
  likeAnimation = false;
  pubImgId;
  loadingComment = false;
  emojiHoverId = "";
  commentTextareaId = "";
  public link: LinkBean = new LinkBean();
  commentsDisplayed: boolean;
  /* long publication settings */
  private longPubText: boolean = false;
  private longPubTextShow: boolean = false;
  private firstPubText: string = "";
  private lastPubText: string = "";
  pub_text: string = "";
  arabicText: boolean = false;
  private fbHeight: number;
  imageBaseUrl = environment.IMAGE_BASE_URL;
  private isGif: boolean = false;

  constructor(private sanitizer: DomSanitizer,
              public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              private changeDetector: ChangeDetectorRef,
              private emojiService: EmojiService,
              private loginService: LoginService,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private dateService: DateService,
              public translate: TranslateService,
              public actionSheetCtrl: ActionSheetController,
              private alertCntrl: AlertController,
              public zone: NgZone,
              private postService: PostService,
              public modalCtrl: ModalController) {
    this.user = this.loginService.getUser();

    this.listEmoji = emojiService.getEmojiList();
    this.pubImgId = "imgDefault";
    this.formComment = new FormGroup({
      pubComment: new FormControl('', Validators.required),
      commentText: new FormControl('', Validators.required),

    });
  }

  ngOnInit() {
    var txt = this.publication.publText;

    const word_letters: number = 5;

    const words_max: number = 40;
    const words_marge: number = 8;

    const letters_max: number = words_max * word_letters;
    const letters_marge: number = words_marge * word_letters;


    const lines_max: number = 4;
    if (this.publication.publExternalLink) {
      this.linkAPI();
    }
    this.emojiHoverId = "emoji-hover-" + this.publication._id;
    this.pubImgId = "img" + this.publication._id;
    this.commentTextareaId = "comment-" + this.publication._id;
    this.changeDetector.markForCheck();
    if(this.publication.publText != ""){
      this.isText=true;
      //console.log("zaaaaaaaaaaaaaaaa3ma?");
      let view = this.navCtrl.getActive();
      if (!(view.instance instanceof PostPage)) {
        if (txt !== 'null' && txt !== 'undefined' && txt.length > 0) {
          var line_parts = txt.split('<br>');
          if (line_parts.length > lines_max) {
            this.firstPubText = line_parts.slice(0, lines_max).join('<br>');
            this.lastPubText = line_parts.slice(lines_max, line_parts.length).join('<br>');
            this.longPubText = true;
          }
          else {
            var parts = txt.split(' ');
            if (parts.length > words_max) {
              this.longPubText = true;

              let words_cut: number;
              if (parts.length - words_max < words_marge) words_cut = parts.length - words_marge;
              else words_cut = words_max;

              this.firstPubText = parts.slice(0, words_cut).join(' ');
              this.lastPubText = parts.slice(words_cut, parts.length).join(' ');
              //console.log("cut words");
            }
            else if (txt.length > letters_max) {
              this.longPubText = true;

              let letters_cut: number;
              if (txt.length - letters_max < letters_marge) letters_cut = txt.length - letters_marge;
              else letters_cut = letters_max;

              var cut_end: number = txt.slice(0, letters_cut).lastIndexOf(' ');
              this.firstPubText = txt.slice(0, cut_end);
              this.lastPubText = txt.slice(cut_end);
              //console.log("cut letters");
            }
            else {
              this.firstPubText = txt;
            }
          }
          //console.log("long text : " + this.longPubText);
        }
      }
      else {
        this.firstPubText=txt;
        this.longPubText = false;

      }
    }
    if (this.publication.publPictureLink)
      this.isImg = true;
    else if (this.publication.publyoutubeLink && this.publication.publyoutubeLink != "null") {
      this.isYoutube = true;
      this.youtubeLink = "https://www.youtube.com/embed/" + this.publication.publyoutubeLink;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubeLink);
      //console.log(this.isYoutube,this.youtubeLink);
    }
    else if (this.publication.publfacebookLink && this.publication.publfacebookLink != "null") {
      this.isFb = true;
      this.facebookLink = "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F" + this.publication.publfacebookLink +
        "%2F&show_text=0&height=250&appId";
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.facebookLink);

    }

    //
    // this.interractions=this.publication.nbLikes + this.publication.nbDislikes;
    this.nbComments = this.publication.comments.length;
    this.imgUrl = this.publication.publPictureLink;
    this.publicationUrl = this.imageBaseUrl + this.imgUrl;

    var publishCommentWithEnter = function () {
      alert(this.publicationBean._id);
    }.bind(this)
    var loadChanges = function () {
      this.changeDetector.markForCheck();
    }.bind(this);


    var closeEmoji = function () {
      this.changeDetector.markForCheck();
    }.bind(this);
    var closeSignal = function () {
      this.signalButton = false;
      this.changeDetector.markForCheck();
    }.bind(this);

    this.initComments();
  }
  preventLink(e, isGif) {
    if (isGif) {
      e.preventDefault();
    }
  }
  onViewPost() {
    this.navCtrl.push(PostPage, {'publication':this.publication});
  }

  addOrRemoveLike() {
    if (!this.publication.isLiked)
      this.addLike();
    else
      this.removeLike();
  }

  addLike() {
    if (this.publication.isDisliked)
      this.removeDislike();

    let body = JSON.stringify({
      publId: this.publication._id,
      profileId: this.user._id,
      profilefirstname: this.user.firstName,
      profilelastname: this.user.lastName,
      profilepicture: this.user.profilePictureMin
    });
    this.http.post(environment.SERVER_URL + pathUtils.LIKE_PUBLICATION, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

        },
        err => {
        },
        () => {
        }
      );

    this.publication.isLiked = true;
    this.publication.nbLikes++;

  }

  longPub() {
    let view = this.navCtrl.getActive();
    if (!(view.instance instanceof PostPage)) {
      const lines_max2 = 6;
      const words_max2 = 25;
      const letters_max2 = 100;
      var line_parts2 = this.lastPubText.split('<br>');
      var parts2 = this.lastPubText.split(' ');
      if (line_parts2.length > lines_max2 || parts2.length > words_max2 || this.lastPubText.length > letters_max2) {
        this.navCtrl.push(PostPage, {'publication': this.publication});
      }
      else this.longPubTextShow = true;
    }
    else this.longPubTextShow = true;
  }

  removeLike() {
    let body = JSON.stringify({
      publId: this.publication._id,
      profileId: this.user._id
    });
    this.http.post(environment.SERVER_URL + pathUtils.REMOVE_LIKE_PUBLICATION, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

        },
        err => {
        },
        () => {
        }
      );

    this.publication.isLiked = false;
    this.publication.nbLikes--;
  }

  addOrRemoveDislike() {
    if (!this.publication.isDisliked)
      this.addDislike();
    else
      this.removeDislike();
  }

  addDislike() {
    if (this.publication.isLiked)
      this.removeLike();

    let body = JSON.stringify({
      publId: this.publication._id,
      profileId: this.user._id,
      profilefirstname: this.user.firstName,
      profilelastname: this.user.lastName,
      profilepicture: this.user.profilePictureMin
    });
    this.http.post(environment.SERVER_URL + pathUtils.DISLIKE_PUBLICATION, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
        },
        err => {
        },
        () => {

        }
      );

    this.publication.isDisliked = true;
    this.publication.nbDislikes++;
  }

  removeDislike() {
    let body = JSON.stringify({
      publId: this.publication._id,
      profileId: this.user._id
    });
    this.http.post(environment.SERVER_URL + pathUtils.REMOVE_DISLIKE_PUBLICATION, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
        },
        err => {
        },
        () => {

        }
      );
    this.publication.isDisliked = false;
    this.publication.nbDislikes--;
  }


  linkAPI() {


    var linkURL = this.publication.publExternalLink;
    if (linkURL.search(".gif") >= 0) {
      var checker = linkURL.substr(linkURL.length - 8, 8);
      if (checker.indexOf(".gif") >= 0) {
        this.link.image = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
        this.link.imageWidth = 500;
        this.link.imageHeight = 500;
        this.link.isGif = true;
        this.link.url = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
        this.link.title = "gif";
        this.link.description = "gif";
        this.link.isSet = true;
        return 1;
      }
    }

    this.http.get(
      environment.SERVER_URL + pathUtils.GET_OPEN_GRAPH_DATA + linkURL
      , AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.results.success) {
            this.link.url = linkURL;
            this.link.title = response.results.data.ogTitle;
            this.link.description = response.results.data.ogDescription;
            if (response.results.data.ogImage) {
              if(response.results.data.ogImage.length == 2)
              {
                
              this.link.image = response.results.data.ogImage[1].url.replace(/['"]+/g, '');
              //console.log(response.results.data.ogImage[1].url);
              //this.resetPreview(linkIsImage = true);
              //console.log("image detected");
              // jQuery("#preview-image").attr("src", this.link.image);
              // jQuery(".file-input-holder").show();
              // jQuery("#preview-image").show();
              

              }else{
                var a = response.results.data.ogImage.url;
                this.link.image = response.results.data.ogImage.url;
                this.link.imageWidth = response.results.data.ogImage.width;
                this.link.imageHeight = response.results.data.ogImage.height;
                if (a.substring(a.length - 3, a.length) == "gif")
                  this.link.isGif = true;
                else this.link.isGif = false;
              }
              
            }
            else {
              this.link.image = null;
              this.link.imageWidth = 0;
              this.link.imageHeight = 0;
            }
            this.link.isSet = true;


            this.changeDetector.markForCheck();
          }
          else {
            console.error("error in link API; " + linkURL);

          }
        },
        err => {
          //error
          console.error("error in link API; " + linkURL);

        },
        () => {
          //final
        }
      );
  }

  // for comment
  initComments() {
    if (this.publication.comments.length > this.nbMaxAddComments) {
      this.afficheMoreComments = true;
      this.nbComments = this.nbMaxAddComments;
      for (let i = 0; i < this.nbComments; i++)
        this.listComments.push(this.publication.comments[i]);
    }
    else {
      this.nbComments = this.publication.comments.length;
      for (let i = 0; i < this.nbComments; i++)
        this.listComments.push(this.publication.comments[i]);
    }
  }


  displayComments() {
    this.commentsDisplayed = !this.commentsDisplayed;
  }

  publishComment() {
    var txt: string = this.commentInputHtml;
    console.log(this.commentInputHtml);
    txt = txt.replace(/(\&nbsp;|\ )+/g, ' ')
      .replace(/(\<.?br\>)+/g, '<br>')
      .replace(/^\<.?br\>|\<.?br\>$/g, '');
    console.log(txt);
    var white_space_regex: RegExp = /^(\ |\&nbsp;|\<br\>)*$/g;
    var white_space_only = white_space_regex.test(txt);
    if (!commentToSend && white_space_only && !this.uploadedPictureComment) {
      return;
    }

    var commentToSend = this.emojiService.getCommentTextFromHtml(txt);

    this.loadingComment = true;
    this.changeDetector.markForCheck();
    var data = new FormData();

    data.append('commentText', commentToSend);
    data.append('profileId', this.user._id);
    data.append('publId', this.publication._id);
    data.append('commentPicture', this.uploadedPictureComment);
    this.changeDetector.markForCheck();

    this.http.post(environment.SERVER_URL + pathUtils.ADD_COMMENT, data, AppSettings.OPTIONS_POST)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.changeDetector.markForCheck();
          if (response.status == "0") {
            if (response.comment) {
              if (!this.publication.comments.length)
                this.publication.comments.unshift(response.comment);

              this.listComments.unshift(response.comment);
              this.nbComments++;
              //this.formComment.controls.pubComment.updateValue('');
              this.changeDetector.markForCheck();
              this.commentInputHtml = "";
              this.uploadedPictureComment = null;
              this.loadingComment = false;
            }

          }
          else {
            console.error(response);
            this.loadingComment = false;

          }
        },
        err => {
        },
        () => {
        }
      );

  }

  loadMoreComments(i: number) {
    this.afficheCommentsLoading = true;
    this.afficheMoreComments = false;
    if (i >= this.nbMaxAddComments) {
      this.afficheCommentsLoading = false;
      this.afficheMoreComments = true;
      this.changeDetector.markForCheck();
    }
    else if ((this.listComments.length) >= this.publication.comments.length) {
      this.afficheCommentsLoading = false;
      this.afficheMoreComments = false;
      this.changeDetector.markForCheck();
    }
    else {
      setTimeout(() => {
        this.listComments.push(this.publication.comments[i + this.nbComments]);
        this.changeDetector.markForCheck();
        this.loadMoreComments(i + 1);
      }, 0);
    }
  }

  onClickProfile() {
    if (this.navCtrl.getActive().name != "ProfilePage")
      this.navCtrl.push(ProfilePage, {'userId': this.publication.profileId});
  }

  onClickProfileShare() {
    console.log(this.publication.profileId);
    console.log(this.navCtrl.getActive().data.userId);
    if (this.navCtrl.getActive().name != "ProfilePage" || this.publication.originalProfileId != this.navCtrl.getActive().data.userId)
      this.navCtrl.push(ProfilePage, {'userId': this.publication.originalProfileId});
  }

  checkEnter(event) {

  }


  //uploading Photo click event
  addPhoto() {
    jQuery(("." + this.pubImgId)).click();
  }

  //uploading photo or GIF
  uploadPhoto($event) {
    var inputValue = $event.target;
    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedPictureComment = inputValue.files[0];
      this.ng2ImgMaxService.compress([this.uploadedPictureComment], 0.5).subscribe((compressedImage) => {
        this.ng2ImgMaxService.resize([compressedImage], 360, 200).subscribe((result) => {
          this.uploadedPictureComment = result;
          this.previewFile(this.uploadedPictureComment, this.pubImgId);
        })
      });

    }
    else {
      this.uploadedPictureComment = null;
    }
  }

  resetCommentPicture() {
    this.uploadedPictureComment = null;
  }

  toggleEmoji() {
    this.emoji = !this.emoji;
    console.log(("#" + this.emojiHoverId));
    //jQuery("#" + this.emojiHoverId).toggle();
  }

  public closeModalEmoji() {
    jQuery("#" + this.emojiHoverId).hide();
  }

  openModalPub() {
    this.modalPub = true;
  }

  closeModalPub() {
    this.modalPub = false;
  }

  changeEmojiTab(tab) {
    this.selectedEmojiTab = tab;
  }

  addToComment(emoji) {
    this.commentInputHtml += this.afficheComment(" " + emoji.shortcut);
  }

  afficheComment(comment): string {
    var img = '<img class="emoji" style="align:absmiddle; top : 0;" src="assets/images/basic/';
    for (var i = 0; i < this.listEmoji.length; i++) {
      for (var j = 0; j < this.listEmoji[i].list.length; j++) {
        comment = this.replaceAll(comment, this.listEmoji[i].list[j].shortcut, img + this.listEmoji[i].list[j].imageName + '.png" />');
      }
    }
    return comment;
  }

  replaceAllNew(comment, search, replacement) {
    return comment.split(search).join(replacement);
  }


  replaceAll(comment, search, replacement) {
    return comment.split(search).join(replacement);
  }

  affichePostText(postText: string): string {
    return this.emojiService.AfficheWithEmoji(postText);
  }

  activateAnimation() {
    this.likeAnimation = true;
  }

  deactivateAnimation() {
    this.likeAnimation = false;
  }

  previewFile(uploadedFile, elementId) {
    //var preview = jQuery('#preview-image');
    var file = uploadedFile;
    var reader = new FileReader();

    reader.addEventListener("load", function () {
      //preview.att.src = reader.result;
      //jQuery("#" + elementId).attr('src', reader.result);
      //jQuery("#" + elementId).fadeIn(500);

      //console.log(reader.result);
      //test

    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  translateCode(code) {
    let message;
    this.translate.get(code).subscribe((resTranslate: string) => {
      message = resTranslate;
    });
    return message;
  }

  getPostTime(publishDateString: string): string {
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
      this.fixedPublishDate = diffDate.day + " " + this.translateCode("prefix_date_days");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour == 1)) {
      this.fixedPublishDate = this.translateCode("prefix_date_one_hour");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.hour) && (diffDate.hour > 0)) {
      this.fixedPublishDate = diffDate.hour+ " " + this.translateCode("prefix_date_hours");
      this.isFixedPublishDate = true;
    }
    else if ((diffDate.min) && (diffDate.min > 1))
      this.fixedPublishDate = diffDate.min + " " + this.translateCode("prefix_date_minutes");
    else
      this.fixedPublishDate = this.translateCode("prefix_date_now");
    return this.fixedPublishDate;
  }

  doDeletePub() {
    this.notifyDeletePost.emit(this.publication);
    this.publication.displayed = false;
    this.changeDetector.markForCheck();
    let body;
    body = JSON.stringify({
      publId: this.publication._id,
    });

    this.http.post(environment.SERVER_URL + pathUtils.REMOVE_PUBLICATION, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {

        },
        err => {
        },
        () => {
          this.changeDetector.markForCheck();
        }
      );
  }

  deletePub() {
    let alert = this.alertCntrl.create({
      title: this.translateCode("publication_popup_confirmation_title"),
      message: this.translateCode("publication_popup_confirmation_delete_text"),
      buttons: [
        {
          text: this.translateCode("publication_popup_cancel_button"),
          role: 'cancel'
        },
        {
          text: this.translateCode("publication_popup_confirmation_delete_button"),
          handler: () => {
            this.doDeletePub();
          }
        }
      ]
    });
    alert.present();
  }

  onViewOptions(){
    let text:string;
    let isOwner:boolean=this.publication.profileId == this.user._id;
    if(isOwner){
      text=this.postOptions.delete_post
    }else if(!isOwner){
      text=this.postOptions.report_post
    }
    let actionSheet= this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.translateCode(text),
          handler: () => {
            if(isOwner)
              this.deletePub();
            else
              this.reportPub();
          }
        },
        {
          text: this.translateCode(this.postOptions.cancel),
          role: 'cancel',
        }
      ]
    });
    actionSheet.present();
  }

  reportPub() {
    let alert = this.alertCntrl.create({
      title: this.translateCode("publication_popup_report_title"),
      message: this.translateCode("publication_popup_report_text"),
      inputs: [
        {
          name: 'reportText'
        }
      ],
      buttons: [
        {
          text: this.translateCode("publication_popup_cancel_button"),
          role: 'cancel'
        },
        {
          text: this.translateCode("publication_popup_confirm"),
          handler: (data) => {
            this.doReportPub(data.reportText);
          }
        }
      ]
    });
    alert.present();
  }

  doReportPub(text) {
    if (text) {
      console.log(text);
      let body = JSON.stringify({
        signalText: text,
        publId: this.publication._id,
        profileId: this.user._id
      });
      this.http.post(environment.SERVER_URL + pathUtils.REPORT_PUBLICATION, body, AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
          response => {

          },
          err => {
          },
          () => {
          }
        );
    }
  }

  sharePub(post: PublicationBean) {
    let alert = this.alertCntrl.create({
      title: this.translateCode("publication_popup_confirmation_title"),
      message: this.translateCode("publication_popup_confirmation_share_text"),
      buttons: [
        {
          text: this.translateCode("publication_popup_NO"),
          role: 'cancel'
        },
        {
          text: this.translateCode("publication_popup_YES"),
          handler: (data) => {
            this.doSharePub(post);
          }
        }
      ]
    });
    alert.present();
  }

  doSharePub(post) {
    var pubId;
    var alreadySharedPubId;
    if (post.isShared) {
      pubId = post.originalPublicationId;
      alreadySharedPubId = this.publication._id;
    }
    else {
      pubId = this.publication._id;
    }
    let body = JSON.stringify({
      publId: pubId,
      alreadySharedPubId: alreadySharedPubId,
      profileId: this.user._id
    });
    this.http.post(environment.SERVER_URL + pathUtils.SHARE_PUBLICATION, body, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response) {
            if (response.status = "0") {

              var element: PublicationBean = response.publication;
              this.postService.putNewPub(element, true);
              this.changeDetector.markForCheck();
            }
          }
        },
        err => {
        },
        () => {

        }
      );
  }

  deleteCommentNb(e: any) {
    this.nbComments--;
  }
  shortNumber(n: number): string {
    return n < 1000 ? n + "" : (n / 1000 + "k").replace(".", ",");
  }
  openModalInteractions(){
    console.log("ffff");
    const modal = this.modalCtrl.create(reactionModal,this.publication);
    modal.present();
  }
}

