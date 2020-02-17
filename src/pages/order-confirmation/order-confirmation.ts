import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codPedido: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public cartService: CartService, 
              public clienteService: ClienteService,
              public pedidoService: PedidoService,
              public loadingCtrl: LoadingController) {
                this.pedido = this.navParams.get('pedido');
  }
  
  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;

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
    this.navCtrl.setRoot('CartPage');
  }

  backCat(){
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout(){
    let loader = this.presentLoading();
    this.pedidoService.insert(this.pedido)
      .subscribe(response => {
        this.cartService.createOrClearCart();
        this.cartService.qnt = 0;
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
