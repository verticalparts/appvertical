import { Component, ViewChild } from '@angular/core';
import { Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';

import { ClienteDTO } from '../models/cliente.dto';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  pages: Array<{title: string, component: string}>;

  cliente: ClienteDTO;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              public auth: AuthService) {

    this.initializeApp();


    this.pages = [
      { title: 'Perfil', component: 'ProfilePage' },
      { title: 'Seleção de Menus', component: 'Menu2Page' },
      { title: 'Categorias', component: 'CategoriasPage' },
      { title: 'Carrinho', component: 'CartPage'},
      { title: 'Logout', component: ''}
      
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page : {title:string, component:string}) {
    
    switch(page.title){
      case 'Logout':
      this.auth.logout();
      this.nav.setRoot('HomePage');
      break;

      default:
      this.nav.setRoot(page.component);

      /* O sistema tira o usuário não logado caso ele tente acessar o carrinho */
      switch(page.title){
      case 'Carrinho':
      if(this.auth.noProfileCart()){
      this.nav.setRoot('HomePage');
      }
      else{
        this.nav.setRoot(page.component);
      }
      break;
      }
    }
  }
}
