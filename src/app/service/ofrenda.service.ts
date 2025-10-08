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
        this.myAPIUrl ='api/preguntas';
  }

  getRFC(rfc: String): Observable<any> {
    return this.http.get<any>(`${this.myAppUrl}${this.myAPIUrl}/getrfc/${rfc}`)
  }

  saveRegistro(preguntas: any, rfc: String):Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/savecuestionario/${rfc}`,preguntas)
  }


}
