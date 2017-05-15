import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { UserProvider } from '../user-provider/user-provider';

@Injectable()
export class ChatsProvider {
    constructor(public af: AngularFire, public up: UserProvider) {}

    // get list of Chats of a Logged In User
    getChats() {
        return this.up.getUid().then(uid => {
            console.log("::getChats", uid);
            let chats = this.af.database.list('/users/' + uid + '/chats');
            return chats;
        });
    }

    getUserChats(uid) {

        console.log("::getUserChats", uid);
        return this.af.database.list('/users/' + uid + '/chats', {query: {
          orderByChild:'createdAt'  
        }}).map( (array) => array.reverse());
    }
  
  // Add Chat References to Both users
  /*
  addChats(uid, interlocutor) {
      let endpoint = this.af.database.object('/users/' + uid + '/chats/' + interlocutor);
      endpoint.set(true);      
  }*/

    lastChats(uid, interlocutor, chat) {
        let endpoint1 = this.af.database.object('/users/' + uid + '/chats/' + interlocutor);
        endpoint1.set(chat);

        let endpoint2 = this.af.database.object('/users/' + interlocutor + '/chats/' + uid);
        endpoint2.set(chat);
    }

    removeLastChats(uid, interlocutor) {
        let endpoint1 = this.af.database.object('/users/' + uid + '/chats/' + interlocutor);
        endpoint1.remove();

        let endpoint2 = this.af.database.object('/users/' + interlocutor + '/chats/' + uid);
        endpoint2.remove();
    }

    getChatRef(uid, interlocutor) {
        console.log("::getChatRef", uid, interlocutor);

        let firstRef = this.af.database.object('/chats/' + uid + ',' + interlocutor, {preserveSnapshot:true});
        let promise = new Promise((resolve, reject) => {
            firstRef.subscribe(snapshot => {
                let a = snapshot.exists();
                if(a) {
                    resolve('/chats/' +uid+','+interlocutor);
                } else {
                    let secondRef = this.af.database.object('/chats/' + interlocutor + ',' + uid, {preserveSnapshot:true});
                    secondRef.subscribe(snapshot => {
                        let b = snapshot.exists();
                        if(!b) {
                            this.lastChats(uid, interlocutor, {});
                        }
                    });
                    resolve('/chats/'+interlocutor+','+uid);
                }
            });
        });

        return promise;
    }

    
}

