import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage_service";
import { JwtHelper } from 'angular2-jwt';
import { CartService } from "./domain/cart.service";
import { ClienteDTO } from "../models/cliente.dto";
import { ClienteService } from "./domain/cliente.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class AuthService{

    jwtHelper : JwtHelper = new JwtHelper();

    cliente: ClienteDTO;

    constructor(public http: HttpClient,
                public storage: StorageService, 
                public cartService: CartService,
                public clienteService: ClienteService,
                public alertCtrl: AlertController){
    }

    authenticate(creds : CredenciaisDTO){
       return this.http.post(`${API_CONFIG.baseUrl}/login`, 
        creds,
        {
            observe: 'response',
            responseType: 'text'
        })
    }

    refreshToken(){
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`, 
        {},
        {
             observe: 'response',
             responseType: 'text'
         })
     }

    sucessfulLogin(authorizationValue: string){
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
            token: tok,
            email: this.jwtHelper.decodeToken(tok).sub
        };
        this.storage.setLocalUser(user);
        this.cartService.createOrClearCart();
    }

    logout(){
        this.storage.setLocalUser(null);
    }

    /* O sistema tira o usuário não logado caso ele tente acessar o carrinho */
    noProfileCart(){
        let localUser = this.storage.getLocalUser();
        if(localUser && localUser.email){
          this.clienteService.findByEmail(localUser.email)
           .subscribe(response => {
             this.cliente = response as ClienteDTO;
           },
           error => {
             if (error.status == 403) {
               console.log(error);
             }
           });
       }
       else {
        let alert =  this.alertCtrl.create({
          title: 'Aviso!',
          subTitle: 'Entre com uma conta para acessar seu carrinho!',
          buttons: ['Ok']
        });
        return alert.present();
      }
        }
    }
