import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController, AlertController, LoadingController} from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

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

  constructor(public navCtrl: NavController, 
              public menu: MenuController, 
              public alertCtrl: AlertController, 
              public auth: AuthService,
              public loadingCtrl: LoadingController) {

  }

  presentLoading(){
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  login(){
    let loader = this.presentLoading();
    this.auth.authenticate(this.creds)
      .subscribe(response => {
        this.auth.sucessfulLogin(response.headers.get('Authorization'));
        loader.dismiss();
        this.navCtrl.setRoot("Menu2Page");
      },
      error => {
        loader.dismiss();
      })
    
  }

  signup(){
    this.navCtrl.push("SignupPage");
  }

  newPass(){
    this.navCtrl.push("NewpPage");
  }

  noAccount(){
    this.navCtrl.setRoot("Menu2Page");
    let alert =  this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Você só poderá solicitar orçamentos se estiver logado em uma conta.',
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

  ionViewDidEnter(){
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.sucessfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot("Menu2Page");
      },
      error => {})
  }
}
