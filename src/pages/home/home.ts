import {Component,ViewChild,} from '@angular/core';
import {IonicPage, NavController, NavParams,Content} from 'ionic-angular';
import {Http, Response} from "@angular/http";
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ChangeDetectorRef} from "@angular/core";
/* conf */
import {AppSettings} from "../../conf/app-settings";
/* Utils */
import * as pathUtils from "../../utils/path.utils";
import {environment} from "../../environments/environment";
/*beans*/
import {User} from '../../beans/user';
import {LinkBean} from '../../beans/linkBean';
/*pages*/
import {SuggestionsPage} from "../suggestions/suggestions";
import {ProfilePage} from "../profile/pages/profile/profile";
import {SearchPage} from "../search/search";

/*service*/
import {LinkView} from '../post/services/linkView';
import {LoginService} from "../login/services/loginService";
import {Ng2ImgMaxService} from 'ng2-img-max';
/*jQuery*/
import * as jQuery from "jquery";
import {PublicationBean} from '../../beans/publication-bean';
import {TranslateService} from "@ngx-translate/core";

import { ScrollHideConfig } from './directives/scroll-hide';
import { ScrollHideDirective } from './directives/scroll-hide';
import {RecentRechService} from "../search/services/recentRechService";
//import publicationBeanList_offline from "../../offline/publications-offline";
//import user_offline from "../../offline/user-offline";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content;
  public ListOfGifs = [];

  listSearchUsers: Array<User> = [];
  showRecentSearch: Boolean;
  noSearchResults: Boolean = false;
  recentSearchList;
  showSearch:boolean=false;

  arabicRegex: RegExp = /[\u0600-\u06FF]/;
  public arabicText: boolean = false;
  isEmpty = true;
  loadingPublish = false;
  selectedMenuElement = 0;
  online: any;
  public link: LinkBean = new LinkBean();
  public user: User = new User();
  public publicationBeanList: Array<PublicationBean> = [];

  linkDomain = "";
  linkLoading: boolean;
  errorMsg = "";
  uploadedPicture: File;
  imageFromLink: boolean;
  youtubeInput = false;
  youtubeLink = "";
  facebookInput = false;
  facebookLink = "";

  titleEnable = false;
  form;

  suggestionsPage = SuggestionsPage;
  profilePage = ProfilePage;
  lastPostId;
  isLock = false;
  showLoading = true;
  keepLoading: boolean = true;
  currentUserId: string;
  morePosts = true;
  firstSCroll = true;
  welcomeMsgIsShown:boolean=true;
  headerScrollConfig:ScrollHideConfig={cssProperty: 'margin-top', maxValue: 40};
  private showGifSlider:boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loginService: LoginService,
              public http: Http,
              private linkView: LinkView,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private changeDetector: ChangeDetectorRef,
              public translate: TranslateService,
              private recentSearchService: RecentRechService) {

    this.form = new FormGroup({
      publicationTitle: new FormControl(),
      publicationText: new FormControl("", Validators.required),
      publicationYoutubeLink: new FormControl()
    });
    //this.loginService.redirect();

    this.user = this.loginService.getUser();

    this.currentUserId = loginService.getUser()._id;
    this.loadFirstPosts();
    //this.ListOfGifs = gifService.getGifList();
    this.showRecentSearch=true;

  }
  ionSelected(){
      console.log('selected');
      this.content.scrollToTop(300);
  }
  ionViewWillEnter(){

    this.user = this.loginService.getUser();

    this.loadFirstPosts();
    this.currentUserId = this.loginService.getUser()._id;

  }

  toggleGifSlider() {
    this.showGifSlider = !this.showGifSlider;
}
  closeGif(showGif:boolean){
    console.log("after event emit");
    console.log(showGif);
    this.showGifSlider=showGif;
  }

