import { Component, OnInit } from '@angular/core';
import { DatosymlService } from './services/datosyml.service';
import { Values } from './entidades/values';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  public valorTiempo         // Clase undefined para recoger los datos
  public valorTemperatura    : any = null
  public valorPotencia       : any = null
  public mensajeError        : string = ""
  public horaActual          : string

  constructor (private datosymlService:DatosymlService){}

  ngOnInit():void{
    // Ejecuta cada x tiempo
    setInterval(() => {
      this.reloj();
    }, 1000);
  }

  // Llena de 0 a la izquierda
  public llenarCeros(number, width){
    width -= number.toString().length;
    if ( width > 0 ){
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + ""; // devuelve tipo cadena
  }

  
  public reloj():void{
    let date     = new Date();

    let hora     = this.llenarCeros(date.getHours(), 2)
    let minutos  = this.llenarCeros(date.getMinutes(), 2)
    let segundos = this.llenarCeros(date.getSeconds(), 2)
    
    this.horaActual = hora+":"+minutos+":"+segundos

    // Lanza consulta cada 5 segundos
    if (!(date.getSeconds() % 5)){
      //this.mensajeError = this.horaActual
      this.getTemperatura(this.horaActual)
      this.getPotencia(this.horaActual)
    }
  }


  getTemperatura(tiempo:string):void{
    //this.valorTiempo = tiempo

    this.datosymlService.getTemperatura(tiempo)
    .subscribe(
      res => this.valorTemperatura = res,
      err => console.log(err)   // Manejar el error
    )
  }


  getPotencia(tiempo:string):void{
    //this.valorTiempo = tiempo

    this.datosymlService.getPotencia(tiempo)
    .subscribe(
      res => this.valorPotencia = res,
      err => console.log(err)   // Manejar el error
    )
  }

  submitTiempo(tiempo:HTMLInputElement){
    //Validamos que los campos del formulario no están vacios
    if(tiempo.value){
      //Hacer petición
      this.getTemperatura(tiempo.value)

      //tiempo.value =''
      //this.mensajeError = '' //Borra mensaje de error
    }else{
      this.mensajeError = 'Introduzca algún valor. Los campos no deben estar vacíos.'
    }
    tiempo.focus()  //Coge el foco después de hacer submit
    return false    //Para que no refresque el formulario al hacer submit
  }

}
