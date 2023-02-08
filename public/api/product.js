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
      let phonetics = "";
      for (let i = 0; i < definition.data[0].phonetics.length; i++) 
      {
        if (definition.data[0].phonetics[i].audio != "" && typeof definition.data[0].phonetics[i].audio !== 'undefined') 
        {
          phonetics += `<div class="phonetics"><p>/${definition.data[0].phonetics[i].text || ""}/</p>
        <button onclick="playSound(this)"><audio class="sound" src="${definition.data[0].phonetics[i].audio}"></audio><i class="fas fa-volume-up"></i></button></div>`;
        }
        else
        {
          phonetics += `<div class="phonetics"><p>/${definition.data[0].phonetics[i].text || ""}/</p></div>`;
        }
        //definition.data[0].meanings[0].partOfSpeech
      }
      let details = ""
      for (let i = 0; i < definition.data[0].meanings.length; i++) 
      {
        let definitions = "";
        for (let j = 0; j < definition.data[0].meanings[i].definitions.length; j++) 
        {
          if (typeof definition.data[0].meanings[i].definitions[j].example !== 'undefined') 
          {
            definitions += `<div class="definitions"><p class="word-meaning">
            ${definition.data[0].meanings[i].definitions[j].definition}
            </p>
            <p class="word-example">
                ${definition.data[0].meanings[i].definitions[j].example}
            </p></div>`;
          }
          else
          {
            definitions += `<div class="definitions"><p class="word-meaning">
            ${definition.data[0].meanings[i].definitions[j].definition}
            </p></div>`;
          }
        }

        let synonyms = `<h4 class="word-partOfSpeech">Synonyms:</h4>`;
        for (let j = 0; j < definition.data[0].meanings[i].synonyms.length; j++) 
        {
          synonyms += `<p class="synonyms" onclick="searchSynonym(this)">${definition.data[0].meanings[i].synonyms[j]}</p>`;
        }
        if(definition.data[0].meanings[i].synonyms.length == 0){synonyms = ""}

        let antonyms = `<h4 class="word-partOfSpeech">Antonyms:</h4>`;
        for (let j = 0; j < definition.data[0].meanings[i].antonyms.length; j++) 
        {
          antonyms += `<p class="synonyms" onclick="searchSynonym(this)">${definition.data[0].meanings[i].antonyms[j]}</p>`;
        }
        if(definition.data[0].meanings[i].antonyms.length == 0){antonyms = ""}

        details += `
        <h3 class="word-partOfSpeech">
            ${definition.data[0].meanings[i].partOfSpeech}
        </h3>
       ${definitions}
       <div class="synonymsCard">${synonyms}</div>
       <div class="synonymsCard">${antonyms}</div>`;
        //definition.data[0].meanings[0].partOfSpeech
      }
      
      //console.log("%j", definition.data);
      let html = `
      <div class="result" id="result">
      <div class="word">
              <h2>${search}</h2>
          </div>
          <div class="details">
          ${phonetics}
          </div>
          ${details}
          </div>`;
    
      file = file.replace('<div class="result" id="result">', html);
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
    res.send(file);
  }
});
router.post('/search', async (req, res) => {
  
  search = req.body.searchName;
  res.redirect('/');

});

 module.exports = router;