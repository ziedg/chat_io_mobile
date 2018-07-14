import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {RecentRechService} from './services/recentRechService';
import {ProfilePage} from '../profile/pages/profile/profile';
import {User} from '../../beans/user';
import {AppSettings} from '../../conf/app-settings';
import {environment} from '../../environments/environment';
import {Http, Response} from '@angular/http';
import * as pathUtils from '../../utils/path.utils';
import * as jQuery from "jquery";


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  profilePage = ProfilePage;

  recentSearchList;
  listSearchUsers: Array<User> = [];
  showRecentSearch: Boolean;
  noSearchResults: Boolean = false;
  searchValue: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              private recentSearchService: RecentRechService,
              private changeDetector: ChangeDetectorRef) {
    this.showRecentSearch = true;
    this.recentSearchList = this.recentSearchService.getListRecentRech();
  }

  saveRecentRech(result) {
    this.recentSearchService.addToListRecentRech(result);
    this.changeDetector.markForCheck();
    this.disableAutocomplete();
    this.recentSearchList = this.recentSearchService.getListRecentRech();
  }

  onChange(newValue: string) {
    this.listSearchUsers = [];
    this.enableAutocomplete();
    this.changeDetector.markForCheck();
    if (newValue.length > 1) {
      this.getListSearchUsers(newValue);
    } else {
      if (this.recentSearchService.isEmptyList()) {
        this.disableAutocomplete();
      } else {
        this.showRecentSearchUsers();
      }
    }
    this.changeDetector.markForCheck();
  }

  showRecentSearchUsers() {
    if (this.recentSearchService.isEmptyList()) {
      this.disableAutocomplete();
      this.showRecentSearch = false;
    } else {
      this.enableAutocomplete();
      this.recentSearchList = this.recentSearchService.getListRecentRech();
      this.showRecentSearch = true;
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
            this.disableAutocomplete();
            this.noSearchResults = true;
          } else {
            this.noSearchResults = false;
          }
          this.changeDetector.markForCheck();
        }
      );
  }

  checkAutoComplete() {
    if (this.searchValue && this.searchValue.length > 1) {
      this.getListSearchUsers(this.searchValue);
    } else {
      this.enableAutocomplete();
      this.showRecentSearchUsers();
    }
  }

  // TODO: disable jQuery
  enableAutocomplete() {
    jQuery(".recherche-results-holder").show();
    jQuery(".upper-arrow-search").show();
    this.changeDetector.markForCheck();
  }

  disableAutocomplete() {
    jQuery(".recherche-results-holder-1").hide();
    jQuery(".upper-arrow-search").hide();
  }

}
