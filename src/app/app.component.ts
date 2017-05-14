import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { AreasPage } from '../pages/areas/areas'; // question 1
import { ChurchPage } from '../pages/church/church'; // question 2
import { AboutMePage } from '../pages/about-me/about-me'; // question 2
import { MainPage } from '../pages/main/main';
import { SettingsPage } from '../pages/settings/settings';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { Storage } from '@ionic/storage';
import { Keyboard } from 'ionic-native';

declare var FCMPlugin;


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;

    constructor(
        private platform: Platform, 
        public af: AngularFire,
        private alertCtrl: AlertController,
        public authProvider:AuthProvider, 
        public storage: Storage) {

        platform.ready().then(() => {
        
        StatusBar.styleDefault();
        StatusBar.backgroundColorByHexString('#ffffff'); // set status bar to white
        Splashscreen.hide();
        if (platform.is('ios')) {
             Keyboard.hideKeyboardAccessoryBar(false)
            //Keyboard.disableScroll(true);
            //Keyboard.shrinkView(true);
        }

        this.intialize();

      if ( this.platform.is('cordova') ) {
        this.initPushNotification();
      }else{
        console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      }
    });
  }

    intialize() {
        if ( this.platform.is('cordova') ) {
            this.storage.get('hasUserReachedMain').then(reachedMain => {

                this.af.auth.take(1).subscribe(auth => {
                    if(auth && reachedMain) {
                        console.log("MyApp::intialize going to main page");
                        this.rootPage = MainPage;
                        // this.rootPage = AboutMePage;
                        // this.rootPage = SettingsPage;
                        // this.rootPage = EditProfilePage;
                    }else{
                        console.log("MyApp::intialize going to login page");
                        this.rootPage = LoginPage;
                        // this.rootPage = WelcomePage;
                    }
                });
            });

        }else{
            this.rootPage = EditProfilePage;
        }
    }

    initPushNotification() {
        console.log('MyApp::initPushNotification()', FCMPlugin, (typeof FCMPlugin !== "undefined") );
        FCMPlugin.onTokenRefresh((token) => {
            // alert( token );
            console.log('MyApp::initPushNotification()', token );
        }); 
/*
        this.tokensetup().then((token) => {
            // store token
            console.log('MyApp::initPushNotification()', token);
        });
*/
        setTimeout(this.getTheToken, 1000);
        
        FCMPlugin.onNotification(
            (data) => {
                console.log('MyApp::onNotification() success', data);
            },
            (e) => {
                console.log('MyApp::onNotification() error', e);
            });
    }

    tokensetup() {
        var promise = new Promise((resolve, reject) => {

            FCMPlugin.getToken((token)=>{
                console.log('MyApp::getToken() success', token);
                resolve(token);
            }, (err) => {
                console.log('MyApp::getToken() error', err);
                reject(err);
            });

        });
        return promise;
    }

    getTheToken() {
        console.log('MyApp::getTheToken()', (typeof FCMPlugin !== "undefined") );
        
        FCMPlugin.getToken((token) => {
            if (token == null || token == "") {
                console.log("null token:" + token + ":");
                setTimeout(this.getTheToken, 1000);
            } else {
                console.log("I got the token: " + token + ":");
            }
        },
        (err) => {
            console.log('error retrieving token: ' + err);
        }
    );
}
}
