import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/*
  Generated class for the Feedback page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html'
})
export class FeedbackPage {

  constructor(public viewCtrl: ViewController) {}

  ionViewDidLoad() {
  }

  dismiss(): void {
    this.viewCtrl.dismiss();
  }

}
