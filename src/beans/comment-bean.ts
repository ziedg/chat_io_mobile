
export class CommentBean {

    public _id  : string;
    public profileId  : string;
    public profilePicture  : string;
    public profileFirstName  : string;
    public profileLastName  : string;
    public publId : string;
    public dateComment : string;
    public nbLikes : number;
    public nbDislikes: number;
    public commentText : string;
    public commentLink : string;
    public commentPicture : string;
    public isLiked : boolean;
    public isDisliked : boolean;
    public deleted=false;
    public profilePictureMin:string;
	constructor() {
			this.isLiked=false;
			this.isDisliked=false;
            this.deleted=false;
	}
}
