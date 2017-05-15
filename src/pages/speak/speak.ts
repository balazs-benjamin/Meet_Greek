import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFire } from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { AboutMePage } from '../about-me/about-me';

@Component({
  selector: 'page-speak',
  templateUrl: 'speak.html'
})
export class SpeakPage {

  constructor(
    public nav: NavController,
    public af: AngularFire,
    public userProvider: UserProvider,
    public storage: Storage) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpeakPage');
  }


  speak(value:string): void {
    this.storage.set('speak', value);
    this.writeUserData();
    this.nav.push(AboutMePage);
  }

  writeUserData(): void {
    let speakGreek;
      
    this.storage.get('speak').then(speak => {
      speakGreek = speak;
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object(`/users/` + uid);
      if (currentUserRef) {
          currentUserRef.update({
              speak: speakGreek
          });
      } 
    });
  }
}
