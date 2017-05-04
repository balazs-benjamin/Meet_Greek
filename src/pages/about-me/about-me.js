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
import { MainPage } from '../main/main';
// import { Forms } from @angular/forms
var AboutMePage = (function () {
    function AboutMePage(nav, af, userProvider, storage) {
        var _this = this;
        this.nav = nav;
        this.af = af;
        this.userProvider = userProvider;
        this.storage = storage;
        this.storage.get('userImage[0]').then(function (picture) {
            if (picture) {
                _this.profile_pic = picture.data.url;
            }
        });
    }
    AboutMePage.prototype.ionViewDidLoad = function () {
    };
    AboutMePage.prototype.next = function () {
        this.storage.set('hasUserEnterDetails', true);
        this.storage.set('aboutMe', this.aboutMeText);
        this.writeUserData();
    };
    AboutMePage.prototype.writeUserData = function () {
        var _this = this;
        var userAboutMe;
        this.storage.get('aboutMe').then(function (aboutMe) {
            userAboutMe = aboutMe;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object("/users/" + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    aboutMe: userAboutMe
                });
                _this.nav.setRoot(MainPage);
            }
        });
    };
    return AboutMePage;
}());
AboutMePage = __decorate([
    Component({
        selector: 'page-about-me',
        templateUrl: 'about-me.html'
    }),
    __metadata("design:paramtypes", [NavController,
        AngularFire,
        UserProvider,
        Storage])
], AboutMePage);
export { AboutMePage };
//# sourceMappingURL=about-me.js.map