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

  getUserMatches(uid) {
      return this.af.database.list(`/users/${uid}/matched`);
  }

  addLike(uid,interlocutor) {
      let user = this.af.database.object(`/users/${uid}/likes/${interlocutor}`);
      user.set(true);
  }

  addMatch(uid, interlocutor) {
      let user = this.af.database.object(`/users/${uid}/matched/${interlocutor}`);
      user.set(true);
  }

  reject(uid, interlocutor) {
      let user = this.af.database.object(`/users/${uid}/likes/${interlocutor}`);
      user.set(false);
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
