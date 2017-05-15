import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, 
  AuthMethods } from 'angularfire2';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthProvider {
    private authState: FirebaseAuthState;
    uid: number;
    username: string;
    picture: string;
    email: string;

    private graphUrl = 'https://graph.facebook.com/';
    // private graphQuery = `?access_token=${this.accessToken}&date_format=U&fields=posts{from,created_time,message,attachments}`;

    constructor(
        private http: Http,
        public af:AngularFire, 
        public auth$: AngularFireAuth,
        public local:Storage) {

        this.authState = null;
        af.auth.subscribe((state: FirebaseAuthState) => {
            console.log("AngularFireAuth success", state);
            this.authState = state;
        }, err => {
            console.log("AngularFireAuth error", err);
        });
    }
  
  /*
  signin(credentails) {   
    return this.af.auth.login(credentails).then((data)=>{
      console.log("login", data);
    }, (error) => {
      console.log("login", error);
    });
  }
  */

    createAccount(credentails) {
        return this.af.auth.createUser(credentails).then( data =>{
          console.log("createAccount", data);
        },error=>{
          console.log("createAccount", error);
        });
    }

    deleteAccount(){
        return new Promise<void>((resolve, reject) => {
            this.af.auth.subscribe(authState => {
                authState.auth.delete()
                .then(_ => resolve())
                .catch(e => reject(e));
            });
        });
    }

  
/*
  fbProfileData(pageName: string, query:string): Observable<any> {
    let url = this.graphUrl + pageName + query;

    return this.http
        .get(url)
        .map(response => response.json());
   }
*/
    get authenticated(): boolean {
        return this.authState !== null;
    }

    get getAuthState():FirebaseAuthState{
        return this.authState;
    }

    signInWithFacebook(facebookCredential): firebase.Promise<FirebaseAuthState> {
        return this.auth$.login(facebookCredential, {
          provider: AuthProviders.Facebook,
          method: AuthMethods.OAuthToken // don't change this on any cirsumstances
        });
    }

    signOut() {
        console.log( "AuthProvider::signOut()" );
        return this.auth$.logout();
    }

    displayName(): string {
        if (this.authState != null) {
          return this.authState.facebook.displayName;
        } else {
          return '';
        }
    }



}

