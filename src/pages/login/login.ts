import { Component, OnInit } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
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
import { Facebook } from 'ionic-native';
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

  // coordinates = {lat: 0, lng: 0};
  // public cityResults: any;

  constructor(public nav: NavController,
    public af: AngularFire,
    public auth: AuthProvider,
    public userProvider: UserProvider,
    public util: UtilProvider,
    public storage: Storage,
    public platform: Platform,
    public loadingCtrl: LoadingController) {
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      //   this.storage.get('introShown4').then((result) => {
      //   if (!result) {

      //     // Geolocation.getCurrentPosition().then((resp) => {
      //     // // alert(resp.coords.latitude);
      //     // // alert(resp.coords.longitude);
          
      //     // }).catch((error) => {
      //     //   console.log('Error getting location', error);
      //     // });
      //     // this.storage.set('introShown4', true);
      //     // this.nav.setRoot(IntroPage);
      //   }
      // });
      this.storage.get('hasUserEnterDetails').then((result) => {
        if (!result) {
          this.hasUserEnterDetails = false;
        } else {
          this.hasUserEnterDetails = true;
        }
      });
    });
  }


  ngOnInit() {
    // this.loginForm = new FormGroup({
    //   email: new FormControl("", [Validators.required, validateEmail]),
    //   password: new FormControl("", Validators.required)
    // });
  }

  signin() {
    // this.auth.signin(this.loginForm.value)
    //   .then((data) => {
    //     this.storage.set('uid', data.uid);
    //     this.nav.setRoot(MainPage);
    //   }, (error) => {
    //     let alert = this.util.doAlert("Error", error.message, "Ok");
    //     alert.present();
    //   });
  };

  createAccount() {
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

  facebookLogin() {
    this.loading.present();
    Facebook.login(['email']).then((response) => {
      let facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          this.getProfile();
        })
        .catch((error) => {
          let alert = this.util.doAlert("Error user", JSON.stringify(error), "Ok");
          alert.present();
        });
    }, (error) => {
      let alert = this.util.doAlert("Error user", JSON.stringify(error), "Ok");
      alert.present();
      this.loading.dismiss();
    });



    // ).catch((error) => {
    //     let alert = this.util.doAlert("Error user", JSON.stringify(error), "Ok");
    //     alert.present();
    // });

  }

  getProfile(): void {
    Facebook.api('/me?fields=id,name,picture.width(500).height(500),email,first_name', ['public_profile']).then(
      (response) => {
        this.storage.set('uid', response.id);
        this.storage.set('username', response.name);
        this.storage.set('profile_picture', response.picture);
        this.storage.set('email', response.email);
        this.storage.set('first_name', response.first_name);
        // this.storage.set('birthday', response.birthday);
      


        
        // let alert1 = this.util.doAlert("Error respone", this.cityResults, "Ok");
        // alert1.present();

        this.writeUserData(response);

        //THIS CHECK
        var user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: response.name,
          photoURL: response.picture.data.url
        }).then(function () {
          let alert = this.util.doAlert("Error user", user.displayName, "Ok");
          alert.present();
        }, function (error) {
          // An error happened.
        });

        // this.menu.enable(true);
        this.loading.dismiss();
        if (this.hasUserEnterDetails == true) {
          this.nav.setRoot(MainPage);
        } else if (this.hasUserEnterDetails == false) {
          let startAge = {
            lower: 18,
            upper: 78
          }
          this.storage.set('userImages[0]', response.picture.data.url);
          this.storage.set('discoverable', false);
          this.storage.set('distance', 0);
          this.storage.set('age', startAge);
          this.storage.set('preference', "...");
          this.storage.set('new_match_notif', false);
          this.storage.set('messages_notif', false);
          this.storage.set('superlikes_notif', false);
          this.nav.setRoot(WelcomePage);
        }

        // this.nav.setRoot(WelcomePage);

      },

      (err) => {
        // console.log(err);
        // let alert = this.doAlert.create({
        //   title: 'Oops!',
        //   subTitle: 'Something went wrong, please try again later.',
        //   buttons: ['Ok']
        // });
        let alert = this.util.doAlert("Error", err.message, "Ok");
        this.loading.dismiss();
        alert.present();
      }
    );
  }

  formatLocalDate() {
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
    let userName;
    let userEmail;
    let userProfilePicture;
    let user_first_name;
    let userImages = [];
    let upAt = this.formatLocalDate();
    
    //let birthDay;

    this.storage.get('email').then(email => {
      userEmail = email;
    });
    this.storage.get('profile_picture').then(profile_picture => {
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
    });
    this.storage.get('userImages[0]').then(picture => {
      userImages[0] = picture;
    });
    this.storage.get('username').then(username => {
      userName = username;
    });

    this.storage.get('first_name').then(first_name => {
      user_first_name = first_name;
    });
    // this.storage.get('birthday').then(birthday => {
    //   birthDay = birthday;
    // });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object(`/users/${uid}`);
      if (currentUserRef) {
        currentUserRef.update({
          email: userEmail,
          username: userName,
          profile_picture: userProfilePicture,
          first_name: user_first_name,
          updatedAt: upAt,
          userImage0: userProfilePicture
          // images: userImages
        });
        
      } else {
        currentUserRef.set({
          email: userEmail,
          username: userName,
          profile_picture: userProfilePicture,
          first_name: user_first_name,
          createdAt: upAt,
          userImage0: userImages[0]
          // images: userImages
        });
       
      }
    });
  }
}