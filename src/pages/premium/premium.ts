import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { PurchaseProvider } from '../../providers/purchase-provider/purchase-provider';

@Component({
  selector: 'page-premium',
  templateUrl: 'premium.html'
})
export class PremiumPage {
  slideOptions: any; 
  constructor(public viewCtrl: ViewController, public purchase: PurchaseProvider) {

  }

  ionViewDidLoad() {
    
  }

  oneWeek(): void {
    this.purchase.getProducts();
  }

  oneMonth(): void {

  }

  sixMonths(): void {

  }

  restore(): void {
    
  }

  back(): void {
    this.viewCtrl.dismiss();
  }

}
