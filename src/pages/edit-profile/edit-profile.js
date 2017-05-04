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
import { NavController, AlertController, Platform, ModalController, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { PhotoModel } from '../../models/photo-model';
import { SimpleAlert } from '../../providers/simple-alert';
import { Camera, File } from 'ionic-native';
import { Data } from '../../providers/data';
import firebase from 'firebase';
import { AngularFire } from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
import { Facebook } from 'ionic-native';
import { UtilProvider } from '../../providers/utils';
var EditProfilePage = (function () {
    function EditProfilePage(userProvider, af, navCtrl, dataService, platform, simpleAlert, modalCtrl, alertCtrl, storage, actionSheetCtrl, toastCtrl, util, loadingCtrl) {
        var _this = this;
        this.userProvider = userProvider;
        this.af = af;
        this.navCtrl = navCtrl;
        this.dataService = dataService;
        this.platform = platform;
        this.simpleAlert = simpleAlert;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.actionSheetCtrl = actionSheetCtrl;
        this.toastCtrl = toastCtrl;
        this.util = util;
        this.loadingCtrl = loadingCtrl;
        this.loadedEdit = false;
        this.photos = [];
        this.storageRef = firebase.storage().ref();
        this.userPhotos = [];
        this.test = [];
        this.maxPhotos = false;
        this.isYes = false;
        this.isFather = false;
        this.isMother = false;
        this.isNo = false;
        this.user = {};
        this.checkPhotos();
        this.userProvider.getUser().then(function (userObservable) {
            userObservable.subscribe(function (user) {
                _this.user = user;
                _this.loadedEdit = true;
                _this.msg = user.aboutMe;
                _this.gender = _this.user.gender;
            });
        });
    }
    EditProfilePage.prototype.ionViewDidLoad = function () {
        // Uncomment to use test data 
        /*this.photos = [
          new PhotoModel('http://placehold.it/100x100'),
          new PhotoModel('http://placehold.it/100x100'),
          new PhotoModel('http://placehold.it/100x100')
          ]*/
        this.platform.ready().then(function () {
            // this.loadPhotos();
        });
    };
    EditProfilePage.prototype.presentActionSheet = function (file_uri) {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: 'Edit gallery',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: function () {
                        _this.deleteImage(file_uri);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                    }
                }
            ]
        });
        actionSheet.present();
    };
    EditProfilePage.prototype.cameraActionSheet = function () {
        var _this = this;
        var cameraSheet = this.actionSheetCtrl.create({
            title: 'Add picture',
            buttons: [
                {
                    text: 'From Camera',
                    handler: function () {
                        _this.takePhoto2();
                    }
                }, {
                    text: 'From Gallery',
                    handler: function () {
                        _this.takePhoto3();
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                    }
                }
            ]
        });
        cameraSheet.present();
    };
    EditProfilePage.prototype.loadPhotos = function () {
        var _this = this;
        this.dataService.getData().then(function (photos) {
            var savedPhotos = false;
            if (typeof (photos) != "undefined") {
                savedPhotos = JSON.parse(photos);
            }
            if (savedPhotos) {
                savedPhotos.forEach(function (savedPhoto) {
                    _this.photos.push(new PhotoModel(savedPhoto.image));
                });
            }
            _this.loadedEdit = true;
        });
    };
    EditProfilePage.prototype.createPhoto = function (photo) {
        var newPhoto = new PhotoModel(photo);
        this.photos.push(newPhoto);
        this.save();
    };
    EditProfilePage.prototype.takePhoto = function () {
        var _this = this;
        if (!this.loadedEdit) {
            return false;
        }
        if (!this.platform.is('cordova')) {
            console.log("You can only take photos on a device!");
            return false;
        }
        var options = {
            quality: 100,
            destinationType: 1,
            encodingType: 0,
            cameraDirection: 1,
            saveToPhotoAlbum: true //save a copy to the users photo album as well
        };
        Camera.getPicture(options).then(function (imageData) {
            return function (imagePath) {
                //Grab the file name
                var currentName = imagePath.replace(/^.*[\\\/]/, '');
                //Create a new file name
                var d = new Date(), n = d.getTime(), newFileName = n + ".jpg";
                if (_this.platform.is('ios')) {
                    //Move the file to permanent storage
                    File.moveFile(cordova.file.tempDirectory, currentName, cordova.file.dataDirectory, newFileName).then(function (success) {
                        _this.createPhoto(success.nativeURL);
                        _this.uploadPicture(imagePath);
                        _this.sharePhoto(success.nativeURL);
                    }, function (err) {
                        console.log(err);
                        var alert = _this.simpleAlert.createAlert('Oops!', 'Somethingwent wrong.');
                        alert.present();
                    });
                }
                else {
                    _this.createPhoto(imagePath);
                    _this.uploadPicture(imagePath);
                    _this.sharePhoto(imagePath);
                }
            };
        }, function (err) {
            var alert = _this.simpleAlert.createAlert('Oops!', 'Something went wrong.');
            alert.present();
        });
    };
    EditProfilePage.prototype.takePhoto2 = function () {
        var _this = this;
        if (this.loadedEdit) {
            // if(this.maxPhotos == false){
            Camera.getPicture({
                quality: 95,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: true
            }).then(function (imageData) {
                _this.uploadPicture(imageData);
            }, function (error) {
                console.log("ERROR -> " + JSON.stringify(error));
            });
        }
    };
    EditProfilePage.prototype.takePhoto3 = function () {
        var _this = this;
        if (this.loadedEdit) {
            // if(this.maxPhotos == false){
            Camera.getPicture({
                quality: 95,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: false
            }).then(function (imageData) {
                _this.uploadPicture(imageData);
            }, function (error) {
                console.log("ERROR -> " + JSON.stringify(error));
            });
        }
    };
    EditProfilePage.prototype.deleteImage = function (photo) {
        var _this = this;
        var storage = firebase.storage();
        var httpsReference = storage.refFromURL(photo);
        var photosLeft = [];
        photosLeft.length = 0;
        httpsReference.delete().then(function () {
            // File deleted successfully
        }).catch(function (error) {
            // Uh-oh, an error occurred!
        });
        this.storage.get('images').then(function (photos) {
            for (var _i = 0, photos_1 = photos; _i < photos_1.length; _i++) {
                var ph = photos_1[_i];
                if (ph != photo) {
                    photosLeft.push(ph);
                }
            }
            _this.storage.set('images', photosLeft);
            _this.writeUserData();
        });
    };
    EditProfilePage.prototype.removePhoto = function (photo) {
        var index = this.photos.indexOf(photo);
        if (index > -1) {
            this.photos.splice(index, 1);
        }
    };
    EditProfilePage.prototype.sharePhoto = function (image) {
    };
    EditProfilePage.prototype.save = function () {
        this.dataService.save(this.photos);
    };
    EditProfilePage.prototype.uploadPicture = function (newFile) {
        var _this = this;
        var d = new Date(), n = d.getTime(), newFileName = n + ".jpeg";
        this.userProvider.getUid().then(function (uid) {
            _this.userPhotos.length = 0;
            _this.storageRef.child('images/' + uid + '/' + newFileName).putString(newFile, 'base64', { contentType: 'image/jpeg' }).then(function (savedPicture) {
                _this.storage.get('images').then(function (photos) {
                    if (!photos) {
                        _this.userPhotos.push(savedPicture.downloadURL);
                    }
                    else {
                        for (var _i = 0, photos_2 = photos; _i < photos_2.length; _i++) {
                            var photo = photos_2[_i];
                            _this.userPhotos.push(photo);
                        }
                        _this.userPhotos.push(savedPicture.downloadURL);
                    }
                    _this.storage.set('images', _this.userPhotos);
                    _this.writeUserData();
                });
            });
        });
    };
    EditProfilePage.prototype.writeUserData = function () {
        var _this = this;
        if (!this.maxPhotos) {
            this.checkPhotos();
        }
        var photosChosen = [];
        photosChosen.length = 0;
        this.storage.get('images').then(function (photo) {
            for (var _i = 0, photo_1 = photo; _i < photo_1.length; _i++) {
                var ph = photo_1[_i];
                photosChosen.push(ph);
            }
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object('/users/' + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    images: photosChosen
                });
            }
            if (_this.maxPhotos) {
                _this.checkPhotos();
            }
        });
    };
    EditProfilePage.prototype.checkPhotos = function () {
        var _this = this;
        this.storage.get('images').then(function (photo) {
            if (photo) {
                if (photo.length == 6) {
                    _this.maxPhotos = true;
                }
                else {
                    _this.maxPhotos = false;
                }
            }
            else {
                _this.maxPhotos = false;
            }
        });
    };
    EditProfilePage.prototype.done = function () {
        if (this.user.gender != undefined || this.user.gender != "") {
            this.user.aboutMe = this.msg;
            this.storage.set('descent', this.user.descent);
            this.storage.set('areas', this.user.areas);
            this.storage.set('gender', this.gender);
            this.storage.set('aboutMe', this.user.aboutMe);
            this.writeUserDataDone();
            this.navCtrl.setRoot(SettingsPage);
        }
        else {
            this.presentToast();
        }
    };
    EditProfilePage.prototype.writeUserDataDone = function () {
        var _this = this;
        var userDescent;
        this.storage.get('descent').then(function (descent) {
            userDescent = descent;
        });
        var areasChosen;
        this.storage.get('areas').then(function (areas) {
            areasChosen = areas;
        });
        var userGender;
        this.storage.get('gender').then(function (gender) {
            userGender = gender;
        });
        var userAboutMe;
        this.storage.get('aboutMe').then(function (aboutMe) {
            userAboutMe = aboutMe;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object('/users/' + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    descent: userDescent,
                    areas: areasChosen,
                    gender: userGender,
                    aboutMe: userAboutMe
                });
            }
        });
    };
    EditProfilePage.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Need more info!',
            cssClass: "toast-success",
            duration: 2000,
            position: 'middle'
        });
        toast.present();
    };
    EditProfilePage.prototype.showDescent = function () {
        var _this = this;
        this.checkPreviousDescent();
        var alert = this.alertCtrl.create();
        alert.setTitle('Are you of Greek Descent?');
        alert.addInput({
            type: 'radio',
            label: 'Yes',
            value: 'Yes',
            checked: true ? this.isYes : false
        });
        alert.addInput({
            type: 'radio',
            label: 'Yes, Mother’s Side',
            value: 'Yes, Mother’s Side',
            checked: true ? this.isMother : false
        });
        alert.addInput({
            type: 'radio',
            label: 'Yes, Father’s Side',
            value: 'Yes, Father’s Side',
            checked: true ? this.isFather : false
        });
        alert.addInput({
            type: 'radio',
            label: 'No, just here for the lamb',
            value: 'No, just here for the lamb',
            checked: true ? this.isNo : false
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: function (data) {
                _this.user.descent = data;
            }
        });
        alert.present();
    };
    EditProfilePage.prototype.checkPreviousDescent = function () {
        if (this.user.descent == "Yes") {
            this.isYes = true;
            this.isMother = false;
            this.isFather = false;
            this.isNo = false;
        }
        else if (this.user.descent == "Yes, Mother’s Side") {
            this.isYes = false;
            this.isMother = true;
            this.isFather = false;
            this.isNo = false;
        }
        else if (this.user.descent == "Yes, Father’s Side") {
            this.isYes = false;
            this.isMother = false;
            this.isFather = true;
            this.isNo = false;
        }
        else if (this.user.descent == "No, just here for the lamb") {
            this.isYes = false;
            this.isMother = false;
            this.isFather = false;
            this.isNo = true;
        }
    };
    EditProfilePage.prototype.showAreas = function () {
        var _this = this;
        var alert = this.alertCtrl.create();
        alert.setTitle('Select the areas where your family comes from, if you wish.');
        alert.addInput({
            type: 'checkbox',
            label: 'Central Greece',
            value: 'Central Greece',
            checked: true ? (this.user.areas).indexOf('Central Greece') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Thessalia',
            value: 'Thessalia',
            checked: true ? (this.user.areas).indexOf('Thessalia') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Macedonia',
            value: 'Macedonia',
            checked: true ? (this.user.areas).indexOf('Macedonia') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Epirus',
            value: 'Epirus',
            checked: true ? (this.user.areas).indexOf('Epirus') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Chalkidiki',
            value: 'Chalkidiki',
            checked: true ? (this.user.areas).indexOf('Chalkidiki') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Thraki',
            value: 'Thraki',
            checked: true ? (this.user.areas).indexOf('Thraki') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Sporades Islands',
            value: 'Sporades Islands',
            checked: true ? (this.user.areas).indexOf('Sporades Islands') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'NE Aegean Islands',
            value: 'NE Aegean Islands',
            checked: true ? (this.user.areas).indexOf('NE Aegean Islands') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Dodecanese Islands',
            value: 'Dodecanese Islands',
            checked: true ? (this.user.areas).indexOf('Dodecanese Islands') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Cyclades Islands',
            value: 'Cyclades Islands',
            checked: true ? (this.user.areas).indexOf('Cyclades Islands') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Crete Island',
            value: 'Crete Island',
            checked: true ? (this.user.areas).indexOf('Crete Island') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Saronic Islands',
            value: 'Saronic Islands',
            checked: true ? (this.user.areas).indexOf('Saronic Islands') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Peloponnese',
            value: 'Peloponnese',
            checked: true ? (this.user.areas).indexOf('Peloponnese') >= 0 : false
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Ionian Islands',
            value: 'Ionian Islands',
            checked: true ? (this.user.areas).indexOf('Ionian Islands') >= 0 : false
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: function (data) {
                _this.user.areas = data;
            }
        });
        alert.present();
    };
    EditProfilePage.prototype.updateFacebook = function () {
        var _this = this;
        this.loading = this.loadingCtrl.create({
            content: 'Updating Profile from Facebook...'
        });
        this.loading.present();
        Facebook.api('/me?fields=id,name,picture.width(500).height(500),email', ['public_profile']).then(function (response) {
            _this.storage.set('username', response.name);
            _this.storage.set('profile_picture', response.picture);
            _this.storage.set('email', response.email);
            _this.updateUserData(response);
            //THIS CHECK
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: response.name,
                photoURL: response.picture.data.url
            }).then(function () {
                var alert = this.util.doAlert("Error user", user.displayName, "Ok");
                alert.present();
            }, function (error) {
                // An error happened.
            });
            // this.menu.enable(true);
            _this.loading.dismiss();
        }, function (err) {
            console.log(err);
            // let alert = this.doAlert.create({
            //   title: 'Oops!',
            //   subTitle: 'Something went wrong, please try again later.',
            //   buttons: ['Ok']
            // });
            var alert = _this.util.doAlert("Error", err.message, "Ok");
            _this.loading.dismiss();
            alert.present();
        });
    };
    EditProfilePage.prototype.updateUserData = function (response) {
        var _this = this;
        var userName;
        var userEmail;
        var userProfilePicture;
        this.storage.get('email').then(function (email) {
            userEmail = email;
        });
        this.storage.get('profile_picture').then(function (profile_picture) {
            userProfilePicture = profile_picture.data.url;
            // this.storage.get('images').then(photos => {
            //     if(photos){
            //         for (let photo of photos) {
            //             userImages.push(photo);
            //         }
            //     this.storage.set('images', userImages);
            //     }else {
            //         userImages.push(profile_picture.data.url);
            //         this.storage.set('images', userImages);
            //     }
            // });
        });
        this.storage.get('username').then(function (username) {
            userName = username;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object("/users/" + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    email: userEmail,
                    username: userName,
                    profile_picture: userProfilePicture
                    // images: userImages
                });
            }
        });
    };
    return EditProfilePage;
}());
EditProfilePage = __decorate([
    Component({
        selector: 'page-edit-profile',
        templateUrl: 'edit-profile.html'
    }),
    __metadata("design:paramtypes", [UserProvider,
        AngularFire,
        NavController,
        Data,
        Platform,
        SimpleAlert,
        ModalController,
        AlertController,
        Storage,
        ActionSheetController,
        ToastController,
        UtilProvider,
        LoadingController])
], EditProfilePage);
export { EditProfilePage };
//# sourceMappingURL=edit-profile.js.map