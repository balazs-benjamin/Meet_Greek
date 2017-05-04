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
import { AboutMePage } from '../about-me/about-me';
var ChurchPage = (function () {
    function ChurchPage(nav, af, userProvider, storage) {
        this.nav = nav;
        this.af = af;
        this.userProvider = userProvider;
        this.storage = storage;
    }
    ChurchPage.prototype.ionViewDidLoad = function () {
    };
    ChurchPage.prototype.every = function () {
        this.storage.set('church', 'Every Sunday');
        this.writeUserData();
        this.nav.setRoot(AboutMePage);
    };
    ChurchPage.prototype.once = function () {
        this.storage.set('church', 'Once in a while');
        this.writeUserData();
        this.nav.push(AboutMePage);
    };
    ChurchPage.prototype.only = function () {
        this.storage.set('church', 'Only for Easter and Chistmas');
        this.writeUserData();
        this.nav.push(AboutMePage);
    };
    ChurchPage.prototype.never = function () {
        this.storage.set('church', 'Never');
        this.writeUserData();
        this.nav.push(AboutMePage);
    };
    ChurchPage.prototype.skip = function () {
        this.storage.set('church', '');
        this.writeUserData();
        this.nav.push(AboutMePage);
    };
    ChurchPage.prototype.church = function (value) {
        this.storage.set('church', value);
        this.writeUserData();
        this.nav.push(AboutMePage);
    };
    ChurchPage.prototype.writeUserData = function () {
        var _this = this;
        var userChurch;
        this.storage.get('church').then(function (church) {
            userChurch = church;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object("/users/" + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    church: userChurch
                });
            }
        });
    };
    return ChurchPage;
}());
ChurchPage = __decorate([
    Component({
        selector: 'page-church',
        templateUrl: 'church.html'
    }),
    __metadata("design:paramtypes", [NavController,
        AngularFire,
        UserProvider,
        Storage])
], ChurchPage);
export { ChurchPage };
//# sourceMappingURL=church.js.map