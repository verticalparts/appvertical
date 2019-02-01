import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController, AlertController } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/domain/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  }

  constructor(public navCtrl: NavController, public menu: MenuController, public alertCtrl: AlertController, public auth: AuthService) {

  }

  login(){
    this.auth.authenticate(this.creds)
      .subscribe(response => {
        console.log(response.headers.get('Authorization'));
        this.navCtrl.setRoot("Menu2Page");
      },
      error => {})
    
  }

  noAccount(){
    this.navCtrl.setRoot("Menu2Page");
    let alert =  this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Você só poderá solicitar orçamentos se estiver logado em um conta.',
      buttons: ['Entendi']
    });
    return alert.present();
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave(){
    this.menu.swipeEnable(true);
  }
}
