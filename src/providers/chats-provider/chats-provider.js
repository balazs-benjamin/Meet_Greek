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
import { AngularFire } from 'angularfire2';
import { UserProvider } from '../user-provider/user-provider';
var ChatsProvider = (function () {
    function ChatsProvider(af, up) {
        this.af = af;
        this.up = up;
    }
    // get list of Chats of a Logged In User
    ChatsProvider.prototype.getChats = function () {
        var _this = this;
        return this.up.getUid().then(function (uid) {
            var chats = _this.af.database.list('/users/' + uid + '/chats');
            return chats;
        });
    };
    ChatsProvider.prototype.getUserChats = function (uid) {
        return this.af.database.list('/users/' + uid + '/chats');
    };
    // Add Chat References to Both users
    ChatsProvider.prototype.addChats = function (uid, interlocutor) {
        // First User
        var endpoint = this.af.database.object('/users/' + uid + '/chats/' + interlocutor);
        endpoint.set(true);
        // Second User
        var endpoint2 = this.af.database.object('/users/' + interlocutor + '/chats/' + uid);
        endpoint2.set(true);
    };
    ChatsProvider.prototype.getChatRef = function (uid, interlocutor) {
        var _this = this;
        var firstRef = this.af.database.object('/chats/' + uid + ',' + interlocutor, { preserveSnapshot: true });
        var promise = new Promise(function (resolve, reject) {
            firstRef.subscribe(function (snapshot) {
                var a = snapshot.exists();
                if (a) {
                    resolve('/chats/' + uid + ',' + interlocutor);
                }
                else {
                    var secondRef = _this.af.database.object('/chats/' + interlocutor + ',' + uid, { preserveSnapshot: true });
                    secondRef.subscribe(function (snapshot) {
                        var b = snapshot.exists();
                        if (!b) {
                            _this.addChats(uid, interlocutor);
                        }
                    });
                    resolve('/chats/' + interlocutor + ',' + uid);
                }
            });
        });
        return promise;
    };
    return ChatsProvider;
}());
ChatsProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AngularFire, UserProvider])
], ChatsProvider);
export { ChatsProvider };
//# sourceMappingURL=chats-provider.js.map