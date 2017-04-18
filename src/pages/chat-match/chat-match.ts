import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/map';
import { ChatViewPage }  from '../chat-view/chat-view';
import { MatchPage } from '../match/match';


@Component({
  selector: 'page-chat-match',
  templateUrl: 'chat-match.html'
})
export class ChatMatchPage {
  everythingLoaded = false;
  chats:Observable<any[]>;
  users:Observable<any[]>;
  uid:string;
  searchQuery: string = '';
  userChats:Observable<any[]>;
  chatsKeys = [];
  constructor(
    public chatsProvider: ChatsProvider, 
    public userProvider: UserProvider, 
    public af:AngularFire, 
    public nav: NavController,
    public modalCtrl: ModalController) {
    // this.initializeItems();
    // this.initializeItems2();
    this.chatsProvider.getChats()
      .then(chats => {
          this.chats = chats.map(users => {
              return users.map(user => {
                  user.info = this.af.database.object(`/users/${user.$key}`);
                  return user;
              });
          });
      });
    this.userProvider.getUid()
    .then(uid => {
        this.uid = uid;
        this.users = this.userProvider.getAllUsers();
        this.userChats = this.chatsProvider.getUserChats(uid);
        this.addToChatsArray();
    });
    // this.userProvider.getUid()
    //   .then(uid => {
    //       this.uid = uid;
    //       this.users = this.userProvider.getAllUsers();
    //   });
  }

  ionViewDidLoad() {
    
  }

  addToChatsArray(): void {
    this.userChats.subscribe(chats => {
        this.chatsKeys = [];
        // items is an array
        chats.forEach(chat => {
          //console.log(item.$key);
            this.chatsKeys.push(chat.$key);
        });
        this.everythingLoaded = true;
    });
  }

  openChat(key) {
      this.userProvider.getUid()
      .then(uid => {
          let param = {uid: uid, interlocutor: key};
          this.nav.push(ChatViewPage,param);
      });   
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    // this.initializeItems();
    // this.initializeItems2();
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      // this.users = this.users.filter((user) => {
      //   return (user.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })
      // this.items2 = this.items2.filter((item) => {
      //   return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })
    }
  }

  match(other_key): void {
    let param = null;
    param = {interlocutor: other_key};
    //let param = {uid: "this uid", interlocutor: "other user key"};
    let matchModal = this.modalCtrl.create(MatchPage, param);
      // matchModal.onDidDismiss(data => {
      //   if(data.foo == 'bar1'){
      //     this.goToNextUser();
      //   }
      //   this.buttonDisabled = null;
      // });
    matchModal.present();
  }

  shouldShowCancel(): void {

  }

}
