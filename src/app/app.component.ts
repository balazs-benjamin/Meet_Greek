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
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
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
        // setTimeout(this.initPushNotification, 1000);
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
          }else{
            console.log("MyApp::intialize going to login page");
            this.rootPage = LoginPage;
            // this.rootPage = WelcomePage;
          }
        });

      });
    }else{
      // this.rootPage = AboutMePage;
    }
  }

  initPushNotification() {
    console.log('MyApp::initPushNotification()', FCMPlugin);
   
    FCMPlugin.getToken(
      (t) => {
        console.log('MyApp::getToken() success', t);
      },
      (e) => {
        console.log('MyApp::getToken() error', e);
      }
    );

    FCMPlugin.onNotification(
      (data) => {
        console.log('MyApp::onNotification() success', data);
      },
      (e) => {
        console.log('MyApp::onNotification() error', e);
      }
    );
  }
}
