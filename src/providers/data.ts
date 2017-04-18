import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

@Injectable()
export class Data {
  userEmail: string;
  userName: string;
  userPicture: string;

  constructor(public storage: Storage) {
    
  }

  getData(): Promise<any> {
    return this.storage.get('photos');
  }
  save(data): void {
    let newData = JSON.stringify(data); 
    this.storage.set('photos', newData);
  }
}
