import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Platform, ModalController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ChatsProvider } from '../../providers/chats-provider/chats-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ExtendedProfilePage } from '../extended-profile/extended-profile';

@Component({
  selector: 'page-chat-view',
  templateUrl: 'chat-view.html',
})
export class ChatViewPage {
  interlocutorProfile = <any>{};
  message: string;
  uid:string;
  interlocutor:string;
  chats:FirebaseListObservable<any>;  
  @ViewChild(Content) content: Content;
  constructor(public nav:NavController, 
  params:NavParams, 
  public chatsProvider:ChatsProvider, 
  public af:AngularFire, 
  public userProvider:UserProvider,
  public platform: Platform,
  public modalCtrl: ModalController) {
    this.uid = params.data.uid;
    this.interlocutor = params.data.interlocutor;
    
    // Get Chat Reference
    chatsProvider.getChatRef(this.uid, this.interlocutor)
    .then((chatRef:any) => {  
        this.chats = this.af.database.list(chatRef);
    });
    this.userProvider.getUserInterlocutor(this.interlocutor).then(userObservable => {
      userObservable.subscribe(user => {
        this.interlocutorProfile = user;
      });
    });
  }

  ionViewDidEnter() {
    // this.platform.ready().then(() => {
    //   Keyboard.disableScroll(true);
    // });
    this.content.scrollToBottom();
}

ionViewWillLeave() {
    // this.platform.ready().then(() => {
    //   Keyboard.disableScroll(false);
    // });
}

    showProfile(): void {
        let param = null;
        param = {uid: this.uid, interlocutor: this.interlocutor};   
        //let param = {uid: "this uid", interlocutor: "other user key"};
        let extendedProfileModal = this.modalCtrl.create(ExtendedProfilePage, param);
        extendedProfileModal.onDidDismiss(data => {
            if(data.foo == 'bar1'){
            
            }
            
        });
    extendedProfileModal.present();
    
    }

  sendMessage() {
      if(this.message) {
          let sent = this.formatLocalDate();
          let chat = {
              from: this.uid,
              message: this.message,
              createdAt: sent,
              type: 'message'
          };
          this.chats.push(chat);
          this.message = "";
      }
  };
  
  sendPicture() {
      let sent = this.formatLocalDate();
      let chat = {from: this.uid, createdAt: sent, type: 'picture', picture:null};
      this.userProvider.getPicture()
      .then((image) => {
          chat.picture =  image;
          this.chats.push(chat);
      });
  }

  formatLocalDate() {
    var now = new Date(),
        tzo = -now.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return now.getFullYear() 
        + '-' + pad(now.getMonth()+1)
        + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours())
        + ':' + pad(now.getMinutes()) 
        + ':' + pad(now.getSeconds()) 
        + dif + pad(tzo / 60) 
        + ':' + pad(tzo % 60);
  }
}
