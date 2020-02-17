import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItemC } from '../../models/cart-itemC';
import { CorrimaoService } from '../../services/domain/corrimao.service';
import { API_CONFIG } from '../../config/api.config';
import { CartCService } from '../../services/domain/cart-c.service';
import { CorrimaoDTO } from '../../models/corrimao.dto';

@IonicPage()
@Component({
  selector: 'page-cart-c',
  templateUrl: 'cart-c.html',
})
export class CartCPage {

  items: CartItemC[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public cartCService: CartCService, 
              public corrimaoService: CorrimaoService) {
  }

  ionViewDidLoad() {
    let cartC = this.cartCService.getCartC();
    this.items = cartC.items;
    this.loadImageUrls();
  }

  loadImageUrls() {
    for (var i=0; i<this.items.length; i++) {
      let item = this.items[i];
      this.corrimaoService.getImageFromBucket(item.corrimao.id)
        .subscribe(response => {
          item.corrimao.imageUrl = `${API_CONFIG.bucketCorrUrl}/VP-${item.corrimao.id}.png`;
        },
        error => {});
    }
  } 

  total(){
    return this.cartCService.qnt;
  }

  removeItem(corrimao: CorrimaoDTO) {
    this.items = this.cartCService.removeProduto(corrimao).items;
  }

  goOn() {
    this.navCtrl.setRoot('CategoriasCPage');
  }

  checkout() {
    this.navCtrl.push('EnderecoCPage');
  }

}
