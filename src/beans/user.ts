export class User {
	public _id;
	public firstName: string;
	public lastName: string;
	public email: string;
	public profilePicture: string;
	public coverPicture: string;
	public nbLikes: number;
	public nbSubscribers: number;
	public nbSuivi: number;
	public profile;
	public gender:string;
	public googleId:string;
	public about:string;
	public isSubscribe:boolean;
  public isFollowed:boolean;
	public facebookLink:string;
	public twitterLink:string;
	public youtubeLink:string;
	public profilePictureMin:string;
  public isNewInscri : boolean;
	public constructor(){
		this._id=0;
		this.firstName="";
		this.lastName="";
	}
}
