import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import {Camera} from 'ionic-native';

@Injectable()
export class UtilProvider {
    constructor(public AlertCtrl: AlertController) {

    }
    doAlert(title, message, buttonText) {
        console.log(message);
        let alert = this.AlertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [buttonText]
        });
        return alert;
    }

    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')
        [0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab], { type: mimeString });
        return bb;
    }

    // Get Picture
    getPicture(sourceType = 0, allowEdit = true) {
        let base64Picture;
        let options = {
            destinationType: 0,
            sourceType: sourceType,
            encodingType: 0,
            mediaType: 0,
            allowEdit: allowEdit
        };
        let promise = new Promise((resolve, reject) => {
            Camera.getPicture(options).then((imageData) => {
                base64Picture = "data:image/jpeg;base64," + imageData;
                resolve(base64Picture);
            }, (error) => {
                reject(error);
            });
        });
        return promise;
    }

}