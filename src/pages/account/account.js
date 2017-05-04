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
import { NavController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { PremiumPage } from '../premium/premium';
import { LegalPage } from '../legal/legal';
import { FeedbackPage } from '../feedback/feedback';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../login/login';
var AccountPage = (function () {
    function AccountPage(nav, af, auth, userProvider, local, util, storage, modalCtrl) {
        var _this = this;
        this.nav = nav;
        this.af = af;
        this.auth = auth;
        this.userProvider = userProvider;
        this.local = local;
        this.util = util;
        this.storage = storage;
        this.modalCtrl = modalCtrl;
        this.user = { username: "", profile_picture: "", aboutMe: "", descent: "", areas: [], church: "", education: "", location: "", images: [] };
        this.userProvider.getUser().then(function (userObservable) {
            userObservable.subscribe(function (user) {
                _this.user = user;
            });
        });
        this.profilePage = 'profile';
        this.isProfile = true;
        this.slideOptions = {
            pager: true
        };
        this.storage.get('discoverable').then(function (discoverable) {
            _this.publicDiscoverable = discoverable;
        });
        this.storage.get('distance').then(function (dist) {
            _this.distance = dist;
        });
        this.storage.get('age').then(function (ag) {
            _this.age = ag;
        });
        this.storage.get('preference').then(function (pref) {
            _this.searchPreference = pref;
        });
        this.storage.get('new_match_notif').then(function (nm) {
            _this.newMatches = nm;
        });
        this.storage.get('messages_notif').then(function (msg) {
            _this.messages = msg;
        });
        this.storage.get('superlikes_notif').then(function (sl) {
            _this.superLikes = sl;
        });
    }
    AccountPage.prototype.ionViewWillLeave = function () {
        this.writeUserData();
    };
    //save user info
    AccountPage.prototype.updatePicture = function () {
        // this.userProvider.updatePicture();
        var alert = this.util.doAlert("Error", this.user.username, "Ok");
        alert.present();
    };
    ;
    AccountPage.prototype.edit = function () {
        this.nav.push(EditProfilePage);
    };
    AccountPage.prototype.next = function () {
    };
    AccountPage.prototype.profileClicked = function () {
        this.isProfile = true;
        this.writeUserData();
    };
    AccountPage.prototype.settingsClicked = function () {
        this.isProfile = false;
    };
    AccountPage.prototype.logout = function () {
        var _this = this;
        console.log("AccountPage::logout()");
        this.local.remove('uid');
        this.local.remove('username');
        this.local.remove('profile_picture');
        this.local.remove('email');
        // this.local.remove('userInfo');
        // Facebook.logout();
        // this.auth.logout();
        this.auth.signOut().then(function () {
            _this.nav.setRoot(LoginPage);
        });
    };
    AccountPage.prototype.showPremium = function () {
        var premiumModal = this.modalCtrl.create(PremiumPage);
        this.writeUserData();
        premiumModal.present();
    };
    AccountPage.prototype.test = function () {
        var startAge = {
            lower: 18,
            upper: 78
        };
        this.storage.set('discoverable', false);
        this.storage.set('distance', 0);
        this.storage.set('age', startAge);
        this.storage.set('preference', "...");
        this.storage.set('new_match_notif', false);
        this.storage.set('messages_notif', false);
        this.storage.set('superlikes_notif', false);
    };
    AccountPage.prototype.publicDisc = function () {
        this.storage.set('discoverable', this.publicDiscoverable);
    };
    AccountPage.prototype.distanceChoice = function () {
        this.storage.set('distance', this.distance);
    };
    AccountPage.prototype.ageChoice = function () {
        this.storage.set('age', this.age);
    };
    AccountPage.prototype.searchPref = function () {
        this.storage.set('preference', this.searchPreference);
    };
    AccountPage.prototype.newMatch = function () {
        this.storage.set('new_match_notif', this.newMatches);
    };
    AccountPage.prototype.msg = function () {
        this.storage.set('messages_notif', this.messages);
    };
    AccountPage.prototype.like = function () {
        this.storage.set('superlikes_notif', this.superLikes);
    };
    AccountPage.prototype.showLegal = function () {
        var legalModal = this.modalCtrl.create(LegalPage);
        this.writeUserData();
        legalModal.present();
    };
    AccountPage.prototype.showFeedback = function () {
        var feedbackModal = this.modalCtrl.create(FeedbackPage);
        this.writeUserData();
        feedbackModal.present();
    };
    AccountPage.prototype.writeUserData = function () {
        var _this = this;
        var userPublic;
        this.storage.get('public').then(function (publicPreference) {
            userPublic = publicPreference;
        });
        var distancePreference;
        this.storage.get('distance').then(function (distance) {
            distancePreference = distance;
        });
        var userAge;
        this.storage.get('age').then(function (age) {
            userAge = age;
        });
        var userPreference;
        this.storage.get('preference').then(function (preference) {
            userPreference = preference;
        });
        var userNewMatches;
        this.storage.get('new_match_notif').then(function (new_matches_notif) {
            userNewMatches = new_matches_notif;
        });
        var userMessagesNotif;
        this.storage.get('messages_notif').then(function (messages_notif) {
            userMessagesNotif = messages_notif;
        });
        var userSuperLikes;
        this.storage.get('superlikes_notif').then(function (superlikes_notif) {
            userSuperLikes = superlikes_notif;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object('/users/' + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    discoverable: userPublic,
                    distance: distancePreference,
                    age: userAge,
                    preference: userPreference,
                    new_matches: userNewMatches,
                    messages: userMessagesNotif,
                    superLikes: userSuperLikes
                });
            }
        });
    };
    return AccountPage;
}());
AccountPage = __decorate([
    Component({
        selector: 'page-account',
        templateUrl: 'account.html'
    }),
    __metadata("design:paramtypes", [NavController,
        AngularFire,
        AuthProvider,
        UserProvider,
        Storage,
        UtilProvider,
        Storage,
        ModalController])
], AccountPage);
export { AccountPage };
//# sourceMappingURL=account.js.map