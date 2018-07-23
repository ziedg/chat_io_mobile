import {Injectable} from '@angular/core';

import {EmojiBean} from '../../beans/emoji-bean';
import {EmojiListBean} from '../../beans/emoji-list-bean';


@Injectable()
export class EmojiService {
  listEmoji: Array<EmojiListBean> = [];

  /* constructor  */
  constructor() {
    let nvList: EmojiListBean = new EmojiListBean();
    let nvemoji: EmojiBean = new EmojiBean();
    // list people
    nvList.title = "persone";
    nvList.list = [];

    nvemoji = new EmojiBean();
    nvList.list.push(this.addtoListEmoji(":)", "blush"));
    nvList.list.push(this.addtoListEmoji(":D", "smile"));
    nvList.list.push(this.addtoListEmoji(";)", "smirk"));
    nvList.list.push(this.addtoListEmoji(":sot:", "stuck_out_tongue"));
    nvList.list.push(this.addtoListEmoji(":*", "kissing"));
    nvList.list.push(this.addtoListEmoji(":p", "stuck_out_tongue"));
    nvList.list.push(this.addtoListEmoji(":laughing:", "laughing"));
    nvList.list.push(this.addtoListEmoji(":o", "open_mouth"));
    nvList.list.push(this.addtoListEmoji(":/", "confused"));
    nvList.list.push(this.addtoListEmoji("-_-", "expressionless"));
    nvList.list.push(this.addtoListEmoji(":(", "disappointed"));
    nvList.list.push(this.addtoListEmoji(":ersevere:", "persevere"));
    nvList.list.push(this.addtoListEmoji(":'(", "cry"));
    nvList.list.push(this.addtoListEmoji(":yum:", "yum"));
    nvList.list.push(this.addtoListEmoji("<3", "heart"));
    nvList.list.push(this.addtoListEmoji("B)", "sunglasses"));
    nvList.list.push(this.addtoListEmoji(":innocent:", "innocent"));
    nvList.list.push(this.addtoListEmoji(":smi:", "smiling_imp"));
    nvList.list.push(this.addtoListEmoji("(y)", "thumbsup"));
    nvList.list.push(this.addtoListEmoji(":dislike:", "-1"));
    nvList.list.push(this.addtoListEmoji(":nch:", "punch"));
    nvList.list.push(this.addtoListEmoji(":v:", "v"));
    nvList.list.push(this.addtoListEmoji(":clap:", "clap"));
    nvList.list.push(this.addtoListEmoji(":kiss:", "kiss"));
    nvList.list.push(this.addtoListEmoji(":tongue:", "tongue"));
    nvList.list.push(this.addtoListEmoji(":thought_balloon:", "thought_balloon"));
    nvList.list.push(this.addtoListEmoji(":trollface:", "trollface"));

    this.listEmoji[0] = nvList;

    // nature

    nvList = new EmojiListBean();
    nvList.list = [];
    nvList.title = "nature";

    nvList.list.push(this.addtoListEmoji(":sunny:", "sunny"));
    nvList.list.push(this.addtoListEmoji(":umbrella:", "umbrella"));
    nvList.list.push(this.addtoListEmoji(":cloud:", "cloud"));
    nvList.list.push(this.addtoListEmoji(":snowman:", "snowman"));
    nvList.list.push(this.addtoListEmoji(":zap:", "zap"));
    nvList.list.push(this.addtoListEmoji(":cyclone:", "cyclone"));
    nvList.list.push(this.addtoListEmoji(":cherry_blossom:", "cherry_blossom"));
    nvList.list.push(this.addtoListEmoji(":rose:", "rose"));
    nvList.list.push(this.addtoListEmoji(":tulip:", "tulip"));
    nvList.list.push(this.addtoListEmoji(":sunflower:", "sunflower"));
    nvList.list.push(this.addtoListEmoji(":deciduous_tree:", "deciduous_tree"));
    nvList.list.push(this.addtoListEmoji(":evergreen_tree:", "evergreen_tree"));
    nvList.list.push(this.addtoListEmoji(":sun_with_face:", "sun_with_face"));
    nvList.list.push(this.addtoListEmoji(":cat:", "cat"));
    nvList.list.push(this.addtoListEmoji(":dog:", "dog"));
    nvList.list.push(this.addtoListEmoji(":monkey_face:", "monkey_face"));
    nvList.list.push(this.addtoListEmoji(":horse:", "horse"));
    nvList.list.push(this.addtoListEmoji(":camel:", "camel"));
    nvList.list.push(this.addtoListEmoji(":ram:", "ram"));
    nvList.list.push(this.addtoListEmoji(":honeybee:", "honeybee"));
    nvList.list.push(this.addtoListEmoji(":snake:", "snake"));
    nvList.list.push(this.addtoListEmoji(":cow:", "ox"));
    nvList.list.push(this.addtoListEmoji(":dragon:", "dragon"));
    nvList.list.push(this.addtoListEmoji(":whale:", "whale"));
    nvList.list.push(this.addtoListEmoji(":fish:", "fish"));
    nvList.list.push(this.addtoListEmoji(":turtle:", "turtle"));
    nvList.list.push(this.addtoListEmoji(":beetle:", "beetle"));
    nvList.list.push(this.addtoListEmoji(":leopard:", "leopard"));
    nvList.list.push(this.addtoListEmoji(":ig2:", "pig2"));
    nvList.list.push(this.addtoListEmoji(":mouse2:", "mouse2"));

    this.listEmoji[1] = nvList;


    // nature

    nvList = new EmojiListBean();
    nvList.list = [];
    nvList.title = "objets";

    nvList.list.push(this.addtoListEmoji(":gift_heart:", "gift_heart"));
    nvList.list.push(this.addtoListEmoji(":school_satchel:", "school_satchel"));
    nvList.list.push(this.addtoListEmoji(":flags:", "flags"));
    nvList.list.push(this.addtoListEmoji(":fireworks:", "fireworks"));
    nvList.list.push(this.addtoListEmoji(":jack_o_lantern:", "jack_o_lantern"));
    nvList.list.push(this.addtoListEmoji(":jack_o_lantern:", "jack_o_lantern"));
    nvList.list.push(this.addtoListEmoji(":clap:", "clap"));
    nvList.list.push(this.addtoListEmoji(":fireworks:", "fireworks"));
    nvList.list.push(this.addtoListEmoji(":bell:", "bell"));
    nvList.list.push(this.addtoListEmoji(":iphone:", "iphone"));
    nvList.list.push(this.addtoListEmoji(":telephone:", "phone"));
    nvList.list.push(this.addtoListEmoji(":tv:", "tv"));
    nvList.list.push(this.addtoListEmoji(":computer:", "computer"));
    nvList.list.push(this.addtoListEmoji(":tv:", "tv"));
    nvList.list.push(this.addtoListEmoji(":computer:", "computer"));
    nvList.list.push(this.addtoListEmoji(":fax:", "fax"));
    nvList.list.push(this.addtoListEmoji(":watch:", "watch"));
    nvList.list.push(this.addtoListEmoji(":alarm_clock:", "alarm_clock"));
    nvList.list.push(this.addtoListEmoji(":mag_right:", "mag_right"));
    nvList.list.push(this.addtoListEmoji(":lock:", "lock"));
    nvList.list.push(this.addtoListEmoji(":unlock:", "unlock"));
    nvList.list.push(this.addtoListEmoji(":key:", "key"));
    nvList.list.push(this.addtoListEmoji(":toilet:", "toilet"));
    nvList.list.push(this.addtoListEmoji(":bomb:", "bomb"));
    nvList.list.push(this.addtoListEmoji(":closed_book:", "closed_book"));
    nvList.list.push(this.addtoListEmoji(":soccer:", "soccer"));
    nvList.list.push(this.addtoListEmoji(":tennis:", "tennis"));
    nvList.list.push(this.addtoListEmoji(":rugby_football:", "rugby_football"));
    nvList.list.push(this.addtoListEmoji(":ring:", "ring"));
    nvList.list.push(this.addtoListEmoji(":lipstick:", "lipstick"));


    this.listEmoji[2] = nvList;

  }

