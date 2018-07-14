import {Injectable} from '@angular/core';


@Injectable()
export class LinkView {
  public listLinks: Array<string> = [];

  /* constructor  */
  constructor() {
    this.listLinks = [];

    /*
    function validateYouTubeUrl() {
      //  var url = $('#youTubeUrl').val();
      let url = "";
      if (url != undefined || url != '') {
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).+/;
        let match = url.match(regExp);
        if (match && match[2].length == 11) {
          // Do anything for being valid
          // if need to change the url to embed url then use below line
          // $('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
        }
        else {
          // Do anything for not being valid
        }
      }
    }
    */
  }

  isALink(link): Boolean {
    //var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?&nbsp?/i;
    let myRegExp = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
    return myRegExp.test(link);
  }

  getListLinks(text: string): Array<string> {
    this.listLinks = [];
    let textSpliced = text.split(/ |\n+/);
    for (let i = 0; i < textSpliced.length; i++) {
      if (this.isALink(textSpliced[i])) {
        this.listLinks.push(textSpliced[i]);
      }
    }
    return this.listLinks;
  }

  transformATextHaveALink(text): string {
    if (!this.getListLinks(text).length) {
      return text;
    }
    let newText = "";
    let textSplicedInLine = text.split("\n");
    for (let i = 0; i < textSplicedInLine.length; i++) {
      let textSplicedInOneLine = textSplicedInLine[i].split(" ");
      for (let j = 0; j < textSplicedInOneLine.length; j++) {
        if (this.isALink(textSplicedInOneLine[j])) {
          newText = newText + ' <a href="' + textSplicedInOneLine[j] + '">' + textSplicedInOneLine[j] + '</a>';
        }
        else {
          newText = newText + " " + textSplicedInOneLine[j];
        }
      }
      if (i == 0 || (i == textSplicedInLine.length - 1 && (textSplicedInLine[i] == "" || textSplicedInLine[i] == " " || textSplicedInLine[i] == "<br>"))) {
        newText = newText;
      }
      else {
        newText = " <br> " + newText;
      }
    }

    return newText;
  }


}
