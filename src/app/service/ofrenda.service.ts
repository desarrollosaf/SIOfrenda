import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable, signal, inject, computed } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment'; 


@Injectable({
  providedIn: 'root'
})
export class OfrendaService {

  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );
  constructor() {
        this.myAppUrl = enviroment.endpoint;
        this.myAPIUrl ='api/registro';
  }

  getRFC(rfc: String): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/datos/${rfc}`)
  }

  saveRegistro(datos: any):Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/saveregistro/`,datos)
  }

  getRegistro():Observable<string> {
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/saveregistro/`)
  }


}
