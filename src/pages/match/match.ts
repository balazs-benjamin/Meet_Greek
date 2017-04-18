import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ViewController } from 'ionic-angular';
import { ChatViewPage } from '../chat-view/chat-view';



@Component({
  selector: 'page-match',
  templateUrl: 'match.html'
})
export class MatchPage {
  uid:string;
  interlocutor:string;
  user = { username: "", userImage0: "" };
  constructor(
    public nav: NavController,
    public viewCtrl: ViewController, 
    params:NavParams,
    public userProvider: UserProvider) {
      this.interlocutor = params.data.interlocutor;
      this.userProvider.getUserInterlocutor(this.interlocutor).then(userObservable => {
      userObservable.subscribe(user => {
        this.user = user;
      });
    });
    }

  ionViewDidLoad() {
    
  }

  ngOnInit() {
        this.userProvider.getUid()
        .then(uid => {
            this.uid = uid;
        });
    };

  goBack(): void {
    this.viewCtrl.dismiss();
  }


  openChat(key) {
        let param = {uid: this.uid, interlocutor: key};
        this.nav.push(ChatViewPage,param);
    }
}
