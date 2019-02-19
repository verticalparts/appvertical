import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { CartService } from '../../services/domain/cart.service';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-detalhes',
  templateUrl: 'detalhes.html',
})
export class DetalhesPage {

  item: ProdutoDTO;
  cliente: ClienteDTO;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public produtoService: ProdutoService,
              public cartService: CartService, 
              public storage: StorageService, 
              public clienteService: ClienteService,
              public alertCtrl: AlertController,
              public callNumber: CallNumber) {
  }

  ionViewDidLoad() {
    let produto_id = this.navParams.get('produto_id')
    this.produtoService.findById(produto_id)
      .subscribe(response => {
        this.item = response;
        this.getImageUrlIfExists();
      },
      error => {});
  }

  getImageUrlIfExists(){
    this.produtoService.getImageFromBucket(this.item.id)
      .subscribe(response => {
        this.item.imageUrl = `${API_CONFIG.bucketProdUrl}/VPER-${this.item.id}.png`;
      },
      error => {});
  }

  /* O Sistema só adiciona o item ao carrinho de compras caso o usuário esteja logado */ 
  addToCart(produto: ProdutoDTO){
    this.cartService.addProduto(produto);
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
       .subscribe(response => {
         this.cliente = response as ClienteDTO;
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
      subTitle: 'Você só poderá solicitar orçamentos se estiver logado em uma conta.',
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

  call(){
    this.callNumber.callNumber("+5511969122684", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

}
