import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the Filter pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'filter'
})
@Injectable()
export class Filter {
  transform(users: Array<any[]>, uid: String): Array<any[]> {
    function filterByID(user) {
      if (user.$key != Number(uid)) {
        return true;
      } 
    }
    return users.filter(filterByID);
  }
}
