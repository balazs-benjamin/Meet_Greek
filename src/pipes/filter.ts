import { Injectable, Pipe } from '@angular/core';

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
