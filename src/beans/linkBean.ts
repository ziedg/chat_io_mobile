/* LinkBean */
export class LinkBean {
	public url: string;
	public title: string;
	public description: string;
	public image: string;
	public imageWidth: number;
	public imageHeight: number;
	public isSet: boolean;
	public isGif :boolean;

	public constructor() {
		this.url = "http://speegar.com";
		this.title = "Link Unavailable";
		this.description = "Link Unavailable";
		this.title = "Speegar";
		this.image = null;
		this.imageWidth = 0;
		this.imageHeight = 0;
		this.isSet = false;
		this.isGif = false;
	}

	public initialise() {
		this.url = "http://speegar.com";
		this.title = "Link Unavailable";
		this.description = "Link Unavailable";
		this.title = "Speegar";
		this.image = null;
		this.imageWidth = 0;
		this.imageHeight = 0;
		this.isSet = false;
		this.isGif = false;
	}

}
