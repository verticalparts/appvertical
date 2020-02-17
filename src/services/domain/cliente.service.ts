import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "../storage_service";
import { ImageUtilService } from "../image-util.service";

@Injectable()
export class ClienteService{

    constructor(public http: HttpClient,
                public storage: StorageService,
                public imageUtilService: ImageUtilService){

    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    getImageFromBucket(id : string) : Observable<any>{
        let url = `${API_CONFIG.bucketImageUrl}/cp${id}.jpg`
        return this.http.get(url, {responseType : 'blob'});
    }

    insert(obj : ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    uploadPicture(picture){

        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData : FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    newPass(newPass: ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/forgot`,
            newPass,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}