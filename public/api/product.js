const axios = require('axios')
const Owlbot = require('owlbot-js');

const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

require("dotenv").config();

router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.use(express.static('./api'));


const client = Owlbot(process.env.OWL_TOKEN);


router.get('/', async (req, res) => {

  //const file = await fs.promises.readFile(path.join(__dirname, './index.html'), 'utf8');
  //res.send(file);
  const file = await axios({
    method: "get",
    url: `https://api.api-ninjas.com/v1/thesaurus?word=owl`,
    headers: {
       'X-Api-Key': process.env.SYNONYMS_TOKEN,
    },
  });
  res.json(file.data);
});

client.define('owl')
  .then(result => {
    console.log(result);
    //result.definitions[0].type;
  })
  .catch(error => console.error(`Error: ${error.message}`));

 module.exports = router;