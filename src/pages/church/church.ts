import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { SpeakPage } from '../speak/speak';


@Component({
  selector: 'page-church',
  templateUrl: 'church.html'
})
export class ChurchPage {

  constructor(
    public nav: NavController,
    public af: AngularFire,
    public userProvider: UserProvider,
    public storage: Storage) {
    
  }

  ionViewDidLoad() {
    
  }

  every(): void {
    this.storage.set('church', 'Every Sunday');
    this.writeUserData();
    this.nav.setRoot(SpeakPage);
  }

  once(): void {
    this.storage.set('church', 'Once in a while');
    this.writeUserData();
    this.nav.push(SpeakPage);
  }

  only(): void {
    this.storage.set('church', 'Only for Easter and Chistmas');
    this.writeUserData();
    this.nav.push(SpeakPage);
  }

  never(): void {
    this.storage.set('church', 'Never');
    this.writeUserData();
    this.nav.push(SpeakPage);
  }

  skip(): void {
    this.storage.set('church', '');
    this.writeUserData();
    this.nav.push(SpeakPage);
  }

  church(value:string): void {
    this.storage.set('church', value);
    this.writeUserData();
    this.nav.push(SpeakPage);
  }

  writeUserData(): void {
    let userChurch;
      
    this.storage.get('church').then(church => {
      userChurch = church;
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object(`/users/` + uid);
      if (currentUserRef) {
          currentUserRef.update({
              church: userChurch
          });
      } 
    });
  }

}
