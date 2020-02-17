import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { PedidoCDTO } from "../../models/pedido-c.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class PedidoCService{

    constructor(public http: HttpClient){

    }

    insert (obj: PedidoCDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/pedidosC`,
            obj,
            {
               observe: 'response',
               responseType: 'text' 
            } 
        );
    }
}