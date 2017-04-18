import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { MyApp } from './app.component';
import { SimpleAlert } from '../providers/simple-alert';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UsersPage } from '../pages/users/users';
import { ChatsPage } from '../pages/chats/chats';
import { AccountPage } from '../pages/account/account';
import { ChatViewPage } from '../pages/chat-view/chat-view';
import { IntroPage } from '../pages/intro/intro';
import { WelcomePage } from '../pages/welcome/welcome';
import { DescentPage } from '../pages/descent/descent';
import { AreasPage } from '../pages/areas/areas';
import { ChurchPage } from '../pages/church/church';
import { AboutMePage } from '../pages/about-me/about-me';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { PremiumPage } from '../pages/premium/premium';
import { LegalPage } from '../pages/legal/legal';
import { FeedbackPage } from '../pages/feedback/feedback';
import { SettingsPage } from '../pages/settings/settings';
import { MainPage } from '../pages/main/main';
import { ExtendedProfilePage } from '../pages/extended-profile/extended-profile';
import { ChatMatchPage } from '../pages/chat-match/chat-match';
import { MatchPage } from '../pages/match/match';
import { UserSettingsPage } from '../pages/user-settings/user-settings';

//Swipe screen
import { SwingModule } from 'angular2-swing';
import { HttpModule } from '@angular/http';
//import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';


import { Filter } from '../pipes/filter';
import { ConvertDistance } from '../pipes/convert-distance'

import { AuthProvider } from '../providers/auth-provider/auth-provider';
import { ChatsProvider } from '../providers/chats-provider/chats-provider';
import { LikeProvider } from '../providers/like-provider/like-provider';
import { UserProvider } from '../providers/user-provider/user-provider';
import { PurchaseProvider } from '../providers/purchase-provider/purchase-provider';
import { CityService } from '../providers/city-service';

import { UtilProvider } from '../providers/utils';
import { Data } from '../providers/data';

export const firebaseConfig = {
  apiKey: "AIzaSyCPws3I2YmCW-kGvadQYlgm9JypziF6Z14",
  authDomain: "meetgreek-1783b.firebaseapp.com",
  databaseURL: "https://meetgreek-1783b.firebaseio.com",
  storageBucket: "meetgreek-1783b.appspot.com",
  messagingSenderId: "762176154683"
};

// const myFirebaseAuthConfig = {
//   provider: AuthProviders.Facebook,
//   method: AuthMethods.OAuthToken
// }

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    LoginPage,
    UsersPage,
    ChatsPage,
    AccountPage,
    ChatViewPage,
    IntroPage,
    WelcomePage,
    DescentPage,
    AreasPage,
    ChurchPage,
    AboutMePage,
    EditProfilePage,
    PremiumPage,
    LegalPage,
    FeedbackPage,
    MainPage,
    SettingsPage,
    ExtendedProfilePage,
    ChatMatchPage,
    MatchPage,
    UserSettingsPage,
    Filter,
    ConvertDistance
  ],
  imports: [
    IonicModule.forRoot(MyApp,
    {
        platforms : {
          ios : {
            // These options are available in ionic-angular@2.0.0-beta.2 and up.
            scrollAssist: false,    // Valid options appear to be [true, false]
            autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
          }
          // http://ionicframework.com/docs/v2/api/config/Config/)
        }
      }),
    AngularFireModule.initializeApp(firebaseConfig),
    SwingModule,
    HttpModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    UsersPage,
    ChatsPage,
    AccountPage,
    ChatViewPage,
    IntroPage,
    WelcomePage,
    DescentPage,
    AreasPage,
    ChurchPage,
    AboutMePage,
    EditProfilePage,
    PremiumPage,
    LegalPage,
    FeedbackPage,
    MainPage,
    SettingsPage,
    ChatMatchPage,
    UserSettingsPage,
    ExtendedProfilePage,
    MatchPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
  AuthProvider, ChatsProvider, LikeProvider, UserProvider, PurchaseProvider, UtilProvider, 
  CityService, SimpleAlert, Data]
})
export class AppModule {}
