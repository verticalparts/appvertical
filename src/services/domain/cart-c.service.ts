import { Injectable } from '@angular/core';
import { StorageService } from '../storage_service';
import { CartC } from '../../models/cart-c';
import { CorrimaoDTO } from '../../models/corrimao.dto';

@Injectable()
export class CartCService{

    qnt = 0;

    constructor(public storage: StorageService){
    }

    createOrClearCart() : CartC {
        let cartC: CartC = {items: []};
        this.storage.setCartC(cartC);
        return cartC;
    }

    getCartC() : CartC{
        let cartC: CartC = this.storage.getCartC();
        if (cartC == null){
            cartC = this.createOrClearCart();
        }
        return cartC;
    }

    addCorrimao(corrimao: CorrimaoDTO) : CartC{
        let cartC = this.getCartC();
        let position = cartC.items.findIndex(x => x.corrimao.id == corrimao.id);
        if(position == -1){
            cartC.items.push({corrimao: corrimao});
        }
        this.storage.setCartC(cartC);
        this.qnt = this.qnt + 1;
        return cartC;
    }

    removeProduto(corrimao: CorrimaoDTO) : CartC{
        let cartC = this.getCartC();
        let position = cartC.items.findIndex(x => x.corrimao.id == corrimao.id);
        if(position != -1){
            cartC.items.splice(position, 1);
        }
        this.storage.setCartC(cartC);
        this.qnt = this.qnt - 1;
        return cartC;
    }
}