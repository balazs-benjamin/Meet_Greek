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
import { AngularFire, AuthProviders, AngularFireAuth, AuthMethods } from 'angularfire2';
import { Storage } from '@ionic/storage';
var AuthProvider = (function () {
    function AuthProvider(af, auth$, local) {
        var _this = this;
        this.af = af;
        this.auth$ = auth$;
        this.local = local;
        this.authState = null;
        af.auth.subscribe(function (state) {
            console.log("AngularFireAuth success", state);
            _this.authState = state;
            if (_this.authState) {
                _this.authState.auth.getToken().then(function (token) {
                    console.log('MyApp::onToken() success', token);
                    _this.notificationToken = token;
                }, function (err) {
                    console.log('MyApp::onToken() error', err);
                });
            }
        }, function (err) {
            console.log("AngularFireAuth error", err);
        });
    }
    /*
    signin(credentails) {
      return this.af.auth.login(credentails).then((data)=>{
        console.log("login", data);
      }, (error) => {
        console.log("login", error);
      });
    }
    */
    AuthProvider.prototype.createAccount = function (credentails) {
        return this.af.auth.createUser(credentails).then(function (data) {
            console.log("createAccount", data);
        }, function (error) {
            console.log("createAccount", error);
        });
    };
    ;
    AuthProvider.prototype.deleteAccount = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.af.auth.subscribe(function (authState) {
                authState.auth.delete()
                    .then(function (_) { return resolve(); })
                    .catch(function (e) { return reject(e); });
            });
        });
    };
    Object.defineProperty(AuthProvider.prototype, "authenticated", {
        get: function () {
            return this.authState !== null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "getAuthState", {
        get: function () {
            return this.authState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthProvider.prototype, "token", {
        get: function () {
            return this.notificationToken;
        },
        enumerable: true,
        configurable: true
    });
    AuthProvider.prototype.signInWithFacebook = function (facebookCredential) {
        return this.auth$.login(facebookCredential, {
            provider: AuthProviders.Facebook,
            method: AuthMethods.OAuthToken
        });
    };
    AuthProvider.prototype.signOut = function () {
        console.log("AuthProvider::signOut()");
        return this.auth$.logout();
    };
    AuthProvider.prototype.displayName = function () {
        if (this.authState != null) {
            return this.authState.facebook.displayName;
        }
        else {
            return '';
        }
    };
    return AuthProvider;
}());
AuthProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AngularFire,
        AngularFireAuth,
        Storage])
], AuthProvider);
export { AuthProvider };
//# sourceMappingURL=auth-provider.js.map