import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-servicos',
  templateUrl: 'servicos.html',
})
export class ServicosPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public callNumber: CallNumber,
              public iab: InAppBrowser) {
  }

  ionViewDidLoad() {
  }

  call(){
    this.callNumber.callNumber("+551125286473", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  chat(){
    const browser = this.iab.create('https://wa.me/5511995578519');
    browser.show()
  }

}
