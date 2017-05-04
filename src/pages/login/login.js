var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
// import { CityService } from '../../providers/city-service';
// import { Geolocation } from 'ionic-native';
import { WelcomePage } from '../welcome/welcome';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { AngularFire } from 'angularfire2';
import { MainPage } from '../main/main';
var LoginPage = LoginPage_1 = (function () {
    // coordinates = {lat: 0, lng: 0};
    // public cityResults: any;
    function LoginPage(fb, nav, af, auth, userProvider, util, storage, platform, navParams, loadingCtrl) {
        this.fb = fb;
        this.nav = nav;
        this.af = af;
        this.auth = auth;
        this.userProvider = userProvider;
        this.util = util;
        this.storage = storage;
        this.platform = platform;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.hasUserEnterDetails = false;
        this.deleteAccount = false;
        this.loading = this.loadingCtrl.create({
            content: 'Authenticating...'
        });
        console.log("navParams.data", navParams.data);
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log("LoginPage::ionViewDidLoad()");
        this.platform.ready().then(function () {
            _this.user = firebase.auth().currentUser;
            console.log('LoginPage::ionViewDidLoad', _this.user, _this.auth.authenticated);
            if (_this.auth.authenticated) {
                _this.nav.setRoot(MainPage);
                return;
            }
            _this.storage.get('hasUserEnterDetails').then(function (result) {
                console.log('LoginPage::hasUserEnterDetails', result);
                _this.hasUserEnterDetails = (result != null);
            });
        });
    };
    LoginPage.prototype.ngOnInit = function () {
    };
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
    LoginPage.prototype.facebookLogin = function () {
        var _this = this;
        console.log("LoginPage::facebookLogin");
        this.loading.present();
        // facebook login
        this.fb.getLoginStatus().then(function (data) {
            console.log("LoginPage::facebookLogin status success", data);
            if (data.status == "unknown") {
                _this.fbLogin();
            }
            else {
                _this.firebaseAuth(data);
            }
        }, function (error) {
            console.log("facebookLogin status error", error);
            _this.fbLogin();
        });
    };
    LoginPage.prototype.fbLogin = function () {
        var _this = this;
        console.log("LoginPage::fbLogin");
        this.fb.login(['email']).then(function (response) {
            console.log("facebookLogin success", response);
            _this.firebaseAuth(response);
        }, function (error) {
            _this.loading.dismiss();
            console.log("facebookLogin error", error);
        })
            .catch(function (e) {
            console.log('Error logging into Facebook', e);
        });
    };
    LoginPage.prototype.firebaseAuth = function (data) {
        var _this = this;
        console.log("LoginPage::firebaseAuth", data);
        var facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(data.authResponse.accessToken);
        this.auth.signInWithFacebook(facebookCredential).then(function (data) {
            console.log("signInWithFacebook success", data, _this.navParams.data.delete);
            if (_this.navParams.data.delete) {
                _this.deleteCurrentAccount();
            }
            else {
                _this.getProfile();
            }
        }, function (error) {
            console.log("signInWithFacebook", error);
        });
    };
    LoginPage.prototype.deleteCurrentAccount = function () {
        var _this = this;
        this.auth.deleteAccount().then(function () {
            console.log('SettingsPage::deleteAccount success');
            _this.nav.setRoot(LoginPage_1);
        }, function (err) {
            console.log('SettingsPage::deleteAccount() error', err);
        });
    };
    LoginPage.prototype.getProfile = function () {
        var _this = this;
        console.log("LoginPage::getProfile()");
        console.log("LoginPage::Facebook display name ", this.auth.displayName(), this.auth);
        this.fb.api('/me?fields=id,name,gender,picture.width(500).height(500),email,first_name', ['public_profile']).then(function (response) {
            console.log("getProfile() success", response);
            if (response.picture) {
                _this.storage.set('userImages[0]', response.picture.data.url);
            }
            _this.storage.set('uid', response.id);
            _this.storage.set('username', response.name);
            _this.storage.set('profile_picture', response.picture);
            _this.storage.set('email', response.email);
            _this.storage.set('first_name', response.first_name);
            if (response.gender && response.gender == 'female') {
                _this.storage.set('preference', "Men");
            }
            else {
                _this.storage.set('preference', "Women");
            }
            // this.storage.set('birthday', response.birthday);
            _this.writeUserData(response);
            //THIS CHECK
            console.log("LoginPage::updateProfile user", _this.user);
            if (_this.user) {
                _this.user.updateProfile({
                    displayName: response.name,
                    photoURL: response.picture.data.url
                }).then(function (data) {
                    console.log("LoginPage::updateProfile", data);
                    var alert = _this.util.doAlert("Error user", _this.user.displayName, "Ok");
                    alert.present();
                }, function (error) {
                    // An error happened.
                    console.log("LoginPage::updateProfile", error);
                });
            }
            // this.menu.enable(true);
            _this.loading.dismiss();
            console.log("LoginPage::getProfile user", _this.hasUserEnterDetails);
            if (_this.hasUserEnterDetails == true) {
                _this.nav.setRoot(MainPage);
            }
            else if (_this.hasUserEnterDetails == false) {
                var startAge = {
                    lower: 18,
                    upper: 78
                };
                _this.storage.set('userImages[0]', response.picture.data.url);
                _this.storage.set('discoverable', false);
                _this.storage.set('distance', 0);
                _this.storage.set('age', startAge);
                if (response.gender && response.gender == 'female') {
                    _this.storage.set('preference', "Men");
                }
                else {
                    _this.storage.set('preference', "Women");
                }
                _this.storage.set('new_match_notif', false);
                _this.storage.set('messages_notif', false);
                _this.storage.set('superlikes_notif', false);
                _this.nav.setRoot(WelcomePage);
            }
        }, function (err) {
            console.log("error", err);
            var alert = _this.util.doAlert("Error", err.message, "Ok");
            _this.loading.dismiss();
            alert.present();
        });
    };
    LoginPage.prototype.formatLocalDate = function () {
        console.log("LoginPage::formatLocalDate");
        var now = new Date(), tzo = -now.getTimezoneOffset(), dif = tzo >= 0 ? '+' : '-', pad = function (num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
        return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    };
    LoginPage.prototype.writeUserData = function (response) {
        var _this = this;
        console.log("LoginPage::writeUserData", response);
        var userName;
        var userEmail;
        var userProfilePicture;
        var user_first_name;
        var preference;
        var userImages = [];
        var notificationTokens = [];
        var upAt = this.formatLocalDate();
        console.log("LoginPage::writeUserData upAt", upAt);
        this.storage.get('email').then(function (email) {
            console.log("LoginPage::writeUserData email", email);
            userEmail = email;
        }, function (error) {
            console.log("LoginPage::writeUserData email", error);
        });
        this.storage.get('profile_picture').then(function (profile_picture) {
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
        }, function (error) {
            console.log("writeUserData profile_picture", error);
        });
        this.storage.get('userImages[0]').then(function (picture) {
            userImages[0] = picture;
        }, function (error) {
            console.log("LoginPage::writeUserData image", error);
        });
        this.storage.get('username').then(function (username) {
            userName = username;
        }, function (error) {
            console.log("LoginPage::writeUserData username", error);
        });
        this.storage.get('first_name').then(function (first_name) {
            user_first_name = first_name;
        }, function (error) {
            console.log("LoginPage::writeUserData first_name", error);
        });
        this.storage.get('preference').then(function (pref) {
            preference = pref;
            console.log("LoginPage::writeUserData preference", pref);
        }, function (error) {
            console.log("LoginPage::writeUserData preference", error);
        });
        notificationTokens.push(this.auth.token);
        /*
            this.af.auth.
            .auth.getToken().then( token => {
              notificationTokens.push(token);
              notificationTokens.push(this.auth.notificationToken);
            }, err => {
              console.log("Couldn't find token.", err);
            });*/
        this.userProvider.getUid().then(function (uid) {
            console.log("LoginPage::writeUserData getUid", uid);
            var currentUserRef = _this.af.database.object('/users/' + uid);
            console.log("LoginPage::writeUserData currentUserRef", currentUserRef);
            if (currentUserRef) {
                // this.hasUserEnterDetails = true;
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
            }
            else {
                // this.hasUserEnterDetails = false;
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
        }, function (error) {
            console.log("writeUserData getUid", error);
        });
    };
    return LoginPage;
}());
LoginPage = LoginPage_1 = __decorate([
    Component({
        selector: 'page-login',
        templateUrl: 'login.html'
    }),
    __metadata("design:paramtypes", [Facebook,
        NavController,
        AngularFire,
        AuthProvider,
        UserProvider,
        UtilProvider,
        Storage,
        Platform,
        NavParams,
        LoadingController])
], LoginPage);
export { LoginPage };
var LoginPage_1;
//# sourceMappingURL=login.js.map