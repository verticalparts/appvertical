import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { EnderecoDTO } from '../../models/endereco.dto';
import { CartItem } from '../../models/cart-item';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

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
  profileImage;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public menu: MenuController,
    public cartService: CartService,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public sanitizer: DomSanitizer) {
      this.profileImage = 'assets/imgs/avatar-blank.png';
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

presentActionSheet() {
  const actionSheet = this.actionSheetCtrl.create({
    title: 'Alterar foto de perfil',
    buttons: [
      {
        text: 'Tirar foto',
        role: 'tirar foto',
        handler: () => {
          this.getCameraPicture();
        }
      },{
        text: 'Procurar foto',
        handler: () => {
          this.getPicture();
        }
      },{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
    
        }
      }
    ]
  });
  actionSheet.present();
}

  ionViewDidLoad() {
   this.loadData();
  }

  loadData(){
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

blobToDataURL(blob){
  return new Promise((fulfill, reject) => {
    let reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => fulfill(reader.result);
    reader.readAsDataURL(blob);
  }) 
}

  getImageIfExists(){
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketImageUrl}/cp${this.cliente.id}.jpg`;
        this.blobToDataURL(response).then(dataUrl => {
          let str : string = dataUrl as string;
          this.profileImage = this.sanitizer.bypassSecurityTrustUrl(str);
        });
      },
      error => {
        this.profileImage = 'assets/imgs/avatar-blank.png';
      });
  }

  getCameraPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  getPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    
    this.camera.getPicture(options).then((imageData) => {
     this.picture = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  sendPicture(){
    let loader = this.presentLoading();
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response =>{
        this.picture = null;
        this.getImageIfExists;
        loader.dismiss();
      },
      error=> {});
  }

  cancel(){
    this.picture = null;
  }

  presentLoading(){
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }
}
