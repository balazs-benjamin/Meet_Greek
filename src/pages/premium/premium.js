var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { PurchaseProvider } from '../../providers/purchase-provider/purchase-provider';
var PremiumPage = (function () {
    function PremiumPage(viewCtrl, purchase) {
        this.viewCtrl = viewCtrl;
        this.purchase = purchase;
    }
    PremiumPage.prototype.ionViewDidLoad = function () {
    };
    PremiumPage.prototype.oneWeek = function () {
        this.purchase.getProducts();
    };
    PremiumPage.prototype.oneMonth = function () {
    };
    PremiumPage.prototype.sixMonths = function () {
    };
    PremiumPage.prototype.restore = function () {
    };
    PremiumPage.prototype.back = function () {
        this.viewCtrl.dismiss();
    };
    return PremiumPage;
}());
PremiumPage = __decorate([
    Component({
        selector: 'page-premium',
        templateUrl: 'premium.html'
    }),
    __metadata("design:paramtypes", [ViewController, PurchaseProvider])
], PremiumPage);
export { PremiumPage };
//# sourceMappingURL=premium.js.map