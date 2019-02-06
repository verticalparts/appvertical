import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, public formBuilder: FormBuilder, public estadoService: EstadoService, public clienteService: ClienteService, public alertCtrl: AlertController) {

    this.formGroup = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      tipo: ['1', [Validators.required]],
      cpfOucnpj: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: ['', []],
      bairro: ['', []],
      cep: ['', [Validators.required]],
      telefone1: ['', [Validators.required]],
      telefone2: ['', []],
      telefone3: ['', []],
      estadoId: [null, [Validators.required]]
    });
  }

  ionViewDidLoad(){
    this.estadoService.findAll()
      .subscribe(response => {
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id);
      },
      error => {});
  }

  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave(){
    this.menu.swipeEnable(true);
  }

  signupUser(){
    this.clienteService.insert(this.formGroup.value)
      .subscribe(response => {
        this.showInsertOk();
      },
      error => {});
  }
  showInsertOk(){
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
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
