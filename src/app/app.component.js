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
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { AngularFire } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { Storage } from '@ionic/storage';
import { Keyboard } from 'ionic-native';
var MyApp = (function () {
    function MyApp(platform, af, alertCtrl, authProvider, storage) {
        var _this = this;
        this.platform = platform;
        this.af = af;
        this.alertCtrl = alertCtrl;
        this.authProvider = authProvider;
        this.storage = storage;
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            StatusBar.backgroundColorByHexString('#ffffff'); // set status bar to white
            Splashscreen.hide();
            if (platform.is('ios')) {
                Keyboard.hideKeyboardAccessoryBar(false);
                //Keyboard.disableScroll(true);
                //Keyboard.shrinkView(true);
            }
            _this.intialize();
            if (_this.platform.is('cordova')) {
                setTimeout(_this.initPushNotification, 1000);
            }
            else {
                console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
            }
        });
    }
    MyApp.prototype.intialize = function () {
        var _this = this;
        if (this.platform.is('cordova')) {
            this.storage.get('hasUserReachedMain').then(function (reachedMain) {
                _this.af.auth.subscribe(function (auth) {
                    if (auth && reachedMain) {
                        _this.rootPage = MainPage;
                    }
                    else {
                        _this.rootPage = LoginPage;
                        // this.rootPage = ChurchPage;
                    }
                });
            });
        }
        else {
            // this.rootPage = AboutMePage;
        }
    };
    MyApp.prototype.initPushNotification = function () {
        console.log('MyApp::initPushNotification()', FCMPlugin);
        FCMPlugin.getToken(function (t) {
            console.log('MyApp::getToken() success', t);
        }, function (e) {
            console.log('MyApp::getToken() error', e);
        });
        FCMPlugin.onNotification(function (data) {
            console.log('MyApp::onNotification() success', data);
        }, function (e) {
            console.log('MyApp::onNotification() error', e);
        });
    };
    return MyApp;
}());
MyApp = __decorate([
    Component({
        templateUrl: 'app.html'
    }),
    __metadata("design:paramtypes", [Platform,
        AngularFire,
        AlertController,
        AuthProvider,
        Storage])
], MyApp);
export { MyApp };
//# sourceMappingURL=app.component.js.map