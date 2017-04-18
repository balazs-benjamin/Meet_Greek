import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { Storage } from '@ionic/storage';
import { Keyboard } from 'ionic-native';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  constructor(
    platform: Platform, 
    public af: AngularFire,
    public authProvider:AuthProvider, 
    public storage: Storage) {
    // firebase.initializeApp({
    //   apiKey: "AIzaSyAoSg_zrN3dqxkZNlTwj1MaC4Y-VwfNWUI",
    //   authDomain: "fir-chat-facebook.firebaseapp.com",
    //   databaseURL: "https://fir-chat-facebook.firebaseio.com",
    //   storageBucket: "fir-chat-facebook.appspot.com"
    // })
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
}
