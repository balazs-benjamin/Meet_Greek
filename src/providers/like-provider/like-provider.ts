import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { UserProvider } from '../user-provider/user-provider';


@Injectable()
export class LikeProvider {

  constructor(public af: AngularFire, public up: UserProvider) {}

  getLikes() {
     return this.up.getUid().then(uid => {
        let likes = this.af.database.list(`/users/${uid}/likes`);
        return likes;
     });
  }

  getUserLikes(uid) {
      return this.af.database.list(`/users/${uid}/likes`);
  }

  addLike(uid,interlocutor) {
      let endpoint = this.af.database.object(`/users/${uid}/likes/${interlocutor}`);
      endpoint.set(true);
  }

  reject(uid,interlocutor) {
      let endpoint = this.af.database.object(`/users/${uid}/likes/${interlocutor}`);
      endpoint.set(false);
  }

  getSuperLikes() {
     return this.up.getUid().then(uid => {
        let likes = this.af.database.list(`/users/${uid}/superLikes`);
        return likes;
     });
  }

  addSuperLike(uid,interlocutor) {
      let endpoint = this.af.database.object(`/users/${uid}/superLikes/${interlocutor}`);
      endpoint.set(true);
  }


}
