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

  const file = await fs.promises.readFile(path.join(__dirname, './index.html'), 'utf8');


  if(search != "")
  {
    let exists = true;

    if(exists)
    {
      const definition = await axios({
        method: "get",
        url: `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`
      }).catch(console.log("error"));
      //console.log("%j", definition.data);
      let html = `
      <div class="result" id="result">
      <div class="word">
              <h3>${search}</h3>
              <button onclick="playSound()">
                  <i class="fas fa-volume-up"></i>
              </button>
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
    
      let output = file.replace(' <div class="result" id="result">', html);
      output = output.replace('<audio id="sound"></audio>', `<audio id="sound" src="${definition.data[0].phonetics[1].audio}"></audio>`)
      //res.json(definition.data)
      res.send(output);
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