var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { InAppPurchase } from 'ionic-native';
import { ToastController } from 'ionic-angular';
import { UtilProvider } from '../../providers/utils';
/*
  Generated class for the PurchaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var PurchaseProvider = (function () {
    function PurchaseProvider(toastCtrl, util) {
        this.toastCtrl = toastCtrl;
        this.util = util;
        this.productId = ["com.meetgreekorg.coins100", "coins100"];
    }
    /**
      * returns a array of Products
      */
    PurchaseProvider.prototype.getProducts = function () {
        var _this = this;
        return InAppPurchase
            .getProducts(this.productId)
            .then(function (products) {
            var alert = _this.util.doAlert("Error", products, "Ok");
            alert.present();
            return products;
            //  [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
        })
            .catch(function (err) {
            var alert = _this.util.doAlert("Error", err, "Ok");
            alert.present();
        });
    };
    /**
    * plugin is:  https://github.com/rsanchez-forks/cordova-plugin-inapppurchase
    * function that calls the
    *  prod - is the productId 'test0001'
    * using Toast for now since i cant view console, in a release build
    * @param {string} prod the productId .. "test0001"
    */
    PurchaseProvider.prototype.buyProduct = function (prod) {
        var _this = this;
        InAppPurchase
            .buy(prod)
            .then(function (data) {
            // alert("buy data: " + JSON.stringify(data))
            // ...then mark it as consumed:
            return InAppPurchase.consume(data.productType, data.receipt, data.signature);
        })
            .then(function () {
            var alert = _this.util.doAlert("Success", "Product was successfully consumed!", "Ok");
            alert.present();
            // this.receipt.CreateReceipt(data)
        })
            .catch(function (err) {
        });
    };
    return PurchaseProvider;
}());
PurchaseProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ToastController, UtilProvider])
], PurchaseProvider);
export { PurchaseProvider };
//# sourceMappingURL=purchase-provider.js.map