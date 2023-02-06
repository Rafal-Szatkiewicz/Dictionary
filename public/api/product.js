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
      });
      console.log("%j", definition.data);
      res.json(definition.data)
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