import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DatosymlService {

  URI : String

  constructor(private httpClient: HttpClient) { 
    this.URI = "http://localhost:3000/"
  }

  //http://localhost:3000/temperatura/00:00:55
  getTemperatura(tiempo: string){
    return this.httpClient.get(`${this.URI}temperatura/${tiempo}`)
  }

  //http://localhost:3000/potencia/00:00:55
  getPotencia(tiempo: string){
    return this.httpClient.get(`${this.URI}potencia/${tiempo}`)
  }


}


//VER https://stackoverflow.com/questions/57571519/how-can-i-read-data-from-yaml-file-saved-in-my-pc-in-angular-application