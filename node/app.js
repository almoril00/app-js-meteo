// npm install js-yaml
// npm install express
// npm install body-parser para manejar datos POST


const yaml = require('js-yaml');
const fs = require('fs');
const express = require('express')
const app = express()

let datos // Recoge datos del YML

// Lectura de datos del documento YML
function cargarDatosYML() {
    try {
        datos = yaml.load(fs.readFileSync('./data/data.yml', 'utf8'));
        console.log("Datos YML cargados")

    } catch (error) {
        console.log(error);
    }
}


// Busca valor temperatura en el tiempo solicitado
function buscarValorTemperaturaTiempo(hora) {
    let indiceDeTiempo = -1
    for (let i = 0; i < datos.temperature.values.length; i++) {
        if (datos.temperature.values[i].time == hora) {
            indiceDeTiempo = i
            break
        }
    }
    if (indiceDeTiempo == -1) { //Devuelve -1 si no encuentra el tiempo solicitado
        return indiceDeTiempo
    }
    return datos.temperature.values[indiceDeTiempo].value
}


// Busca valor potencia en el tiempo solicitado
function buscarValorPotenciaTiempo(hora) {
    let indiceDeTiempo = -1
    for (let i = 0; i < datos.power.values.length; i++) {
        if (datos.power.values[i].time == hora) {
            indiceDeTiempo = i
            break
        }
    }
    if (indiceDeTiempo == -1) { //Devuelve "-1" si no encuentra el tiempo solicitado
        return indiceDeTiempo.toString
    }
    return datos.power.values[indiceDeTiempo].value
}


// Configurar Express
app.use(express.json());

// Configurar cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/temperatura', function(req, res) {
    res.send('[GET]Temperatura');
});

// http://localhost:3000/temperatura/00:00:55
app.get('/temperatura/:parametro', function(req, res) {
    let valorTemperatura = buscarValorTemperaturaTiempo(req.params.parametro)

    let temperaturaJSON = {
        time: req.params.parametro,
        value: valorTemperatura
    }
    res.json(temperaturaJSON)
});

// http://localhost:3000/potencia/00:00:55
app.get('/potencia/:parametro', function(req, res) {
    let valorPotencia = buscarValorPotenciaTiempo(req.params.parametro)

    let potenciaJSON = {
        time: req.params.parametro,
        value: parseFloat(valorPotencia) // Convertir string a número decimal
    }
    res.json(potenciaJSON)
});

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
    cargarDatosYML()
});



///// MONGO DB /////
// npm install mongodb
// const { MongoClient } = require("mongodb");

/*
    // Parametros conexión mongoDB
    const url = "mongodb+srv://meteologica:pass@clustermean.1swcx.mongodb.net/meteologica?retryWrites=true";
    const client = new MongoClient(url)
    const dbName = "meteologica"


    // Conecta a la bbdd e inserta documento JSON con los datos
    async function run() {
        try {
            await client.connect();
            console.log("Connected correctly to server");
            const db = client.db(dbName);

            // Use the collection "datos"
            const col = db.collection("data");

            // Borra los datos de la colección
            const b = await col.deleteMany();

            // Insert a single document, wait for promise so we can read it back
            const i = await col.insertOne(datos);

            // Find one document
            const myDoc = await col.findOne();

            // Print to the console
            console.log(myDoc);

        } catch (err) {
            console.log(err.stack);
        } finally {
            await client.close();
        }
    }
    //run().catch(console.dir);
*/