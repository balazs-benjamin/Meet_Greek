var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Platform, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ExtendedProfilePage } from '../extended-profile/extended-profile';
var ChatViewPage = (function () {
    function ChatViewPage(nav, params, chatsProvider, af, userProvider, platform, modalCtrl) {
        var _this = this;
        this.nav = nav;
        this.params = params;
        this.chatsProvider = chatsProvider;
        this.af = af;
        this.userProvider = userProvider;
        this.platform = platform;
        this.modalCtrl = modalCtrl;
        this.interlocutorProfile = {};
        this.uid = params.data.uid;
        this.interlocutor = params.data.interlocutor;
        // Get Chat Reference
        chatsProvider.getChatRef(this.uid, this.interlocutor)
            .then(function (chatRef) {
            _this.chats = _this.af.database.list(chatRef);
        });
        this.userProvider.getUserInterlocutor(this.interlocutor).then(function (userObservable) {
            userObservable.subscribe(function (user) {
                _this.interlocutorProfile = user;
            });
        });
    }
    ChatViewPage.prototype.ionViewDidEnter = function () {
        this.content.scrollToBottom();
    };
    ChatViewPage.prototype.ionViewWillLeave = function () { };
    ChatViewPage.prototype.showProfile = function () {
        var param = null;
        param = { uid: this.uid, interlocutor: this.interlocutor };
        //let param = {uid: "this uid", interlocutor: "other user key"};
        var extendedProfileModal = this.modalCtrl.create(ExtendedProfilePage, param);
        extendedProfileModal.onDidDismiss(function (data) {
            if (data.foo == 'bar1') {
            }
        });
        extendedProfileModal.present();
    };
    ChatViewPage.prototype.sendMessage = function () {
        if (this.message) {
            var sent = this.formatLocalDate();
            var chat = {
                from: this.uid,
                message: this.message,
                createdAt: sent,
                type: 'message'
            };
            this.chats.push(chat);
            this.message = "";
        }
    };
    ;
    ChatViewPage.prototype.sendPicture = function () {
        var _this = this;
        var sent = this.formatLocalDate();
        var chat = { from: this.uid, createdAt: sent, type: 'picture', picture: null };
        this.userProvider.getPicture()
            .then(function (image) {
            chat.picture = image;
            _this.chats.push(chat);
        });
    };
    ChatViewPage.prototype.deleteMessage = function (chat) {
        console.log("deleteMessage", chat);
        this.chats.remove(chat);
    };
    ChatViewPage.prototype.flagMessage = function (chat) {
        console.log("flagMessage", chat);
    };
    ChatViewPage.prototype.formatLocalDate = function () {
        var now = new Date(), tzo = -now.getTimezoneOffset(), dif = tzo >= 0 ? '+' : '-', pad = function (num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
        return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    };
    return ChatViewPage;
}());
__decorate([
    ViewChild(Content),
    __metadata("design:type", Content)
], ChatViewPage.prototype, "content", void 0);
ChatViewPage = __decorate([
    Component({
        selector: 'page-chat-view',
        templateUrl: 'chat-view.html',
    }),
    __metadata("design:paramtypes", [NavController,
        NavParams,
        ChatsProvider,
        AngularFire,
        UserProvider,
        Platform,
        ModalController])
], ChatViewPage);
export { ChatViewPage };
//# sourceMappingURL=chat-view.js.map