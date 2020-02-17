import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { CategoriaCDTO } from "../../models/categoria-c.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class CategoriaCService{

    constructor(public http: HttpClient){

    }

    findAll() : Observable<CategoriaCDTO[]> {
        return this.http.get<CategoriaCDTO[]>(`${API_CONFIG.baseUrl}/categoriasC`);
    }
}