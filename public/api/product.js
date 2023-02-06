const axios = require('axios')

const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(express.static('./api'));

let search = "";


router.get('/', async (req, res) => {

  let file = await fs.promises.readFile(path.join(__dirname, './index.html'), 'utf8');


  if(search != "")
  {
    let exists = true;

    const definition = await axios({
      method: "get",
      url: `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`
    }).catch(error => {
      console.error(`Error: ${error.message}`); 
      exists = false;
    });

    if(exists)
    {
      
      //console.log("%j", definition.data);
      let html = `
      <div class="result" id="result">
      <div class="word">
              <h3>${search}</h3>
              <button onclick="playSound()"><i class="fas fa-volume-up"></i></button>
          </div>
          <div class="details">
              <p>${definition.data[0].meanings[0].partOfSpeech}</p>
              <p>/${definition.data[0].phonetic}/</p>
          </div>
          <p class="word-meaning">
             ${definition.data[0].meanings[0].definitions[0].definition}
          </p>
          <p class="word-example">
              ${definition.data[0].meanings[0].definitions[0].example || ""}
          </p>
          </div>`;
    
      file = file.replace('<div class="result" id="result">', html);
      if (definition.data[0].phonetics[1] && typeof definition.data[0].phonetics[1].audio !== 'undefined') 
      {
        file = file.replace('<audio id="sound"></audio>', `<audio id="sound" src="${definition.data[0].phonetics[1].audio}"></audio>`);
      } 
      else 
      {
          file = file.replace('<audio id="sound"></audio>', "");
          file = file.replace(`<i class="fas fa-volume-up"></i>`, "");
          file = file.replace(`<button onclick="playSound()"></button>`, "");
      }
      //res.json(definition.data)
      res.send(file);
    }
    else
    {
      file = file.replace('<div class="result" id="result">', `<div class="result" id="result"><h3 class="error">Couldn't Find The Word</h3>`);
      res.send(file);
    }
  }
  else
  {
    file = file.replace('<audio id="sound"></audio>', "");
    res.send(file);
  }
});
router.post('/search', async (req, res) => {
  
  search = req.body.searchName;
  res.redirect('/');

});

 module.exports = router;