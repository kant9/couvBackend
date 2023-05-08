const express = require('express');
const Model = require('../models/user');
// const Serre = require('../models/serre');
const Couveuse =require('../models/couveuse')


// const serreRouter = express.Router()
const couveuseRouter = express.Router()

module.exports = couveuseRouter;

//////ROUTE POUR LA SERRE/////


couveuseRouter.post('/postCOuveuse', async (req, res) => {


  const {
    temp,
    hum} = req.body;

  // const users = [];

  let dateInsertion = new Date();
  const newCouv = Couveuse({
    temp,
    hum,
    dateInsertion
  });

  try {

    await newCouv.save();

    res.status(201).json(newCouv);

  } catch (error) {
    res.status(404).json({ message: error.message })
  }

})



couveuseRouter.get('/couveuse', async (req, res) => {
    try {
        const data = await Couveuse.find();
        res.json(data) 
      }
      catch (error) {
        res.status(500).json({ message: error.message })
      }
})


couveuseRouter.get('/couveuse/:id', async (req, res) => {
  try {
    const data = await Couveuse.findById(req.params.id);
    return res.json(data)
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

//Methode pour la modification donnée particuliere de la couveuse
couveuseRouter.patch('/couveuseUpdate/:id',  async (req, res) => {
//   const { matin, soir } = req.body;

  try {

    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options)

     // Comparer l'ancien mot de passe avec le mot de passe haché dans la base de données
    //  const passwordMatch = await bcrypt.compare(oldPassword, result.password);
     if (!result) {
       return res.status(404).json({ message: 'Not found' });
     }
    await result.save();

    return res.status(200).json({ message: 'modification reussie' });
  
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
})