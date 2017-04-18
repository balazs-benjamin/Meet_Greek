import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the Legal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-legal',
  templateUrl: 'legal.html'
})
export class LegalPage {

  constructor(public viewCtrl: ViewController) {}

  ionViewDidLoad() {
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

}
