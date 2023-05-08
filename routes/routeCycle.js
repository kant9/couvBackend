const express = require('express');
const Cycle = require('../models/cycle');
const cycle = require('../models/cycle');
const graph = require('../models/arrosage');

const routeCycle = express.Router()
module.exports = routeCycle;


// ROUTE POUR L'ENREGISTREMENT DES DONNÉES D'UN CYCLE
routeCycle.post('/envDcycle', async (req, res) => {

    // res.send('hello')
    try{
        const {espece, nombre, taux,numcycle} = req.body;
        const data=cycle({
            espece: espece,
            nombre: nombre,
            taux: taux ,
            numcycle: numcycle
        })
          await data.save();
        res.json(data)
    }
    catch (error) {
    res.status(500).json({ message: error.message })
    }
})

// ROUTE POUR LA MODIFICATION DES DONNÉES D'UN CYCLE
routeCycle.patch('/updatecycle/:id',  async (req, res) => {
  const {nombre,espece,numcycle,taux} = req.body;
console.log(req.body);
  try {

    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Cycle.findByIdAndUpdate(id, updatedData, options)

     if (!result) {
       return res.status(404).json({ message: 'Systeme  introuvable' });
     }

    await result.save();

    return res.status(200).json({ message: 'Modifier avec succès' });
  
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


// cycle.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, book) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('le dernier est:', cycle);
// });







// ROUTE POUR LA RECUPERATION DES DONNÉES D'UN CYCLE
routeCycle.get('/cycle', async (req, res) => {
    try {
        const data = await Cycle.findOne({},{}, { sort: { '_id' : -1 } });
        res.json(data)
    }
    catch (error) {
    res.status(500).json({ message: error.message })
    }
})

routeCycle.get('/serre', async (req, res) => {
  try {
      const data = await Serre.findOne({},{}, { sort: { '_id' : -1 } });
      res.json(data)
  }
  catch (error) {
  res.status(500).json({ message: error.message })
  }
})



// ROUTE POUR LA RECUPERATION DES DONNees de tous les cycles
routeCycle.get('/allCycle', async (req, res) => {
  try {
      const data = await Cycle.find();
      res.json(data)
  }
  catch (error) {
  res.status(500).json({ message: error.message })
  }
})




// ROUTE POUR LA MODIFICATION DES DONNÉES D'UN CYCLE
routeCycle.patch('/updatecycle/:id',  async (req, res) => {
    // const {matin,soir,dureMatin,dureSoir} = req.body;
  console.log(req.body);
    try {
      const id = req.params.id;
      const updatedData = req.body;
      const options = { new: true };
  
      const result = await Cycle.findByIdAndUpdate(id, updatedData, options)
  
       if (!result) {
         return res.status(404).json({ message: 'Systeme introuvable' });
       }
  
      await result.save();
  
      return res.status(200).json({ message: 'Données cycle modifiées avec succès' });
    
    }
    catch (error) {
      return res.status(500).json({ message: error.message })
    }
  })