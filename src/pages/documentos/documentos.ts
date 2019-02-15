import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, MenuController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';


@IonicPage()
@Component({
  selector: 'page-documentos',
  templateUrl: 'documentos.html',
})
export class DocumentosPage {

  cliente: ClienteDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform, 
              private iab: InAppBrowser,
              public storage: StorageService,
              public menu: MenuController,
              public clienteService: ClienteService,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

  openDoc(){
   let url = encodeURIComponent('');
   this.iab.create('https://drive.google.com/file/d/1YDimkUGAKCobtCr_V_YBRVmXZ_nJGyVO/view?usp=sharing' + url);
  }

  goToProfile(){
    this.navCtrl.setRoot("ProfilePage");
  }

  goToSections(){
    this.navCtrl.setRoot("Menu2Page");
  }

  goToCategory(){
    this.navCtrl.setRoot("CategoriasPage")
  }
  
  /* O Sistema só irá ao carrinho de compras caso o usuário esteja logado */ 
  goToCart(){
    let localUser = this.storage.getLocalUser();
  if(localUser && localUser.email){
    this.clienteService.findByEmail(localUser.email)
     .subscribe(response => {
       this.cliente = response as ClienteDTO;
       this.navCtrl.push('CartPage');
     },
     error => {
       if (error.status == 403) {
         console.log(error);
       }
     });
 }
 else {
  let alert =  this.alertCtrl.create({
    title: 'Aviso!',
    subTitle: 'Entre com uma conta para acessar seu carrinho!',
    buttons: [{
      text: 'Cancelar',
      handler: () => {
        
      }
    },
    {
      text: 'Fazer login',
      handler: () => {
        this.navCtrl.setRoot('HomePage');
      }
    }]
  });
  return alert.present();
}
  }

  logout(){
    this.storage.setLocalUser(null);
    this.navCtrl.setRoot('HomePage');
  }
}