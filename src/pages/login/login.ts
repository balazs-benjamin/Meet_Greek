import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//import { TabsPage } from '../tabs/tabs';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { validateEmail } from '../../validators/email';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';

// import { CityService } from '../../providers/city-service';
// import { Geolocation } from 'ionic-native';
import { WelcomePage } from '../welcome/welcome';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import firebase from 'firebase';
import { AngularFire } from 'angularfire2';
import { MainPage } from '../main/main';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  hasUserEnterDetails;
  loginForm: any;
  loading: any;
  public user:any;
  private deleteAccount:boolean = false;

  // coordinates = {lat: 0, lng: 0};
  // public cityResults: any;

  constructor(
    private fb: Facebook,
    public nav: NavController,
    public af: AngularFire,
    public auth: AuthProvider,
    public userProvider: UserProvider,
    public util: UtilProvider,
    public storage: Storage,
    public platform: Platform,
    private navParams: NavParams,
    public loadingCtrl: LoadingController) {

    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    console.log("navParams.data", navParams.data);
    

  }

  ionViewDidLoad() {
    console.log("LoginPage::ionViewDidLoad()");
    this.platform.ready().then(() => {

      this.user = firebase.auth().currentUser;
      
      console.log('LoginPage::ionViewDidLoad', this.user, this.auth.authenticated );
      
      if (this.auth.authenticated) {
        this.nav.setRoot(MainPage);
        return;
      }
      this.storage.get('hasUserEnterDetails').then((result) => {
        
        console.log('LoginPage::hasUserEnterDetails', result);
        this.hasUserEnterDetails = (result != null);
        
      });
    });
  }

  ngOnInit() {
  }
