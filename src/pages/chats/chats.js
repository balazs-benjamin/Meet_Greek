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
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/map';
import { ChatViewPage } from '../chat-view/chat-view';
var ChatsPage = (function () {
    function ChatsPage(chatsProvider, userProvider, af, nav) {
        var _this = this;
        this.chatsProvider = chatsProvider;
        this.userProvider = userProvider;
        this.af = af;
        this.nav = nav;
        this.chatsProvider.getChats()
            .then(function (chats) {
            _this.chats = chats.map(function (users) {
                return users.map(function (user) {
                    user.info = _this.af.database.object("/users/" + user.$key);
                    return user;
                });
            });
        });
    }
    ChatsPage.prototype.openChat = function (key) {
        var _this = this;
        this.userProvider.getUid()
            .then(function (uid) {
            var param = { uid: uid, interlocutor: key };
            _this.nav.push(ChatViewPage, param);
        });
    };
    return ChatsPage;
}());
ChatsPage = __decorate([
    Component({
        templateUrl: 'chats.html'
    }),
    __metadata("design:paramtypes", [ChatsProvider,
        UserProvider,
        AngularFire,
        NavController])
], ChatsPage);
export { ChatsPage };
//# sourceMappingURL=chats.js.map