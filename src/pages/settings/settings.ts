import { Component, NgZone } from '@angular/core';
import { Platform, NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { UtilProvider } from '../../providers/utils';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { PremiumPage } from '../premium/premium';
import { LegalPage } from '../legal/legal';
import { FeedbackPage } from '../feedback/feedback';
import { AngularFire } from 'angularfire2';
import { MainPage } from '../main/main';
import { LoginPage } from '../login/login';

// import firebase from 'firebase';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    private userId;
    public loading : any ;
    public hasLoaded = false;
    public isProfile = true;
    private profilePageChoice: string = 'profile';
    private rootNav;
    // slideOptions: any;
    private distance: number = 50;
    private age:any = { lower:18, upper:36 };
    // public ageValue:any = { lower:18, upper:36 };
    searchPreference;
    newMatches:true = true;
    messages:boolean = true;
    superLikes:boolean = true;
    publicDiscoverable:boolean = true;
    user = <any>{};
    userLocal = {
        discoverable: true,
        distance: 50,
        age: { lower:18, upper:36 }
    };

    // user = { username: "", profile_picture: "", aboutMe: "", 
    // descent: "", areas: [], church: "", location: "", images: [] };

    constructor(
        public zone:NgZone,
        private fb: Facebook,
        public local: Storage,
        public af: AngularFire,
        private iab: InAppBrowser,
        public util: UtilProvider,
        public nav: NavController,
        public auth: AuthProvider,
        private platform: Platform,
        public userProvider: UserProvider,
        public chatsProvider: ChatsProvider, 
        public modalCtrl: ModalController,
        private alertCtrl: AlertController,
        public loadingCtrl: LoadingController) {

        console.log("SettingsPage");
        this.loading = this.loadingCtrl.create({ 
            content: 'Getting user information...' 
        });
        if (platform.is('cordova')) {
            this.loading.present();
        }
        
        this.local.get('localUser').then(user => {
            console.log("SettingsPage::constructor localUser", user);
            if (user) {
                this.userLocal = user;
            }
        });
        
        this.local.get('discoverable').then(discoverable => {
            // console.log("SettingsPage::constructor discoverable", discoverable);
            this.publicDiscoverable = discoverable;
            this.userLocal.discoverable = discoverable;
        });

        this.local.get('distance').then(dist => {
            this.distance = dist;
        });

        this.local.get('age').then(ag => {
            console.log("SettingsPage::constructor age", ag);
            
            
            if (ag != null) {
                this.age = ag;
                // this.ageValue.lower = this.age.lower;
                // this.ageValue.upper = this.age.upper;
            }
        }, err => {
            console.log("SettingsPage::constructor age", err);
        });
        this.local.get('preference').then(pref => {
            this.searchPreference = pref;
        });
        this.local.get('new_match_notif').then(nm => {
            this.newMatches = nm;
        });
        this.local.get('messages_notif').then(msg => {
            this.messages = msg;
        });
        this.local.get('superlikes_notif').then(sl => {
            this.superLikes = sl;
        });

        this.userProvider.getUid().then(uid => {
            this.userId = uid;
        });
        
        this.userProvider.getUser().then(userObservable => {
            if (!userObservable) {
                return;
            }
          
            userObservable.take(1).subscribe(data => {
                console.log("SettingsPage::constructor user", data);

                this.user = data;
                this.loading.dismiss();
                
                // set data 
                this.publicDiscoverable = this.user.discoverable;
                this.distance = (this.user.distance)?this.user.distance:50;
                this.age = this.user.age;
                if (this.age) {
                    // this.ageValue.lower = this.age.lower;
                    // this.ageValue.upper = this.age.upper;
                }else{
                    // this.ageValue.lower = 18;
                    // this.ageValue.upper = 36;
                }
                if (this.user.preference != '...') {
                    this.searchPreference = this.user.preference;
                }
                this.newMatches = this.user.new_matches;
                this.messages = this.user.messages;
                this.superLikes = this.user.superLikes;

                this.hasLoaded = true;
            });
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage', this.loading);
    }

    ionViewWillEnter() {}

    ionViewWillLeave() {
        this.writeUserData();
    }

    //save user info
    updatePicture(): void {
        // this.userProvider.updatePicture();
        let alert = this.util.doAlert("Error", this.user.username, "Ok");
        alert.present();
    };

    edit(): void {
        this.nav.push(EditProfilePage);
    }

    next(): void {
        console.log("SettingsPage::next()");
        this.nav.setRoot(MainPage);
    }

    profileClicked(ev:Event): void {
        console.log("SettingsPage::profileClicked()", this.isProfile);
        // this.profilePageChoice = 'profile';
        ev.preventDefault();
        this.isProfile = true;
    }

    settingsClicked(ev:Event): void {
        console.log("SettingsPage::settingsClicked()", this.isProfile);
        ev.preventDefault();
        // this.profilePageChoice = 'settings';
        this.isProfile = false;
    }

    logout(): void {
        console.log("SettingsPage::logout()");
        this.loading = this.loadingCtrl.create({ 
            content: 'Please wait...' 
        });
        this.loading.present();

        this.local.remove('uid');
        this.local.remove('username');
        this.local.remove('profile_picture');
        this.local.remove('email');
        
        this.auth.signOut().then(()=>{
            this.fb.logout().then(()=> {
                this.nav.setRoot(LoginPage);
                this.loading.dismiss();
            })
        });

        // Facebook.logout();
    }

    showPremium(): void {
        let premiumModal = this.modalCtrl.create(PremiumPage);
        this.writeUserData();
        premiumModal.present();
    }

    test(): void {
          console.log("SettingsPage::settingsClicked()");
        let startAge = {
          lower: 18,
          upper: 36
        }
        this.local.set('discoverable', true);
        this.local.set('distance', 50);
        this.local.set('age', startAge);
        this.local.set('preference', "...");
        this.local.set('new_match_notif', true);
        this.local.set('messages_notif', true);
        this.local.set('superlikes_notif', true);
    }

    publicDisc(ev:Event): void {
        console.log("SettingsPage::publicDisc()", ev);
        this.userProvider.updateUserProfile(this.userId, 'discoverable', this.publicDiscoverable);
        this.local.set('discoverable', this.publicDiscoverable);
    }

    distanceChoice(): void {
        console.log("SettingsPage::distanceChoice()");
        this.userProvider.updateUserProfile(this.userId, 'distance', this.distance);
        this.local.set('distance', this.distance);
    }

    ageChoice(): void {
        console.log("SettingsPage::ageChoice()", this.age);
        /*
        if ((this.ageValue.upper - this.ageValue.lower) > 4) {
          this.age.upper = this.ageValue.upper;
          this.age.lower = this.ageValue.lower;
            
          this.local.set('age', this.ageValue);
          this.userProvider.updateUserProfile(this.userId, 'age', this.age);
        }*/
    }

    searchPref(ev): void {
        console.log("SettingsPage::searchPref()", ev.checked);
        this.userProvider.updateUserProfile(this.userId, 'preference', this.searchPreference);
        this.local.set('preference', this.searchPreference);
    }

    newMatch(ev): void {
        console.log("SettingsPage::newMatch()", ev.val());
        this.userProvider.updateUserProfile(this.userId, 'new_matches', this.newMatches);
        this.local.set('new_match_notif', this.newMatches);
    }

    msg(): void {
        console.log("SettingsPage::msg()", this.messages);
        this.userProvider.updateUserProfile(this.userId, 'messages', this.messages);
        this.local.set('messages_notif', this.messages);
    }

    like(): void {
        console.log("SettingsPage::like()", this.superLikes );
        this.userProvider.updateUserProfile(this.userId, 'superLikes', this.superLikes);
        this.local.set('superlikes_notif', this.superLikes);
    }

    deleteAccount(){
        console.log('SettingsPage::deleteAccount');
        let prompt = this.alertCtrl.create({
          title:"Are you sure?",
          message: "Please select delete to confirm.",
          buttons:[
          {
            text: 'Cancel'
          },
          {
            text: 'Delete',
            handler: data => {
              this.userProvider.getUid().then(uid => {
                // remove all chats
                let userChats = this.chatsProvider.getUserChats(uid);
                userChats.subscribe(chats => {
                  chats.forEach(chat => {
                    this.chatsProvider.getChatRef(uid, chat.$key)
                    .then((chatRef:any) => {
                      this.af.database.list(chatRef).remove();
                    });
                  });


                  let currentUserRef = this.af.database.object('/users/' + uid);
                  if (currentUserRef) {
                    // delete current user
                    currentUserRef.remove().then(()=>{
                      this.local.remove('hasUserEnterDetails');
                      
                      // everything deleted
                      this.logout();
                    });
                  }

                });
              });
              
            }
          }
          ]
        });
        prompt.present();
    }

    showLegal(): void {
        console.log("SettingsPage::showLegal()" );
        let legalModal = this.modalCtrl.create(LegalPage);
        this.writeUserData();
        legalModal.present();
    }

    showFeedback(): void {
        console.log("SettingsPage::showFeedback");
        let browser = this.iab.create('mailto:info@meetgreekapp.com', '_blank');
        browser.show();

        /*let feedbackModal = this.modalCtrl.create(FeedbackPage);
        this.writeUserData();
        feedbackModal.present();*/
    /*
        let email = {
          to: 'max@mustermann.de',
          cc: '',
          bcc: [],
          attachments: [],
          subject: 'Feedback',
          body: 'My feedback',
          isHtml: true
        };
        
        this.emailComposer.isAvailable().then((available: boolean) =>{
          console.log("SettingsPage::showFeedback", available);
          if(available) {
            //Now we know we can send
            this.emailComposer.open(email);
          }
        });*/

    }

    writeUserData(): void {
        console.log("SettingsPage::writeUserData()", this.auth.authenticated );
        if ( !this.auth.authenticated ) {
            return;
        }

        let userPublic;
        this.local.get('discoverable').then(publicPreference => {
            userPublic = publicPreference;
        });

        let distancePreference;
        this.local.get('distance').then(distance => {
            distancePreference = distance;
        });

        let userAge;
        this.local.get('age').then(age => {
            userAge = age;
        });

        let userPreference;
        this.local.get('preference').then(preference => {
            userPreference = preference;
        });

        let userNewMatches;
        this.local.get('new_match_notif').then(new_matches_notif => {
            userNewMatches = new_matches_notif;
        });

        let userMessagesNotif;
        this.local.get('messages_notif').then(messages_notif => {
            userMessagesNotif = messages_notif;
        });

        let userSuperLikes;
        this.local.get('superlikes_notif').then(superlikes_notif => {
          userSuperLikes = superlikes_notif;
        });

        this.userProvider.getUid().then(uid => {
            let currentUserRef = this.af.database.object('/users/' + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    discoverable: userPublic,
                    distance: distancePreference,
                    age: userAge,
                    preference: userPreference,
                    new_matches: userNewMatches,
                    messages: userMessagesNotif,
                    superLikes: userSuperLikes
                });
            }
        });
    }

}
