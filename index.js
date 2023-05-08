const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const cors = require('cors')
const routes = require('./routes/route');
const serreRoute = require('./routes/serreRouter')
const couveuseRouter=require('./routes/couveuseRouter')
const arrosageRoute = require('./routes/arrosageRouter');
const routeCycle = require('./routes/routeCycle');

require('dotenv').config();

const databaseLink = process.env.DATABASE_URL;
mongoose.connect(databaseLink);
const database = mongoose.connection;
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.json());

app.use('/api', routes)
app.use('/', serreRoute)
app.use('/', arrosageRoute)
app.use('/', couveuseRouter)


app.use('/', routeCycle)
// app.use('/', routeCycle)


database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

module.exports = database;


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:4200']
  }
});


const portSerial = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = portSerial.pipe(new ReadlineParser({ delimiter: '\r\n' }))

//ECOUTER LES EVENNEMENTS DEPUIS LE FRONT
// portSerial.on('open', () => {
//   io.on('connection', (socket) => {

//     socket.on('isOn', (msg) => {
//       console.log('lampe: ' + msg);
//       portSerial.write("1")
//     });

//     socket.on('isOff', (msg) => {
//       console.log('lampe: ' + msg);
//       portSerial.write("0")
//     });

//     socket.on('isWater', (msg) => {
//       console.log('water: ' + msg);
//       portSerial.write("2")
//     });

//     socket.on('noWater', (msg) => {
//       console.log('water: ' + msg);
//       portSerial.write("3")
//     });

//     socket.on('noFan', (msg) => {
//       console.log('fan: ' + msg);
//       portSerial.write("4")
//     });

//     socket.on('isFan', (msg) => {
//       console.log('fan: ' + msg);
//       portSerial.write("5")
//     });

//     socket.on('openDoor', (msg) => {
//       console.log('door: ' + msg);
//       portSerial.write("6")
//     });

//     socket.on('closeDoor', (msg) => {
//       console.log('door: ' + msg);
//       portSerial.write("7")
//     });
//   });
// });




//ECOUTER LES EVENNEMENTS DEPUIS ESP32,ARDUINO,MEGA...

parser.on('data', (data) => {
  
  // console.log("en attente....");
  
  try {
  let dataStr = data.toString();

  
  

    let jsonData = JSON.parse(dataStr)

    // If parsing succeeds, process the JSON data
    // console.log('Received JSON:', jsonData);

    if (jsonData) {
    
      io.emit('temp', `${jsonData.temperature}`);
      io.emit('hum', `${jsonData.humidité}`);
      io.emit('niveau', `${jsonData.niveau}`); 
      io.emit('etaBuzzer', `${jsonData.buzzer}`);
      io.emit('etatfan', `${jsonData.fan}`); 
      io.emit('etatLedRg', `${jsonData.LedRg}`); 
      io.emit('etatLedbleu', `${jsonData.LedBleu}`);
      io.emit('etatbrum', `${jsonData.brum}`);
      io.emit('etatHeater', `${jsonData.heater}`);
      

 
      // console.log('Received JSON:', jsonData.humidité);
        // console.log('Received JSON:', jsonData.LedRg);
      // io.emit('buzzer', `${jsonData.buzzer}`);
      // io.emit('toit', `${jsonData.toit}`);
      // io.emit('door', `${jsonData.door}`);

      let tempEtHum = {
        'temp': jsonData.temperature,
        'hum': jsonData.humidité,
        'dateInsertion': new Date(),
        // 'niveau': jsonData.niveau,
        
      };

     
      // let tmp= tempEtHum.hum;
      // console.log(tmp);
      //Connexion a mongodb et insertion Temperature et humidite
      //  serre.save(tempEtHum)

      const datHeure = new Date();
      const min = datHeure.getMinutes();
      const heur = datHeure.getHours(); //heure
      const sec = datHeure.getSeconds();

      // const cycleCollection = database.collection('cycle');
      // let nombre = "", espece = "", taux = "", numcycle = "";

     
      if ((heur == 08 && min == 35 && sec == 00) || (heur == 02 && min == 14 && sec == 00) || (heur == 05 && min == 31 && sec == 00)) {

        setTimeout(() => {
          const collection = database.collection('serres');
          collection.insertOne(tempEtHum, function (err) {
            if (err) throw err;
            console.log("Data inserted successfully!");
          });
        }, 1000);
      }

      


    }
  
  } catch (error) {
    // throw error
  }
})

//ECOUTE DU SERVER SUR LE PORT 3000
http.listen(3001, () => {
  console.log('listening on :3001');
});

