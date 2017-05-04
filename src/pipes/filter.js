var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, Pipe } from '@angular/core';
/*
  Generated class for the Filter pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
var Filter = (function () {
    function Filter() {
    }
    Filter.prototype.transform = function (users, uid) {
        function filterByID(user) {
            if (user.$key != Number(uid)) {
                return true;
            }
        }
        return users.filter(filterByID);
    };
    return Filter;
}());
Filter = __decorate([
    Pipe({
        name: 'filter'
    }),
    Injectable()
], Filter);
export { Filter };
//# sourceMappingURL=filter.js.map