import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menu: MenuController, public alertCtrl: AlertController) {

  }

  login(){
    this.navCtrl.setRoot("Menu2Page");
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
