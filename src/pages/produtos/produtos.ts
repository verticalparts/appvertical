import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ModalController } from 'ionic-angular';
import { ProdutoService } from '../../services/domain/produto.service';
import { ProdutoDTO } from '../../models/produto.dto';
import { API_CONFIG } from '../../config/api.config';
import { CategoriaDTO } from '../../models/categoria.dto';
import { CategoriaService } from '../../services/domain/categoria.service';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];
  categorias: CategoriaDTO[];
  cliente: ClienteDTO;
  testRadioOpen: boolean;
  testRadioResult: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public produtoService: ProdutoService, 
              public categoriaService: CategoriaService, 
              public storage: StorageService, 
              public menu: MenuController,
              public clienteService: ClienteService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {  
    let categoria_id = this.navParams.get('categoria_id');
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        this.items = response['content'];
        this.loadImageUrls();
      },
      error => {});
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

  loadImageUrls() {
    for (var i=0; i<this.items.length; i++) {
      let item = this.items[i];
      this.produtoService.getImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketProdUrl}/VPER-${item.id}.png`;
        },
        error => {});
    }
  } 

  goToProfile(){
    this.navCtrl.setRoot("ProfilePage");
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
       this.cliente = response;
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

  getFilter() {
      const modal = this.modalCtrl.create("ModalPage");
      modal.present();
    }
 
}
