import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage_service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoCDTO } from '../../models/pedido-c.dto';
import { CartCService } from '../../services/domain/cart-c.service';

/**
 * Generated class for the EnderecoCPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-endereco-c',
  templateUrl: 'endereco-c.html',
})
export class EnderecoCPage {

  items: EnderecoDTO[];

  pedido: PedidoCDTO;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public storage: StorageService,
              public clienteService: ClienteService,
              public cartCService: CartCService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
   if(localUser && localUser.email){
     this.clienteService.findByEmail(localUser.email)
      .subscribe(response => {
        this.items = response['enderecos'];

        let cartC = this.cartCService.getCartC();

        this.pedido = {
          cliente: {id: response['id']},
          enderecoDeEntrega: null, 
          itens : cartC.items.map(x => {return {corrimao: {id: x.corrimao.id}} })
        }
      },
      error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
  }
  else {
    this.navCtrl.setRoot('HomePage');
  }
  }

  nextPage(item: EnderecoDTO){
    this.pedido.enderecoDeEntrega = {id: item.id};
    this.navCtrl.setRoot('OrderConfirmationCPage', {pedido: this.pedido});
  }

}
