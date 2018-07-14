
import {CommentBean} from './comment-bean'

export class PublicationBean {

    public _id  : string;
    public profileId  : string;
    public datePublication : string;
    public profileFirstName  : string;
    public profileLastName : string;
    public profilePicture : string;
    public confidentiality : string;
    public nbLikes  : number;
    public nbDislikes : number;
    public nbComments : number;
    //public nbSignals : number;
    public publTitle  : string;
    public publText : string;
    //public publLink
    public publPictureLink : string;
    public publyoutubeLink : string;
    public publfacebookLink : string;
    public publExternalLink : string;
    //public fcbkLink
    //public twitterLink
    public nbFcbkShare : number;
    public nbTwitterShare : number;
    public isLiked : boolean;
    public isDisliked : boolean;
    public comments: Array<CommentBean>;
    public displayed:Boolean;
    // for sharedPub
    public originalPublicationId:string;
    public originalDatePublication:string;
    public originalProfileFirstName:string;    
    public originalProfileLastName:string;
    public originalProfileId:string;
    public originalProfilePicture:string;
    public originalProfilePictureMin:string;
    public isShared:boolean;
    public nbShare:number;
    public profilePictureMin:string;
    constructor(){
        this._id="0";
        this.comments=[];
        this.displayed=true;
    }
}


