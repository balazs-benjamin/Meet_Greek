import { Component, ViewChild, ViewChildren, QueryList  } from '@angular/core';
import { NavController, ModalController, Slides, Content, Platform, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { UserProvider } from '../../providers/user-provider/user-provider';
import { LikeProvider } from '../../providers/like-provider/like-provider';

import { ChatViewPage } from '../chat-view/chat-view';
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



@Component({
    selector: 'page-main',
    templateUrl: 'main.html'
})
export class MainPage {
    @ViewChild('myswing1') swingStack: SwingStackComponent;
    @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

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
    isPublicEnabled = true;
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
    // users:Observable<any[]>;
    users:FirebaseListObservable<any[]>;
    // buttonsVisible = false;

    constructor(
        private http: Http,
        public storage: Storage,
        public auth: AuthProvider,
        private platform: Platform,
        public navCtrl: NavController,
        public userProvider: UserProvider,
        public modalCtrl: ModalController,
        private toastCtrl: ToastController,
        public likeProvider: LikeProvider) {

        console.log("MainPage");

        this.storage.set('hasUserReachedMain', true);
        this.buttonDisabled = null;

        //Swipe
        this.stackConfig = {
            throwOutConfidence: (offset, element) => {
                // console.log("throwOutConfidence", offset, element);
                let deviation = Math.abs(offset) / Math.abs(element/5);
                // console.log("throwOutConfidence", deviation);
                return Math.min(deviation, 1);
            },
            // transform: (element, x, y, r) => {
            //   this.onItemMove(element, x, y, r);
            // },
            throwOutDistance: (d) => {
                return 400;
            }
        };
        
        this.initialize();
    }


    ionViewDidLoad() {
        console.log( "MainPage::ionViewDidLoad()");
    }

    ionViewDidEnter() {
        // this.slider.lockSwipeToPrev();
    }

    initialize(){
        console.log( "MainPage::initialize() isLogin", this.auth.authenticated );
        if (this.auth.authenticated) {
            this.userProvider.getUid()
            .then(uid => {
                console.log("MainPage::initialize", uid);
            
                this.uid = uid;
                this.users = this.userProvider.getAllUsers();
                this.userLikes = this.likeProvider.getUserLikes(uid);
                this.sortedUsers = [];
                this.cardUserArray = [];
          }, err => {
            console.log("MainPage::error", err);
          });
          

          this.userProvider.getUser().then(userObservable => {
            if (userObservable) {
              userObservable.subscribe(data => {
                this.loggedUser = data;
                this.isPublicEnabled = this.loggedUser.discoverable;
                this.storage.set('discoverable', this.isPublicEnabled);

                console.log("MainPage::initialize loggedUser", this.loggedUser);
                console.log("MainPage::initialize discoverable", this.loggedUser.discoverable);

                this.addToLikedArray();
                this.addNewCardsFromFirebase();
              });

            }
          });

          this.storage.get('discoverable').then(result => {
            if (!result) {
                this.isPublicEnabled = false;
              } else {
                this.isPublicEnabled = true;
              }
          });
        }else{
          this.navCtrl.push(LoginPage);
        }
    }

    makeDiscoverable(){
        this.isPublicEnabled = true;
        this.storage.set('discoverable', true);
        this.userProvider.updateUserProfile(this.uid, 'discoverable', this.isPublicEnabled);

        this.addToLikedArray();
        this.addNewCardsFromFirebase();
    }

    openChat(key) {
        console.log( "MainPage::openChat()", key );
        let param = {uid: this.uid, interlocutor: key};
        this.navCtrl.push(ChatViewPage,param);
        this.loggedUser

    }

    ionSlideTap(key) {
        console.log( "MainPage::ionSlideTap()", key );

        this.buttonDisabled = true;
        // alert("Go To Extended Profile");
        let param = null;
        param = {uid: this.uid, interlocutor: key.$key, main:true};
        //let param = {uid: "this uid", interlocutor: "other user key"};
        let extendedProfileModal = this.modalCtrl.create(ExtendedProfilePage, param);
          extendedProfileModal.onDidDismiss(data => {
            if(data.foo == 'bar1'){
              this.goToNextUser();
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

        let uid = this.uid;
        let interlocutor = this.currentInterlocutorKey;
        this.likeProvider.addSuperLike(uid, interlocutor);
        this.likeKeys.push(interlocutor);
        var index = this.userkeys.indexOf(interlocutor);
        if (index > -1) {
          this.userkeys.splice(index, 1);
        }  
        this.checkLikes();
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
        // this.mainSlider.update();
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
        // this.mainSlider.update();
        // this.mainSlider.slideNext();

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
                this.likeKeys.push(like.$key);
            });
            this.everythingLoaded = true;
        });
    }


    addToExistingLikedArray(interlocutor): void {
        console.log( "MainPage::addToExistingLikedArray()");

        this.likeKeys.push(interlocutor);
        console.log(this.likeKeys);
        this.everythingLoaded = true;
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
        // this.content.resize();
        this.navCtrl.setRoot( this.navCtrl.getActive().component );

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


    // Called whenever we drag an element
    onItemMove(element, x, y, r) {
        var color = '';
        var abs = Math.abs(x);
        let min = Math.trunc(Math.min(16*16 - abs, 16*16));
        let hexCode = this.decimalToHex(min, 2);
        
        if (x < 0) {
            color = '#FF' + hexCode + hexCode;
        } else {
            color = '#' + hexCode + 'FF' + hexCode;
        }
        
        element.style.background = color;
        element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
    }

    voteUp(like: boolean) {
        console.log( "MainPage::voteUp()", like );

        let interlocutor = this.sortedUsers[0].$key;
        
        let removedCard = this.sortedUsers.pop();
        let message: string;
        let uid = this.uid;
        if (like) {
            // let interlocutor = this.currentInterlocutorKey;
            this.likeProvider.addLike(uid, interlocutor);
            this.interlocutorLikes = this.likeProvider.getUserLikes(interlocutor);
            this.interlocutorLikes.take(1).subscribe(likes => {
                // items is an array
                likes.forEach(chat => {
                    console.log("MainPage::voteUp(), likes", chat);
                    if(chat.$key == this.uid){
                        this.likeProvider.addMatch(uid, interlocutor);
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

        this.greeksNotFound = (this.sortedUsers.length == 0);
        console.log( "MainPage::voteUp() greeksNotFound ", this.greeksNotFound );
    }


    decimalToHex(d, padding) {
        var hex = Number(d).toString(16);
        padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
        
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        
        return hex;
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
        console.log( "MainPage::addNewCardsFromFirebase()", this.userArrayIndex );
        let gender:string = this.loggedUser.gender;
        let preference:string = this.loggedUser.preference;

        console.log( "MainPage::addNewCardsFromFirebase() gender:", gender, ", preference:", preference );

        this.users.take(1)
        // filter user preference
        .map(items => {

            if (preference === 'Friends'){
                return items.filter(item => ( item.preference === 'Friends' ) );
            }else if (preference === 'Men') {

                if (gender === 'Woman') {
                    return items.filter(item => (item.gender === 'Man' && item.preference === 'Women') );
                }else if (gender === 'Man') {
                    return items.filter(item => (item.gender === 'Man' && item.preference === 'Men') );
                }else{
                    return items.filter(item => (item.preference === 'Men') );
                }
                
            }else if (preference === 'Women') {
                
                if (gender === 'Woman') {
                    return items.filter(item => (item.gender === 'Woman' && item.preference === 'Women') );
                }else if (gender === 'Man') {
                    return items.filter(item => (item.gender === 'Man' && item.preference === 'Women') );
                }else{
                    return items.filter(item => (item.preference === 'Men') );
                }
            }else{
                return items;
            }
            
        })
        .subscribe(user => {
            console.log( "MainPage::addNewCardsFromFirebase()", user );

            // items is an array
            // this.sortedUsers.push(user[0]);
            this.userArrayIndex = user.length;
            console.log( "MainPage::addNewCardsFromFirebase() length", this.userArrayIndex );
            for (let i = this.previousIndex; i < this.userArrayIndex; i++) {

                console.log( "MainPage::addNewCardsFromFirebase() user", user[i] );
                if(user[i].$key !== this.uid && this.likeKeys.indexOf(user[i].$key) == -1){
                    this.sortedUsers.push( user[i] );
                    this.previousIndex = i + 1;
                }
            }
            
            console.log("sortedUsers", this.sortedUsers);

            this.sortedUsers.forEach(sortedUser => {
                console.log("sortedUser", sortedUser);
                this.cardUserArray.push(sortedUser);
            });

            if(this.sortedUsers.length == 0){
                this.greeksNotFound = true;
                // this.navCtrl.setRoot(this.navCtrl.getActive().component);
            }else{
                this.greeksNotFound = false;
            }
            
            console.log( "MainPage::addNewCardsFromFirebase() previousIndex ", this.previousIndex);
            console.log("*****************************************1");
            console.log( "MainPage::addNewCardsFromFirebase() sortedUsers ", this.sortedUsers);
            if( this.sortedUsers.length > 0 ){
            }else {
                this.greeksFound = false;
                // this.update();
            }

            console.log("*****************************************2");
            // this.mainSlider.update();
            // this.cardUserArray.push(this.sortedUsers[0]);
            this.cardUsersLoaded = true;
            // this.ionViewDidLoad();
            // this.checkLikes();
            console.log( "MainPage::addNewCardsFromFirebase() currentInterlocutorKey ", this.currentInterlocutorKey);


        });
    }

    private checkIfGreeksFound(arr){
        console.log( "MainPage::checkIfGreeksFound()" );
        // if(arr.length > 0){
        //   this.greeksFound = false;
        // }
    }

    sendFCMPush() {
        /*
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

        */


        

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
