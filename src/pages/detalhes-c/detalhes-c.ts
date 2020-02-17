import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CorrimaoDTO } from '../../models/corrimao.dto';
import { CorrimaoService } from '../../services/domain/corrimao.service';
import { API_CONFIG } from '../../config/api.config';
import { CartCService } from '../../services/domain/cart-c.service';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-detalhes-c',
  templateUrl: 'detalhes-c.html',
})
export class DetalhesCPage {

  item: CorrimaoDTO;
  cliente: ClienteDTO;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public corrimaoService: CorrimaoService,
              public cartCService: CartCService, 
              public storage: StorageService, 
              public clienteService: ClienteService,
              public alertCtrl: AlertController,
              public callNumber: CallNumber,
              public iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    let corrimao_id = this.navParams.get('corrimao_id')
    this.corrimaoService.findById(corrimao_id)
      .subscribe(response => {
        this.item = response;
        this.getImageUrlIfExists();
      },
      error => {});
  }

  getImageUrlIfExists(){
    this.corrimaoService.getImageFromBucket(this.item.id)
      .subscribe(response => {
        this.item.imageUrl = `${API_CONFIG.bucketCorrUrl}/VP-${this.item.id}.png`;
      },
      error => {});
  }

  /* O Sistema só adiciona o item ao carrinho de compras caso o usuário esteja logado */ 
  addToCart(corrimao: CorrimaoDTO){
    this.cartCService.addCorrimao(corrimao);
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
       .subscribe(response => {
         this.cliente = response as ClienteDTO;
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
    this.callNumber.callNumber("+551125286473", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  chat(){
    const browser = this.iab.create('https://api.whatsapp.com/send?phone=+5511995578519');
    browser.show()
  }

}
