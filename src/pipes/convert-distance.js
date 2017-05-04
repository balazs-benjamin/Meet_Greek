var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
var ConvertDistance = (function () {
    function ConvertDistance() {
        this.p1 = {};
        this.p2 = {};
    }
    ConvertDistance.prototype.transform = function (value, args) {
        this.p1 = { lat: args[0], lng: args[1] };
        this.p2 = { lat: args[2], lng: args[3] };
        this.result = this.getDistance(this.p1, this.p2);
        this.result = ((this.result * 0.001) * 0.621371192).toFixed();
        if (this.result == 1) {
            return this.result + "mile";
        }
        return this.result + " miles";
    };
    ConvertDistance.prototype.rad = function (x) {
        return x * Math.PI / 180;
    };
    ConvertDistance.prototype.getDistance = function (p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = this.rad(p2.lat - p1.lat);
        var dLong = this.rad(p2.lng - p1.lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };
    return ConvertDistance;
}());
ConvertDistance = __decorate([
    Pipe({
        name: 'convertDistance'
    })
], ConvertDistance);
export { ConvertDistance };
//# sourceMappingURL=convert-distance.js.map