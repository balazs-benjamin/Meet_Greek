import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth-provider/auth-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { UtilProvider } from '../../providers/utils';
import { ChurchPage } from '../church/church';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the Areas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-areas',
  templateUrl: 'areas.html'
})
export class AreasPage {
  // atticaStatus: boolean;
  // pelopenneseStatus: boolean;
  // eviaStatus: boolean;
  // stereaElladaStatus: boolean;
  // thessalyStatus: boolean;
  // epirusStatus: boolean;
  // macedoniaStatus: boolean;
  // thraceStatus: boolean;
  // eptanisaStatus: boolean;
  // dodekanisaStatus: boolean;
  // kykladesStatus: boolean;
  // sporadesStatus: boolean;
  // creteStatus: boolean;

  places = [];

  constructor(
    public nav: NavController,
    public af: AngularFire,
    public auth: AuthProvider,
    public userProvider: UserProvider,
    public util: UtilProvider,
    public storage: Storage,
    public alertCtrl: AlertController) {

    }

  ionViewDidLoad() {
    
  }

  next(): void {
    // this.places = [];
    // if(this.atticaStatus){
    //   this.places.push("Attica");
    // }
    // if(this.pelopenneseStatus){
    //   this.places.push("Peloponnese");
    // }
    // if(this.eviaStatus){
    //   this.places.push("Evia");
    // }
    // if(this.stereaElladaStatus){
    //   this.places.push("Sterea Ellada");
    // }
    // if(this.thessalyStatus){
    //   this.places.push("Thessaly");
    // }
    // if(this.epirusStatus){
    //   this.places.push("Epirus");
    // }
    // if(this.macedoniaStatus){
    //   this.places.push("Macedonia");
    // }
    // if(this.eptanisaStatus){
    //   this.places.push("Eptanisa");
    // }
    // if(this.dodekanisaStatus){
    //   this.places.push("Dodekanisa");
    // }
    // if(this.kykladesStatus){
    //   this.places.push("Kyklades");
    // }
    // if(this.sporadesStatus){
    //   this.places.push("Sporades");
    // }
    // if(this.creteStatus){
    //   this.places.push("Crete");
    // }

    this.storage.set('areas', this.places);
    this.writeUserData();
    this.nav.push(ChurchPage);
  }

  showCheckbox() {
    this.places = [];
    let alert = this.alertCtrl.create();
    alert.setTitle('Select the areas where your family comes from, if you wish.');

    alert.addInput({
      type: 'checkbox',
      label: 'Central Greece',
      value: 'Central Greece'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Thessalia',
      value: 'Thessalia'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Macedonia',
      value: 'Macedonia'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Epirus',
      value: 'Epirus'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Chalkidiki',
      value: 'Chalkidiki'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Thraki',
      value: 'Thraki'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Sporades Islands',
      value: 'Sporades Islands'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'NE Aegean Islands',
      value: 'NE Aegean Islands'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Dodecanese Islands',
      value: 'Dodecanese Islands'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Cyclades Islands',
      value: 'Cyclades Islands'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Crete Island',
      value: 'Crete Island'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Saronic Islands',
      value: 'Saronic Islands'
    });
    alert.addInput({
      type: 'checkbox',
      label: 'Peloponnese',
      value: 'Peloponnese'
    });
    alert.addInput({
      type: 'checkbox',
      label: 'Ionian Islands',
      value: 'Ionian Islands'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.places = data;
      }
    });
    alert.present();
  }

  writeUserData(): void {
    let areasChosen;
      
    this.storage.get('areas').then(areas => {
      areasChosen = areas;
    });

    this.userProvider.getUid().then(uid => {
      let currentUserRef = this.af.database.object(`/users/${uid}`);
      if (currentUserRef) {
          currentUserRef.update({
              areas: areasChosen
        });
      } 
    });
  }

}
