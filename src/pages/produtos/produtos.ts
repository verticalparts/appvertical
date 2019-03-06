import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { ProdutoService } from '../../services/domain/produto.service';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { CategoriaDTO } from '../../models/categoria.dto';
import { CategoriaService } from '../../services/domain/categoria.service';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CachedResourceLoader } from '@angular/platform-browser-dynamic/src/resource_loader/resource_loader_cache';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  page: number = 0;

  categorias: CategoriaDTO[];
  cliente: ClienteDTO;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public produtoService: ProdutoService, 
              public categoriaService: CategoriaService, 
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
        return (item.nome.toString().toLowerCase().indexOf(val.toLowerCase()) > -1) || 
               (item.vper.toString().toLowerCase().indexOf(val.toLowerCase()) > -1) || 
               (item.marca.toString().toLowerCase().indexOf(val.toLowerCase()) > -1)||
               (item.modelo.toString().toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else{
      this.page = 0;
      this.items = [];
      this.loadData();
    }
  }

  doRefresh() { //Recarregar produtos
    this.page = 0;
    this.items = [];
    this.loadData();
  }
  

  ionViewDidLoad() {  
    this.loadData();
  }

  loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
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
        this.produtoService.getImageFromBucket(item.id)
          .subscribe(response => {
            item.imageUrl = `${API_CONFIG.bucketProdUrl}/VPER-${item.id}.png`;
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

    showDetails(produto_id : string){
      this.navCtrl.push('DetalhesPage', {produto_id: produto_id});
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
        this.navCtrl.setRoot('CartPage');
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
