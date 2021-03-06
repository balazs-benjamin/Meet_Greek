import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { Camera } from 'ionic-native';


declare var FCMPlugin;

@Injectable()
export class UserProvider {
    private uid:string;

    public static notificationToken;

    constructor(
        public platform:Platform,
        public af: AngularFire, 
        public local: Storage) { 

        if (platform.is('cordova')) {
            setTimeout(this.getTheToken, 1000);
        }

    }

    // Get Current User's UID
    getUid() {
        return this.local.get('uid');
    }

    // Create User in Firebase
    createUser(userCredentails, uid) {
        let currentUserRef = this.af.database.object('/users/' + uid);
        console.log(userCredentails);
        currentUserRef.set({ email: userCredentails.email });
    }

    // Get Info of Single User
    getUser() {
        // Getting UID of Logged In User
        return this.getUid().then(uid => {
            if (uid) {
                return this.af.database.object('/users/'+uid);
            }
            return null;
        });
    }

    getUserInterlocutor(interlocutorUid) {
        // Getting UID of Logged In User
        return this.getUid().then(uid => {
            return this.af.database.object('/users/' + interlocutorUid );
        });
    }

    // Get All Users of App
    getAllUsers() {
        return this.af.database.list('/users', 
            { query: { 
                orderByChild: 'discoverable',
                equalTo: true
            }
        });
    }
    getPreferedUsers() {
        return this.af.database.list('/users', 
            { query: { 
                orderByChild: 'discoverable',
                equalTo: true
            }
        });
    }

    getAllUsersKeys() {
        var i = this.af.database.object('/users', { preserveSnapshot: true })
        i.subscribe(snapshot => { });
    }

    getAllUsersExcept() {
        return this.af.database.list('/users');
    }

    // Get base64 Picture of User
    getPicture() {
        let base64Picture;
        let options = {
            destinationType: 0,
            sourceType: 0,
            encodingType: 0
        };

        let promise = new Promise((resolve, reject) => {
            Camera.getPicture(options).then((imageData) => {
                base64Picture = "data:image/jpeg;base64," + imageData;
                resolve(base64Picture);
            }, (error) => {
                reject(error);
            });

        });
        return promise;
    }

    updateUserProfile(uid, property, value){
        console.log("updateUserProfile ", uid, property, value);
        if (uid != undefined && value != undefined) {
            this.af.database.object(`/users/${uid}/${property}`).set(value).then( _ => {
                console.log("updateUserProfile complete", _);
            }, err => {
                console.log("updateUserProfile", err);
            });
        }
        
    }

    // Update Provide Picture of User
    updatePicture() {
        this.getUid().then(uid => {
            let pictureRef = this.af.database.object('/users/'+uid+'/picture');
            this.getPicture()
                .then((image) => {
                    pictureRef.set(image);
                });
        });
    }

    // upload profile picture
    uploadPicture(file) {
        return this.getUid()
            .then(uid => {
                let promise = new Promise((res, rej) => {
                    let fileName = uid + '.jpg';
                    let pictureRef =
                        firebase.storage().ref('/profile/' + fileName);

                    let uploadTask = pictureRef.put(file);
                    uploadTask.on('state_changed', function (snapshot) {
                    }, function (error) {
                        rej(error);
                    }, function () {
                        var downloadURL = uploadTask.snapshot.downloadURL;
                        res(downloadURL);
                    });
                });
                return promise;
            });
    }

    getTheToken() {
        console.log('LoginPage::getTheToken()', (typeof FCMPlugin !== "undefined") );
        
        FCMPlugin.getToken((token) => {
            if (token == null || token == "") {
                console.log("LoginPage::null token:" + token + ":");
                setTimeout(this.getTheToken, 1000);
            } else {
                console.log("LoginPage::I got the token:" + token + ":");
                UserProvider.notificationToken = token;
            }
        },
        (err) => {
            console.log('error retrieving token: ' + err);
        });
    }
}

