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
import { Storage } from '@ionic/storage';
import { Camera } from 'ionic-native';
var UserProvider = (function () {
    function UserProvider(af, local) {
        this.af = af;
        this.local = local;
    }
    // Get Current User's UID
    UserProvider.prototype.getUid = function () {
        return this.local.get('uid');
    };
    // Create User in Firebase
    UserProvider.prototype.createUser = function (userCredentails, uid) {
        var currentUserRef = this.af.database.object('/users/' + uid);
        console.log(userCredentails);
        currentUserRef.set({ email: userCredentails.email });
    };
    // Get Info of Single User
    UserProvider.prototype.getUser = function () {
        var _this = this;
        // Getting UID of Logged In User
        return this.getUid().then(function (uid) {
            return _this.af.database.object('/users/' + uid);
        });
    };
    UserProvider.prototype.getUserInterlocutor = function (interlocutorUid) {
        var _this = this;
        // Getting UID of Logged In User
        return this.getUid().then(function (uid) {
            return _this.af.database.object('/users/' + interlocutorUid);
        });
    };
    // Get All Users of App
    UserProvider.prototype.getAllUsers = function () {
        return this.af.database.list('/users', { query: {
                orderByChild: 'discoverable',
                equalTo: true
            }
        });
    };
    UserProvider.prototype.getAllUsersKeys = function () {
        var i = this.af.database.object('/users', { preserveSnapshot: true });
        i.subscribe(function (snapshot) { });
    };
    UserProvider.prototype.getAllUsersExcept = function () {
        return this.af.database.list('/users');
    };
    // Get base64 Picture of User
    UserProvider.prototype.getPicture = function () {
        var base64Picture;
        var options = {
            destinationType: 0,
            sourceType: 0,
            encodingType: 0
        };
        var promise = new Promise(function (resolve, reject) {
            Camera.getPicture(options).then(function (imageData) {
                base64Picture = "data:image/jpeg;base64," + imageData;
                resolve(base64Picture);
            }, function (error) {
                reject(error);
            });
        });
        return promise;
    };
    UserProvider.prototype.updateUserProfile = function (uid, property, value) {
        console.log("updateUserProfile ", uid, property, value);
        if (uid != undefined) {
            this.af.database.object("/users/" + uid + "/" + property).set(value).then(function (_) {
                console.log("updateUserProfile complete", _);
            }, function (err) {
                console.log("updateUserProfile", err);
            });
        }
    };
    // Update Provide Picture of User
    UserProvider.prototype.updatePicture = function () {
        var _this = this;
        this.getUid().then(function (uid) {
            var pictureRef = _this.af.database.object('/users/' + uid + '/picture');
            _this.getPicture()
                .then(function (image) {
                pictureRef.set(image);
            });
        });
    };
    // upload profile picture
    UserProvider.prototype.uploadPicture = function (file) {
        return this.getUid()
            .then(function (uid) {
            var promise = new Promise(function (res, rej) {
                var fileName = uid + '.jpg';
                var pictureRef = firebase.storage().ref('/profile/' + fileName);
                var uploadTask = pictureRef.put(file);
                uploadTask.on('state_changed', function (snapshot) {
                }, function (error) {
                    rej(error);
                }, function () {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    res(downloadURL);
                });
            });
            return promise;
        });
    };
    return UserProvider;
}());
UserProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AngularFire, Storage])
], UserProvider);
export { UserProvider };
//# sourceMappingURL=user-provider.js.map