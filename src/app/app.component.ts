import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import firebase from 'firebase';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
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
        setTimeout(this.initPushNotification, 1000);
      }else{
        console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      }
      
    });
  }

  intialize() {
    // this.storage.get('hasUserEnterDetails').then((result) => {
    //     if (result == true) {
    //       this.hasUserEnterDetails = true;
    //     }else {
    //       this.hasUserEnterDetails = false;
    //     }
      //   this.af.auth.subscribe(auth => {
      //   if(auth && this.hasUserEnterDetails == false) {
      //       this.rootPage = WelcomePage;
      //     } else if(auth && this.hasUserEnterDetails == true) {
      //       this.rootPage = TabsPage;
      //     }else{
      //       this.rootPage = LoginPage;
      //     }
      // });

      this.storage.get('hasUserReachedMain').then(reachedMain => {
        this.af.auth.subscribe(auth => {
          if(auth && reachedMain) {
            this.rootPage = MainPage;
          }else{
            this.rootPage = LoginPage;
          }
        });
      });
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
