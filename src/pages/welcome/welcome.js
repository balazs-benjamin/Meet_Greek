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
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { DescentPage } from '../descent/descent';
import { CityService } from '../../providers/city-service';
import { AngularFire } from 'angularfire2';
var WelcomePage = (function () {
    function WelcomePage(af, nav, auth, userProvider, storage, platform, loadingCtrl, ct) {
        var _this = this;
        this.af = af;
        this.nav = nav;
        this.auth = auth;
        this.userProvider = userProvider;
        this.storage = storage;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.ct = ct;
        this.isTapped = false;
        this.user = {};
        this.latitude = 0;
        this.longitude = 0;
        if (platform.is('cordova')) {
            this.loading = this.loadingCtrl.create({
                content: 'Getting user information...'
            });
            this.loading.present();
            this.userProvider.getUser().then(function (userObservable) {
                userObservable.subscribe(function (user) {
                    _this.user = user;
                    _this.loading.dismiss();
                    _this.writeUserData();
                });
            });
        }
    }
    WelcomePage.prototype.ngOnInit = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.storage.get('hasUserEnterDetails').then(function (result) {
                if (!result) {
                    setTimeout(function () {
                        if (!_this.isTapped) {
                            _this.nav.setRoot(DescentPage);
                        }
                    }, 1000);
                }
            });
        });
    };
    ;
    WelcomePage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (navigator.geolocation) {
                var options = {
                    enableHighAccuracy: true
                };
                navigator.geolocation.getCurrentPosition(function (position) {
                    // console.info('using navigator');
                    _this.latitude = position.coords.latitude;
                    _this.longitude = position.coords.longitude;
                    _this.storage.set('latitude', _this.latitude);
                    _this.storage.set('longitude', _this.longitude);
                    _this.loadCity(position.coords.latitude, position.coords.longitude);
                }, function (error) {
                }, options);
            }
        });
    };
    WelcomePage.prototype.tapToContinue = function () {
        this.isTapped = true;
        this.nav.setRoot(DescentPage);
    };
    WelcomePage.prototype.loadCity = function (lat, lon) {
        var _this = this;
        this.ct.load(lat, lon)
            .then(function (data) {
            _this.cityResults = data;
        });
    };
    WelcomePage.prototype.writeUserData = function () {
        var _this = this;
        var loc;
        var lat;
        var lng;
        this.storage.get('location').then(function (location) {
            loc = location;
        });
        this.storage.set('latitude', this.latitude);
        this.storage.set('longitude', this.longitude);
        this.storage.get('latitude').then(function (latitude) {
            lat = latitude;
        });
        this.storage.get('longitude').then(function (longitude) {
            lng = longitude;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object("/users/" + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    location: loc,
                    latitude: lat,
                    longitude: lng
                });
            }
        });
    };
    return WelcomePage;
}());
WelcomePage = __decorate([
    Component({
        selector: 'page-welcome',
        templateUrl: 'welcome.html'
    }),
    __metadata("design:paramtypes", [AngularFire,
        NavController,
        AuthProvider,
        UserProvider,
        Storage,
        Platform,
        LoadingController,
        CityService])
], WelcomePage);
export { WelcomePage };
//# sourceMappingURL=welcome.js.map