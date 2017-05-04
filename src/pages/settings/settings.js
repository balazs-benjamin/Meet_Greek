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
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { PremiumPage } from '../premium/premium';
import { LegalPage } from '../legal/legal';
import { FeedbackPage } from '../feedback/feedback';
import { AngularFire } from 'angularfire2';
import { MainPage } from '../main/main';
import { LoginPage } from '../login/login';
var SettingsPage = (function () {
    // user = { username: "", profile_picture: "", aboutMe: "", 
    // descent: "", areas: [], church: "", location: "", images: [] };
    function SettingsPage(fb, nav, af, auth, userProvider, local, util, storage, alertCtrl, modalCtrl, loadingCtrl) {
        var _this = this;
        this.fb = fb;
        this.nav = nav;
        this.af = af;
        this.auth = auth;
        this.userProvider = userProvider;
        this.local = local;
        this.util = util;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.loadingCtrl = loadingCtrl;
        this.hasLoaded = false;
        this.user = {};
        this.profilePageChoice = 'profile';
        // this.profilePage = 'profile';
        this.isProfile = true;
        this.storage.get('discoverable').then(function (discoverable) {
            console.log("SettingsPage::constructor discoverable", discoverable);
            _this.publicDiscoverable = discoverable;
        });
        this.storage.get('distance').then(function (dist) {
            _this.distance = dist;
        });
        this.storage.get('age').then(function (ag) {
            console.log("SettingsPage::constructor age", ag);
            _this.age = ag;
        }, function (err) {
            console.log("SettingsPage::constructor age", err);
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
        this.userProvider.getUid().then(function (uid) {
            _this.userId = uid;
        });
        this.userProvider.getUser().then(function (userObservable) {
            _this.loading = _this.loadingCtrl.create({
                content: 'Getting user information...'
            });
            _this.loading.present();
            userObservable.subscribe(function (data) {
                console.log("SettingsPage::constructor user", data);
                _this.user = data;
                _this.hasLoaded = true;
                _this.loading.dismiss();
                // set data 
                _this.publicDiscoverable = _this.user.discoverable;
                _this.distance = _this.user.distance;
                _this.age = _this.user.age;
                if (_this.user.preference != '...') {
                    _this.searchPreference = _this.user.preference;
                }
                _this.newMatches = _this.user.new_matches;
                _this.messages = _this.user.messages;
                _this.superLikes = _this.user.superLikes;
            });
        });
    }
    SettingsPage.prototype.ionViewWillEnter = function () {
    };
    SettingsPage.prototype.ionViewWillLeave = function () {
        this.writeUserData();
    };
    //save user info
    SettingsPage.prototype.updatePicture = function () {
        // this.userProvider.updatePicture();
        var alert = this.util.doAlert("Error", this.user.username, "Ok");
        alert.present();
    };
    ;
    SettingsPage.prototype.edit = function () {
        this.nav.push(EditProfilePage);
    };
    SettingsPage.prototype.next = function () {
        console.log("SettingsPage::next()");
        this.nav.setRoot(MainPage);
    };
    SettingsPage.prototype.profileClicked = function () {
        // this.profilePageChoice = 'profile';
        this.isProfile = true;
        //this.writeUserData();
    };
    SettingsPage.prototype.settingsClicked = function () {
        // this.profilePageChoice = 'settings';
        this.isProfile = false;
    };
    SettingsPage.prototype.logout = function (param) {
        var _this = this;
        console.log("SettingsPage::logout()");
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
        this.local.remove('uid');
        this.local.remove('username');
        this.local.remove('profile_picture');
        this.local.remove('email');
        this.auth.signOut().then(function () {
            _this.fb.logout().then(function () {
                _this.nav.setRoot(LoginPage, param);
                _this.loading.dismiss();
            });
        });
        // this.local.remove('userInfo');
        // Facebook.logout();
    };
    SettingsPage.prototype.showPremium = function () {
        var premiumModal = this.modalCtrl.create(PremiumPage);
        this.writeUserData();
        premiumModal.present();
    };
    SettingsPage.prototype.test = function () {
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
    SettingsPage.prototype.publicDisc = function () {
        this.userProvider.updateUserProfile(this.userId, 'discoverable', this.publicDiscoverable);
        this.storage.set('discoverable', this.publicDiscoverable);
    };
    SettingsPage.prototype.distanceChoice = function () {
        this.userProvider.updateUserProfile(this.userId, 'distance', this.distance);
        this.storage.set('distance', this.distance);
    };
    SettingsPage.prototype.ageChoice = function () {
        this.userProvider.updateUserProfile(this.userId, 'age', this.age);
        console.log("SettingsPage::ageChoice()", this.age);
        this.storage.set('age', this.age);
    };
    SettingsPage.prototype.searchPref = function () {
        this.userProvider.updateUserProfile(this.userId, 'preference', this.searchPreference);
        this.storage.set('preference', this.searchPreference);
    };
    SettingsPage.prototype.newMatch = function () {
        this.userProvider.updateUserProfile(this.userId, 'new_matches', this.newMatches);
        console.log("SettingsPage::newMatch()", this.newMatches);
        this.storage.set('new_match_notif', this.newMatches);
    };
    SettingsPage.prototype.msg = function () {
        console.log("SettingsPage::msg()", this.messages);
        this.userProvider.updateUserProfile(this.userId, 'messages', this.messages);
        this.storage.set('messages_notif', this.messages);
    };
    SettingsPage.prototype.like = function () {
        console.log("SettingsPage::like()", this.superLikes);
        this.userProvider.updateUserProfile(this.userId, 'superLikes', this.superLikes);
        this.storage.set('superlikes_notif', this.superLikes);
    };
    SettingsPage.prototype.deleteAccount = function () {
        var _this = this;
        console.log('SettingsPage::deleteAccount');
        var prompt = this.alertCtrl.create({
            title: "Are you sure?",
            message: "You have to login again to delete your account. Please select delete to confirm.",
            buttons: [
                {
                    text: 'Cancel'
                },
                {
                    text: 'Delete',
                    handler: function (data) {
                        _this.logout({ delete: true });
                    }
                }
            ]
        });
        prompt.present();
    };
    SettingsPage.prototype.showLegal = function () {
        console.log("SettingsPage::showLegal()");
        var legalModal = this.modalCtrl.create(LegalPage);
        this.writeUserData();
        legalModal.present();
    };
    SettingsPage.prototype.showFeedback = function () {
        var feedbackModal = this.modalCtrl.create(FeedbackPage);
        this.writeUserData();
        feedbackModal.present();
    };
    SettingsPage.prototype.writeUserData = function () {
        var _this = this;
        console.log("SettingsPage::writeUserData()");
        var userPublic;
        this.storage.get('discoverable').then(function (publicPreference) {
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
    return SettingsPage;
}());
SettingsPage = __decorate([
    Component({
        selector: 'page-settings',
        templateUrl: 'settings.html'
    }),
    __metadata("design:paramtypes", [Facebook,
        NavController,
        AngularFire,
        AuthProvider,
        UserProvider,
        Storage,
        UtilProvider,
        Storage,
        AlertController,
        ModalController,
        LoadingController])
], SettingsPage);
export { SettingsPage };
//# sourceMappingURL=settings.js.map