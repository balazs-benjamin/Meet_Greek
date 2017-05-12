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
  // chats:Observable<any[]>;
  users:any[];
  chatUsersFiltered:any[] = [];
  chatUsers:any[] = [];
  chatMessages:any[] = [];
  uid:string;
  searchQuery: string = '';
  searchInput: string = '';
  userChats:Observable<any[]>;
  chatsKeys = [];
  chatsCat = {};


  constructor(
    public chatsProvider: ChatsProvider, 
    public userProvider: UserProvider, 
    public af:AngularFire, 
    public nav: NavController,
    public modalCtrl: ModalController) {

    console.log("ChatMatchPage");
/*
    this.chatsProvider.getChats()
      .then(chats => {
        
        this.chats = chats.map(users => {
            return users.map(user => {
                user.info = this.af.database.object(`/users/${user.$key}`);
                return user;
            });
        });
      });
      */

    this.userProvider.getUid()
    .then(uid => {
        this.uid = uid;
        this.userProvider.getAllUsers().subscribe(users => {
          console.log("ChatMatchPage users: ", users);
          this.users = users;
        });
        this.userChats = this.chatsProvider.getUserChats(uid);
        this.addToChatsArray();
    });
  }

  ionViewDidLoad() {}

  addToChatsArray(): void {
    console.log("ChatMatchPage::addToChatsArray()");

    this.userChats.subscribe(chats => {
        this.chatsKeys = [];
        console.log("ChatMatchPage::addToChatsArray()", chats);

        chats.forEach(chat => {

          this.chatsKeys.push( chat.$key );
          // get users
          this.af.database.object(`/users/${chat.$key}`).take(1)
          .subscribe(user => {
            
            user['lastChat'] = chat;
            
            console.log("got chat user ", user);
            this.chatUsers.push( user );
            this.chatUsersFiltered.push( user );
          })
        });
        
        this.everythingLoaded = true;
    });
  }

  openChat(key) {
    console.log("ChatMatchPage::openChat()", key);

      this.userProvider.getUid()
      .then(uid => {
          let param = {uid: uid, interlocutor: key};
          this.nav.push(ChatViewPage, param);
      });   
  }

  initializeItems(){
    this.chatUsersFiltered = this.chatUsers;
  }

  getItems(ev: any) {
    this.initializeItems();
    
    // let val = ev.target.value;
    let val = this.searchInput.toLowerCase();

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.chatUsersFiltered = this.chatUsers.filter((user:any) => {
        if (user.first_name) {
          return (user.first_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        return false;
      });
      
      // this.users = this.users.filter((user:any) => {
      //   return (user.first_name.indexOf(val.toLowerCase()) > -1);
      // });
      // this.chats = this.chats.filter((item:any) => {
      //   console.log("ChatMatchPage::getItems", val, item);
      //   return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // });
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
