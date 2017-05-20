import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
// import { WelcomePage } from '../pages/welcome/welcome';
// import { AreasPage } from '../pages/areas/areas'; // question 1
// import { ChurchPage } from '../pages/church/church'; // question 2
// import { AboutMePage } from '../pages/about-me/about-me'; // question 2
import { MainPage } from '../pages/main/main';
import { SettingsPage } from '../pages/settings/settings';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { Storage } from '@ionic/storage';
import { Keyboard } from 'ionic-native';

declare var FCMPlugin;


/*
const options: PushOptions = {
    android: {
        senderID: '798902207354'
   },
   ios: {
       alert: 'true',
       badge: true,
       sound: 'false'
   },
   windows: {}
};
*/

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;

    messages:boolean = false;

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
                /*
                const pushObject: PushObject = this.push.init(options);
                this.push.hasPermission()
                .then((res: any) => {
                    if (res.isEnabled) {
                        console.log('MyApp:: We have permission to send push notifications');
                        
                    } else {
                        console.log('MyApp:: We do not have permission to send push notifications');
                    }
                });

                pushObject.on('registration').subscribe( (data:any) => {
                    console.log("MyApp registrationId", data);
                    this.storage.set('notificationToken', data.registrationId );
                });

                pushObject.on('notification').subscribe( (data:any) => {
                    console.log( "MyApp notification", data );
                    // console.log("MyApp notification", data.message);
                    // console.log("MyApp notification", data.title);
                    // console.log("MyApp notification", data.count);
                    // console.log("MyApp notification", data.sound);
                    // console.log("MyApp notification", data.image);
                    // console.log("MyApp notification", data.additionalData);

                    if (data.additionalData.foreground) {
                        // if application open, show popup
                        let confirmAlert = this.alertCtrl.create({
                            title: data.title,
                            message: data.message,
                            buttons: [{
                                text: 'Ignore',
                                role: 'cancel'
                            }, {
                                text: 'View',
                                handler: () => {
                                    //TODO: Your logic here
                                    this.rootPage.push(ChatViewPage, {message: data});
                                }
                            }]
                        });
                        confirmAlert.present();
                    } else {
                        //if user NOT using app and push notification comes
                        //TODO: Your logic on click of push notification directly

                        this.rootPage.push(ChatViewPage, {message: data});
                        console.log("Push notification clicked");
                    }
                });

                pushObject.on('error').subscribe( (e:any) => {
                    console.log("MyApp error", e);
                });
                */
            }else{
                console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
            }
        });
    }

    intialize() {
        if ( this.platform.is('cordova') ) {


            this.storage.get('messages_notif').then(msg => {
                this.messages = msg;
                console.log("MyApp::intialize messages", this.messages);
            });
            this.storage.get('hasUserReachedMain').then(reachedMain => {

                this.af.auth.take(1).subscribe(auth => {
                    if(auth && reachedMain) {
                        // console.log("MyApp::intialize going to main page");
                        this.rootPage = MainPage;
                        // this.rootPage = AboutMePage;
                        // this.rootPage = SettingsPage;
                        // this.rootPage = EditProfilePage;
                    }else{
                        // console.log("MyApp::intialize going to login page");
                        this.rootPage = LoginPage;
                        // this.rootPage = WelcomePage;
                    }
                });
            });

        }else{
            this.rootPage = SettingsPage;
        }
    }

    initPushNotification() {
        console.log('MyApp::initPushNotification()', FCMPlugin, (typeof FCMPlugin !== "undefined") );
        FCMPlugin.onTokenRefresh((token) => {
            // alert( token );
            console.log('MyApp::initPushNotification()', token );
        });         
        
        FCMPlugin.onNotification(
            (data) => {
                console.log('MyApp::onNotification() success', data);

                if (this.messages) {
                    if (data.additionalData.foreground) {
                        // if application open, show popup
                        let confirmAlert = this.alertCtrl.create({
                            title: data.title,
                            message: data.message,
                            buttons: [{
                                text: 'Ok',
                                role: 'cancel'
                            }/*, {
                                text: 'View',
                                handler: () => {
                                    //TODO: Your logic here
                                    this.rootPage.push(ChatViewPage, {message: data});
                                }
                            }*/]
                        });
                        confirmAlert.present();
                    } else {
                        //if user NOT using app and push notification comes
                        //TODO: Your logic on click of push notification directly

                        this.rootPage.push(ChatViewPage, {message: data});
                    }
                }
                
            },
            (e) => {
                console.log('MyApp::onNotification() error', e);
            });
    }

    

}
