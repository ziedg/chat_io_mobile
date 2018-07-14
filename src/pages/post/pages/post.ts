import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OnInit } from '@angular/core';

import { PostService } from '../services/postService';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
  providers: [PostService]
})
export class PostPage implements OnInit{
  private publication:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private postService: PostService) {


  }
  ngOnInit(){
    if(this.navParams.get('publication')) {
      this.publication = this.navParams.get('publication');
      console.log('load Post');
    }
    else {
      this.loadPage(this.navParams.get('publId'));
      console.log("postPage");
    }
  }

  loadPage(publId:string){
    this.postService.goToPost(publId)
      .then(data => {
        this.publication = data
      });
  }
}

