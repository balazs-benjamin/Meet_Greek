import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { DescentPage } from '../descent/descent';

import { CityService } from '../../providers/city-service';
import { Geolocation } from 'ionic-native';
import { AngularFire } from 'angularfire2';
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  // user = {username: "", profile_picture: ""};
  loading : any ;
  isTapped = false;
  user = <any>{};
  latitude = 0;
  longitude = 0;
  
  public cityResults: any;

  constructor(
    public af: AngularFire,
    public nav: NavController, 
    public auth: AuthProvider, 
    public userProvider: UserProvider,
    public storage:Storage,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public ct: CityService) {

    if (platform.is('cordova')) {
      this.loading = this.loadingCtrl.create({ 
          content: 'Getting user information...' 
      });
      this.loading.present();
      this.userProvider.getUser().then(userObservable => {
          userObservable.subscribe(user => {
              this.user = user;
              this.loading.dismiss();
              this.writeUserData();
          });
      });
    }
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.storage.get('hasUserEnterDetails').then((result) => {
          if (!result) {
              setTimeout(() => {
                if(!this.isTapped){
                  this.nav.setRoot(DescentPage);
                }
              }, 1000);
          }
      });
    });
  };
  
  ionViewDidLoad() {
    this.platform.ready().then(() => {
        if (navigator.geolocation) {
          var options = {
            enableHighAccuracy: true
          };
        
        navigator.geolocation.getCurrentPosition(position=> {
          // console.info('using navigator');
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.storage.set('latitude', this.latitude);
          this.storage.set('longitude', this.longitude);
          this.loadCity(position.coords.latitude, position.coords.longitude);
        }, error => {
          
        }, options);
      }
    });
  }

  tapToContinue(): void {
    this.isTapped = true;
    this.nav.setRoot(DescentPage);
  }

  loadCity(lat, lon){
    this.ct.load(lat, lon)
    .then(data => {
      this.cityResults = data;
    });
  }

  writeUserData(): void {
    let loc;
    let lat;
    let lng;

    this.storage.get('location').then(location => {
      loc = location;
    });
    this.storage.set('latitude', this.latitude);
          this.storage.set('longitude', this.longitude);
    this.storage.get('latitude').then(latitude => {
      lat = latitude;
    });
    this.storage.get('longitude').then(longitude => {
      lng = longitude;
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object(`/users/${uid}`);
      if (currentUserRef) {
        currentUserRef.update({
          location: loc,
          latitude: lat,
          longitude: lng
        });
      }
    });
  }
}
