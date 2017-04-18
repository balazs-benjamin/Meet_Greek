import { Pipe } from '@angular/core';
@Pipe({
  name: 'convertDistance'
})
export class ConvertDistance {
  p1 = {};
  p2 = {};
  result: any;
  transform(value, args) {
    this.p1 = {lat: args[0], lng: args[1]};
    this.p2 = {lat: args[2], lng: args[3]};
    this.result = this.getDistance(this.p1, this.p2);
    this.result = ((this.result*0.001)*0.621371192).toFixed();
    
    if(this.result == 1) {
      return this.result + "mile";
    }
    return this.result + " miles";
  }

  rad(x) {
    return x * Math.PI / 180;
  }
  
  getDistance(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(p2.lat - p1.lat);
    var dLong = this.rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }
}
