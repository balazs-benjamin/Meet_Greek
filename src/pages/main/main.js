var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { NavController, ModalController, Slides, Content, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { LikeProvider } from '../../providers/like-provider/like-provider';
import { ChatViewPage } from '../chat-view/chat-view';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
import { ExtendedProfilePage } from '../extended-profile/extended-profile';
import { ChatMatchPage } from '../chat-match/chat-match';
import { MatchPage } from '../match/match';
//Swipe Screen
import { SwingStackComponent } from 'angular2-swing';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
var MainPage = (function () {
    // buttonsVisible = false;
    function MainPage(http, platform, toastCtrl, navCtrl, userProvider, modalCtrl, storage, likeProvider) {
        this.http = http;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.userProvider = userProvider;
        this.modalCtrl = modalCtrl;
        this.storage = storage;
        this.likeProvider = likeProvider;
        this.previousIndex = 0;
        this.userArrayIndex = 0;
        this.isLastElement = false;
        this.isLiked = false;
        this.everythingLoaded = false;
        this.everythingLoaded2 = false;
        this.cardUsersLoaded = false;
        this.likeKeys = [];
        this.isPublicEnabled = false;
        this.calculatedDistance = 0;
        this.greeksNotFound = false;
        this.loggedUser = {};
        this.sliderEnded = false;
        this.premium = true;
        this.greeksFound = true;
        this.userkeys = [];
        console.log("MainPage");
        this.storage.set('hasUserReachedMain', true);
        this.buttonDisabled = null;
        //Swipe
        this.stackConfig = {
            throwOutConfidence: function (offset, element) {
                return Math.min(Math.abs(offset) / (element.offsetWidth / 2), 1);
            },
            throwOutDistance: function (d) {
                return 800;
            }
        };
    }
    MainPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log("MainPage::ionViewDidLoad()");
        this.userProvider.getUid()
            .then(function (uid) {
            console.log("MainPage::ionViewDidLoad", uid);
            _this.uid = uid;
            _this.users = _this.userProvider.getAllUsers();
            _this.userLikes = _this.likeProvider.getUserLikes(uid);
            _this.sortedUsers = [];
            _this.addToLikedArray();
            _this.addNewCardsFromFirebase();
        }, function (err) {
            console.log("MainPage::error", err);
        });
        this.userProvider.getUser().then(function (userObservable) {
            userObservable.subscribe(function (data) {
                _this.loggedUser = data;
            });
            console.log("MainPage", _this.loggedUser.likes);
        });
        this.storage.get('discoverable').then(function (result) {
            if (!result) {
                _this.isPublicEnabled = false;
            }
            else {
                _this.isPublicEnabled = true;
            }
        });
        //this.slider.lockSwipeToPrev();
        // if(this.users){
        //   this.greeksFound = false;
        // }else{
        //   this.greeksFound = true;
        //   //this.userActive = this.users[this.indexOfArr];
        // }
    };
    MainPage.prototype.ionViewDidEnter = function () {
        // this.slider.lockSwipeToPrev();
    };
    MainPage.prototype.openChat = function (key) {
        console.log("MainPage::openChat()", key);
        var param = { uid: this.uid, interlocutor: key };
        this.navCtrl.push(ChatViewPage, param);
    };
    MainPage.prototype.ionSlideTap = function (key) {
        var _this = this;
        console.log("MainPage::ionSlideTap()", key);
        this.buttonDisabled = true;
        // alert("Go To Extended Profile");
        var param = null;
        param = { uid: this.uid, interlocutor: key };
        //let param = {uid: "this uid", interlocutor: "other user key"};
        var extendedProfileModal = this.modalCtrl.create(ExtendedProfilePage, param);
        extendedProfileModal.onDidDismiss(function (data) {
            if (data.foo == 'bar1') {
                //this.goToNextUser();
            }
            _this.buttonDisabled = null;
        });
        extendedProfileModal.present();
        //this.navCtrl.push(ExtendedProfilePage, );
    };
    MainPage.prototype.ionSlideNextEnd = function () {
        console.log("MainPage::ionSlideNextEnd()");
        alert("user liked this one");
    };
    MainPage.prototype.goToChat = function () {
        this.navCtrl.push(ChatMatchPage);
    };
    MainPage.prototype.goToSettings = function () {
        this.navCtrl.setRoot(SettingsPage);
    };
    MainPage.prototype.redo = function () {
        console.log("MainPage::redo()");
        if (this.premium) {
            // if(!this.slider.isBeginning){
            //   this.slider.unlockSwipeToPrev();
            //   this.slider.slidePrev();
            //   this.slider.lockSwipeToPrev();
            // }else{
            //   this.slider.lockSwipeToPrev();
            // }
        }
        else {
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
    };
    MainPage.prototype.superLike = function () {
        console.log("MainPage::superLike()");
        var uid = this.uid;
        var interlocutor = this.currentInterlocutorKey;
        this.likeProvider.addSuperLike(uid, interlocutor);
        this.likeKeys.push(interlocutor);
        var index = this.userkeys.indexOf(interlocutor);
        if (index > -1) {
            this.userkeys.splice(index, 1);
        }
        //this.checkLikes();
    };
    MainPage.prototype.checkLikes = function () {
        console.log("MainPage::checkLikes()");
        if (this.likeKeys.indexOf(this.currentInterlocutorKey) == -1) {
            this.isLiked = false;
        }
        else {
            this.isLiked = true;
        }
        console.log(this.currentInterlocutorKey);
        console.log(this.isLiked);
        this.mainSlider.update();
    };
    MainPage.prototype.reject = function (interlocutor) {
        var _this = this;
        console.log("MainPage::reject()");
        var uid = this.uid;
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
            .then(function (uid) {
            _this.uid = uid;
            _this.users = _this.userProvider.getAllUsers();
            _this.userLikes = _this.likeProvider.getUserLikes(uid);
            _this.addToExistingLikedArray(interlocutor);
            // this.buttonsVisible = true;
        });
        //console.log(this.userkeys);
    };
    MainPage.prototype.addToLikedArray = function () {
        var _this = this;
        console.log("MainPage::addToLikedArray()");
        this.userLikes.subscribe(function (likes) {
            console.log("MainPage::addToLikedArray()", likes);
            _this.likeKeys = [];
            likes.forEach(function (like) {
                //console.log(item.$key);
                _this.likeKeys.push(like.$key);
                // var index = this.userkeys.indexOf(like.$key, 0);
                // console.log(index);
                // if (index > -1) {
                //   this.userkeys.splice(index, 1);
                // }  
            });
            // this.mainSlider.update();
            _this.everythingLoaded = true;
            _this.content.resize();
            //this.ionViewDidLoad();
            //this.checkLikes();
            // console.log(this.currentInterlocutorKey);
        });
    };
    MainPage.prototype.addToExistingLikedArray = function (interlocutor) {
        console.log("MainPage::addToExistingLikedArray()");
        this.likeKeys.push(interlocutor);
        console.log(this.likeKeys);
        this.everythingLoaded = true;
    };
    MainPage.prototype.slideChanged = function () {
        console.log("MainPage::slideChanged()");
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
    };
    MainPage.prototype.getCurrentInterloculot = function (index) {
        var _this = this;
        console.log("MainPage::getCurrentInterloculot()", index);
        this.users.subscribe(function (items) {
            if (_this.everythingLoaded2 != true) {
                _this.userkeys = [];
                // items is an array
                items.forEach(function (item) {
                    //console.log(item.$key);
                    if (item.$key != _this.uid) {
                        _this.userkeys.push(item.$key);
                    }
                });
                // console.log(userkeys);
                _this.addToLikedArray();
            }
            _this.everythingLoaded2 = true;
            //this.checkLikes();
            _this.currentInterlocutorKey = _this.userkeys[index];
            console.log(_this.currentInterlocutorKey);
            console.log(_this.userkeys);
        });
    };
    MainPage.prototype.like = function (interlocutor) {
        var _this = this;
        console.log("MainPage::like()", interlocutor);
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
            .then(function (uid) {
            _this.uid = _this.uid;
            _this.users = _this.userProvider.getAllUsers();
            _this.userLikes = _this.likeProvider.getUserLikes(uid);
            _this.addToLikedArray();
            // this.buttonsVisible = true;
        });
        this.interlocutorLikes = this.likeProvider.getUserLikes(interlocutor);
        this.interlocutorLikes.subscribe(function (likes) {
            // items is an array
            likes.forEach(function (chat) {
                //console.log(item.$key);
                if (chat.$key == _this.uid) {
                    _this.match(interlocutor);
                }
            });
        });
        //console.log(this.userkeys);
    };
    MainPage.prototype.match = function (other_key) {
        console.log("MainPage::match()", other_key);
        var param = null;
        param = { interlocutor: other_key };
        //let param = {uid: "this uid", interlocutor: "other user key"};
        var matchModal = this.modalCtrl.create(MatchPage, param);
        // matchModal.onDidDismiss(data => {
        //   if(data.foo == 'bar1'){
        //     this.goToNextUser();
        //   }
        //   this.buttonDisabled = null;
        // });
        matchModal.present();
    };
    MainPage.prototype.goToNextUser = function () {
        console.log("MainPage::goToNextUser()");
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
    };
    MainPage.prototype.toggleFade = function () {
        // this.fadeState = 'visible';    
    };
    MainPage.prototype.toggleBounce = function () {
        // this.bounceState =  'bouncing';   
    };
    //SWIPE
    MainPage.prototype.ngAfterViewInit = function () {
        console.log("MainPage::ngAfterViewInit()");
        this.swingStack.throwin.subscribe(function (event) {
            console.log("MainPage::ngAfterViewInit()", event);
            event.target.style.background = '#ffffff';
        });
        // this.cards = [];
        // this.addNewCards(1);
    };
    MainPage.prototype.voteUp = function (like) {
        var _this = this;
        console.log("MainPage::voteUp()", like);
        var interlocutor = this.sortedUsers[0].$key;
        //this.sortedUsers = [];
        var removedCard = this.sortedUsers.pop();
        var message;
        var uid = this.uid;
        if (like) {
            // let interlocutor = this.currentInterlocutorKey;
            this.likeProvider.addLike(uid, interlocutor);
            this.interlocutorLikes = this.likeProvider.getUserLikes(interlocutor);
            this.interlocutorLikes.subscribe(function (likes) {
                // items is an array
                likes.forEach(function (chat) {
                    //console.log(item.$key);
                    if (chat.$key == _this.uid) {
                        _this.match(interlocutor);
                    }
                });
            });
        }
        else {
            this.likeProvider.reject(uid, interlocutor);
            message = 'You just disliked :(';
        }
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'bottom'
        });
        toast.present(toast);
    };
    MainPage.prototype.addNewCards = function (count) {
        console.log("MainPage::addNewCards()", count);
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
    };
    MainPage.prototype.addNewCardsFromFirebase = function () {
        var _this = this;
        console.log("MainPage::addNewCardsFromFirebase()");
        this.users.subscribe(function (user) {
            console.log("MainPage::addNewCardsFromFirebase()", user);
            // items is an array
            // this.sortedUsers.push(user[0]);
            _this.userArrayIndex = user.length;
            for (var i = _this.previousIndex; i < user.length; i++) {
                if (user[i].$key !== _this.uid && _this.likeKeys.indexOf(user[i].$key) == -1) {
                    _this.sortedUsers.push(user[i]);
                    _this.previousIndex = i + 1;
                    break;
                }
            }
            // this.sortedUsers.forEach(user => {
            //   this.cardUserArray.push(user);
            console.log(_this.sortedUsers.length);
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
    };
    MainPage.prototype.checkIfGreeksFound = function (arr) {
        console.log("MainPage::checkIfGreeksFound()");
        // if(arr.length > 0){
        //   this.greeksFound = false;
        // }
    };
    MainPage.prototype.sendFCMPush = function () {
        var Legacy_SERVER_KEY = "AIzaSyAHvUlvULDb5P3XME-ggl630Xo1dALbXvI";
        var FCM_PUSH_URL = "";
        var msg = "this is test message,.,,.,.";
        var title = "my title";
        var token = "FCM_RECEIVER_TOKEN";
        var objData = {
            body: msg,
            title: title,
            sound: "default",
            icon: "icon_name",
            tag: token,
            priority: "high"
        };
        var dataobjData = {
            text: msg,
            title: title
        };
        var obj = {
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
    };
    MainPage.prototype.calculateAge = function (b) {
        console.log("MainPage::calculateAge()", b);
        var birthday = new Date(b.replace(' ', 'T'));
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    return MainPage;
}());
__decorate([
    ViewChild('myswing1'),
    __metadata("design:type", SwingStackComponent)
], MainPage.prototype, "swingStack", void 0);
__decorate([
    ViewChildren('mycards1'),
    __metadata("design:type", QueryList)
], MainPage.prototype, "swingCards", void 0);
__decorate([
    ViewChild('mainSlider'),
    __metadata("design:type", Slides)
], MainPage.prototype, "mainSlider", void 0);
__decorate([
    ViewChild(Content),
    __metadata("design:type", Content)
], MainPage.prototype, "content", void 0);
MainPage = __decorate([
    Component({
        selector: 'page-main',
        templateUrl: 'main.html'
    }),
    __metadata("design:paramtypes", [Http,
        Platform,
        ToastController,
        NavController,
        UserProvider,
        ModalController,
        Storage,
        LikeProvider])
], MainPage);
export { MainPage };
//# sourceMappingURL=main.js.map