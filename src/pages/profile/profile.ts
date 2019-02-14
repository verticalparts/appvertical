import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { StorageService } from '../../services/storage_service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  perfil: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public menu: MenuController) {
      this.perfil = "info";
  }

  ionViewDidLoad() {
   let localUser = this.storage.getLocalUser();
   if(localUser && localUser.email){
     this.clienteService.findByEmail(localUser.email)
      .subscribe(response => {
        this.cliente = response;
        this.getImageIfExists();
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
}
