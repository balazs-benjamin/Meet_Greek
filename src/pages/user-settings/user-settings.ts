import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the UserSettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-settings',
  templateUrl: 'user-settings.html'
})
export class UserSettingsPage {
  pet: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pet = 'profile';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserSettingsPage');
  }

}