/*
  createAccount() {
    console.log("LoginPage::createAccount()");

    let credentials = this.loginForm.value;
    this.auth.createAccount(credentials)
      .then((data) => {        
        this.storage.set('uid', data.uid);
        this.userProvider.createUser(credentials, data.uid);
      }, (error) => {
        let alert = this.util.doAlert("Error", error.message, "Ok");
        alert.present();
      });
  };
*/
  facebookLogin() {
    console.log( "LoginPage::facebookLogin" );
    this.loading.present();
    
    // facebook login
    this.fb.getLoginStatus().then(
      (data)=>{

        console.log( "LoginPage::facebookLogin status success", data );
        if (data.status == "unknown") {
          this.fbLogin();
        }else{
          this.firebaseAuth( data );
        }
        
      }, (error)=> {
        console.log( "facebookLogin status error", error );
        this.fbLogin();
      });
  }

  fbLogin(){
    console.log( "LoginPage::fbLogin" );

    this.fb.login(['email']).then( 
      (response:FacebookLoginResponse) => {
        console.log( "facebookLogin success", response );
        this.firebaseAuth( response );
      }, (error) => {
        this.loading.dismiss();
        console.log("facebookLogin error", error);
      })
    .catch(e => {
      console.log('Error logging into Facebook', e);
    });
  }

  firebaseAuth(data:any){
    console.log("LoginPage::firebaseAuth", data);

    let facebookCredential = firebase.auth.FacebookAuthProvider
    .credential( data.authResponse.accessToken );
    
    this.auth.signInWithFacebook( facebookCredential ).then( (data) =>{

      console.log("signInWithFacebook success", data, this.navParams.data.delete);
      if (this.navParams.data.delete) {
        this.deleteCurrentAccount();
      }else{
        this.getProfile();
      }
      

    }, (error) => {
      console.log("signInWithFacebook", error);
    });
  }

  deleteCurrentAccount(){
    this.auth.deleteAccount().then( 
      () => {  
        console.log('SettingsPage::deleteAccount success');
        this.nav.setRoot(LoginPage);
    }, err => {
      console.log('SettingsPage::deleteAccount() error', err);
    });
  }

  getProfile(): void {

    console.log("LoginPage::getProfile()");
    console.log("LoginPage::Facebook display name ", this.auth.displayName(), this.auth);

    this.fb.api('/me?fields=id,name,gender,picture.width(500).height(500),email,first_name', 
      ['public_profile']).then(
      (response) => {

        console.log("getProfile() success", response);

        this.storage.set('uid', response.id);
        this.storage.set('username', response.name);
        this.storage.set('profile_picture', response.picture);
        this.storage.set('email', response.email);
        this.storage.set('first_name', response.first_name);
        if (response.gender && response.gender == 'female') {
          this.storage.set('preference', "Men");
        }else{
          this.storage.set('preference', "Women");
        }
        
        // this.storage.set('birthday', response.birthday);
     
        this.writeUserData(response);

        //THIS CHECK
        console.log("LoginPage::updateProfile user", this.user); 
        if (this.user) {
          this.user.updateProfile({
            displayName: response.name,
            photoURL: response.picture.data.url
          }).then(data => {

            console.log("LoginPage::updateProfile", data); 
            let alert = this.util.doAlert("Error user", this.user.displayName, "Ok");
            alert.present();
          }, error => {
            // An error happened.
            console.log("LoginPage::updateProfile", error);
          });
        }
        
        // this.menu.enable(true);
        this.loading.dismiss();

        console.log("LoginPage::getProfile user", this.hasUserEnterDetails); 
        if (this.hasUserEnterDetails == true) {
          this.nav.setRoot(MainPage);
        } else if (this.hasUserEnterDetails == false) {
          let startAge = {
            lower: 18,
            upper: 78
          };
          this.storage.set('userImages[0]', response.picture.data.url);
          this.storage.set('discoverable', false);
          this.storage.set('distance', 0);
          this.storage.set('age', startAge);
          if (response.gender && response.gender == 'female') {
            this.storage.set('preference', "Men");
          }else{
            this.storage.set('preference', "Women");
          }
          this.storage.set('new_match_notif', false);
          this.storage.set('messages_notif', false);
          this.storage.set('superlikes_notif', false);
          this.nav.setRoot(WelcomePage);
        }

        // this.nav.setRoot(WelcomePage);

      },

      (err) => {
        console.log("error", err);

        let alert = this.util.doAlert("Error", err.message, "Ok");
        this.loading.dismiss();
        alert.present();
      }
    );
  }

  formatLocalDate() {
    console.log("LoginPage::formatLocalDate");

    var now = new Date(),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return now.getFullYear() 
        + '-' + pad(now.getMonth()+1)
        + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours()) 
        + ':' + pad(now.getMinutes()) 
        + ':' + pad(now.getSeconds()) 
        + dif + pad(tzo / 60) 
        + ':' + pad(tzo % 60);
  }

  writeUserData(response): void {
    console.log("LoginPage::writeUserData", response);

    let userName;
    let userEmail;
    let userProfilePicture;
    let user_first_name;
    let preference;
    let userImages = [];
    let notificationTokens = [];
    let upAt = this.formatLocalDate();
    console.log("LoginPage::writeUserData upAt", upAt);
    
    this.storage.get('email').then(email => {
      console.log("LoginPage::writeUserData email", email);
      userEmail = email;
    }, error => {
      console.log("LoginPage::writeUserData email", error);
    });

    this.storage.get('profile_picture').then(profile_picture => {
      console.log("LoginPage::writeUserData profile_picture", profile_picture);

      userProfilePicture = profile_picture.data.url;
      
      // this.storage.get('images').then(photos => {
      //     if(photos){
      //         for (let photo of photos) {
      //             userImages.push(photo);
      //         }
      //     this.storage.set('images', userImages);
      //     }else {
      //         userImages.push(profile_picture.data.url);
      //         this.storage.set('images', userImages);
      //     }
      // });
    }, (error) => {
      console.log("writeUserData profile_picture", error);
    });

    this.storage.get('userImages[0]').then(picture => {
      userImages[0] = picture;
    }, error => {
      console.log("LoginPage::writeUserData image", error);
    });

    this.storage.get('username').then(username => {
      userName = username;
    }, error => {
      console.log("LoginPage::writeUserData username", error);
    });

    this.storage.get('first_name').then(first_name => {
      user_first_name = first_name;
    }, error => {
      console.log("LoginPage::writeUserData first_name", error);
    });

    this.storage.get('preference').then(pref => {
      preference = pref;
      console.log("LoginPage::writeUserData preference", pref);
    }, error => {
      console.log("LoginPage::writeUserData preference", error);
    });

    notificationTokens.push(this.auth.token );
/*
    this.af.auth.
    .auth.getToken().then( token => {
      notificationTokens.push(token);
      notificationTokens.push(this.auth.notificationToken);
    }, err => {
      console.log("Couldn't find token.", err);
    });*/
    
    this.userProvider.getUid().then((uid) => {
      console.log("LoginPage::writeUserData getUid", uid);

      let currentUserRef = this.af.database.object('/users/' + uid);

      console.log("LoginPage::writeUserData currentUserRef", currentUserRef);

      if (currentUserRef) {
        currentUserRef.update({
          email: userEmail,
          username: userName,
          profile_picture: userProfilePicture,
          first_name: user_first_name,
          preference: preference,
          updatedAt: upAt,
          userImage0: userProfilePicture,
          notificationTokens: notificationTokens
          // images: userImages
        });
        
      } else {
        currentUserRef.set({
          email: userEmail,
          username: userName,
          profile_picture: userProfilePicture,
          first_name: user_first_name,
          preference: preference,
          createdAt: upAt,
          userImage0: userImages[0],
          notificationTokens: notificationTokens
          // images: userImages
        });
       
      }
    }, (error) => {
      console.log("writeUserData getUid", error);
    });
  }
}