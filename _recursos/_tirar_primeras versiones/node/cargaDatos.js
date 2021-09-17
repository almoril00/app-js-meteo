// npm install js-yaml
// npm install mongodb
const yaml = require('js-yaml');
const { MongoClient } = require("mongodb");
const fs = require('fs');

let datos

// Obtiene datos del documento YML
try {
    datos = yaml.load(fs.readFileSync('./data/data.yml', 'utf8'));
    //console.log(datos);
    console.log(buscarValorTemperaturaTiempo("00:00:25"))
    console.log(buscarValorPotenciaTiempo("00:00:00"))

} catch (error) {
    console.log(error);
}


// Buscar valor de una temperatura según el tiempo
function buscarValorTemperaturaTiempo(hora) {
    let indiceDeTiempo = -1
    for (let i = 0; i < datos.temperature.values.length; i++) {
        if (datos.temperature.values[i].time == hora) {
            indiceDeTiempo = i
            break
        }
    }
    if (indiceDeTiempo == -1) { //Devuelve -1 si no encuentra el tiempo
        return indiceDeTiempo
    }
    return datos.temperature.values[indiceDeTiempo].value
}


// Buscar valor de una potencia según el tiempo
function buscarValorPotenciaTiempo(hora) {
    let indiceDeTiempo = -1
    for (let i = 0; i < datos.power.values.length; i++) {
        if (datos.power.values[i].time == hora) {
            indiceDeTiempo = i
            break
        }
    }
    if (indiceDeTiempo == -1) { //Devuelve -1 si no encuentra el tiempo
        return indiceDeTiempo
    }
    return datos.power.values[indiceDeTiempo].value
}





/*

    // Parametros conexión mongoDB
    const url = "mongodb+srv://meteologica:1234@clustermean.1swcx.mongodb.net/meteologica?retryWrites=true";
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