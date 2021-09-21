# app-js-meteo

Este proyecto fué desarrollado en su parte `Front` con [Angular CLI](https://github.com/angular/angular-cli) version 14.15.5

La parte `Back` con [Node.js](https://nodejs.org/es/download/releases/) version 11.2.1.

## Herramientas utilizadas:

* [npm](http://www.dropwizard.io/1.0.2/docs/) - Node Package Manager v6.14.11
* [NGX Charts](https://swimlane.gitbook.io/ngx-charts/installing) - Librería para representación de gráficas en Angular
* [JS-YAML](https://www.npmjs.com/package/js-yaml) - Módulo para lectura de documentos YAML en NodeJS
* [express](https://www.npmjs.com/package/express) - Framework web para NodeJS


## BACK (node) | Ejecución:

Ejecutar `node .\app.js` para arrancar servidor con servicio REST por el puesto 3000, que quedará a la eschucha de las peticiones GET de Angular.
Responderá a peticiones GET de Angular con el siguiente formato:

`http://localhost:3000/temperatura/00:15:25`

`http://localhost:3000/potencia/05:25:30`


## FRONT (angular) | Ejecución:

Ejecutar `npm install` para reconstruir carpeta `"node_modules"`.

Arrancar app ejecutando `ng serve` y navegar en `http://localhost:4200/`. La aplicación recargará automáticamente si se cambia alguno de los archivos fuente.

---

![Imagen del proyecto](https://github.com/almoril00/app-js-meteo/raw/main/angular/readme.jpg)

