const express = require('express');
const axios = require('axios')
const router = express.Router();

const RECIPE_API_KEY = "Put your APIKEY";

router.get("/", (req,res) =>{
  res.render('index')
})

router.post('/search', async(req,res)=>{
  const {query} = req.body;
  console.log(query)
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${RECIPE_API_KEY}`)
    const recipes = response.data.results;
  res.render('results', {recipes}) 
  } catch (error) {
    console.error(error);
    res.status(404).render('error', { message: 'Recipe not found', error });
  }
})

router.get('/recipe/:id', async(req,res)=>{
  const {id} = req.params;
  console.log(id)
  try {
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${RECIPE_API_KEY}`) 
    const recipe = response.data;
  res.render('recipe', {recipe})
  } catch (error) {
    console.error(error);
    res.status(404).render('error', { message: 'Recipe not found', error });
  }
})

module.exports = router;
