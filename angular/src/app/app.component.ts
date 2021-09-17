import { Component, OnInit } from '@angular/core';
import { DatosymlService } from './services/datosyml.service';
import { Values } from './entidades/values';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'})

export class AppComponent implements OnInit{

  public valorTemperatura         : any = ""
  public valorPotencia            : any = ""
  public horaActual               : string
  public TempeValoresProcesados   : number[] = []
  public TempeContadorIteraciones : number = 0
  public PotenValoresProcesados   : number[] = []
  public PotenContadorIteraciones : number = 0

  public mensajeTemperatura       : string = "Procesando intervalo minutal para su representación gráfica..."
  public mensajePotencia          : string = "Procesando intervalo minutal para su representación gráfica..."

  // Chart arrays
  public chartTemperatura         : any[]
  public chartPotencia            : any[]

  // Chart options
  public legend                   : boolean = false
  public showLabels               : boolean = true
  public animations               : boolean = true
  public xAxis                    : boolean = true
  public yAxis                    : boolean = true
  public showYAxisLabel           : boolean = true
  public showXAxisLabel           : boolean = true
  public xAxisLabelTemp           : string = 'time (HH:mm)'
  public yAxisLabelTemp           : string = 'Temperatura (grados C)'
  public xAxisLabelPote           : string = 'time (HH:mm)'
  public yAxisLabelPote           : string = 'Potencia (kW)'
  public timeline                 : boolean = false

  public colorScheme1 = { domain: ['#5AA454'] }
  public colorScheme2 = { domain: ['red'] }


  constructor (private datosymlService:DatosymlService){
    // Valores gráfica Temperatura
    this.chartTemperatura =    [
      {
        "name": "Temperatura (ºC)",
        "series": []
      },
    ]
    
    // Valores gráfica Potencia
    this.chartPotencia =    [
      {
        "name": "Potencia (kW)",
        "series": []
      },
    ]
  }

  
  ngOnInit():void{
    // Ejecuta cada segundo
    setInterval(() => {
      this.reloj();
    }, 1000);
  }


  // Llena de 0 a la izquierda un número y lo convierte a string
  private llenarCerosIzquierda(number, width){
    width -= number.toString().length
    if ( width > 0 ){
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
    }
    return number + "" // devuelve tipo cadena
  }

  
  private reloj():void{
    // Obtiene hora actual
    let date     = new Date();

    let hora     = this.llenarCerosIzquierda(date.getHours(), 2)
    let minutos  = this.llenarCerosIzquierda(date.getMinutes(), 2)
    let segundos = this.llenarCerosIzquierda(date.getSeconds(), 2)
    
    this.horaActual = hora+":"+minutos+":"+segundos

    // Lanza consulta cada 5 segundos
    if (!(date.getSeconds() % 5)){
      this.getTemperatura(this.horaActual)
      this.getPotencia(this.horaActual)
    }
  }


  private getTemperatura(tiempo:string):void{
    this.datosymlService.getTemperatura(tiempo)
    .subscribe(
      res => this.valorTemperatura = res,
      err => console.log(err)   // Manejar el error
    )
    this.procesarTemperatura(this.valorTemperatura.time, this.valorTemperatura.value)
  }



  private getPotencia(tiempo:string):void{
    this.datosymlService.getPotencia(tiempo)
    .subscribe(
      res => this.valorPotencia = res,
      err => console.log(err)   // Manejar el error
    )
    this.procesarPotencia(this.valorPotencia.time, this.valorPotencia.value)
  }


  private procesarTemperatura(tiempo:string, val: number):void{
    let valorMedioT : number = 0

    if (!(val==null || val==-1)) {
        this.TempeValoresProcesados.push(val)
        console.log("TEMPE | Valores recibido: " + val);
    }
    this.TempeContadorIteraciones += 1       

    if (this.TempeContadorIteraciones == 12){          // ==12 un minuto (entra cada 5 segundos)
      let nuevoValorT = new Values
     
      if (this.TempeValoresProcesados.length == 0){   // Si no recoje valor devuelve 0 a la gráfica
        nuevoValorT.name = tiempo
        nuevoValorT.value = null
      }
      else{
        for (let i=0; i<this.TempeValoresProcesados.length; i++) {
          valorMedioT += this.TempeValoresProcesados[i];
         }
  
        valorMedioT = valorMedioT/this.TempeValoresProcesados.length
        let valorCelsius = (valorMedioT/10) - 273.15
        console.log("TEMPE | ValorMedio dk: "+ valorMedioT + " | ValorMedio ºC: "+ valorCelsius);
  
        nuevoValorT.name  = tiempo.slice(0, 5)
        nuevoValorT.value = valorCelsius
      }

      // Actualiza valores en gráfica
      this.chartTemperatura[0].series.push(nuevoValorT)
      this.chartTemperatura = [...this.chartTemperatura]
      this.mensajeTemperatura=""

      //Inicializar
      this.TempeContadorIteraciones = 0
      this.TempeValoresProcesados = []
    }
  }

  
  private procesarPotencia(tiempo:string, val: string):void{
    let valorMedioP : number = 0
    
    if (!(val==null || val=="-1")) {
        this.PotenValoresProcesados.push(parseFloat(val))
        console.log("POTEN | Valor procesado: " + val);
    }
    this.PotenContadorIteraciones += 1       

    if (this.PotenContadorIteraciones == 12){          // ==12 un minuto (entra cada 5 segundos)
      let nuevoValorP = new Values

      if (this.PotenValoresProcesados.length == 0){   // Si no recoje valor devuelve 0 a la gráfica
        nuevoValorP.name = tiempo
        nuevoValorP.value = 0
      }
      else{
        for (let i=0; i<this.PotenValoresProcesados.length; i++) {
          valorMedioP += this.PotenValoresProcesados[i];
         }
  
        valorMedioP = valorMedioP/this.PotenValoresProcesados.length
        let valorkW = valorMedioP*1000
        console.log("POTEN | ValorMedio MW: "+ valorMedioP + " | ValorMedio kW: "+ valorkW);
         
        nuevoValorP.name = tiempo.slice(0, 5)
        nuevoValorP.value = valorkW
      }
      
      // Actualiza valor en gráfica
      this.chartPotencia[0].series.push(nuevoValorP)
      this.chartPotencia = [...this.chartPotencia]
      this.mensajePotencia=""

      //Inicializar
      this.PotenContadorIteraciones = 0
      this.PotenValoresProcesados = []
      } 
  }
}
