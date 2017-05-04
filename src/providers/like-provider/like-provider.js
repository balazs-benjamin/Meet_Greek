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
var LikeProvider = (function () {
    function LikeProvider(af, up) {
        this.af = af;
        this.up = up;
    }
    LikeProvider.prototype.getLikes = function () {
        var _this = this;
        return this.up.getUid().then(function (uid) {
            var likes = _this.af.database.list("/users/" + uid + "/likes");
            return likes;
        });
    };
    LikeProvider.prototype.getUserLikes = function (uid) {
        return this.af.database.list("/users/" + uid + "/likes");
    };
    LikeProvider.prototype.addLike = function (uid, interlocutor) {
        var endpoint = this.af.database.object("/users/" + uid + "/likes/" + interlocutor);
        endpoint.set(true);
    };
    LikeProvider.prototype.reject = function (uid, interlocutor) {
        var endpoint = this.af.database.object("/users/" + uid + "/likes/" + interlocutor);
        endpoint.set(false);
    };
    LikeProvider.prototype.getSuperLikes = function () {
        var _this = this;
        return this.up.getUid().then(function (uid) {
            var likes = _this.af.database.list("/users/" + uid + "/superLikes");
            return likes;
        });
    };
    LikeProvider.prototype.addSuperLike = function (uid, interlocutor) {
        var endpoint = this.af.database.object("/users/" + uid + "/superLikes/" + interlocutor);
        endpoint.set(true);
    };
    return LikeProvider;
}());
LikeProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AngularFire, UserProvider])
], LikeProvider);
export { LikeProvider };
//# sourceMappingURL=like-provider.js.map