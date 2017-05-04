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
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import { ChurchPage } from '../church/church';
import { AlertController } from 'ionic-angular';
/*
  Generated class for the Areas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AreasPage = (function () {
    function AreasPage(nav, af, auth, userProvider, util, storage, alertCtrl) {
        this.nav = nav;
        this.af = af;
        this.auth = auth;
        this.userProvider = userProvider;
        this.util = util;
        this.storage = storage;
        this.alertCtrl = alertCtrl;
        this.places = [];
    }
    AreasPage.prototype.ionViewDidLoad = function () {
    };
    AreasPage.prototype.next = function () {
        // this.places = [];
        // if(this.atticaStatus){
        //   this.places.push("Attica");
        // }
        // if(this.pelopenneseStatus){
        //   this.places.push("Peloponnese");
        // }
        // if(this.eviaStatus){
        //   this.places.push("Evia");
        // }
        // if(this.stereaElladaStatus){
        //   this.places.push("Sterea Ellada");
        // }
        // if(this.thessalyStatus){
        //   this.places.push("Thessaly");
        // }
        // if(this.epirusStatus){
        //   this.places.push("Epirus");
        // }
        // if(this.macedoniaStatus){
        //   this.places.push("Macedonia");
        // }
        // if(this.eptanisaStatus){
        //   this.places.push("Eptanisa");
        // }
        // if(this.dodekanisaStatus){
        //   this.places.push("Dodekanisa");
        // }
        // if(this.kykladesStatus){
        //   this.places.push("Kyklades");
        // }
        // if(this.sporadesStatus){
        //   this.places.push("Sporades");
        // }
        // if(this.creteStatus){
        //   this.places.push("Crete");
        // }
        this.storage.set('areas', this.places);
        this.writeUserData();
        this.nav.push(ChurchPage);
    };
    AreasPage.prototype.showCheckbox = function () {
        var _this = this;
        this.places = [];
        var alert = this.alertCtrl.create();
        alert.setTitle('Select the areas where your family comes from, if you wish.');
        alert.addInput({
            type: 'checkbox',
            label: 'Central Greece',
            value: 'Central Greece'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Thessalia',
            value: 'Thessalia'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Macedonia',
            value: 'Macedonia'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Epirus',
            value: 'Epirus'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Chalkidiki',
            value: 'Chalkidiki'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Thraki',
            value: 'Thraki'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Sporades Islands',
            value: 'Sporades Islands'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'NE Aegean Islands',
            value: 'NE Aegean Islands'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Dodecanese Islands',
            value: 'Dodecanese Islands'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Cyclades Islands',
            value: 'Cyclades Islands'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Crete Island',
            value: 'Crete Island'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Saronic Islands',
            value: 'Saronic Islands'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Peloponnese',
            value: 'Peloponnese'
        });
        alert.addInput({
            type: 'checkbox',
            label: 'Ionian Islands',
            value: 'Ionian Islands'
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'Okay',
            handler: function (data) {
                _this.places = data;
            }
        });
        alert.present();
    };
    AreasPage.prototype.writeUserData = function () {
        var _this = this;
        var areasChosen;
        this.storage.get('areas').then(function (areas) {
            areasChosen = areas;
        });
        this.userProvider.getUid().then(function (uid) {
            var currentUserRef = _this.af.database.object("/users/" + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    areas: areasChosen
                });
            }
        });
    };
    return AreasPage;
}());
AreasPage = __decorate([
    Component({
        selector: 'page-areas',
        templateUrl: 'areas.html'
    }),
    __metadata("design:paramtypes", [NavController,
        AngularFire,
        AuthProvider,
        UserProvider,
        UtilProvider,
        Storage,
        AlertController])
], AreasPage);
export { AreasPage };
//# sourceMappingURL=areas.js.map