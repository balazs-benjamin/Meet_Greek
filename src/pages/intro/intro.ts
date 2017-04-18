import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class IntroPage { 
  slideOptions: any; 
  
  constructor(public nav: NavController) { 
    this.slideOptions = { 
      pager: true 
    }; 
  } 
  
  goToLogin(): void { 
    this.nav.setRoot(LoginPage); 
  } 
}
