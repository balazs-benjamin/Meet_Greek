import { Component, ViewChild, ViewChildren, QueryList  } from '@angular/core';
import { NavController, ModalController, Slides, Content, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { LikeProvider } from '../../providers/like-provider/like-provider';
import { ChatViewPage } from '../chat-view/chat-view';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
import { ExtendedProfilePage } from '../extended-profile/extended-profile';
import { ChatMatchPage }  from '../chat-match/chat-match';
import { ConvertDistance } from '../../pipes/convert-distance'
import { MatchPage } from '../match/match';
import { LoginPage } from '../login/login';

import { AuthProvider } from '../../providers/auth-provider/auth-provider';

//Swipe Screen
import { SwingStackComponent, StackConfig, SwingCardComponent, ThrowEvent } from 'angular2-swing';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-main',
  templateUrl: 'main.html'
})
export class MainPage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
  @ViewChild('mainSlider') mainSlider: Slides;
  @ViewChild(Content) content: Content;

  cards: Array<any>;
  sortedUsers: Array<any>;
  cardUserArray: Array<any>;
  stackConfig: StackConfig;
  previousIndex = 0;
  userArrayIndex = 0;
  isLastElement = false;
  isLiked = false;
  everythingLoaded = false;
  everythingLoaded2 = false;
  cardUsersLoaded = false;
  likeKeys = [];
  currentInterlocutorKey: any;
  currentInterlocutorKey2: any;
  isPublicEnabled = false;
  calculatedDistance = 0;
  buttonDisabled: any;
  greeksNotFound = false;
  loggedUser = <any>{};
  uid:string;
  slideOptions: any; 
  public slider: any;
  userActive;
  sliderEnded = false;
  premium = true;
  greeksFound = true;
  interlocutorLikes:Observable<any[]>;
  userLikes:Observable<any[]>;
  userkeys = [];
  users:Observable<any[]>;
  // buttonsVisible = false;

  constructor(
    private http: Http,
    public auth: AuthProvider,
    private platform: Platform,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public userProvider: UserProvider,
    public modalCtrl: ModalController,
    public storage: Storage,
    public likeProvider: LikeProvider) {

    console.log("MainPage");

    this.storage.set('hasUserReachedMain', true);
    this.buttonDisabled = null;

    //Swipe
    this.stackConfig = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth/2), 1);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
  }


  ionViewDidLoad() {
    console.log( "MainPage::ionViewDidLoad() isLogin", this.auth.authenticated );
    if (this.auth.authenticated) {

      this.userProvider.getUid()
      .then(uid => {
        console.log("MainPage::ionViewDidLoad", uid);

        this.uid = uid;
        this.users = this.userProvider.getAllUsers();
        this.userLikes = this.likeProvider.getUserLikes(uid);
        this.sortedUsers = [];
        this.addToLikedArray();
        this.addNewCardsFromFirebase();
        
      }, err => {
        console.log("MainPage::error", err);
      });

      this.userProvider.getUser().then(userObservable => {
        userObservable.subscribe(data => {
          this.loggedUser = data;
        });
        console.log("MainPage", this.loggedUser.likes);
      });

      this.storage.get('discoverable').then(result => {
        if (!result) {
            this.isPublicEnabled = false;
          } else {
            this.isPublicEnabled = true;
          }
      });
      //this.slider.lockSwipeToPrev();
      // if(this.users){
      //   this.greeksFound = false;
      // }else{
      //   this.greeksFound = true;
      //   //this.userActive = this.users[this.indexOfArr];
      // }
    }else{
      this.navCtrl.push(LoginPage);
    }
  }

  ionViewDidEnter() {
    // this.slider.lockSwipeToPrev();
  }

  openChat(key) {
    console.log( "MainPage::openChat()", key );

    let param = {uid: this.uid, interlocutor: key};
    this.navCtrl.push(ChatViewPage,param);
  }

  ionSlideTap(key) {
    console.log( "MainPage::ionSlideTap()", key );

    this.buttonDisabled = true;
    // alert("Go To Extended Profile");
    let param = null;
    param = {uid: this.uid, interlocutor: key};   
    //let param = {uid: "this uid", interlocutor: "other user key"};
    let extendedProfileModal = this.modalCtrl.create(ExtendedProfilePage, param);
      extendedProfileModal.onDidDismiss(data => {
        if(data.foo == 'bar1'){
          //this.goToNextUser();
        }
        this.buttonDisabled = null;
      });
    extendedProfileModal.present();
    //this.navCtrl.push(ExtendedProfilePage, );
  }

  ionSlideNextEnd(): void {
    console.log( "MainPage::ionSlideNextEnd()");
    alert("user liked this one");
  }

  goToChat(): void {
    this.navCtrl.push(ChatMatchPage);
  }
  goToSettings(): void {
    this.navCtrl.setRoot(SettingsPage);
  }

  redo(): void {
    console.log( "MainPage::redo()");
    if(this.premium){
      // if(!this.slider.isBeginning){
      //   this.slider.unlockSwipeToPrev();
      //   this.slider.slidePrev();
      //   this.slider.lockSwipeToPrev();
      // }else{
      //   this.slider.lockSwipeToPrev();
      // }
      
    }else{
      alert('Load Premium Page');
    }
    // if(this.premium){
    //   alert('user has bought premium - REDO');
    //   if(this.indexOfArr-1 >= 0){
    //     this.userActive = this.users[this.indexOfArr - 1];
    //     this.indexOfArr -= 1;
    //   }else {
    //     alert("You have reached the first found user");
    //   }
    // }else{
    //   alert('user cant use that function');
    // }
  }

  superLike(): void {
    console.log( "MainPage::superLike()");

    let uid =this.uid;
    let interlocutor = this.currentInterlocutorKey;
    this.likeProvider.addSuperLike(uid, interlocutor);
    this.likeKeys.push(interlocutor);
    var index = this.userkeys.indexOf(interlocutor);
    if (index > -1) {
      this.userkeys.splice(index, 1);
    }  
    //this.checkLikes();
  }

  checkLikes(): void {
    console.log( "MainPage::checkLikes()");
    
    if(this.likeKeys.indexOf(this.currentInterlocutorKey) == -1){
          this.isLiked = false
        }else{
          this.isLiked = true;
        }
    console.log(this.currentInterlocutorKey);
    console.log(this.isLiked);
    this.mainSlider.update();
  }

  reject(interlocutor): void {
    console.log( "MainPage::reject()");

    let uid = this.uid;
    // let interlocutor = this.currentInterlocutorKey;
    this.likeProvider.reject(uid, interlocutor);
    this.likeKeys.push(interlocutor);
    // var index = this.userkeys.indexOf(interlocutor);
    // if (index > -1) {
    //   this.userkeys.splice(index, 1);
    // }
    //this.checkLikes();
    this.mainSlider.update();
    this.mainSlider.slideNext();

    //reload users
    this.everythingLoaded = false;
    this.userProvider.getUid()
      .then(uid => {
          this.uid = uid;
          this.users = this.userProvider.getAllUsers();
          this.userLikes = this.likeProvider.getUserLikes(uid);
          this.addToExistingLikedArray(interlocutor);
          // this.buttonsVisible = true;
      });
    //console.log(this.userkeys);
    
  }

  addToLikedArray(): void {
    console.log( "MainPage::addToLikedArray()");

    this.userLikes.subscribe(likes => {
      console.log( "MainPage::addToLikedArray()", likes);
      this.likeKeys = [];
      
      likes.forEach(like => {
        //console.log(item.$key);
          this.likeKeys.push(like.$key);
          // var index = this.userkeys.indexOf(like.$key, 0);
          // console.log(index);
          // if (index > -1) {
          //   this.userkeys.splice(index, 1);
          // }  
      });
      // this.mainSlider.update();
      this.everythingLoaded = true;
      this.content.resize();
      //this.ionViewDidLoad();
      //this.checkLikes();
      // console.log(this.currentInterlocutorKey);
      
    });
  }


  addToExistingLikedArray(interlocutor): void {
    console.log( "MainPage::addToExistingLikedArray()");

    this.likeKeys.push(interlocutor);
    console.log(this.likeKeys);
    this.everythingLoaded = true;
  }

  slideChanged() {
    console.log( "MainPage::slideChanged()");

    // this.users.forEach(user => {
    //   //console.log(user);
    // });
   
    // for (let key in this.users) {
    //     console.log(key);
    //     userkeys.push(key);
    //   }
    // console.log(userkeys);
    
    // let currentIndex = this.mainSlider.getActiveIndex();
    // this.getCurrentInterloculot(currentIndex);
    // this.mainSlider.update();
    //console.log("Current index is", currentIndex);
    // var obj = this.users;
    // this.currentInterlocutorKey = obj[Object.keys(obj)[currentIndex]];
    // //alert(this.currentInterlocutorKey);
    // var keys = Object.keys(this.users);
    // console.log(keys);
  }

  getCurrentInterloculot(index): void {
    console.log( "MainPage::getCurrentInterloculot()", index);

    this.users.take(1).subscribe(items => {
      
      if(this.everythingLoaded2 != true){
        this.userkeys = [];
        // items is an array
        items.forEach(item => {
          //console.log(item.$key);
          if(item.$key != this.uid){
            this.userkeys.push(item.$key);
          }
        });
        // console.log(userkeys);
          this.addToLikedArray();
        }
        this.everythingLoaded2 = true;
        //this.checkLikes();
        this.currentInterlocutorKey = this.userkeys[index];
        console.log(this.currentInterlocutorKey);
        console.log(this.userkeys);
    });
  }

  like(interlocutor): void {
    console.log( "MainPage::like()", interlocutor);
    // this.goToNextUser();
    
    // let interlocutor = this.currentInterlocutorKey;
    this.likeProvider.addLike(this.uid, interlocutor);
    this.content.resize();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
    // this.likeKeys.push(interlocutor);
    // var index = this.userkeys.indexOf(interlocutor);
    // if (index > -1) {
    //   this.userkeys.splice(index, 1);
    // }
    //this.checkLikes();
    // this.mainSlider.update();

    //reload users
    this.everythingLoaded = false;
    this.userLikes = null;
    this.userkeys = null;
    this.users = null;
    this.userProvider.getUid()
      .then(uid => {
          this.uid = this.uid;
          this.users = this.userProvider.getAllUsers();
          this.userLikes = this.likeProvider.getUserLikes(uid);
          this.addToLikedArray();
          // this.buttonsVisible = true;
      });
      this.interlocutorLikes = this.likeProvider.getUserLikes(interlocutor);
        this.interlocutorLikes.subscribe(likes => {
          // items is an array
          likes.forEach(chat => {
            //console.log(item.$key);
            if(chat.$key == this.uid){
              this.match(interlocutor);
            }
          });
      });
    //console.log(this.userkeys);
  }



  match(other_key): void {
    console.log( "MainPage::match()", other_key );
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

  goToNextUser(): void {
    console.log( "MainPage::goToNextUser()" );
    // this.slider.lockSwipeToPrev();
    // // if(this.indexOfArr+1 < this.users.length){
    // //   this.userActive = this.users[this.indexOfArr + 1];
    // //   this.indexOfArr += 1;

    // // }else{
    // //   this.greeksFound = false;
    // // }
    // if(this.slider.isEnd){
    //   this.sliderEnded = true;
    //   this.greeksFound = false;
    // }else{
    //   this.slider.slideNext();
    // }
    // alert('Load next user');
  }

  toggleFade() {
    // this.fadeState = 'visible';    
  }
 
  toggleBounce(){
    // this.bounceState =  'bouncing';   
  }

  //SWIPE
  ngAfterViewInit() {
    console.log( "MainPage::ngAfterViewInit()" );

    this.swingStack.throwin.take(1).subscribe((event: ThrowEvent) => {
      console.log( "MainPage::ngAfterViewInit()", event );
      event.target.style.background = '#ffffff';
      
    });
    // this.cards = [];
    // this.addNewCards(1);

  }

  voteUp(like: boolean) {
    console.log( "MainPage::voteUp()", like );

    let interlocutor = this.sortedUsers[0].$key;
    //this.sortedUsers = [];
    let removedCard = this.sortedUsers.pop();
    let message: string;
    let uid =this.uid;
    if (like) {
      // let interlocutor = this.currentInterlocutorKey;
      this.likeProvider.addLike(uid, interlocutor);
      this.interlocutorLikes = this.likeProvider.getUserLikes(interlocutor);
        this.interlocutorLikes.subscribe(likes => {
          // items is an array
          likes.forEach(chat => {
            //console.log(item.$key);
            if(chat.$key == this.uid){
              this.match(interlocutor);
            }
          });
      });
    } else {
      this.likeProvider.reject(uid, interlocutor);
      message = 'You just disliked :(';
    }
    
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  addNewCards(count: number) {
    console.log( "MainPage::addNewCards()", count );
    // this.http.get('https://randomuser.me/api/?results=' + count)
    //   .map(data => data.json().results)
    //   .subscribe(result => {
    //     for (let val of result) {
    //       val.age = this.calculateAge(val.dob);
    //       this.cards.push(val);
    //     }
    //     console.log("*****************************************");
    //     console.log(this.cards);
    //     console.log("*****************************************");
    //   });
  }

  addNewCardsFromFirebase(): void {
    console.log( "MainPage::addNewCardsFromFirebase()" );

    this.users.subscribe(user => {
      console.log( "MainPage::addNewCardsFromFirebase()", user );
        // items is an array
        // this.sortedUsers.push(user[0]);
        this.userArrayIndex = user.length;
        
        for (var i = this.previousIndex; i < user.length; i++) {          
          if(user[i].$key !== this.uid && this.likeKeys.indexOf(user[i].$key) == -1){
            
            this.sortedUsers.push(user[i]);
            this.previousIndex = i + 1;
            
            break;
          }
        }
        
        // this.sortedUsers.forEach(user => {
        //   this.cardUserArray.push(user);
        console.log(this.sortedUsers.length);
        // if(this.sortedUsers.length == 0){
        //   this.greeksNotFound = true;
        //   //this.navCtrl.setRoot(this.navCtrl.getActive().component);
        // }else{
        //   this.greeksNotFound = false;
        // }
        
        // console.log(this.previousIndex);
        //console.log("*****************************************1");
        //console.log(this.sortedUsers);
        // if(this.sortedUsers.length > 0){
        // }else {
        //   this.greeksFound = false;
        //   this.update();
        // }
        //console.log("*****************************************2");
        // this.mainSlider.update();
        //this.cardUserArray.push(this.sortedUsers[0]);
        //this.cardUsersLoaded = true;
        //this.ionViewDidLoad();
        //this.checkLikes();
        // console.log(this.currentInterlocutorKey);
        //
    });
  }

  private checkIfGreeksFound(arr){
    console.log( "MainPage::checkIfGreeksFound()" );
    // if(arr.length > 0){
    //   this.greeksFound = false;
    // }
  }

  sendFCMPush() {

    let Legacy_SERVER_KEY = "AIzaSyAHvUlvULDb5P3XME-ggl630Xo1dALbXvI";
    let FCM_PUSH_URL = "";
    let msg = "this is test message,.,,.,.";
    let title = "my title";
    let token = "FCM_RECEIVER_TOKEN";

    let objData:any = {
      body: msg,
      title: title,
      sound: "default",
      icon: "icon_name", //   icon_name image must be there in drawable
      tag: token,
      priority: "high"
    };

    let dataobjData:any = {
      text: msg,
      title: title
    };

    let obj:any ={
      to: token,
      notification: objData,
      data: dataobjData
    };

    /*
    JsonObjectRequest jsObjRequest = new JsonObjectRequest(Request.Method.POST, Constants.FCM_PUSH_URL, obj,
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    Log.e("!_@@_SUCESS", response + "");
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.e("!_@@_Errors--", error + "");
                }
            }) {
        @Override
        public Map<String, String> getHeaders() throws AuthFailureError {
            Map<String, String> params = new HashMap<String, String>();
            params.put("Authorization", "key=" + Legacy_SERVER_KEY);
            params.put("Content-Type", "application/json");
            return params;
        }
    };
    RequestQueue requestQueue = Volley.newRequestQueue(this);
    int socketTimeout = 1000 * 60;// 60 seconds
    RetryPolicy policy = new DefaultRetryPolicy(socketTimeout, 
      DefaultRetryPolicy.DEFAULT_MAX_RETRIES, 
      DefaultRetryPolicy.DEFAULT_BACKOFF_MULT);
    jsObjRequest.setRetryPolicy(policy);
    requestQueue.add(jsObjRequest);
    */
  }


  private calculateAge(b: any) {
    console.log( "MainPage::calculateAge()", b );

    let birthday = new Date(b.replace(' ', 'T'));
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
