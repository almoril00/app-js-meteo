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
  public valorTemperatura    : any = ""
  public valorPotencia       : any = ""
  public mensajeError        : string = ""
  public horaActual          : string
  public TempValoresXMinuto  : number[] = []
  public TempContadorMinutal : number = 0
  // Chart
  chartTemperatura: any[];
  chartPotencia: any[];
  view: any[] = [700, 300];

  // Chart options
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'time';
  yAxisLabel: string = 'value';
  timeline: boolean = true;

  colorScheme1 = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  colorScheme2 = {
    domain: ['red', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor (private datosymlService:DatosymlService){
    // Valores gráfica Temperatura
    this.chartTemperatura =    [
      {
        "name": "Temperatura",
        "series": []
      },
    ]
    
    // Valores gráfica Potencia
    this.chartPotencia =    [
      {
        "name": "Potencia",
        "series": [
          {
            name:  "00:00:00",
            value: 33,
          },
          {
            name: "00:00:05",
            value: 32,
          },
          {
            name: "00:00:10",
            value: 29,
          },
        ]
      },
    ]
  
  }

  
  ngOnInit():void{
    // Ejecuta cada x tiempo
    setInterval(() => {
      this.reloj();
    }, 1000);
    
    // Actualiza valores en gráficas
    this.chartTemperatura = [...this.chartTemperatura]
    this.chartPotencia = [...this.chartPotencia]
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
    // Obtiene hora actual
    let date     = new Date();

    let hora     = this.llenarCeros(date.getHours(), 2)
    let minutos  = this.llenarCeros(date.getMinutes(), 2)
    let segundos = this.llenarCeros(date.getSeconds(), 2)
    
    this.horaActual = hora+":"+minutos+":"+segundos

    // Lanza consulta cada 5 segundos
    if (!(date.getSeconds() % 5)){
      this.getTemperatura(this.horaActual)
      //this.getPotencia(this.horaActual)
    }
  }

  getTemperatura(tiempo:string):void{
    //this.valorTiempo = tiempo

    this.datosymlService.getTemperatura(tiempo)
    .subscribe(
      res => this.valorTemperatura = res,
      err => console.log(err)   // Manejar el error
    )
    
    this.procesarTemperatura(this.valorTemperatura.time, this.valorTemperatura.value)
  }


  getPotencia(tiempo:string):void{
    //this.valorTiempo = tiempo

    this.datosymlService.getPotencia(tiempo)
    .subscribe(
      res => this.valorPotencia = res,
      err => console.log(err)   // Manejar el error
    )
  }


  procesarTemperatura(tiempo:string, val: number):void{
    
    let valorMedio : number = 0
    
    if (!(val==null || val==-1)) {
        this.TempValoresXMinuto.push(val)
        console.log("TEMP | Valores x min recibidos: " + this.TempValoresXMinuto);
    }
    
    this.TempContadorMinutal += 1       

    if (this.TempContadorMinutal == 2){    // =12 un minuto (entra cada 5 segundos)

      for (let i=0; i<this.TempValoresXMinuto.length; i++) {
        valorMedio += this.TempValoresXMinuto[i];
       }

      valorMedio = valorMedio/this.TempValoresXMinuto.length
      let valorCelsius = (valorMedio/10) - 273.15
      console.log("TEMP | ValorMedio dk: "+ valorMedio + " | ValorMedio ºC: "+ valorCelsius);

      let nuevoValor = new Values
      nuevoValor.name = tiempo
      nuevoValor.value = valorCelsius
      
      // Actualiza valor en gráfica
      this.chartTemperatura[0].series.push(nuevoValor)
      this.chartTemperatura = [...this.chartTemperatura]

      //Inicializar
      this.TempContadorMinutal = 0
      this.TempValoresXMinuto = []
    }
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
