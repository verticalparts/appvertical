import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PedidoCDTO } from '../../models/pedido-c.dto';
import { CartItemC } from '../../models/cart-itemC';
import { CartCService } from '../../services/domain/cart-c.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoCService } from '../../services/domain/pedido-c.service';


@IonicPage()
@Component({
  selector: 'page-order-confirmation-c',
  templateUrl: 'order-confirmation-c.html',
})
export class OrderConfirmationCPage {

  pedido: PedidoCDTO;
  cartItems: CartItemC[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codPedido: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cartCService: CartCService, 
              public clienteService: ClienteService,
              public pedidoCService: PedidoCService,
              public loadingCtrl: LoadingController) {
                this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartCService.getCartC().items;

    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('HomePage');
      });
  }

  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  back(){
    this.navCtrl.setRoot('CartCPage');
  }

  backCat(){
    this.navCtrl.setRoot('CategoriasCPage');
  }

  checkout(){
    let loader = this.presentLoading();
    this.pedidoCService.insert(this.pedido)
      .subscribe(response => {
        this.cartCService.createOrClearCart();
        this.cartCService.qnt = 0;
        loader.dismiss();
       this.codPedido = this.extractId (response.headers.get('location'));
      },
      error => {
        if(error.status == 403){
          this.navCtrl.setRoot('HomePage')
        }
      });
    }

      private extractId(location : string) : string{
        let position = location.lastIndexOf('/');
        return location.substring(position + 1, location.length);
      }

      presentLoading(){
        let loader = this.loadingCtrl.create({
          content: "Enviando cotação..."
        });
        loader.present();
        return loader;
      }

}
