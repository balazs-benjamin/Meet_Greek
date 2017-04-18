import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { Facebook } from 'ionic-native';
import { UtilProvider } from '../../providers/utils';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { PremiumPage } from '../premium/premium';
import { LegalPage } from '../legal/legal';
import { FeedbackPage } from '../feedback/feedback';
import { AngularFire } from 'angularfire2';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  isProfile;
  profilePage;
  rootNav;
  slideOptions: any;
  distance: any;
  age;
  searchPreference;
  newMatches;
  messages;
  superLikes;
  publicDiscoverable;
  user = { username: "", profile_picture: "", aboutMe: "", descent: "", areas: [], church: "", education: "", location: "", images: [] };
  constructor(
    public nav: NavController,
    public af: AngularFire,
    public auth: AuthProvider,
    public userProvider: UserProvider,
    public local: Storage,
    public util: UtilProvider,
    public storage: Storage,
    public modalCtrl: ModalController) {
    this.userProvider.getUser().then(userObservable => {
      userObservable.subscribe(user => {
        this.user = user;
        
      });
    });
    this.profilePage = 'profile';
    this.isProfile = true;
    this.slideOptions = {
      pager: true
    };
    this.storage.get('discoverable').then(discoverable => {
        this.publicDiscoverable = discoverable;
    });
    this.storage.get('distance').then(dist => {
        this.distance = dist;
    });
    this.storage.get('age').then(ag => {
        this.age = ag;
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
  }

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

  }

  profileClicked(): void {
    this.isProfile = true;
    this.writeUserData();
  }

  settingsClicked(): void {
    this.isProfile = false;
  }

  logout(): void {
    this.local.remove('uid');
    this.local.remove('username');
    this.local.remove('profile_picture');
    this.local.remove('email');
    this.nav.setRoot(LoginPage);
    this.local.remove('userInfo');
    Facebook.logout();
    this.auth.logout();
  }

  showPremium(): void {
    let premiumModal = this.modalCtrl.create(PremiumPage);
    this.writeUserData();
    premiumModal.present();
  }

  test(): void {
    let startAge = {
      lower: 18,
      upper: 78
    }
    this.storage.set('discoverable', false);
    this.storage.set('distance', 0);
    this.storage.set('age', startAge);
    this.storage.set('preference', "...");
    this.storage.set('new_match_notif', false);
    this.storage.set('messages_notif', false);
    this.storage.set('superlikes_notif', false);
  }

  publicDisc(): void {
    this.storage.set('discoverable', this.publicDiscoverable);
  }

  distanceChoice(): void {
    this.storage.set('distance', this.distance);
  }

  ageChoice(): void {
    this.storage.set('age', this.age);
  }

  searchPref(): void {
    this.storage.set('preference', this.searchPreference);
  }

  newMatch(): void {
    this.storage.set('new_match_notif', this.newMatches);
  }

  msg(): void {
    this.storage.set('messages_notif', this.messages);
  }

  like(): void {
    this.storage.set('superlikes_notif', this.superLikes);
  }

  showLegal(): void {
    let legalModal = this.modalCtrl.create(LegalPage);
    this.writeUserData();
    legalModal.present();
  }

  showFeedback(): void {
    let feedbackModal = this.modalCtrl.create(FeedbackPage);
    this.writeUserData();
    feedbackModal.present();
  }

  writeUserData(): void {
    let userPublic;
    this.storage.get('public').then(publicPreference => {
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
      let currentUserRef = this.af.database.object(`/users/${uid}`);
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