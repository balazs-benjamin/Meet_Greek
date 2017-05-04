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
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/map';
import { ChatViewPage } from '../chat-view/chat-view';
import { MatchPage } from '../match/match';
var ChatMatchPage = (function () {
    function ChatMatchPage(chatsProvider, userProvider, af, nav, modalCtrl) {
        var _this = this;
        this.chatsProvider = chatsProvider;
        this.userProvider = userProvider;
        this.af = af;
        this.nav = nav;
        this.modalCtrl = modalCtrl;
        this.everythingLoaded = false;
        this.searchQuery = '';
        this.chatsKeys = [];
        console.log("ChatMatchPage");
        this.userProvider.getUid()
            .then(function (uid) {
            _this.uid = uid;
            _this.users = _this.userProvider.getAllUsers();
            _this.userChats = _this.chatsProvider.getUserChats(uid);
            _this.addToChatsArray();
            _this.loadMatches();
        });
    }
    ChatMatchPage.prototype.ionViewDidLoad = function () { };
    ChatMatchPage.prototype.loadMatches = function () {
    };
    ChatMatchPage.prototype.addToChatsArray = function () {
        var _this = this;
        console.log("ChatMatchPage::addToChatsArray()");
        this.userChats.subscribe(function (chats) {
            _this.chatsKeys = [];
            console.log("ChatMatchPage::addToChatsArray()", chats);
            chats.forEach(function (chat) {
                _this.chatsKeys.push(chat.$key);
            });
            _this.everythingLoaded = true;
        });
    };
    ChatMatchPage.prototype.openChat = function (key) {
        var _this = this;
        console.log("ChatMatchPage::openChat()", key);
        this.userProvider.getUid()
            .then(function (uid) {
            var param = { uid: uid, interlocutor: key };
            _this.nav.push(ChatViewPage, param);
        });
    };
    ChatMatchPage.prototype.getItems = function (ev) {
        // Reset items back to all of the items
        // this.initializeItems();
        // this.initializeItems2();
        // set val to the value of the searchbar
        var val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            // this.users = this.users.filter((user) => {
            //   return (user.toLowerCase().indexOf(val.toLowerCase()) > -1);
            // })
            // this.items2 = this.items2.filter((item) => {
            //   return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
            // })
        }
    };
    ChatMatchPage.prototype.match = function (other_key) {
        var param = null;
        param = { interlocutor: other_key };
        //let param = {uid: "this uid", interlocutor: "other user key"};
        var matchModal = this.modalCtrl.create(MatchPage, param);
        // matchModal.onDidDismiss(data => {
        //   if(data.foo == 'bar1'){
        //     this.goToNextUser();
        //   }
        //   this.buttonDisabled = null;
        // });
        matchModal.present();
    };
    ChatMatchPage.prototype.shouldShowCancel = function () {
    };
    return ChatMatchPage;
}());
ChatMatchPage = __decorate([
    Component({
        selector: 'page-chat-match',
        templateUrl: 'chat-match.html'
    }),
    __metadata("design:paramtypes", [ChatsProvider,
        UserProvider,
        AngularFire,
        NavController,
        ModalController])
], ChatMatchPage);
export { ChatMatchPage };
//# sourceMappingURL=chat-match.js.map