import { Injectable } from '@angular/core';

/* beans */
import { User } from '../../../beans/user'
import { SocialUser } from "../../../beans/social-user";
//import { NavController } from 'ionic-angular';
//import { environment } from "../environments/environment";


@Injectable()
export class LoginService {
    /* token */
    public token: string;
    /* User */
    public user : User;

    /* constructor  */
    constructor(){
        this.actualize();
    }

    /* isConnected  */
    isConnected():boolean{
        if(localStorage.getItem('token')){
          return true;
        }
        return false;
    }

    /* isWasConnectedWithFacebook */
    isWasConnectedWithFacebook(): boolean{
        if(localStorage.getItem('facebookUser')){
            return true;
        }
        return false;
    }
    isWasConnectedWithGoogle(): boolean{
        if(localStorage.getItem('googleUser')){
            return true;
        }
        return false;
    }


    redirect(){
      if(!this.isConnected()){
        if(this.isWasConnectedWithFacebook()){

          //this.router.navigate(['/sign-in/facebook-sign-in']);
        }else{
            //this.navCtrl.setRoot(SignInPage);
        }
      }
    }

    /* getFacebookUser */
    getFacebookUser(): SocialUser{
        if(this.isWasConnectedWithFacebook()){
           return JSON.parse(localStorage.getItem('facebookUser'));
        }
        return null;
    }

    deleteUserFacebook(){
        localStorage.removeItem('facebookUser');
    }

    /* actualize */
    actualize(){
        if(this.isConnected()){
            this.token = localStorage.getItem('token');
            this.user= JSON.parse(localStorage.getItem('user'));
        }
    }

    /* updateUser */
    updateUser(user:User){
            this.user=user;
            localStorage.setItem('user', JSON.stringify(user));
    }

    /* setToken */
    setToken(token : string){
        this.token=token;
        localStorage.setItem('token', token);
    }

    /* getToken */
    getToken():string{
        return this.token;
    }

    /* getUser */
    getUser():User{
        this.user= JSON.parse(localStorage.getItem('user'));
        return this.user;
    }

    /* deconnexion */
    logout(){
        if(this.isConnected()){
            console.log("remove Item");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('facebookUser');
        }
        if(localStorage.getItem('lastConnexionMethod')){
                if(localStorage.getItem('lastConnexionMethod')=="g+"){
                        //this.router.navigate(['/sign-in/google-sign-in']);

                }
                else if(localStorage.getItem('lastConnexionMethod')=="fb"){
                        //this.router.navigate(['/sign-in/facebook-sign-in']);
                }
                else if(localStorage.getItem('lastConnexionMethod')=="nr"){
                        //this.router.navigate(['/sign-in/sign-in']);
                }
                else{
                    //this.router.navigate(['/sign-in/sign-in']);
                }
        }
        else{
                    //this.router.navigate(['/sign-in/sign-in']);
        }
    }
}
