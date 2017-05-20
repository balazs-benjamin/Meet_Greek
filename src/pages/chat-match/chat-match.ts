import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { AngularFire } from 'angularfire2';
import 'rxjs/add/operator/map';

import { UserProvider } from '../../providers/user-provider/user-provider';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { LikeProvider } from '../../providers/like-provider/like-provider';

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
    matchedUsers:any[] = [];
    chatMessages:any[] = [];
    uid:string;
    searchQuery: string = '';
    searchInput: string = '';
    userChats:Observable<any[]>;
    userMatches:Observable<any[]>;
    chatsKeys = [];
    chatsCat = {};


    constructor(
        public af:AngularFire, 
        public nav: NavController,
        public likeProvider: LikeProvider,
        public modalCtrl: ModalController, 
        public userProvider: UserProvider, 
        public chatsProvider: ChatsProvider, 
        private alertCtrl: AlertController,
        public loadingCtrl: LoadingController) {

        console.log("ChatMatchPage");

        this.userProvider.getUid()
        .then(uid => {
            this.uid = uid;
            this.userProvider.getAllUsers().subscribe(users => {
              console.log("ChatMatchPage users: ", users);
              this.users = users;
            });

            this.getUserMatches();
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
            this.chatUsers = []
            this.chatUsersFiltered = [];

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

    getUserMatches(): void {
        console.log("ChatMatchPage::getUserMatches()");
        this.likeProvider.getUserMatches(this.uid).subscribe( matches => {
            console.log("ChatMatchPage::getUserMatches()");

            this.matchedUsers = [];

            matches.forEach(match => {
                
                // get users
                this.af.database.object(`/users/${match.$key}`).take(1)
                .subscribe(user => {
                      
                    console.log("got matched user ", user);
                    this.matchedUsers.push( user );
                    // this.chatUsersFiltered.push( user );
                })
            });

            // this.everythingLoaded = true;
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


    deleteConversation(key){
        console.log("ChatMatchPage::deleteConversation", key);
        let prompt = this.alertCtrl.create({
            title:"Are you sure?",
            message: "Please confirm delete conversation.",
            buttons:[
            {
                text: 'Cancel'
            },
            {
                text: 'Delete',
                handler: data => {
                    let loading = this.loadingCtrl.create({ 
                        content: 'Deleting conversation...' 
                    });
                    loading.present();

                    this.userProvider.getUid()
                    .then(uid => {

                        // remove last chats from user 
                        this.chatsProvider.removeLastChats(uid, key);

                        // remove all conversations
                        this.chatsProvider.getChatRef(uid, key)
                        .then((chatRef:any) => {
                            
                            let chats = this.af.database.list(chatRef);
                            chats.remove().then(()=>{
                                console.log("ChatMatchPage conversation removed" );
                                loading.dismiss();
                            }, (err) => {
                                loading.dismiss();
                            });
                            
                        }, (err)=> {
                            loading.dismiss();
                        });
                        
                    });
                }
            }]
        });
        prompt.present();
    }

    shouldShowCancel(): void {}

}
