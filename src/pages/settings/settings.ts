import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
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
    loading : any ;
    hasLoaded = false;
    isProfile;
    profilePageChoice: any;
    rootNav;
    slideOptions: any;
    distance: any;
    age:any;
    ageValue:any = { lower:18, upper:36 };
    searchPreference;
    newMatches;
    messages;
    superLikes;
    publicDiscoverable;
    user = <any>{};

    // user = { username: "", profile_picture: "", aboutMe: "", 
    // descent: "", areas: [], church: "", location: "", images: [] };

    constructor(
        private fb: Facebook,
        public nav: NavController,
        public af: AngularFire,
        public auth: AuthProvider,
        public userProvider: UserProvider,
        public chatsProvider: ChatsProvider, 
        public local: Storage,
        public util: UtilProvider,
        public storage: Storage,
        private alertCtrl: AlertController,
        public modalCtrl: ModalController,
        private iab: InAppBrowser,
        public loadingCtrl: LoadingController) {

        console.log("SettingsPage");

        this.profilePageChoice = 'profile';
        // this.profilePage = 'profile';
        this.isProfile = true;
        this.storage.get('discoverable').then(discoverable => {
            console.log("SettingsPage::constructor discoverable", discoverable);
            this.publicDiscoverable = discoverable;
        });

        this.storage.get('distance').then(dist => {
            this.distance = dist;
        });

        this.storage.get('age').then(ag => {
            console.log("SettingsPage::constructor age", ag);

          this.age = ag;
          if (ag) {
              this.ageValue.lower = this.age.lower;
              this.ageValue.upper = this.age.upper;
          }else{
              this.ageValue.lower = 18;
              this.ageValue.upper = 36;

              this.age.lower = 18;
              this.age.upper = 36;
          }

        }, err => {
            console.log("SettingsPage::constructor age", err);
        });
        this.storage.get('preference').then(pref => {
            this.searchPreference = pref;
        });
        this.storage.get('new_match_notif').then(nm => {
            this.newMatches = nm;
        });
        this.storage.get('messages_notif').then(msg => {
            this.messages = msg;
        });
        this.storage.get('superlikes_notif').then(sl => {
            this.superLikes = sl;
        });

        this.userProvider.getUid().then(uid => {
            this.userId = uid;
        });
        
        this.userProvider.getUser().then(userObservable => {
            if (!userObservable) {
                return;
            }
          
            this.loading = this.loadingCtrl.create({ 
                content: 'Getting user information...' 
            });
            this.loading.present();

            userObservable.take(1).subscribe(data => {
                console.log("SettingsPage::constructor user", data);

                this.user = data;
                this.hasLoaded = true;
                this.loading.dismiss();
                
                // set data 
                this.publicDiscoverable = this.user.discoverable;
                this.distance = (this.user.distance)?this.user.distance:50;
                this.age = this.user.age;
                if (this.age) {
                    this.ageValue.lower = this.user.age.lower;
                    this.ageValue.upper = this.user.age.upper;
                }else{
                    this.ageValue.lower = 18;
                    this.ageValue.upper = 36;
                }
                if (this.user.preference != '...') {
                  this.searchPreference = this.user.preference;
                }
                this.newMatches = this.user.new_matches;
                this.messages = this.user.messages;
                this.superLikes = this.user.superLikes;
            });
        });
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

    profileClicked(): void {
        this.profilePageChoice = 'profile';
        this.isProfile = true;
    }

    settingsClicked(): void {
        this.profilePageChoice = 'settings';
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

        // this.local.remove('userInfo');
        // Facebook.logout();
    }

    showPremium(): void {
        let premiumModal = this.modalCtrl.create(PremiumPage);
        this.writeUserData();
        premiumModal.present();
    }

  test(): void {
    let startAge = {
      lower: 18,
      upper: 36
    }
    this.storage.set('discoverable', true);
    this.storage.set('distance', 50);
    this.storage.set('age', startAge);
    this.storage.set('preference', "...");
    this.storage.set('new_match_notif', true);
    this.storage.set('messages_notif', true);
    this.storage.set('superlikes_notif', true);
  }

  publicDisc(): void {
    this.userProvider.updateUserProfile(this.userId, 'discoverable', this.publicDiscoverable);
    this.storage.set('discoverable', this.publicDiscoverable);
  }

  distanceChoice(): void {
    this.userProvider.updateUserProfile(this.userId, 'distance', this.distance);
    this.storage.set('distance', this.distance);
  }

  ageChoice(): void {
    console.log(this.ageValue, this.age);

    if ((this.ageValue.upper - this.ageValue.lower) > 4) {
      this.age.upper = this.ageValue.upper;
      this.age.lower = this.ageValue.lower;
        
      this.storage.set('age', this.ageValue);
      this.userProvider.updateUserProfile(this.userId, 'age', this.age);
    }else{

    }
    
  }

  searchPref(): void {
    this.userProvider.updateUserProfile(this.userId, 'preference', this.searchPreference);
    this.storage.set('preference', this.searchPreference);
  }

  newMatch(): void {
    this.userProvider.updateUserProfile(this.userId, 'new_matches', this.newMatches);
    console.log("SettingsPage::newMatch()", this.newMatches);
    this.storage.set('new_match_notif', this.newMatches);
  }

  msg(): void {
    console.log("SettingsPage::msg()", this.messages);
    this.userProvider.updateUserProfile(this.userId, 'messages', this.messages);
    this.storage.set('messages_notif', this.messages);
  }

  like(): void {
    console.log("SettingsPage::like()", this.superLikes );
    this.userProvider.updateUserProfile(this.userId, 'superLikes', this.superLikes);
    this.storage.set('superlikes_notif', this.superLikes);
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

    let browser = this.iab.create('mailto:info@meetgreekapp.com', '_blank');
    browser.show();
  }

  writeUserData(): void {
    console.log("SettingsPage::writeUserData()" );

    let userPublic;
    this.storage.get('discoverable').then(publicPreference => {
      userPublic = publicPreference;
    });

    let distancePreference;
    this.storage.get('distance').then(distance => {
      distancePreference = distance;
    });

    let userAge;
    this.storage.get('age').then(age => {
      userAge = age;
    });

    let userPreference;
    this.storage.get('preference').then(preference => {
      userPreference = preference;
    });

    let userNewMatches;
    this.storage.get('new_match_notif').then(new_matches_notif => {
      userNewMatches = new_matches_notif;
    });

    let userMessagesNotif;
    this.storage.get('messages_notif').then(messages_notif => {
      userMessagesNotif = messages_notif;
    });

    let userSuperLikes;
    this.storage.get('superlikes_notif').then(superlikes_notif => {
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
