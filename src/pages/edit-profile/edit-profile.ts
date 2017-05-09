import { Component } from '@angular/core';
import { NavController, AlertController, Platform, ModalController, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { PhotoModel } from '../../models/photo-model';
import { SimpleAlert } from '../../providers/simple-alert';
import { Camera, File } from 'ionic-native';
import { Data } from '../../providers/data';
import firebase from 'firebase'
import { AngularFire } from 'angularfire2';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';
import { Facebook } from 'ionic-native';
import { UtilProvider } from '../../providers/utils';
import { DescentPage } from '../descent/descent';
import { AreasPage } from '../areas/areas';
import { ChurchPage } from '../church/church'
import { SpeakPage } from '../speak/speak'


import { DragulaService } from 'ng2-dragula/ng2-dragula';


declare var cordova;

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {

  loadedEdit: boolean = false;
  photos: PhotoModel[] = [];
  storageRef = firebase.storage().ref();
  userPhotos = [];
  test = [];
  public maxPhotos = false;
  public msg: string;
  public gender: any;
  public isYes = false;
  public isFather = false;
  public isMother = false;
  public isNo = false;
  public loading : any ;
  public user:any = {
    images:[]
  };
  public images1:any[] = [
    'https://placeholdit.imgix.net/~text?txtsize=20&txt=1&w=150&h=150',
    'https://placeholdit.imgix.net/~text?txtsize=20&txt=2&w=150&h=150',
    'https://placeholdit.imgix.net/~text?txtsize=20&txt=3&w=150&h=150'];

  public images2:any[] = [
    'https://placeholdit.imgix.net/~text?txtsize=20&txt=4&w=150&h=150',
    'https://placeholdit.imgix.net/~text?txtsize=20&txt=5&w=150&h=150',
    'https://placeholdit.imgix.net/~text?txtsize=20&txt=6&w=150&h=150'];
  
  constructor(
    public userProvider: UserProvider,
    public af: AngularFire, 
    public navCtrl: NavController, 
    public dataService: Data, 
    public platform: Platform, 
    public simpleAlert: SimpleAlert, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController,
    public storage: Storage,
    private dragulaService: DragulaService,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public util: UtilProvider,
    public loadingCtrl: LoadingController) {

    console.log('EditProfilePage');


    dragulaService.setOptions('first-bag', {
      revertOnSpill: true
    });
    dragulaService.out.subscribe((value) => {
      let [e, el, container] = value;
      // console.log(`out: ${value[0]}`, e, el, container, this.images1, this.images2);
      // console.log(`out: ${value[0]}`, el, container.children);

      if (this.images1.length > 3) {
        this.images2.push( this.images1.pop() );
      }else if (this.images2.length > 3) {
        this.images1.push( this.images2.pop() );
      }
      // console.log(`out: done`, this.images1, this.images2);
      // this.onOut(value.slice(1));
    });

    

    this.checkPhotos();
    this.userProvider.getUser().then(userObservable => {
      if (userObservable) {
        userObservable.subscribe(user => {
          console.log('EditProfilePage user', user);
          this.user = user;
          this.loadedEdit = true;
          this.msg = user.aboutMe;
          this.gender = this.user.gender;

          if (!this.user.images) {
            this.user.images = [
            'https://placeholdit.imgix.net/~text?txtsize=20&txt=1&w=150&h=150',
            'https://placeholdit.imgix.net/~text?txtsize=20&txt=2&w=150&h=150',
            'https://placeholdit.imgix.net/~text?txtsize=20&txt=3&w=150&h=150',
            'https://placeholdit.imgix.net/~text?txtsize=20&txt=4&w=150&h=150',
            'https://placeholdit.imgix.net/~text?txtsize=20&txt=5&w=150&h=150',
            'https://placeholdit.imgix.net/~text?txtsize=20&txt=6&w=150&h=150'
            ];
          }
        });
      }
      
    });
  }

  ionViewDidLoad() {
    // Uncomment to use test data 
    /*this.photos = [
      new PhotoModel('http://placehold.it/100x100'), 
      new PhotoModel('http://placehold.it/100x100'), 
      new PhotoModel('http://placehold.it/100x100')
      ]*/

    this.platform.ready().then(() => {
      // this.loadPhotos();
    });
  }

  showPage(page:string){
    switch (page) {
      case 'church':
        this.navCtrl.push(ChurchPage);
        break;

      case 'speak':
        this.navCtrl.push(SpeakPage);
        break;

      case 'descent':
        this.navCtrl.push(DescentPage);
        break;

      case 'area':
        this.navCtrl.push(AreasPage);
        break;
      
      default:
        // code...
        break;
    }
  }

  presentActionSheet(posion:number) {
    let file_uri = this.user.images[posion];
    if (file_uri) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Edit gallery',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.deleteImage(file_uri);
            }
          },{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              
            }
          }
        ]
      });
      actionSheet.present();
    }else{
      //add image
    }
    
  }

  cameraActionSheet(){
    let cameraSheet = this.actionSheetCtrl.create({
      title: 'Add picture',
      buttons: [
        {
          text: 'From Camera',
          handler: () => {
            this.takePhoto2();
          }
        },{
          text: 'From Gallery',
          handler: () => {
            this.takePhoto3();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    cameraSheet.present();
  }

  loadPhotos(): void {
    this.dataService.getData().then((photos) => {
      let savedPhotos: any = false;
      if (typeof (photos) != "undefined") {
        savedPhotos = JSON.parse(photos);
      } if (savedPhotos) {
        savedPhotos.forEach(savedPhoto => {
          this.photos.push(new PhotoModel(savedPhoto.image));
        });
      }
      this.loadedEdit = true;
    });
  }

  createPhoto(photo): void {
    let newPhoto = new PhotoModel(photo);
    this.photos.push(newPhoto);
    this.save();
  }

  takePhoto(): any {
    if (!this.loadedEdit) {
      return false;
    }
    if (!this.platform.is('cordova')) {
      console.log("You can only take photos on a device!");
      return false;
    }

    let options = {
      quality: 100,
      destinationType: 1, //return a path to the image on the device sourceType: 1, //use the camera to grab the image
      encodingType: 0, //return the image in jpeg format
      cameraDirection: 1, //front facing camera
      saveToPhotoAlbum: true //save a copy to the users photo album as well
    };

  Camera.getPicture(options).then(imageData =>
      (imagePath) => {
        //Grab the file name
        let currentName = imagePath.replace(/^.*[\\\/]/, '');
        //Create a new file name
        let d = new Date(),
          n = d.getTime(),
          newFileName = n + ".jpg";
        if (this.platform.is('ios')) {
          //Move the file to permanent storage
          File.moveFile(cordova.file.tempDirectory, currentName, cordova.file.dataDirectory, newFileName).then((success: any) => {
            this.createPhoto(success.nativeURL);
            this.uploadPicture(imagePath);
            this.sharePhoto(success.nativeURL);
          }, (err) => {
            console.log(err);
            let alert = this.simpleAlert.createAlert('Oops!', 'Somethingwent wrong.');
            alert.present();
          });
        } else {
          this.createPhoto(imagePath);
          this.uploadPicture(imagePath);
          this.sharePhoto(imagePath);
        }
      },
      (err) => {
        let alert = this.simpleAlert.createAlert('Oops!', 'Something went wrong.');
        alert.present();
      }
    );
  }

  takePhoto2(): void {
    if (this.loadedEdit) {
      
    
    // if(this.maxPhotos == false){
      Camera.getPicture({
      quality : 95,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
      }).then(imageData => {
        this.uploadPicture(imageData)
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    
    }
  }

  takePhoto3(): void {
    if (this.loadedEdit) {
      
    
    // if(this.maxPhotos == false){
      Camera.getPicture({
      quality : 95,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: false
      }).then(imageData => {
        this.uploadPicture(imageData)
      }, error => {
        console.log("ERROR -> " + JSON.stringify(error));
      });
    
    }
  }

  deleteImage(photo): void {
    var storage = firebase.storage();
    var httpsReference = storage.refFromURL(photo);
    let photosLeft = [];
    photosLeft.length = 0;
    

    httpsReference.delete().then(function() {
      // File deleted successfully
      
    }).catch(function(error) {
      // Uh-oh, an error occurred!
    });

    this.storage.get('images').then(photos => {
        for (let ph of photos) {
          
          if(ph != photo) {
            photosLeft.push(ph);
            
          }
        }
        this.storage.set('images', photosLeft);
        this.writeUserData();
    });
      
  }

  removePhoto(photo): void {
    let index = this.photos.indexOf(photo);
    if (index > -1) {
      this.photos.splice(index, 1);
    }
  }


  sharePhoto(image): void {

  }

  save(): void {
    this.dataService.save(this.photos);
  }

uploadPicture(newFile){
  let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpeg";

  this.userProvider.getUid().then(uid => {
    this.userPhotos.length = 0;
    this.storageRef.child('images/'+ uid + '/' + newFileName).putString(newFile, 'base64', {contentType: 'image/jpeg'}).then((savedPicture) => {
      this.storage.get('images').then(photos => {
        if(!photos){
          this.userPhotos.push(savedPicture.downloadURL);
        }else {
          for (let photo of photos) {
            this.userPhotos.push(photo);
          }
          this.userPhotos.push(savedPicture.downloadURL);
        }
        this.storage.set('images', this.userPhotos);
        this.writeUserData();
      });
    });
  });
}

writeUserData(): void {
    if(!this.maxPhotos){
      this.checkPhotos();
    }
    let photosChosen = [];
    photosChosen.length = 0;
    this.storage.get('images').then(photo => {
      for (let ph of photo) {
            photosChosen.push(ph);
          }
         
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object('/users/'+uid);
      if (currentUserRef) {
          currentUserRef.update({
              images: photosChosen
        });
      }
      if(this.maxPhotos){
         this.checkPhotos();
      }
    });
    
  }

  checkPhotos(): void {
    this.storage.get('images').then(photo => {
      if(photo) {
        if (photo.length == 6){
          this.maxPhotos = true;
        }else {
          this.maxPhotos = false;
        }
      }else {
        this.maxPhotos = false;
      }
    });
  }

  done(): void{
    if(this.user.gender != undefined || this.user.gender != ""){
      this.user.aboutMe = this.msg;

      this.storage.set('descent', this.user.descent);
      this.storage.set('areas', this.user.areas);
      this.storage.set('gender', this.gender);
      this.storage.set('aboutMe', this.user.aboutMe);
      this.writeUserDataDone();
      this.navCtrl.setRoot(SettingsPage);
    }else {
      this.presentToast();
    }
  }

  writeUserDataDone(): void {
    let userDescent;
    this.storage.get('descent').then(descent => {
      userDescent = descent;
    });

    let areasChosen;
    this.storage.get('areas').then(areas => {
      areasChosen = areas;
    });

    let userGender;
    this.storage.get('gender').then(gender => {
      userGender = gender;
    });

    let userAboutMe;
    this.storage.get('aboutMe').then(aboutMe => {
      userAboutMe = aboutMe;
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object('/users/' + uid);
      if (currentUserRef) {
          currentUserRef.update({
              descent: userDescent,
              areas: areasChosen,
              gender: userGender,
              aboutMe: userAboutMe
        });
      } 
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Need more info!',
      cssClass: "toast-success",
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  showDescent(): void {
    this.checkPreviousDescent();
    let alert = this.alertCtrl.create();
    alert.setTitle('Are you of Greek Descent?');

    alert.addInput({
      type: 'radio',
      label: 'Yes',
      value: 'Yes',
      checked: true ? this.isYes : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Yes, Mother’s Side',
      value: 'Yes, Mother’s Side',
      checked: true ? this.isMother : false
    });

    alert.addInput({
      type: 'radio',
      label: 'Yes, Father’s Side',
      value: 'Yes, Father’s Side',
      checked: true ? this.isFather : false
    });

    alert.addInput({
      type: 'radio',
      label: 'No, just here for the lamb',
      value: 'No, just here for the lamb',
      checked: true ? this.isNo : false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.user.descent = data;
      }
    });
    alert.present();
  }

  checkPreviousDescent(): void {
    if(this.user.descent == "Yes"){
      this.isYes = true;
      this.isMother = false;
      this.isFather = false;
      this.isNo = false;
    }else if (this.user.descent == "Yes, Mother’s Side"){
      this.isYes = false;
      this.isMother = true;
      this.isFather = false;
      this.isNo = false;
    }else if (this.user.descent == "Yes, Father’s Side"){
      this.isYes = false;
      this.isMother = false;
      this.isFather = true;
      this.isNo = false;
    }else if (this.user.descent == "No, just here for the lamb") {
      this.isYes = false;
      this.isMother = false;
      this.isFather = false;
      this.isNo = true;
    }
  }

  showAreas() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select the areas where your family comes from, if you wish.');

    alert.addInput({
      type: 'checkbox',
      label: 'Central Greece',
      value: 'Central Greece',
      checked: true ? (this.user.areas).indexOf('Central Greece') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Thessalia',
      value: 'Thessalia',
      checked: true ? (this.user.areas).indexOf('Thessalia') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Macedonia',
      value: 'Macedonia',
      checked: true ? (this.user.areas).indexOf('Macedonia') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Epirus',
      value: 'Epirus',
      checked: true ? (this.user.areas).indexOf('Epirus') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Chalkidiki',
      value: 'Chalkidiki',
      checked: true ? (this.user.areas).indexOf('Chalkidiki') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Thraki',
      value: 'Thraki',
      checked: true ? (this.user.areas).indexOf('Thraki') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Sporades Islands',
      value: 'Sporades Islands',
      checked: true ? (this.user.areas).indexOf('Sporades Islands') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'NE Aegean Islands',
      value: 'NE Aegean Islands',
      checked: true ? (this.user.areas).indexOf('NE Aegean Islands') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Dodecanese Islands',
      value: 'Dodecanese Islands',
      checked: true ? (this.user.areas).indexOf('Dodecanese Islands') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Cyclades Islands',
      value: 'Cyclades Islands',
      checked: true ? (this.user.areas).indexOf('Cyclades Islands') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Crete Island',
      value: 'Crete Island',
      checked: true ? (this.user.areas).indexOf('Crete Island') >= 0 : false
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Saronic Islands',
      value: 'Saronic Islands',
      checked: true ? (this.user.areas).indexOf('Saronic Islands') >= 0 : false
    });
    alert.addInput({
      type: 'checkbox',
      label: 'Peloponnese',
      value: 'Peloponnese',
      checked: true ? (this.user.areas).indexOf('Peloponnese') >= 0 : false
    });
    alert.addInput({
      type: 'checkbox',
      label: 'Ionian Islands',
      value: 'Ionian Islands',
      checked: true ? (this.user.areas).indexOf('Ionian Islands') >= 0 : false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.user.areas = data;
      }
    });
    alert.present();
  }

  updateFacebook(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Updating Profile from Facebook...'
    });

    this.loading.present();
    Facebook.api('/me?fields=id,name,picture.width(500).height(500),email', ['public_profile']).then(
      (response) => {
        this.storage.set('username', response.name);
        this.storage.set('profile_picture', response.picture);
        this.storage.set('email', response.email);
          
        this.updateUserData(response);

        //THIS CHECK
        var user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: response.name,
            photoURL: response.picture.data.url
        }).then(function () {
            let alert = this.util.doAlert("Error user", user.displayName, "Ok");
            alert.present();
        }, function (error) {
            // An error happened.
        });

        // this.menu.enable(true);
        this.loading.dismiss();
      },

      (err) => {
        console.log(err);
        // let alert = this.doAlert.create({
        //   title: 'Oops!',
        //   subTitle: 'Something went wrong, please try again later.',
        //   buttons: ['Ok']
        // });
        let alert = this.util.doAlert("Error", err.message, "Ok");
        this.loading.dismiss();
        alert.present();
      }
      );
  }

    updateUserData(response): void {
        let userName;
        let userEmail;
        let userProfilePicture;

        this.storage.get('email').then(email => {
            userEmail = email;
        });
        this.storage.get('profile_picture').then(profile_picture => {
            userProfilePicture = profile_picture.data.url;
            // this.storage.get('images').then(photos => {
            //     if(photos){
            //         for (let photo of photos) {
            //             userImages.push(photo);
            //         }
            //     this.storage.set('images', userImages);
            //     }else {
            //         userImages.push(profile_picture.data.url);
            //         this.storage.set('images', userImages);
            //     }
            // });
        });
        this.storage.get('username').then(username => {
            userName = username;
        });
        this.userProvider.getUid().then(uid => {
            let currentUserRef = this.af.database.object(`/users/` + uid);
            if (currentUserRef) {
                currentUserRef.update({
                    email: userEmail,
                    username: userName,
                    profile_picture: userProfilePicture
                    // images: userImages
                });
            }
        });
    }
//   // File or Blob named mountains.jpg
// file = 

// // Create the file metadata


// // Upload file and metadata to the object 'images/mountains.jpg'
// this.uploadTask = this.storageRef.child('images/' + file.name).put(file, metadata);

// // Listen for state changes, errors, and completion of the upload.
// uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//   function(snapshot) {
//     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log('Upload is ' + progress + '% done');
//     switch (snapshot.state) {
//       case firebase.storage.TaskState.PAUSED: // or 'paused'
//         console.log('Upload is paused');
//         break;
//       case firebase.storage.TaskState.RUNNING: // or 'running'
//         console.log('Upload is running');
//         break;
//     }
//   }, function(error) {
//   switch (error.code) {
//     case 'storage/unauthorized':
//       // User doesn't have permission to access the object
//       break;

//     case 'storage/canceled':
//       // User canceled the upload
//       break;

//     ...

//     case 'storage/unknown':
//       // Unknown error occurred, inspect error.serverResponse
//       break;
//   }
// }, function() {
//   // Upload completed successfully, now we can get the download URL
//   var downloadURL = uploadTask.snapshot.downloadURL;
// });

 
}
