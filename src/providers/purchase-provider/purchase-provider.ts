import { Injectable } from '@angular/core';
import { InAppPurchase } from 'ionic-native';
import { ToastController} from 'ionic-angular';
import { UtilProvider } from '../../providers/utils';

/*
  Generated class for the PurchaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PurchaseProvider {
  private productId: string[] = ["com.meetgreekorg.coins100", "coins100"]
  constructor(private toastCtrl: ToastController, public util: UtilProvider) {
  }

  /**
    * returns a array of Products
    */
  public getProducts():Promise<Iproducts[]> {
    return InAppPurchase
      .getProducts(this.productId)
      .then((products: Iproducts[]) => {
        let alert = this.util.doAlert("Error", products, "Ok");
        alert.present();
        return products
        //  [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
      })
      .catch((err) => {
        let alert = this.util.doAlert("Error", err, "Ok");
        alert.present();
      });
  }

  /**
  * plugin is:  https://github.com/rsanchez-forks/cordova-plugin-inapppurchase
  * function that calls the
  *  prod - is the productId 'test0001'
  * using Toast for now since i cant view console, in a release build
  * @param {string} prod the productId .. "test0001"
  */
  public buyProduct(prod: string): void {
    InAppPurchase
      .buy(prod)
      .then((data) => {
        // alert("buy data: " + JSON.stringify(data))
        // ...then mark it as consumed:
        return InAppPurchase.consume(data.productType, data.receipt, data.signature);
      })
      .then(() => {
        let alert = this.util.doAlert("Success", "Product was successfully consumed!", "Ok");
        alert.present();
        // this.receipt.CreateReceipt(data)
      })
      .catch((err) => {
        
      });
  }
}

export interface Iproducts {
  productId?: string;
  title?: string;
  description?: string;
  price?: string | number
}
