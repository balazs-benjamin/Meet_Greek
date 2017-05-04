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
import { AlertController } from 'ionic-angular';
import { Camera } from 'ionic-native';
var UtilProvider = (function () {
    function UtilProvider(AlertCtrl) {
        this.AlertCtrl = AlertCtrl;
    }
    UtilProvider.prototype.doAlert = function (title, message, buttonText) {
        console.log(message);
        var alert = this.AlertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [buttonText]
        });
        return alert;
    };
    UtilProvider.prototype.dataURItoBlob = function (dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab], { type: mimeString });
        return bb;
    };
    // Get Picture
    UtilProvider.prototype.getPicture = function (sourceType, allowEdit) {
        if (sourceType === void 0) { sourceType = 0; }
        if (allowEdit === void 0) { allowEdit = true; }
        var base64Picture;
        var options = {
            destinationType: 0,
            sourceType: sourceType,
            encodingType: 0,
            mediaType: 0,
            allowEdit: allowEdit
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
    return UtilProvider;
}());
UtilProvider = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AlertController])
], UtilProvider);
export { UtilProvider };
//# sourceMappingURL=utils.js.map