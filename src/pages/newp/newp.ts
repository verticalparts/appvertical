import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../services/domain/cliente.service';
@IonicPage()
@Component({
  selector: 'page-newp',
  templateUrl: 'newp.html',
})
export class NewpPage {

  formGroup: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public clienteService: ClienteService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

                this.formGroup = this.formBuilder.group({
                  email: ['', [Validators.required, Validators.email]]
                });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewpPage');
  }

  newPass(){
    let loader = this.presentLoading();
    this.clienteService.newPass(this.formGroup.value)
      .subscribe(response => {
        loader.dismiss();
        this.showInsertOk();
      },
      error => {
        loader.dismiss();
        this.showError();
      });
  }

  presentLoading(){
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Email enviado com sucesso!',
      message: 'Verifique a nova senha em seu email.',
      enableBackdropDismiss: false,
      buttons: [ 
      {
        text: 'Ok',
        handler: () => {
          this.navCtrl.setRoot('HomePage');
        }
      }
    ]
    });
    alert.present();
  }

  showError(){
    let alert = this.alertCtrl.create({
      title: 'Email não encontrado, crie já sua conta!',
      message: 'Verificamos em nosso banco de dados e não foi encontrado nenhum email com essas especificaçõs.',
      enableBackdropDismiss: false,
      buttons: [ 
      {
        text: 'Ok',
        handler: () => {
          this.navCtrl.setRoot('HomePage');
        }
      }
    ]
    });
    alert.present();
  }

}
