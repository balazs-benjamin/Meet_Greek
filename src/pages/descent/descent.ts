import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { AreasPage } from '../areas/areas';
import { AboutMePage } from '../about-me/about-me';

@Component({
  selector: 'page-descent',
  templateUrl: 'descent.html'
})
export class DescentPage {

  constructor(
    public nav: NavController,
    public af: AngularFire,
    public userProvider: UserProvider,
    public storage: Storage
  ) {

  }

  ionViewDidLoad() {
    
  }

  yes(): void {
    this.storage.set('descent', 'Yes');
    this.writeUserData();
    this.nav.push(AreasPage);
  }

  yesMotherSide(): void {
    this.storage.set('descent', 'Yes, Mother’s Side');
    this.writeUserData();
    this.nav.push(AreasPage);
  }

  yesFatherSide(): void {
    this.storage.set('descent', 'Yes, Father’s Side');
    this.writeUserData();
    this.nav.push(AreasPage);
  }

  no(): void {
    this.storage.set('descent', 'No, just here for the lamb');
    this.writeUserData();
    this.nav.push(AboutMePage);
  }

  writeUserData(): void {
    let userDescent;
  
    this.storage.get('descent').then(descent => {
      userDescent = descent;
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object(`/users/${uid}`);
      if (currentUserRef) {
          currentUserRef.update({
              descent: userDescent
          });
      } 
    });
  }
}
