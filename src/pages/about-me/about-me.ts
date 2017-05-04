import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { MainPage } from '../main/main';
// import { Forms } from @angular/forms

@Component({
  selector: 'page-about-me',
  templateUrl: 'about-me.html'
})
export class AboutMePage {

  profile_pic: string;
  aboutMeText: string;

  constructor(
    public nav: NavController,
    public af: AngularFire,
    public userProvider: UserProvider,
    public storage: Storage) {

      this.storage.get('userImaxge[0]').then(picture => {
        console.log('AboutMePage::userImage[0]', picture);
      });
      this.storage.get('profile_picture').then(picture => {
        console.log('AboutMePage::profile_picture', picture);

        if (picture) {
          this.profile_pic = picture.data.url;
        }
        
      });

  }

  ionViewDidLoad() {
    
  }

   next(): void {
    this.storage.set('hasUserEnterDetails', true);
    this.storage.set('aboutMe', this.aboutMeText);
    this.writeUserData();
  }

  writeUserData(): void {
    let userAboutMe;
    this.storage.get('aboutMe').then(aboutMe => {
      userAboutMe = aboutMe;
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object(`/users/` + uid);
      if (currentUserRef) {
          currentUserRef.update({
              aboutMe: userAboutMe
        });
        this.nav.setRoot(MainPage);
      } 
    });
  }
}
