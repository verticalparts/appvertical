import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController} from 'ionic-angular';
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

  pages: Array<{title: string, component: string, icon: string}>;

  cliente: ClienteDTO;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              public auth: AuthService,
              ) {

    this.initializeApp();


    this.pages = [
      { title: 'Perfil', component: 'ProfilePage', icon: "people" },
      { title: 'Seleção de Menus', component: 'Menu2Page', icon: "albums" },
      /*{ title: 'Produtos', component: 'CategoriasPage', icon: "construct" },
      { title: 'Carrinho de Peças', component: 'CartPage', icon: "cart"},
      { title: 'Corrimãos', component: 'CategoriasCPage', icon: "construct" },
      { title: 'Carrinho de Corrimãos', component: 'CartCPage', icon: "cart"},*/
      { title: 'Logout', component: '', icon: "exit"}
      
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
