import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import { MenuController } from 'ionic-angular';

import { ProposDeNousPage } from '../propos-de-nous/propos-de-nous';
import { CguPage } from '../cgu/cgu';
import { EquipePage } from '../equipe/equipe';
//import { DebugOnlyPage } from '../debug-only/debug-only';


@IonicPage()
@Component({
  selector: 'page-support-tabs',
  templateUrl: 'support-tabs.html',
})
export class SupportTabsPage {

  rootPage:any;
  constructor( public navctlr:NavController, public menuCtrl: MenuController){
    this.rootPage=ProposDeNousPage;
  }
  onClick(type:string){
    switch(type){
      case 'aPropos': this.rootPage=ProposDeNousPage;
        break;
      case 'equipe': this.rootPage=EquipePage;
        break;
      case 'cgu': this.rootPage=CguPage;
        break;
    }
    this.menuCtrl.close();
  }
  ionViewDidLoad(){
    console.log("SupportTabsPage didLoad");
  }
}
