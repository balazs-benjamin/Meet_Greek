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
import { NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ViewController } from 'ionic-angular';
/*
  Generated class for the ExtendedProfile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var ExtendedProfilePage = (function () {
    function ExtendedProfilePage(viewCtrl, params, userProvider) {
        var _this = this;
        this.viewCtrl = viewCtrl;
        this.userProvider = userProvider;
        this.data = { 'foo': 'bar' };
        this.premium = true;
        this.user = { username: "", userImage0: "", aboutMe: "", descent: "", areas: [], church: "", education: "", location: "", images: [] };
        this.uid = params.data.uid;
        this.interlocutor = params.data.interlocutor;
        this.userProvider.getUserInterlocutor(this.interlocutor).then(function (userObservable) {
            userObservable.subscribe(function (user) {
                _this.user = user;
            });
        });
        this.slideOptions = {
            pager: true
        };
    }
    ExtendedProfilePage.prototype.ionViewDidLoad = function () {
    };
    ExtendedProfilePage.prototype.flagUser = function () {
        alert("FLAG USER");
    };
    ExtendedProfilePage.prototype.reject = function () {
        this.data = { 'foo': 'bar1' };
        alert("Reject User");
        this.dismiss();
    };
    ExtendedProfilePage.prototype.like = function () {
        this.data = { 'foo': 'bar1' };
        alert("Like user");
        this.dismiss();
    };
    ExtendedProfilePage.prototype.superlike = function () {
        this.data = { 'foo': 'bar1' };
        alert("SuperLike user");
        this.dismiss();
    };
    ExtendedProfilePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss(this.data);
    };
    return ExtendedProfilePage;
}());
ExtendedProfilePage = __decorate([
    Component({
        selector: 'page-extended-profile',
        templateUrl: 'extended-profile.html'
    }),
    __metadata("design:paramtypes", [ViewController,
        NavParams,
        UserProvider])
], ExtendedProfilePage);
export { ExtendedProfilePage };
//# sourceMappingURL=extended-profile.js.map