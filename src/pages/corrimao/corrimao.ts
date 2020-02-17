import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  MenuController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { CorrimaoService } from '../../services/domain/corrimao.service';
import { CorrimaoDTO } from '../../models/corrimao.dto';
import { API_CONFIG } from '../../config/api.config';
import { CategoriaCDTO } from '../../models/categoria-c.dto';
import { CategoriaCService } from '../../services/domain/categoria-c.service';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-corrimao',
  templateUrl: 'corrimao.html',
})
export class CorrimaoPage {

  items: CorrimaoDTO[] = [];
  page: number = 0;

  categorias: CategoriaCDTO[];
  cliente: ClienteDTO;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public corrimaoService: CorrimaoService, 
              public categoriaCService: CategoriaCService, 
              public storage: StorageService, 
              public menu: MenuController,
              public clienteService: ClienteService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public loadingCtrl: LoadingController) {
  }

  getProdutos(ev) { //Filtrar produtos
    var val = ev.target.value;
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.nome.toString().toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.page = 0;
      this.items = [];
      this.loadData();
    }
  }

  /*doRefresh(refresher) {
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }*/
  
  ionViewDidLoad() {  
    this.loadData();
  }

  loadData(){
    let categoriaC_id = this.navParams.get('categoriaC_id');
    let loader = this.presentLoading();
    this.corrimaoService.findByCategoria(categoriaC_id, this.page, 10)
      .subscribe(response => {
        let start = this.items.length;
        this.items = this.items.concat (response['content']);
        let end = this.items.length - 1;
        loader.dismiss();
        this.loadImageUrls(start, end);
      },
      error => {
        loader.dismiss();
      });
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }
  
    loadImageUrls(start: number, end: number) {
      for (var i=start; i<=end; i++) {
        let item = this.items[i];
        this.corrimaoService.getImageFromBucket(item.id)
          .subscribe(response => {
            item.imageUrl = `${API_CONFIG.bucketCorrUrl}/VP-${item.id}.png`;
          },
          error => {});
      }
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

    showDetails(corrimao_id : string){
      this.navCtrl.push('DetalhesCPage', {corrimao_id: corrimao_id});
    }

    goToSections(){
      this.navCtrl.setRoot("Menu2Page");
    }
    
    goToCategory(){
      this.navCtrl.setRoot("CategoriasCPage")
    }
    
    /* O Sistema só irá ao carrinho de compras caso o usuário esteja logado */ 
    goToCart(){
      let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
      .subscribe(response => {
        this.navCtrl.setRoot('CartCPage');
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

      doInfinite(infiniteScroll) {
        this.page++;
        this.loadData();   
        setTimeout(() => {
          infiniteScroll.complete();
        }, 1000);
      }

}
