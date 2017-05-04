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
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ViewController } from 'ionic-angular';
import { ChatViewPage } from '../chat-view/chat-view';
var MatchPage = (function () {
    function MatchPage(nav, viewCtrl, params, userProvider) {
        var _this = this;
        this.nav = nav;
        this.viewCtrl = viewCtrl;
        this.userProvider = userProvider;
        this.user = { username: "", userImage0: "" };
        this.interlocutor = params.data.interlocutor;
        this.userProvider.getUserInterlocutor(this.interlocutor).then(function (userObservable) {
            userObservable.subscribe(function (user) {
                _this.user = user;
            });
        });
    }
    MatchPage.prototype.ionViewDidLoad = function () {
    };
    MatchPage.prototype.ngOnInit = function () {
        var _this = this;
        this.userProvider.getUid()
            .then(function (uid) {
            _this.uid = uid;
        });
    };
    ;
    MatchPage.prototype.goBack = function () {
        this.viewCtrl.dismiss();
    };
    MatchPage.prototype.openChat = function (key) {
        var param = { uid: this.uid, interlocutor: key };
        this.nav.push(ChatViewPage, param);
    };
    return MatchPage;
}());
MatchPage = __decorate([
    Component({
        selector: 'page-match',
        templateUrl: 'match.html'
    }),
    __metadata("design:paramtypes", [NavController,
        ViewController,
        NavParams,
        UserProvider])
], MatchPage);
export { MatchPage };
//# sourceMappingURL=match.js.map