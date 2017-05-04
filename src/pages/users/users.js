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
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatViewPage } from '../chat-view/chat-view';
var UsersPage = (function () {
    function UsersPage(nav, userProvider) {
        this.nav = nav;
        this.userProvider = userProvider;
    }
    UsersPage.prototype.ngOnInit = function () {
        var _this = this;
        this.userProvider.getUid()
            .then(function (uid) {
            _this.uid = uid;
            _this.users = _this.userProvider.getAllUsers();
        });
    };
    ;
    UsersPage.prototype.openChat = function (key) {
        var param = { uid: this.uid, interlocutor: key };
        this.nav.push(ChatViewPage, param);
    };
    return UsersPage;
}());
UsersPage = __decorate([
    Component({
        templateUrl: 'users.html'
    }),
    __metadata("design:paramtypes", [NavController, UserProvider])
], UsersPage);
export { UsersPage };
//# sourceMappingURL=users.js.map