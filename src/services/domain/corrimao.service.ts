import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';
import { Observable } from 'rxjs/Rx';
import { CorrimaoDTO } from '../../models/corrimao.dto';

@Injectable()
export class CorrimaoService{
    constructor(public http: HttpClient){
    }

    findById(corrimao_id : string){
        return this.http.get<CorrimaoDTO>(`${API_CONFIG.baseUrl}/corrimaos/${corrimao_id}`);
    }

    findByCategoria(categoriaC_id : string, page : number = 0, linesPerPage : number = 24){
        return this.http.get(`${API_CONFIG.baseUrl}/corrimaos/?categoriasC=${categoriaC_id}&page=${page}&linesPerPage=${linesPerPage}`);
    }

    getImageFromBucket(id: string) : Observable<any>{
        let url = `${API_CONFIG.bucketCorrUrl}/VP-${id}.png`
        return this.http.get(url, {responseType: 'blob'});
    }
}