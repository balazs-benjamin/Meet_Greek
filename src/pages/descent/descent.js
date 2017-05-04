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
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { AreasPage } from '../areas/areas';
import { AboutMePage } from '../about-me/about-me';
var DescentPage = (function () {
    function DescentPage(nav, af, userProvider, storage) {
        this.nav = nav;
        this.af = af;
        this.userProvider = userProvider;
        this.storage = storage;
    }
    DescentPage.prototype.ionViewDidLoad = function () {
    };
    DescentPage.prototype.yes = function () {
        this.storage.set('descent', 'Yes');
        this.writeUserData();
        this.nav.push(AreasPage);
    };
    DescentPage.prototype.yesMotherSide = function () {
        this.storage.set('descent', 'Yes, Mother’s Side');
        this.writeUserData();
        this.nav.push(AreasPage);
    };
    DescentPage.prototype.yesFatherSide = function () {
        this.storage.set('descent', 'Yes, Father’s Side');
        this.writeUserData();
        this.nav.push(AreasPage);
    };
    DescentPage.prototype.no = function () {
        this.storage.set('descent', 'No, just here for the lamb');
        this.writeUserData();
        this.nav.push(AboutMePage);
    };
    DescentPage.prototype.writeUserData = function () {
        var _this = this;
        var userDescent;
        this.storage.get('descent').then(function (descent) {
            userDescent = descent;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object("/users/" + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    descent: userDescent
                });
            }
        });
    };
    return DescentPage;
}());
DescentPage = __decorate([
    Component({
        selector: 'page-descent',
        templateUrl: 'descent.html'
    }),
    __metadata("design:paramtypes", [NavController,
        AngularFire,
        UserProvider,
        Storage])
], DescentPage);
export { DescentPage };
//# sourceMappingURL=descent.js.map