previewGIF(urlGIF){
  var linkURL = urlGIF;
  this.link.url = linkURL;
  this.link.isSet = true;
  this.link.isGif = true;
  this.linkLoading = false;
  jQuery(".file-input-holder").hide();


}

  closeWelcomeMsg(){
    this.welcomeMsgIsShown= !this.welcomeMsgIsShown;
  }


  enableTitlePost() {
    this.titleEnable = !this.titleEnable;
    //console.log(this.user);
    //console.log(this.loginService.getUser());
  }

  addPhoto() {
    jQuery("#file-image").click();
  }

  addPhotoGIF() {
    jQuery("#file-image-gif").click();
  }

  uploadPhoto($event) {
    let inputValue = $event.target;

    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedPicture = inputValue.files[0];
      console.log(this.uploadedPicture);
      //change

      this.ng2ImgMaxService
        .compress([this.uploadedPicture], 0.7)
        .subscribe(result => {
          this.uploadedPicture = result;

          previewFile(this.uploadedPicture);
          jQuery(".youtube-preview").html("");
          jQuery(".facebook-preview").html("");
          //this.form.controls.publicationYoutubeLink.updateValue('');
          this.closeLinkAPI();
          return this.uploadedPicture;
        });


    } else {
      this.uploadedPicture = null;
      return null;
    }
  }


  uploadPhotoGIF($event) {
    let inputValue = $event.target;
    if (inputValue != null && null != inputValue.files[0]) {
      this.uploadedPicture = inputValue.files[0];
      previewFile(this.uploadedPicture);
      jQuery(".youtube-preview").html("");
      jQuery(".facebook-preview").html("");
    } else {
      this.uploadedPicture = null;
    }
  }

  changeSelectMenu(choice) {
    this.selectedMenuElement = choice;
  }

  updatePublishTextOnPaste($event) {
    $event.preventDefault();
    let text = $event.clipboardData.getData("text/plain");
    console.log("pasted");
    this.link.isGif = false;

    if (
      text.search("youtube.com/watch") >= 0 ||
      text.search("youtu.be/") >= 0
    ) {

      this.youtubeInput = true;
      this.changeDetector.markForCheck();
      this.youtubeLink = text;
      this.updateYoutubeFacebook(text);
      return 1;
    }

    if (
      text.search("web.facebook.com") >= 0 || text.search("www.facebook.com") > 0 ||
      text.search("m.facebook.com") > 0 || text.search("mobile.facebook.com") > 0) {
      this.facebookInput = true;
      this.changeDetector.markForCheck();
      this.facebookLink = text;
      this.updateYoutubeFacebook(text);
      return 1;
    }
    if (text.search(/(\.jpg)|(\.jpeg)|(\.png)|(\.gif)$/i) > 0) {
      console.log("image detected");
      jQuery("#preview-image").attr("src", text);
      jQuery(".file-input-holder").show();
      jQuery("#preview-image").show();
      console.log("image shown");
      this.imageFromLink = true;
      this.youtubeLink = null;
      this.facebookLink = null;

      this.uploadedPicture = null;
      jQuery(".youtube-preview").html("");
      jQuery(".facebook-preview").html("");
      this.link.isSet = false;
      return 1;
    }
    this.analyzeLink(text);
    console.log('start');
    text = text.replace(/(?:\r\n|\r|\n)/g, "<br>");
    //console.log('finish');
    document.execCommand("insertHTML", false, text);
  }

  updateYoutubeFacebook(videoLink: string) {

    var videoId;

    if (videoLink.indexOf("youtube.com") > 0 || videoLink.indexOf("youtu.be") > 0) {
      videoId = this.getIdYoutubeVideoId(videoLink);
      try {
        jQuery(".facebook-preview").html("");
        jQuery(".youtube-preview").html(
          '<iframe width="320" height="215" src="https://www.youtube.com/embed/' +
          videoId +
          '" frameborder="0" allowfullscreen></iframe>'
        );
        this.uploadedPicture = null;
        this.closeLinkAPI();
        this.youtubeLink = videoId;
        jQuery("#preview-image").hide();
      } catch (err) {
        this.displayLinkError();
      }
    }
    else if (videoLink.indexOf("web.facebook.com") > 0 || videoLink.indexOf("www.facebook.com") > 0 ||
      videoLink.indexOf("m.facebook.com") > 0 || videoLink.indexOf("mobile.facebook.com") > 0) {
      videoId = this.getIdFacebookVideo(videoLink);
      let videoPage = this.getPageFacebookVideo(videoLink);
      try {
        jQuery(".youtube-preview").html("");
        jQuery(".facebook-preview").html(
          '<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F' + videoPage + '%2Fvideos%2F' +
          videoId +
          '%2F&show_text=0&height=215&appId" width="320" height="215" style="border:none;overflow:none" scrolling="yes" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>'
        );
        console.log("fb preview");
        this.uploadedPicture = null;
        this.closeLinkAPI();
        this.facebookLink = videoId;
        jQuery("#preview-image").hide();

      } catch (err) {
        this.displayLinkError();
      }
    }
    else {
      this.displayLinkError();
      return;
    }

  }


  getIdYoutubeVideoId(youtubeLink): string {
    if (youtubeLink.indexOf("youtube.com") > 0) {
      //let video = "";
      var a = youtubeLink.split("?");
      var b = a[1];
      var c = b.split("&");
      for (var i = 0; i < c.length; i++) {
        var d = c[i].split("=");
        if (d[0] == "v") {
          return d[1];
        }
      }
    } else if (youtubeLink.indexOf("youtu.be") > 0) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = youtubeLink.match(regExp);
      if (match && match[2].length == 11) {
        return match[2];
      }
    }
    return "error";
  }

  getIdFacebookVideo(facebookLink): string {
    var myRegexp = /(\/(videos\/)|(posts\/)|(v|(&|\?)id)=)(\d+)/;
    var match = facebookLink.match(myRegexp);
    if (match) {
      return match[match.length - 1];
    }
  }

  getPageFacebookVideo(videoLink): string {
    return "facebook";
  }

  resetPublishPicture() {
    jQuery("#preview-image").attr("src", "");
    jQuery("#preview-image").hide();
    this.imageFromLink = false;
    this.uploadedPicture = null;
  }

  analyzeLink(source) {

    var myArray = this.linkView.getListLinks(source);

    if (!myArray.length) {
      return 1;
    }
    var linkURL = myArray[0];
    //check if linkURL refers to speegar.com
    if (linkURL == this.link.url) {

      return 1;
    }


    if (this.imageFromLink) {
      return 1
    }


    this.linkLoading = true;

    this.http
      .get(
        environment.SERVER_URL + pathUtils.GET_OPEN_GRAPH_DATA + linkURL,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          if (response.results.success) {
            jQuery("#publishDiv").empty();
            //this.resetPublishPicture();
            jQuery(".video-preview").html("");
            //this.form.controls.publicationYoutubeLink.updateValue('');

            var r = /:\/\/(.[^/]+)/;
            this.linkDomain = linkURL.match(r)[1];
            //this.link.url = linkURL.substring(0, linkURL.length - 6);
            this.link.url = linkURL;
            this.link.title = response.results.data.ogTitle;
            this.link.description = response.results.data.ogDescription;
            if (response.results.data.ogImage) {
              this.link.image = response.results.data.ogImage.url;
              this.link.imageWidth = response.results.data.ogImage.width;
              this.link.imageHeight = response.results.data.ogImage.height;

            } else {
              this.link.image = null;
              this.link.imageWidth = 0;
              this.link.imageHeight = 0;
            }
            this.link.isSet = true;
            this.linkLoading = false;
            this.changeDetector.markForCheck();
          }
          this.linkLoading = false;
        },
        err => {
          console.error("error in link API;");
        },
        () => {
          this.linkLoading = false;
        }
      );
  }

  publish(publishDivRef) {

    console.log("publish");
    this.online = window.navigator.onLine;

    let txt: string = publishDivRef.innerHTML;
    console.log(txt);
    let white_space_regex: RegExp = /^(\ |\&nbsp;|\<br\>)*$/g;
    if (
      //!this.form.value.publicationText &&
      white_space_regex.test(txt)
      && !this.youtubeLink
      && !this.facebookLink
      && !this.uploadedPicture
      && !this.link.isSet
      && !this.imageFromLink) {
      this.errorMsg = "SP_FV_ER_PUBLICATION_EMPTY";
      // this.errorTimed();
      return;
    }

    txt = txt.replace(/(\&nbsp;|\ )+/g, ' ')
      .replace(/(\<.?br\>)+/g, '<br>')
      .replace(/^\<.?br\>|\<.?br\>$/g, '');

    // when image form link is passed
    this.imageFromLink = this.imageFromLink
      && !this.youtubeLink
      && !this.facebookLink
      && !this.uploadedPicture
      && !this.link.isSet;

    var img_src: string = jQuery('#preview-image').attr('src');
    if (this.imageFromLink) {
      this.imageFromLink = false;
      if (img_src && img_src.length) {

        let br: string = txt.length ? '<br>' : "";
        txt += `${br}<img src="${img_src}" class='image-from-link'>`;
      }
    }


    this.form.value.publicationText = txt;

    var data = new FormData();
    data.append("profileId", this.user._id);
    if (this.selectedMenuElement == 0) {
      data.append("confidentiality", "PUBLIC");
    } else {
      data.append("confidentiality", "PRIVATE");
    }
    data.append("publTitle", this.form.value.publicationTitle);
    data.append("publText", this.form.value.publicationText);
    data.append("publyoutubeLink", this.youtubeLink);
    data.append("publfacebookLink", this.facebookLink);
    data.append("publPicture", this.uploadedPicture);
    console.log(this.facebookLink);
    // clear title value
    this.form.reset();

    if (this.link.isSet) {
      data.append("publExternalLink", this.link.url);
    }
    this.changeDetector.markForCheck();
    if (this.online) {

      this.loadingPublish = true;
      this.http
        .post(
          environment.SERVER_URL + pathUtils.PUBLISH,
          data,
          AppSettings.OPTIONS_POST
        )
        .map((res: Response) => res.json())
        .subscribe(
          response => {
            console.log(response);
            if (response.status == "0") {

              jQuery("#errorMsgDisplay").fadeOut(1000);
              this.putNewPub(response.publication, false);
              this.resetPublish();
              this.titleEnable = false;
            } else {
              this.errorMsg = response.error;
              //this.errorTimed();
            }
            this.arabicText = false;
          },
          err => {
            console.log(err);
            this.errorMsg = "SP_ER_TECHNICAL_ERROR";
          },
          () => {
            this.loadingPublish = false;
          }
        );
    } else {
      this.errorMsg = "Intenet Connection Failed";
      //this.errorTimed();

    }
  }

  checkArabic(firstLetter) {
    this.arabicText = this.arabicRegex.test(firstLetter);

  }

  putNewPub(pub: PublicationBean, isShared: boolean) {
    var element = pub;
    element.displayed = true;
    if (isShared) {
      element.isShared = true;
    } else {
      element.isShared = false;
    }

    this.publicationBeanList.unshift(element);
    this.changeDetector.markForCheck();
  }

  resetPublish() {
    jQuery("#file-image").val("");
    jQuery("#file-image-gif").val("");
    jQuery("#preview-image").attr("src", "");
    jQuery("#preview-image").fadeOut();
    this.uploadedPicture = null;
    this.titleEnable = false;
    this.youtubeInput = false;
    this.youtubeLink = "";
    this.facebookInput = false;
    this.facebookLink = "";
    jQuery(".yt-in-url").val("");
    jQuery(".youtube-preview").html("");
    jQuery(".facebook-preview").html("");
    this.loadingPublish = false;
    jQuery(".textarea-publish").html("");
    this.closeLinkAPI();
    this.isEmpty = true;
    this.changeDetector.markForCheck();
  }

  closeLinkAPI() {
    this.link.initialise();
  }

  displayLinkError() {
    this.errorMsg = "Votre lien Youtube ou Facebook est invalide! Veuillez mettre un lien Valide.";
    this.errorTimed();
    jQuery(".youtube-preview").html("");
    jQuery(".facebook-preview").html("");
  }

  errorTimed() {
    jQuery("#errorMsgDisplay").fadeIn(500);
    jQuery("html, body").scrollTop(
      // jQuery("#errorMsgDisplay").offset().top - jQuery(".main-header").innerHeight() - 10
    );
    //document.querySelector("#errorMsgDisplay").scroll; //.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      jQuery("#errorMsgDisplay").fadeOut(1000);
    }, 5000);
    setTimeout(() => {
      this.errorMsg = "";
    }, 5200);
  }

  loadFirstPosts() {
    if (localStorage.getItem('token') == 'offline') {
      console.log("load first posts");
      //this.publicationBeanList = publicationBeanList_offline;
      return;
    }
    console.log("load first postsss");
    let urlAndPara = environment.SERVER_URL + pathUtils.GET_PUBLICATIONS;
    this.http
      .get(urlAndPara, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.publicationBeanList = [];
          this.putIntoList(response);
          //console.log(this.publicationBeanList);
          this.showLoading=false;
          if (response.length == 0) {
            this.morePosts = false
          }
          this.changeDetector.markForCheck();
        },
        err => {
          setTimeout(() => {
            this.showLoading = false;
            this.isLock = true;
            this.keepLoading = false;
            this.changeDetector.markForCheck();
          }, 3000);
        },
        () => {
        }
      );
  }


  onLoadMorePosts(infiniteScroll) {

    if (this.keepLoading) {
      this.isLock = true;
      this.showLoading = true;
      let urlAndPara =
        environment.SERVER_URL + pathUtils.GET_PUBLICATIONS + this.lastPostId;
      this.http
        .get(urlAndPara, AppSettings.OPTIONS)
        .map((res: Response) => res.json())
        .subscribe(
          response => {
            this.putIntoList(response);
            if (response.length == 0) {
              this.morePosts = false
            }
            this.changeDetector.markForCheck();
            infiniteScroll.complete();
          },
          err => {
            setTimeout(() => {
              this.showLoading = false;
              this.isLock = true;
              this.keepLoading = false;
            }, 3000);
          },
          () => {
          }
        );
    }
  }


  putIntoList(response) {
    if (!response.length) {
      console.log("!response.length");
      this.showLoading = false;
      this.isLock = false;
      // this.showSuggestionMSG = true;
      this.keepLoading = false;
      return;

    }
    //this.showSuggestionMSG = false;
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
    if (response.length < 10) {
      console.log("response.length < 10");
      //this.showSuggestionMSG = true;
    }

  }

  refrech(refresher) {
    let urlAndPara = environment.SERVER_URL + pathUtils.GET_PUBLICATIONS;
    this.http
      .get(urlAndPara, AppSettings.OPTIONS)
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          this.publicationBeanList = [];
          this.putIntoList(response);
          console.log(this.publicationBeanList);

          if (response.length == 0) {
            this.morePosts = false
          }
          this.changeDetector.markForCheck();
          refresher.complete();
        },
        err => {
          setTimeout(() => {
            this.showLoading = false;
            this.isLock = true;
            this.keepLoading = false;
            this.changeDetector.markForCheck();
          }, 3000);
          refresher.complete();
        },
        () => {
          refresher.complete();
        }
      );
  }

  doRefresh(refresher) {
    this.refrech(refresher);
  }

  deletePost(event: PublicationBean) {
    this.publicationBeanList = this.publicationBeanList.filter(el => el._id != event._id);
    console.log("hoome"+this.publicationBeanList );
  }

  toggleShowGifSlider() {
    this.showGifSlider = !this.showGifSlider;
  }

  onChange(newValue: string) {
    this.listSearchUsers = [];
    //this.enableAutocomplete();
    this.changeDetector.markForCheck();
    if (newValue.length > 1) {
      this.getListSearchUsers(newValue);
    } else {
      if (this.recentSearchService.isEmptyList()) {
        //this.disableAutocomplete();
      } else {
        this.showRecentSearchUsers();
      }
    }
    this.changeDetector.markForCheck();
  }
  getListSearchUsers(key: string) {
    this.showRecentSearch = false;
    this.http
      .get(
        environment.SERVER_URL + pathUtils.FIND_PROFILE + key,
        AppSettings.OPTIONS
      )
      .map((res: Response) => res.json())
      .subscribe(
        response => {
          let i;
          this.listSearchUsers = [];
          this.noSearchResults = false;
          this.changeDetector.markForCheck();
          for (i = 0; i < this.listSearchUsers.length; i++) {
            this.listSearchUsers.pop();
            this.changeDetector.markForCheck();
          }
          if (response.status == 0) {
            if (response.profiles)
              for (i = 0; i < response.profiles.length; i++) {
                this.listSearchUsers[i] = response.profiles[i];
                this.changeDetector.markForCheck();
              }
          }
        },
        ()=> {
          this.noSearchResults = true;
        },
        () => {
          if (this.listSearchUsers.length == 0) {
            //this.disableAutocomplete();
            this.noSearchResults = true;
          } else {
            this.noSearchResults = false;
          }
          this.changeDetector.markForCheck();
        }
      );
  }
  showRecentSearchUsers() {
    if (this.recentSearchService.isEmptyList()) {
      //this.disableAutocomplete();
      this.showRecentSearch = false;
    } else {
      //this.enableAutocomplete();
      this.recentSearchList = this.recentSearchService.getListRecentRech();
      this.showRecentSearch = true;
    }
    this.changeDetector.markForCheck();
  }
  onClickSearch(){
    this.navCtrl.push(SearchPage);
  }
}

export function readURL(input) {
  if (input.files && input.files[0]) {
    let reader = [];
    reader.push(new FileReader());
    reader[0].addEventListener(
      "load",
      event => {
        jQuery("#preview-image").show();
      },
      false
    );
    if (input.files[0]) {
      reader[0].readAsDataURL(input.files[0]);
    }
  }
}

function previewFile(uploadedFile) {
  //let preview = jQuery("#preview-image");
  let file = uploadedFile;
  let reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      //preview.att.src = reader.result;
      jQuery("#preview-image").attr("src", reader.result);
      jQuery(".file-input-holder").fadeIn(500);
      jQuery("#preview-image").fadeIn(500);
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
}

