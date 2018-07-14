import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostPage } from './post';
import {PostComponent} from "../components/post/post";
import {Comment} from "../components/comment/comment";
import {LikeReaction} from "../components/post/reactions/like-reaction/like-reaction";
import {LoveReaction} from "../components/post/reactions/love-reaction/love-reaction";
import {ContenteditableModel} from "./contenteditable-model";

@NgModule({
  declarations: [
    PostPage,
    PostComponent,
    Comment,
    LikeReaction,
    LoveReaction,
    ContenteditableModel
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
  ],
})
export class PostPageModule {}
