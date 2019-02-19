import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from '../../config/api.config';
import { StorageService } from '../../services/storage_service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { ClienteService } from '../../services/domain/cliente.service';
import { ClienteDTO } from '../../models/cliente.dto';

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  items: CategoriaDTO[];
  cliente: ClienteDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public categoriaService: CategoriaService,
              public storage: StorageService,
              public menu: MenuController,
              public clienteService: ClienteService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loader = this.presentLoading();
    this.categoriaService.findAll()
    .subscribe(response => {
      loader.dismiss();
      this.items = response;
    },
    error =>{});
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

    showProdutos(categoria_id : string){
      this.navCtrl.push('ProdutosPage', {categoria_id: categoria_id});
    }

    goToProfile(){
      let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
       .subscribe(response => {
         this.cliente = response as ClienteDTO;
         this.navCtrl.setRoot("ProfilePage");
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
      subTitle: 'Entre com uma conta para acessar seu perfil!',
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

    goToSections(){
      this.navCtrl.setRoot("Menu2Page");
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

  presentLoading(){
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }
}


