import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';

/**
 * Generated class for the Menu2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu2',
  templateUrl: 'menu2.html',
})
export class Menu2Page {

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  }
  
  goCategoria(){
    this.navCtrl.push("CategoriasPage");
  }

  goDocumentos(){
    this.navCtrl.push("DocumentosPage");
  }

}
