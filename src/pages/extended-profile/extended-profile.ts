import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-extended-profile',
  templateUrl: 'extended-profile.html'
})
export class ExtendedProfilePage {
  data = { 'foo': 'bar' };
  premium = true;
  fromMainPage = true;
  uid:string;
  interlocutor:string;
  slideOptions: any;
  user = { username: "", userImage0: "", aboutMe: "", descent: "", 
  areas: [], church: "", education: "", location: "", images: [] };

  constructor(
    public viewCtrl: ViewController, 
    params:NavParams,
    public userProvider: UserProvider) {

    this.uid = params.data.uid;
    this.interlocutor = params.data.interlocutor;
    this.fromMainPage = (params.data.main)?true:false;
    this.userProvider.getUserInterlocutor(this.interlocutor).then(userObservable => {
      userObservable.subscribe(user => {
        this.user = user;
      });
    });
    this.slideOptions = {
      pager: true
    };
    
  }

  ionViewDidLoad() {
  }

  flagUser(): void {
    alert("FLAG USER");
  }

  reject(): void{
    this.data = { 'foo': 'bar1' }
    alert("Reject User");
    this.dismiss();
  }

  like(): void {
    this.data = { 'foo': 'bar1' }
    alert("Like user");
    this.dismiss();
  }

  superlike(): void {
    this.data = { 'foo': 'bar1' }
    alert("SuperLike user");
    this.dismiss();
  }

  dismiss() {
   this.viewCtrl.dismiss(this.data);
 } 
}
