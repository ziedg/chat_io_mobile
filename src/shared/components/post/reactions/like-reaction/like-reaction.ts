import { Component, Input } from '@angular/core';

@Component({
  selector: 'like-reaction',
  templateUrl: 'like-reaction.html'
})
export class LikeReaction {
  @Input('checked') checked:boolean = false;
}
