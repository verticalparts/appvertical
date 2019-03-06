import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { EnderecoDTO } from '../../models/endereco.dto';
import { CartItem } from '../../models/cart-item';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { CameraOptions, Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  items: EnderecoDTO[];
  perfil: string;
  endereco: EnderecoDTO;
  codPedido: string;
  cartItems: CartItem[];
  pedido: PedidoDTO;
  picture: string;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public menu: MenuController,
    public cartService: CartService,
    public camera: Camera) {

      this.perfil = "info";
  }
  loadEndereco(){
    let localUser = this.storage.getLocalUser();
   if(localUser && localUser.email){
     this.clienteService.findByEmail(localUser.email)
      .subscribe(response => {
        this.items = response['enderecos'];
      },
      error => {});
  }
}

  ionViewDidLoad() {
   let localUser = this.storage.getLocalUser();
   if(localUser && localUser.email){
     this.clienteService.findByEmail(localUser.email)
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        this.getImageIfExists();
      },
      error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
      this.loadEndereco();
  }
  else {
    this.navCtrl.setRoot('HomePage');
  }
}

goToSections(){
  this.navCtrl.setRoot("Menu2Page");
}

goToCategory(){
  this.navCtrl.setRoot("CategoriasPage")
}

goToCart(){
  this.navCtrl.setRoot("CartPage");
}

logout(){
    this.storage.setLocalUser(null);
    this.navCtrl.setRoot('HomePage');
}

ionViewWillEnter(){
  this.menu.swipeEnable(false);
}

ionViewWillLeave(){
  this.menu.swipeEnable(true);
}

  getImageIfExists(){
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketImageUrl}/cp${this.cliente.id}.jpg`;
      },
      error => {});
  }

  getCameraPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {

    });
  }
}