  addtoListEmoji(shortcut, imageName): EmojiBean {
    var nvemoji: EmojiBean = new EmojiBean();
    nvemoji.shortcut = shortcut;
    nvemoji.imageName = imageName;
    return nvemoji;
  }

  getEmojiList(): Array<EmojiListBean> {
    return this.listEmoji;
  }

  AfficheWithEmoji(text: string): string {
    let img;
    if (this.isAEmoji(this.replaceAll(text, " ", ""))) {
      img = '<img class="emoji-img"  src="assets/images/basic/';
    }
    else {
      img = '<img class="emoji-img emoji" src="assets/images/basic/';
    }
    var newText = "";
    var textSplicedInLine = text.split("\n");
    for (var i = 0; i < textSplicedInLine.length; i++) {
      var textSplicedInOneLine = textSplicedInLine[i].split(" ");
      for (var j = 0; j < textSplicedInOneLine.length; j++) {
        var textAfterEdit = textSplicedInOneLine[j];
        textAfterEdit = this.replaceAll(textAfterEdit, "&nbsp;", " ");
        for (var i = 0; i < textAfterEdit.length; i++) {
          if (textAfterEdit.charCodeAt(i) == 160) {
            textAfterEdit = textAfterEdit.replace(textAfterEdit[i], "");
          }
        }

        if (this.isAEmoji(this.replaceAll(textAfterEdit, " ", ""))) {
          newText = newText + ' ' + img + this.shortCutToImageName(this.replaceAll(textAfterEdit, " ", "")) + '.png" /> ';
        }
        else {
          newText = newText + " " + textSplicedInOneLine[j];
        }
      }
      newText = newText + " <br> ";
    }


    return newText;
  }

  replaceAll(comment, search, replacement) {
    return comment.split(search).join(replacement);
  }

  isAEmoji(text: String): Boolean {
    for (var i = 0; i < this.listEmoji.length; i++) {
      for (var j = 0; j < this.listEmoji[i].list.length; j++) {
        if (text == this.listEmoji[i].list[j].shortcut) {
          return true;
        }
      }
    }
    return false;
  }

  shortCutToImageName(short: string): string {
    for (var i = 0; i < this.listEmoji.length; i++) {
      for (var j = 0; j < this.listEmoji[i].list.length; j++) {
        if (short === this.listEmoji[i].list[j].shortcut)
          return this.listEmoji[i].list[j].imageName;
      }
    }
    return "";
  }

  imageNameToShortcut(imageName: string): string {
    for (var i = 0; i < this.listEmoji.length; i++) {
      for (var j = 0; j < this.listEmoji[i].list.length; j++) {
        if (imageName === this.listEmoji[i].list[j].imageName)
          return this.listEmoji[i].list[j].shortcut;
      }
    }
    return "";
  }

  getCommentTextFromHtml(commentHtml) {
    let firstPart = '<img class="emoji" style="align:absmiddle; top : 0;" src="assets/images/basic/';
    let secondPart = '.png" />';
    let context = this;
    return (
      commentHtml.replace(
        new RegExp("(?:" + firstPart + ")(.*?)(?:" + secondPart + ")", "ig"),
        function ($1, $2, $3) {
          return context.imageNameToShortcut($2);
        }
      )
    );
  }
}
